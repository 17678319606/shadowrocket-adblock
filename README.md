# Shadowrocket 广告过滤统一模块

一个模块订阅，整合 Jinx、Johnshall、anti-AD、blackmatrix7 四套广告过滤来源，外加 hdys03 影视站专项拦截。由 Muse 定期维护，只开小火箭（Shadowrocket）一个隧道即可，不需要再同时开 Jinx。

## 订阅地址（jsDelivr，主）

```
https://cdn.jsdelivr.net/gh/17678319606/shadowrocket-adblock@main/AdBlock-All.sgmodule
```

备用地址（jsDelivr 拉不通时用，更新可能稍慢）：

```
https://raw.githubusercontent.com/17678319606/shadowrocket-adblock/main/AdBlock-All.sgmodule
```

Johnshall 转换清单地址（模块已自动引用，不用单独订阅）：

```
https://cdn.jsdelivr.net/gh/17678319606/shadowrocket-adblock@main/johnshall-ad.list
```

## 导入步骤（小火箭）

1. 复制上面的订阅地址（主）。
2. 打开 Shadowrocket →「配置」→「模块」→ 右上角「+」。
3. 粘贴 URL → 下载 → 勾选启用这个模块。
4. 关掉 Jinx 的系统级过滤（iOS 同一时间只能开一个网络隧道，两个一起开会互相顶掉）。
5. 以后模块更新了，在「模块」页对它点更新即可，地址永远不变。

## 组成部分与来源

- 放行名单（在最前，防误伤）：RFU-Rules 放行清单 + blackmatrix7 Direct 清单。删掉会误伤微信登录、推送等功能域名，不要动顺序。
- Jinx 基线：VME98/jinx-rules 3.2.3，经 RiverFlowsInUUU/RFU-Rules 转成小火箭格式，8550 条广告/追踪/遥测域名。
- Johnshall 仅去广告：来源 `sr_ad_only.conf`（EasyList + EasyList China + Peter Lowe + 乘风规则 + 手工维护的 iOS/App/视频广告，Johnshall 每日北京时间 8 点重建）。本仓库的 `johnshall-ad.list` 是把它转成标准 RULE-SET 格式的版本（去掉策略后缀，策略由模块统一指定 REJECT），2026-11-08 转换 53,919 条。
- anti-AD：中文广告过滤域名集。
- blackmatrix7：AdvertisingLite + Advertising 广告规则集（Johnshall 懒人配置同源）。
- hdys03 专项（2026-11-08 浏览器实测）：花都影视 hdys03.com 顶部博彩横幅的落地域名会轮换，本模块按「随机串-数字.ap-northeast-2.elb.amazonaws.com」的形态拦截，并对 MacCMS 类影视站的常见同域弹窗路径做 URL Rewrite 拦截。封面图域名 a.7976.top 是正片封面，没有拦。

## 证书说明（重要）

- 本模块的域名规则（上面全部 RULE-SET / DOMAIN-SET）**不需要任何证书**就能生效。
- 只有 URL Rewrite 部分（hdys 的 https 弹窗路径拦截）需要开启 HTTPS 解密，并信任**你自己手机上由 Shadowrocket 现生成的 CA 证书**：小火箭 → 配置 → 当前配置 ⓘ → HTTPS 解密 → 证书 → 生成新的 CA 证书 → 安装；再去 iOS 设置 → 已下载描述文件里安装，最后在 设置 → 通用 → 关于本机 → 证书信任设置 里打开信任。
- **绝不要信任任何配置文件自带的、或从网上下载的第三方 CA 证书**——那等于把你的全部 HTTPS 流量交给对方解密。

## 维护说明

- 由 Muse 每周检查一次：逐个验证各上游来源是否可用/是否改址，重新下载 Johnshall 最新 `sr_ad_only.conf` 并更新本仓库的 `johnshall-ad.list` 转换清单，复查 hdys03 广告域名是否换了新形态。
- 上游无变化时静默更新版本号与转换清单；来源失效或 hdys 换新打法时会在主聊天报告。
- 本仓库文件：`AdBlock-All.sgmodule`（模块本体）、`johnshall-ad.list`（Johnshall 转换清单）、`hdys-clean.js`（hdys 页面清洗脚本，可选附件，需另行在小火箭脚本里引用才生效）、`README.md`（本文件）。
