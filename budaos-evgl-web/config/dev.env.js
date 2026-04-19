'use strict'
module.exports = {
  NODE_ENV: '"development"',
  // 本地开发：使用相对路径，通过 webpack-dev-server 代理到后端 9080 端口
     baseUrl: '""',
  // 生产环境：
  // baseUrl: '"https://www.budaos.com/bds/"',
  //布道师服务的webSocket连接的url：小程序端使用
      webSocketUrl: '"wss://www.budaos.com/sp/wss"',
  //文件预览的url在线预览使用第三方服务
    filePreviewUrl:'"https://www.budaos.com/cbFilePreview/onlinePreview"',
  //布道师主页的url
     doMainUrl:'"https://www.budaos.com"'
}
