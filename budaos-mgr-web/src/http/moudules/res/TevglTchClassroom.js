import axios from '@/http/axios'

// 分页查询
export const findPage = (params) => {
  return axios({
    url: '/api/tch/tevgltchclassroom/queryForMap',
    method: 'get',
    params
  })
};

// 保存
export const save = (data) => {
  return axios({
    url: '/api/tch/tevgltchclassroom/saveorupdate',
    method: 'post',
    data
  })
};

// 删除
export const doDelete = (data) => {
  return axios({
    url: '/api/tch/tevgltchclassroom/deletes',
    method: 'post',
    data
  })
};

//查看明细
export const view = (id) => {
  return axios({
    url: '/api/tch/tevgltchclassroom/view/'+id,
    method: 'get'
  })
};

export const end = (data) => {
  return axios({
    url: '/api/tch/tevgltchclassroom/end',
    method: 'post',
    data
  })
};

export const turnOver = (data) => {
  return axios({
    url: '/api/tch/tevgltchclassroom/turnOver',
    method: 'post',
    data
  })
};

export const listPkgInfoSelect = (params) => {
  return axios({
    url: '/api/tch/tevgltchclassroom/listPkgInfoSelect',
    method: 'get',
    params
  })
};

export const listSelectSubject = (params) => {
  return axios({
    url: '/api/tch/tevgltchclassroom/listSelectSubject',
    method: 'get',
    params
  })
};

export const getMajorList = (params) => {
  return axios({
    url: '/api/tch/tevgltchclassroom/getMajorList',
    method: 'get',
    params
  })
};

export const getClassList = (params) => {
  return axios({
    url: '/api/tch/tevgltchclassroom/getClassList',
    method: 'get',
    params
  })
};


export const listClassroomState = (params) => {
  return axios({
    url: '/api/tch/tevgltchclassroom/listClassroomState',
    method: 'get',
    params
  })
};

export const queryTeacherList = (params) => {
  return axios({
    url: '/api/tch/tevgltchclassroom/queryTeacherList',
    method: 'get',
    params
  })
};

export const findClassroomTraineeList = (params) => {
  return axios({
    url: '/api/tch/tevgltchclassroom/findClassroomTraineeList',
    method: 'get',
    params: params
  })
}

export const batchUpdateAccessState = (ctId, data) => {
  return axios({
    url: '/api/tch/tevgltchclassroom/batchUpdateAccessState?ctId=' + ctId,
    method: 'post',
    data: data
  })
}
