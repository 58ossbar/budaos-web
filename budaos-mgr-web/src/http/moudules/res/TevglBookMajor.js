import axios from '../../axios'

// 分页查询
export const findPage = (params) => {
  return axios({
    url: '/api/book/tevglbookmajor/query',
    method: 'get',
    params
  })
};

// 保存
export const save = (data) => {
  return axios({
    url: '/api/book/tevglbookmajor/saveorupdate',
    method: 'post',
    data
  })
};

// 删除
export const doDelete = (data) => {
  return axios({
    url: '/api/book/tevglbookmajor/deletes',
    method: 'post',
    data
  })
};

//查看明细
export const view = (id) => {
  return axios({
    url: '/api/book/tevglbookmajor/view/'+id,
    method: 'get'
  })
};

export const queryMajorClassTreeData = (params) => {
  return axios({
    url: '/api/book/tevglbookmajor/queryMajorClassTreeData',
    method: 'get',
    params
  })
};

export const queryMajorSubjectTreeData = (params) => {
  return axios({
    url: '/api/book/tevglbookmajor/queryMajorSubjectTreeData',
    method: 'get',
    params
  })
};
