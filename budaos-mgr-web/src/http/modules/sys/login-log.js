import axios from '@/http/axios'

/**
 * 根据条件分页查询记录
 * @param {*} params
 * @returns
 */
export const findPage = (params) => {
  return axios({
    url: '/api/sys/loginlog/query',
    method: 'get',
    params
  })
}

/**
 * 批量删除
 * @param {*} data
 * @returns
 */
export const batchDelete = (data) => {
  return axios({
    url: '/api/sys/loginlog/deletes',
    method: 'post',
    data
  })
}
