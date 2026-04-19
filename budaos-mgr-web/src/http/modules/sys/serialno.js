import axios from '@/http/axios'

/*
 * 流水号管理模块
 */

// 分页查询
export const findPage = (params) => {
  return axios({
    url: '/api/sys/serialno/query',
    method: 'get',
    params
  })
}

// 保存
export const save = (data) => {
  return axios({
    url: '/api/sys/serialno/save',
    method: 'post',
    data
  })
}

// 删除
export const doDelete = (data) => {
  return axios({
    url: '/api/sys/serialno/deletes',
    method: 'post',
    data
  })
}
