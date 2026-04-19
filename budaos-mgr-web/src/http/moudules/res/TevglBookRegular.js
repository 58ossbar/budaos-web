import axios from '@/http/axios'

// 分页查询
export const findPage = (params) => {
  return axios({
    url: '/api/book/tevglbookregular/query',
    method: 'get',
    params
  })
};

// 保存
export const save = (data) => {
  return axios({
    url: '/api/book/tevglbookregular/saveOrUpdate',
    method: 'post',
    data
  })
};

// 删除
export const doDelete = (data) => {
  return axios({
    url: '/api/book/tevglbookregular/deletes',
    method: 'post',
    data
  })
};

//查看明细
export const view = (id) => {
  return axios({
    url: '/api/book/tevglbookregular/view/'+id,
    method: 'get'
  })
};

export const getSubjectRegularTree = (params) => {
  return axios({
    url: '/api/book/tevglbookregular/getSubjectRegularTree',
    method: 'get',
    params
  })
}

export const viewRegular = params => {
  return axios({
    url: '/api/book/tevglbookregular/viewRegular',
    method: 'get',
    params
  })
}

export const saveRegular = (data) => {
  return axios({
    url: '/api/book/tevglbookregular/saveRegular',
    method: 'post',
    data
  })
}

export const removeRegular = (data) => {
  return axios({
    url: '/api/book/tevglbookregular/removeRegular',
    method: 'post',
    data
  })
}

export const paste = (data) => {
  return axios({
    url: '/api/book/tevglbookregular/paste',
    method: 'post',
    data
  })
}
