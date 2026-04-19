import axios from '@/http/axios'

/*
 * 字典管理模块
 */

// 保存
export const save = (data) => {
  if (data) {
    return axios({
      url: '/api/sys/settings/update',
      method: 'post',
      data
    })
  }
}

// 查询
export const findData = (params) => {
  return axios({
    url: '/user/querySettings',
    method: 'get',
    params
  })
}

