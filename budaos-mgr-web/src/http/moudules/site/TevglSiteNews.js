import axios from '../../axios'

// TODO 新闻资讯

// 分页查询
export const findPage = (params) => {
  return axios({
    url: '/api/site/tevglsitenews/query',
    method: 'get',
    params
  })
};

// 保存
export const save = (data) => {
  return axios({
    url: '/api/site/tevglsitenews/saveorupdate?attachId='+data.newsLogoAttachId,
    method: 'post',
    data
  })
};

export const view = (id) => {
  return axios({
    url: '/api/site/tevglsitenews/toEdit/' + id,
    method: 'get'
  })
}

// 删除
export const doDelete = (data) => {
  return axios({
    url: '/api/site/tevglsitenews/deletes',
    method: 'post',
    data
  })
};

// 获取资讯分类
export const getCategory = () => {
  return axios({
    url: '/api/site/tevglsitenews/getCategory',
    method: 'get',
  })
}

// 获取发布方式
export const getDeployed = () => {
  return axios({
    url: '/api/site/tevglsitenews/getDeployed',
    method: 'get',
  })
}

// 获取是否头条
export const getIsHeadlineNews = () => {
  return axios({
    url: '/api/site/tevglsitenews/getIsHeadlineNews',
    method: 'get',
  })
}

export const updateState = (data) => {
  return axios({
    url: '/api/site/tevglsitenews/updateStatus',
    method: 'post',
    data
  })
};

// 审核
export const check = (data, obj) => {
  return axios({
    url: '/api/site/tevglsitenews/check?state='+obj.status+"&reason="+obj.reason,
    method: 'post',
    data
  })
}

// 查询审核记录
export const queryCheckInfo = (params) => {
  return axios({
    url: '/api/site/tevglsitenews/queryCheckInfo',
    method: 'get',
    params
  })
}
