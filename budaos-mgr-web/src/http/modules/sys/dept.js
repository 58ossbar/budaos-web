import axios from '@/http/axios'

/*
 * 机构管理模块
 */

// 保存
export const save = (data) => {
  return axios({
    url: '/api/sys/org/saveOrUpdate',
    method: 'post',
    data
  })
}
// 树拖拽
export const updateDrag = (data) => {
  return axios({
    url: '/api/sys/org/drag',
    method: 'post',
    data
  })
}
// 树上下移
export const move = (data) => {
  return axios({
    url: '/api/sys/org/clickDrag',
    method: 'post',
    data
  })
}
// 删除
export const batchDelete = (data) => {
  return axios({
    url: '/api/sys/org/delete',
    method: 'delete',
    data
  })
}
// 查询机构树
export const findDeptTree = (params) => {
  if (params) {
    return axios({
      url: '/api/sys/org/query',
      method: 'get',
      params
    })
  }
}
// 查询显示的机构树
export const findDeptTreeShow = (params) => {
  if (params) {
    return axios({
      url: '/api/sys/org/queryLinkState',
      method: 'get',
      params
    })
  }
}
// 根据id查询数据
export const findDeptTreeById = (params) => {
  if (params) {
    return axios({
      url: '/api/sys/org/get/' + params,
      method: 'get'
    })
  }
}

// 根据机构名称自动生成全拼和简拼
export const findDeptPingYing = (params) => {
  if (params) {
    return axios({
      url: '/api/sys/pinyin/topinyin',
      method: 'get',
      params
    })
  }
}

// 查询机构树
export const getOrgTree = () => {
  return axios({
    url: '/api/sys/org/getOrgTree',
    method: 'get'
  })
}
