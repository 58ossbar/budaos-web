import axios from '../../axios'

// 分页查询
export const findPage = (params) => {
  return axios({
    url: '/api/stu/tevglstustar/query',
    method: 'get',
    params
  })
};

// 保存
export const save = (data) => {
  return axios({
    url: '/api/stu/tevglstustar/saveorupdate?attachId='+data.starPicAttachId,
    method: 'post',
    data
  })
};

// 删除
export const doDelete = (data) => {
  return axios({
    url: '/api/stu/tevglstustar/deletes',
    method: 'post',
    data
  })
};

// 查看明细
export const view = (id) => {
  return axios({
    url: '/api/stu/tevglstustar/view/'+id,
    method: 'get'
  })
};


export const updateState = (data) => {
  return axios({
    url: '/api/stu/tevglstustar/updateStatus',
    method: 'post',
    data
  })
};
