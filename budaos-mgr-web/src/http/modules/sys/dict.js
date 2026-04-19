import axios from '@/http/axios'

/*
 * 字典管理模块
 */

// 保存
export const save = (data) => {
  if (data) {
    return axios({
      url: '/api/sys/dict/saveOrUpdate?attachId=' + data.attachId,
      method: 'post',
      data
    })
  }
}
// 删除
export const batchDelete = (data) => {
  return axios({
    url: '/api/sys/dict/deletes',
    method: 'delete',
    data
  })
}
// 分页查询
export const findPage = (params) => {
  return axios({
    url: '/api/sys/dict/query',
    method: 'get',
    params
  })
}
// 查询左侧树
export const findTree = (params) => {
  return axios({
    url: '/api/sys/dict/dicttree',
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
// 查询字典
export const cbdict = (params) => {
  return axios({
    url: '/api/sys/dict/cbdict',
    method: 'get',
    params
  })
}
