import axios from '@/http/axios'

// 分页查询
export const findPage = (params) => {
  return axios({
    url: '/api/medu/tmedumediaavd/query',
    method: 'get',
    params
  })
};

// 保存
export const save = (data) => {
  return axios({
    url: '/api/medu/tmedumediaavd/saveorupdate?attachId=' + data.avdPicurlAttachId,
    method: 'post',
    data
  })
};

// 删除
export const doDelete = (data) => {
  return axios({
    url: '/api/medu/tmedumediaavd/deletes',
    method: 'post',
    data
  })
};

//查看明细
export const view = (id) => {
  return axios({
    url: '/api/medu/tmedumediaavd/view/'+id,
    method: 'get'
  })
};

export const updateState = (data) => {
  return axios({
    url: '/api/medu/tmedumediaavd/updateStatus',
    method: 'post',
    data
  })
};
