import axios from '@/http/axios'

/**
 * 根据文件名下载文件
 * @param fileName
 */
export const downloadFile = (fileName) => {
  return axios({
    url: '/api/download/file?fileName=' + fileName,
    method: 'get',
    responseType: 'blob',
    timeout: 60000
  })
}

export function sysFileInfoDownload (fileName) {
  return axios({
    url: '/api/download/file?fileName=' + fileName,
    method: 'get',
    timeout: 60000,
    responseType: 'arraybuffer'
  })
}
