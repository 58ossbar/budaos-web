import axios from '@/http/axios'

/*
 * 参数管理模块
 */

// 保存
export const save = (data) => {
  return axios({
    url: '/api/sys/parameter/saveOrUpdate',
    method: 'post',
    data
  })
}
// 删除
export const batchDelete = (data) => {
  return axios({
    url: '/api/sys/parameter/deletes',
    method: 'delete',
    data
  })
}
// 分页查询
export const findPage = (params) => {
  return axios({
    url: '/api/sys/parameter/query',
    method: 'get',
    params
  })
}
// 查询左侧树
export const findTree = (params) => {
  return axios({
    url: '/api/sys/parameter/paraTree',
    method: 'get',
    params
  })
}

// 查询参数
export const findParaType = (params) => {
  return axios({
    url: '/api/sys/parameter/getPara',
    method: 'get',
    params
  })
}

/* export const findTree = (params) => {
  return axios({
    url: 'dict/findTree',
    method: 'get',
    params
  })
}*/
