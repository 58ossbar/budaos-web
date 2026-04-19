import axios from '../../axios'

// 分页查询
export const findPage = (params) => {
  return axios({
    url: '/api/book/tevglbooksubject/query',
    method: 'get',
    params
  })
};

// 保存
export const save = (data) => {
  return axios({
    url: '/api/book/tevglbooksubject/saveorupdate',
    method: 'post',
    data
  })
};

// 删除
export const doDelete = (data) => {
  return axios({
    url: '/api/book/tevglbooksubject/deletes',
    method: 'post',
    data
  })
};

//查看明细
export const view = (id) => {
  return axios({
    url: '/api/book/tevglbooksubject/view/'+id,
    method: 'get'
  })
};

//切换状态开关
export const updateStatus = (data) => {
  return axios({
    url: '/api/book/tevglbooksubject/updateStatus',
    method: 'post',
    data
  })
};

// 获取静态封面图
export const getSubjectLogo = params => {
  return axios({
    url: '/api/book/tevglbooksubject/getSubjectLogo',
    method: 'get',
    params
  })
}

export const getChapterTree = params => {
  return axios({
    url: '/api/book/tevglbooksubject/getTreeForMgr',
    method: 'get',
    params
  })
}

export const saveChapterInfo = data => {
  return axios({
    url: '/api/book/tevglbooksubject/saveChapterInfo',
    method: 'post',
    data
  })
}

export const remove = data => {
  return axios({
    url: '/api/book/tevglbooksubject/remove',
    method: 'post',
    data
  })
}

export const saveChapterContent = data => {
  return axios({
    url: '/api/book/tevglbooksubject/saveChapterContent',
    method: 'post',
    data
  })
}

export const viewChapter = (id) => {
  return axios({
    url: '/api/book/tevglbooksubject/viewChapter/'+id,
    method: 'get'
  })
};

export const querySubjectList = (params) => {
  return axios({
    url: '/api/book/tevglbooksubject/querySubjectList',
    method: 'get',
    params
  })
};
