// hdys03 净化脚本（小火箭 http-response 用）
// 作用：删掉页面里外挂的广告脚本、把 window.open / 自动跳转中和掉，
//       去掉那种铺满全屏、点了就跳走的透明遮罩层。
// 说明：这是正则清洗，只能对付常见写法；站点改版后可能要跟着改。
var body = $response.body;
if (body) {
  // 1) 去掉外部广告脚本（src 里带 ad/pop/gg/tongji 之外的可疑词时整段删）
  body = body.replace(/<script[^>]+src=["'][^"']*(pop|_ad|ads|gg|guanggao|tongcheng|click|jump)[^"']*["'][^>]*>[\s\S]*?<\/script>/gi, "");
  // 2) 中和自动跳转 / 弹窗打开
  body = body.replace(/window\.open\s*\(/g, "void(");
  body = body.replace(/location\.href\s*=\s*["']https?:\/\/(?!7rkj\.hdys03\.com)/g, "void('");
  // 3) 在 </head> 前注入一条样式：干掉全屏透明遮罩和悬浮广告位
  var css = "<style>.ads,.ad,.advert,#ads,#ad,div[style*='position:fixed'][style*='z-index:9'],a[target='_blank'][style*='position:absolute'],a[target='_blank'][style*='position:fixed']{display:none!important}</style>";
  body = body.replace(/<\/head>/i, css + "</head>");
}
$done({ body: body });
