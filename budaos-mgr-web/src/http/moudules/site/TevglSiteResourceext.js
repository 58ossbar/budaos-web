import axios from '../../axios'

// 分页查询
export const findPage = (params) => {
  return axios({
    url: '/api/site/tevglsiteresourceext/query',
    method: 'get',
    params
  })
};

// 保存
export const save = (data) => {
  return axios({
    url: '/api/site/tevglsiteresourceext/saveorupdate',
    method: 'post',
    data
  })
};

// 删除
export const doDelete = (id) => {
  return axios({
    url: '/api/site/tevglsiteresourceext/removeSite/'+id,
    method: 'get'
  })
};

export const editSite = (id) => {
  return axios({
    url: '/api/site/tevglsiteresourceext/editsite/'+id,
    method: 'get'
  })
}

/**
 * 获取树形数据
 * @param params
 * @returns {*|Promise|Promise<any>}
 */
export const querySite = (params) => {
  return axios({
    url: '/api/site/tevglsiteresourceext/querySite',
    method: 'get',
    params
  })
}

/**
 * 查询站点详细信息
 * @param id
 * @returns {*|Promise|Promise<any>}
 */
export const viewSite = (id) => {
  return axios({
    url: '/api/site/tevglsiteresourceext/viewSite/'+id,
    method: 'get'
  })
}

/**
 * 获取类型,如【站点】【栏目】
 * @returns {*|Promise|Promise<any>}
 */
export const getSiteType = () => {
  return axios({
    url: '/api/site/tevglsiteresourceext/getSiteType',
    method: 'get'
  })
}

export const saveOrUpdate = (data) => {
  return axios({
    url: '/api/site/tevglsiteresourceext/saveSite',
    method: 'post',
    data
  })
};

// 查看seo
export const viewSeo = (id) => {
  return axios({
    url: '/api/site/tevglsiteseo/viewSeo/'+id,
    method: 'get'
  })
}

// 保存seo
export const saveOrUpdateSeo = (data) => {
  return axios({
    url: '/api/site/tevglsiteseo/saveorupdate',
    method: 'post',
    data
  })
};

// 编辑seo
export const editSiteSeo = (params) => {
  return axios({
    url: '/api/site/tevglsiteseo/editsiteseo/'+params.menuId,
    method: 'get',
    params
  })
}

// 删除seo
export const removeSiteSeo = (id) => {
  return axios({
    url: '/api/site/tevglsiteseo/removeseo/'+id,
    method: 'get'
  })
}

// 获取行业类型,如IT、教育、汽车等
export const getTradeType = () => {
  return axios({
    url: '/api/site/tevglsiteresourceext/getTradeType',
    method: 'get'
  })
}
