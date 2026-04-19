import axios from '@/http/axios'

/*
 * 用户管理模块
 */

// 保存
export const save = (data) => {
  return axios({
    url: '/api/sys/user/save',
    method: 'post',
    data
  })
}
// 修改
export const update = (data) => {
  return axios({
    url: '/api/sys/user/save',
    method: 'post',
    data
  })
}

// 删除
export const batchDelete = (data) => {
  return axios({
    url: '/api/sys/user/deletes',
    method: 'post',
    data
  })
}
// 分页查询
export const findPage = (params) => {
  return axios({
    url: '/api/sys/user/findPage',
    method: 'get',
    params
  })
}
// 查找用户的菜单权限标识集合
export const findPermissions = (params) => {
  return axios({
    url: '/api/sys/user/findPermissions',
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
    url: '/api/sys/user/view/' + id,
    method: 'get'
  })
}

/**
 * 清空权限
 * @param {*} data
 * @returns
 */
export const clearPermissions = (data) => {
  return axios({
    url: '/api/sys/user/clearPermissions',
    method: 'post',
    data
  })
}

/**
 * 重置密码
 * @param {*} data
 * @returns
 */
export const resetPassword = (data) => {
  return axios({
    url: '/api/sys/user/resetPassword',
    method: 'post',
    data
  })
}

/**
 * 获取已分配的角色
 * @param {*} data
 * @returns
 */
export const toGrantRole = (data) => {
  return axios({
    url: '/api/sys/user/toGrantRole',
    method: 'post',
    data
  })
}

/**
 * 分配角色
 * @param {*} params
 * @returns
 */
export const grantRole = (data) => {
  return axios({
    url: '/api/sys/user/grantRole',
    method: 'post',
    data
  })
}

// 修改密码
export const changePassword = (data) => {
  return axios({
    url: '/api/sys/user/password',
    method: 'post',
    data
  })
}
