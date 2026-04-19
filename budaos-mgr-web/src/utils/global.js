/**
 * 全局常量、方法封装模块
 * 通过原型挂载到Vue属性
 * 通过 this.Global 调用
 */

export const tokenKeyName = 'token'

function getBaseUrl() {
  const envBaseUrl = process.env.baseUrl
  if (!envBaseUrl) {
    return ''
  }
  // process.env.baseUrl 可能带引号，需要去除
  const trimmed = String(envBaseUrl).trim().replace(/["']/g, '')
  if (trimmed === '' || trimmed === 'undefined' || trimmed === 'null') {
    return ''
  }
  return trimmed
}

export const baseUrl = getBaseUrl()
export const evglUrl = process.env.evglUrl
export const baseUrlUpload = process.env.baseUrlUpload

export const baseDictUrl = baseUrl + '/uploads/dict/'
export const baseDictUploaderUrl = baseUrl + '/api/sys/dict/uploadIcon'

export const backupBaseUrl = baseUrl

export default {
  baseUrl,
  evglUrl,
  backupBaseUrl
}
