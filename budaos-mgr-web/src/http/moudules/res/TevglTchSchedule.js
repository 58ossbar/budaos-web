import axios from '@/http/axios'

// 分页查询
export const findPage = (params) => {
  return axios({
    url: '/api/tch/tevgltchschedule/query',
    method: 'get',
    params
  })
};

// 保存
export const save = (data) => {
  return axios({
    url: '/api/tch/tevgltchschedule/saveorupdate',
    method: 'post',
    data
  })
};

// 删除
export const doDelete = (data) => {
  return axios({
    url: '/api/tch/tevgltchschedule/deletes',
    method: 'post',
    data
  })
};

export const deleteAlone = (id) => {
  return axios({
    url: '/api/tch/tevgltchschedule/delete/' + id,
    method: 'get'
  })
};

//查看明细
export const view = (id) => {
  return axios({
    url: '/api/tch/tevgltchschedule/view/'+id,
    method: 'get'
  })
};

// 分页查询
export const queryScheduleData = (params) => {
  return axios({
    url: '/api/tch/tevgltchschedule/queryScheduleDataV2',
    method: 'get',
    params
  })
};

export const saveBatch = (data) => {
  return axios({
    url: '/api/tch/tevgltchschedule/saveBatch',
    method: 'post',
    data
  })
};

export const queryTrainingRoomList = (params) => {
  return axios({
    url: '/api/tch/tevgltchschedule/queryTrainingRoomList',
    method: 'get',
    params
  })
};

export const exchangeSchedule = (data) => {
  return axios({
    url: '/api/tch/tevgltchschedule/exchangeSchedule',
    method: 'post',
    data
  })
};
