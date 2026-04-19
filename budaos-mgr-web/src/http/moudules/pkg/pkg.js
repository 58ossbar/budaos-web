import axios from '@/http/axios'

// 分页查询
export const findPage = (params) => {
  return axios({
    url: '/api/pkg/tevglpkginfo/queryPackageForChange',
    method: 'get',
    params
  })
};


// 保存
export const save = (data) => {
  return axios({
    url: '/api/pkg/tevglpkginfo/doChangePackage',
    method: 'post',
    data
  })
};
