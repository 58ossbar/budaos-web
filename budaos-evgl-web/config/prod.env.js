'use strict'
let baseUrl
//webSocket连接的url
let webSocketUrl
//文件预览的url
let filePreviewUrl
let doMainUrl

if (process.env.env_config == 'dev') {
  baseUrl = '"https://frp.budaos.com/console/"'
  webSocketUrl = '"wss://frp.budaos.com/sp/wss"'
  filePreviewUrl = '"https://frp.budaos.com/cbFilePreview/onlinePreview"'
  doMainUrl = '"https://frp.budaos.com"'
}
//生产环境2024.11.25部署成功：已经部署到www.budaos.com
if (process.env.env_config == 'prod') {
  //布道师服务的url
  baseUrl = '"https://www.budaos.com/bds"'
   //布道师服务的webSocket连接的url：小程序端使用
  webSocketUrl = '"wss://www.budaos.com/sp/wss"'
  //文件预览的url在线预览使用第三方服务
  filePreviewUrl = '"https://www.budaos.com/cbFilePreview/onlinePreview"'
  //布道师主页的url
  doMainUrl = '"https://www.budaos.com"'
}
if (process.env.env_config == 'test') {
  baseUrl = '"http://39.99.132.73/bds/"'
  webSocketUrl = '"ws://39.99.132.73/sp/wss"'
  filePreviewUrl = '"http://39.99.132.73/cbFilePreview/onlinePreview"'
  doMainUrl = '"https://frp.budaos.com"'
}

module.exports = {
  NODE_ENV: '"production"',
  baseUrl: baseUrl,
  webSocketUrl:webSocketUrl,
  filePreviewUrl:filePreviewUrl,
  doMainUrl: doMainUrl
}
