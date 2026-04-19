import axios from '@/http/axios'

/*
 * 附件管理模块
 */

/**
 * 分页查询
 * @param {*} params
 * @returns
 */
export const findPage = (params) => {
  return axios({
    url: '/api/sys/attach/query',
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
    url: '/api/sys/attach/deletes',
    method: 'delete',
    data
  })
}

