import axios from '@/http/axios'

// 分页查询
export const findPage = (params) => {
  return axios({
    url: '/api/forum/tevglforumfriend/query',
    method: 'get',
    params
  })
};

// 保存
export const save = (data) => {
  return axios({
    url: '/api/forum/tevglforumfriend/saveorupdate',
    method: 'post',
    data
  })
};

// 删除
export const doDelete = (data) => {
  return axios({
    url: '/api/forum/tevglforumfriend/deletes',
    method: 'post',
    data
  })
};

//查看明细
export const view = (id) => {
  return axios({
    url: '/api/forum/tevglforumfriend/view/'+id,
    method: 'get'
  })
};

export const updateState = (data) => {
  return axios({
    url: '/api/forum/tevglforumfriend/updateState',
    method: 'post',
    data
  })
};

export const queryTypeList = (data) => {
  return axios({
    url: '/api/forum/tevglforumfriendtype/queryTypeList',
    method: 'post',
    data
  })
};

export const getTree = (params) => {
  return axios({
    url: '/api/forum/tevglforumfriendtype/getTree',
    method: 'get',
    params
  })
};
