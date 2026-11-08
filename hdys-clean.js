// hdys 净化脚本 v2（Shadowrocket http-response 用）
// 2026-11-08 实测依据（7rkj.hdys03.com 分类页源码逐项核对）：
// - 广告注入是两段无 src 的内联混淆脚本（大量 \x 转义、idia 框架），
//   运行时生成底部悬浮广告条与误触跳转；域名规则拦不到，只能清洗响应体。
// - 顶部横幅是 class='sponsor-block' 的整块标记（外链 ELB 已在规则层拦截，
//   图片挂 img.alicdn.com 仍会显示），用注入 CSS 整块隐藏。
// - 合法内联脚本都有可读标志（feifeicms / stui-header / jump-btn /
//   MIN_CHROME / 协议跳转），清洗只认混淆指纹，不误伤。
var body = $response.body;
if (body) {
  // 1) 删除无 src 的内联混淆脚本：正文中 \x 转义出现 >=20 次即判定
  body = body.replace(/<script(?![^>]+src)[^>]*>([\s\S]*?)<\/script>/gi,
    function (m, code) {
      var hits = (code.match(/\\x[0-9a-fA-F]{2}/g) || []).length;
      return hits >= 20 ? "" : m;
    });
  // 2) 删统计/注入加载器内联块（域名层已 REJECT，这里再断其内联入口）
  body = body.replace(/<script(?![^>]+src)[^>]*>[\s\S]*?(aizhantj|mc\.yandex\.ru)[\s\S]*?<\/script>/gi, "");
  // 3) 外部脚本 src 带广告关键词的整段删（沿用 v1）
  body = body.replace(/<script[^>]+src=["'][^"']*(pop|_ad|ads|gg|guanggao|tongcheng|click|jump)[^"']*["'][^>]*>[\s\S]*?<\/script>/gi, "");
  // 4) 中和残余自动跳转与弹窗（沿用 v1；站内相对跳转不受影响）
  body = body.replace(/location\.href\s*=\s*["']https?:\/\/(?!7rkj\.hdys03\.com)/g, "void('");
  // 5) 注入 CSS：隐藏顶部推广块、全屏遮罩、底部悬浮广告条
  var css = "<style>"
    + ".sponsor-block,.ads,.ad,.advert,#ads,#ad{display:none!important}"
    + "div[style*='position:fixed'][style*='bottom:0'],div[style*='position: fixed'][style*='bottom: 0']{display:none!important}"
    + "a[target='_blank'][style*='position:fixed'],a[target='_blank'][style*='position:absolute']{display:none!important}"
    + "</style>";
  body = body.replace(/<\/head>/i, css + "</head>");
}
$done({ body: body });
