import axios from '@/http/axios'

/*
 * 日志管理模块
 */

// 分页查询
export const findPage = (params) => {
  return axios({
    url: '/api/sys/log/query',
    method: 'get',
    params
  })
}

/**
 * 删除
 * @param {*} data
 * @returns
 */
export const batchDelete = (data) => {
  return axios({
    url: '/api/sys/log/deletes',
    method: 'post',
    data
  })
}
