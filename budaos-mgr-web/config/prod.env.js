'use strict'
let baseUrl, evglUrl
if (process.env.env_config === 'platform') {
  baseUrl = '"https://frp.budaos.com/platform-api"'
  evglUrl = '"https://frp.budaos.com/evglui/#/"'
} else if (process.env.env_config === 'dev') {
  baseUrl = '"https://frp.budaos.com/mgr"'
  evglUrl = '"http://localhost:8888/#/"'
} else if (process.env.env_config === 'test' || process.env.env_config === 'frp') {
  baseUrl = '"https://frp.budaos.com/mgr"'
  evglUrl = '"https://frp.budaos.com/bds/#/"'
  // 生产环境配置
} else if (process.env.env_config === 'prod') {
  baseUrl = '"https://www.budaos.com/manage"'
  evglUrl = '"https://www.budaos.com/#/"'
}

module.exports = {
  NODE_ENV: '"production"',
  baseUrl: baseUrl,
  evglUrl: evglUrl
}
