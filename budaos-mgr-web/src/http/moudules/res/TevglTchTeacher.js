import axios from '../../axios'

// 分页查询
export const findPage = (params) => {
  return axios({
    url: '/api/tch/tevgltchteacher/query',
    method: 'get',
    params
  })
};

// 保存
export const save = (data) => {
  return axios({
    url: '/api/tch/tevgltchteacher/saveorupdate?attachId='+data.teacherPicAttachId,
    method: 'post',
    data
  })
};

// 删除
export const doDelete = (data) => {
  return axios({
    url: '/api/tch/tevgltchteacher/deletes',
    method: 'post',
    data
  })
};

// 查看明细
export const view = (id) => {
  return axios({
    url: '/api/tch/tevgltchteacher/view/'+id,
    method: 'get'
  })
};

// 岗位
export const getTeacherPost = (params) => {
  return axios({
    url: '/api/sys/post/queryAll',
    method: 'get',
    params
  })
};

export const updateStatus = (data) => {
  return axios({
    url: '/api/tch/tevgltchteacher/updateStatus',
    method: 'post',
    data
  })
};
