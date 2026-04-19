import axios from '@/http/axios'

// 分页查询
export const findPage = (params) => {
  return axios({
    url: '/api/site/tevglsitefeedbackreply/query',
    method: 'get',
    params
  })
};

// 保存
export const save = (data) => {
  return axios({
    url: '/api/site/tevglsitefeedbackreply/saveorupdate',
    method: 'post',
    data
  })
};

// 删除
export const doDelete = (data) => {
  return axios({
    url: '/api/site/tevglsitefeedbackreply/deletes',
    method: 'post',
    data
  })
};

//查看明细
export const view = (id) => {
  return axios({
    url: '/api/site/tevglsitefeedbackreply/view/'+id,
    method: 'get'
  })
};

export const viewFeedbackReplyInfo = (params) => {
  return axios({
    url: '/api/site/tevglsitefeedbackreply/viewFeedbackReplyInfo',
    method: 'get',
    params
  })
};