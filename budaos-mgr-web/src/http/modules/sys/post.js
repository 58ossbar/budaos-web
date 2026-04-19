import axios from '@/http/axios'

/*
 * 岗位管理模块
 */

// 分页查询
export const findPage = (params) => {
  return axios({
    url: '/api/sys/post/query',
    method: 'get',
    params
  })
}

/**
 * 查看明细
 * @param {*} id 岗位id
 * @returns
 */
export const view = (id) => {
  return axios({
    url: '/api/sys/post/view/' + id,
    method: 'get'
  })
}

/**
 * 新增
 * @param {*} data
 * @returns
 */
export const save = (data) => {
  return axios({
    url: '/api/sys/post/save',
    method: 'post',
    data
  })
}

/**
 * 修改
 * @param {*} data
 * @returns
 */
export const update = (data) => {
  return axios({
    url: '/api/sys/post/save',
    method: 'post',
    data
  })
}

// 删除
export const batchDelete = (data) => {
  return axios({
    url: '/api/sys/post/deletes',
    method: 'post',
    data
  })
}

// 上下移
export const postMove = (params) => {
  return axios({
    url: '/api/sys/post/updateSort',
    method: 'get',
    params
  })
}
// 查询岗位树
export const findAll = (params) => {
  return axios({
    url: '/api/sys/post/queryNoPage',
    method: 'get',
    params
  })
}

/**
 * 获取最大排序号
 * @param params
 * @returns {*|Promise|Promise<any>}
 */
export const getMaxSortNum = (params) => {
  return axios({
    url: '/api/sys/post/getMaxSort',
    method: 'get',
    params
  })
}

/**
 * 无分页查询所有岗位
 * @param {*} params
 * @returns
 */
export const findPost = (params) => {
  return axios({
    url: '/api/sys/post/queryAll',
    method: 'get',
    params
  })
}
