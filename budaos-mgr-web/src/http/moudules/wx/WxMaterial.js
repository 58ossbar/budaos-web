import axios from '@/http/axios'

// 分页查询
export const batchgetMaterial = (data) => {
  return axios({
    url: '/api/wx/material/batchgetMaterial',
    method: 'post',
    data
  })
}

// 分页查询
export const queryForOfficial = (params) => {
  return axios({
    url: '/api/wx/official/news/queryForOfficial',
    method: 'get',
    params
  })
}

export const saveForOfficial = (data) => {
  return axios({
    url: '/api/wx/official/news/saveForOfficial',
    method: 'post',
    data
  })
}

export const release = (data) => {
  return axios({
    url: '/api/wx/official/news/release',
    method: 'post',
    data
  })
}

export const doDeleteNews = (data) => {
  return axios({
    url: '/api/wx/official/news/deletes',
    method: 'post',
    data
  })
};

// 分页查询
export const viewForOfficial = (id) => {
  return axios({
    url: '/api/wx/official/news/viewForOfficial/' + id,
    method: 'get'
  })
}

export const upload = (data) => {
  return axios({
    url: '/api/wx/material/upload',
    method: 'post',
    data
  })
}

export const delMaterial = (data) => {
  return axios({
    url: '/api/wx/material/delMaterial',
    method: 'post',
    data
  })
}
