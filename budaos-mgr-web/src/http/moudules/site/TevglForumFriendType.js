import axios from '@/http/axios'

// 分页查询
export const findPage = (params) => {
  return axios({
    url: '/api/forum/tevglforumfriendtype/query',
    method: 'get',
    params
  })
};

// 保存
export const save = (data) => {
  return axios({
    url: '/api/forum/tevglforumfriendtype/saveorupdate',
    method: 'post',
    data
  })
};

// 删除
export const doDelete = (data) => {
  return axios({
    url: '/api/forum/tevglforumfriendtype/deletes',
    method: 'post',
    data
  })
};

//查看明细
export const view = (id) => {
  return axios({
    url: '/api/forum/tevglforumfriendtype/view/'+id,
    method: 'get'
  })
};

export const getMaxSortNum = (params) => {
  return axios({
    url: '/api/forum/tevglforumfriendtype/getMaxSortNum',
    method: 'post',
    params
  })
};
