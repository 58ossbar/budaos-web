import axios from '@/http/axios'

// 分页查询
export const findPage = (params) => {
  return axios({
    url: '/api/tch/tevgltchclasstrainee/queryForMap',
    method: 'get',
    params
  })
};

// 保存
export const save = (data) => {
  return axios({
    url: '/api/tch/tevgltchclasstrainee/saveorupdate',
    method: 'post',
    data
  })
};

// 删除
export const doDelete = (data) => {
  return axios({
    url: '/api/tch/tevgltchclasstrainee/deletes',
    method: 'post',
    data
  })
};

//查看明细
export const view = (id) => {
  return axios({
    url: '/api/tch/tevgltchclasstrainee/view/'+id,
    method: 'get'
  })
};


export const importExcel = (data) => {
  return axios({
    url: '/api/tch/tevgltchclasstrainee/importExcel',
    method: 'post',
    data
  })
};

export const exportExcel = (params) => {
  console.log('条件', params)
  return axios({
    url: '/api/tch/tevgltchclasstrainee/exportExcel',
    method: 'post',
    params
  })
};

export const updateTrainee = (data) => {
  return axios({
    url: '/api/tch/tevgltchclasstrainee/updateTrainee',
    method: 'post',
    data
  })
};

export const downloadClassTraineeTemplate = () => {
  return axios({
    url: '/api/download/downloadClassTraineeTemplate',
    method: 'post',
    responseType: 'blob',
    timeout: 60000,
  })
}

export const findTraineeListNotInClassWithPage = (params) => {
  return axios({
    url: '/api/tch/tevgltchclasstrainee/findTraineeListNotInClassWithPage',
    method: 'get',
    params
  })
};

export const saveClassTraineeBatch = (data) => {
  return axios({
    url: '/api/tch/tevgltchclasstrainee/saveClassTraineeBatch',
    method: 'post',
    data
  })
}
