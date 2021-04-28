# 介绍

no-graph 让你可以通过关系图的方式来查看页面之间的联系

![example](./docs/images/example.png)

# 安全

no-graph 没有使用第三方的 API 代理，而是通过在 Notion 页面内注入 JS 后，直接请求官方的 API 地址，你的数据只会经过官方服务器和本地存储，不会经手第三方。

此外，你不需要额外提供 Token 来使用本插件，只需处在登录模式下使用 Notion 即可，no-graph 不会检测获取你的 token ，而是直接附带本地的 Token 。

详见 `/src/api/raw` 文件夹

# TODO

- [x] 基本页面
- [ ] database
- [ ] backlinks

# 使用

1. 下载 tampermonkey
    - [edge](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)
    - [chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=zh-CN)

2. [安装脚本](https://greasyfork.org/en/scripts/425835-no-graph)
3. 登录状态下，打开 notion
4. 点击左上角的 checkbox 开启 no-graph
