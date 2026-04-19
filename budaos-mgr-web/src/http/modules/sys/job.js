/**
 * 定时任务
 */
import axios from '@/http/axios'

// 列表查询
export const findPage = (params) => {
  return axios({
    url: '/api/sys/job/query',
    method: 'get',
    params
  })
}

// 保存
export const save = (data) => {
  return axios({
    url: '/api/sys/job/save',
    method: 'post',
    data
  })
}

export const update = (data) => {
  return axios({
    url: '/api/sys/job/save',
    method: 'post',
    data
  })
}

// 删除、批量删除
export const batchDelete = (data) => {
  return axios({
    url: '/api/sys/job/deletes',
    method: 'post',
    data
  })
}

// 暂停
export const pause = (data) => {
  return axios({
    url: '/api/sys/job/pause',
    method: 'post',
    data
  })
}

// 恢复
export const resume = (data) => {
  return axios({
    url: '/api/sys/job/resume',
    method: 'post',
    data
  })
}

// 立即执行
export const runTask = (data) => {
  return axios({
    url: '/api/sys/job/runTask',
    method: 'post',
    data
  })
}

export const queryJobLog = (params) => {
  return axios({
    url: '/api/sys/jobLog/query',
    method: 'get',
    params
  })
}
