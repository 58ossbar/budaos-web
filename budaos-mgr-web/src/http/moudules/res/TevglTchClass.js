import axios from '@/http/axios'

// 分页查询
export const findPage = (params) => {
  return axios({
    url: '/api/tch/tevgltchclass/query',
    method: 'get',
    params
  })
};

// 保存
export const save = (data) => {
  return axios({
    url: '/api/tch/tevgltchclass/saveorupdate',
    method: 'post',
    data
  })
};

// 删除
export const doDelete = (data) => {
  return axios({
    url: '/api/tch/tevgltchclass/deletes',
    method: 'post',
    data
  })
};

//查看明细
export const view = (id) => {
  return axios({
    url: '/api/tch/tevgltchclass/view/'+id,
    method: 'get'
  })
};

//查看明细
export const getClassPic = () => {
  return axios({
    url: '/api/tch/tevgltchclass/getClassPic',
    method: 'get'
  })
};


export const getTeachingAssistant = (params) => {
  return axios({
    url: '/api/tch/tevgltchclass/getTeachingAssistant',
    method: 'get',
    params
  })
};

export const listClassTrainee = (params) => {
  return axios({
    url: '/api/tch/tevgltchclass/listClassTrainee',
    method: 'get',
    params
  })
};

export const getClassTree = (params) => {
  return axios({
    url: '/api/tch/tevgltchclass/getClassTree',
    method: 'get',
    params
  })
};
