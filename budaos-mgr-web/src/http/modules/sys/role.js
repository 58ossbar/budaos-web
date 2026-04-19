import axios from '@/http/axios'

/*
 * 角色管理模块
 */

// 分页查询
export const findPage = (params) => {
  return axios({
    url: '/api/sys/role/findPage',
    method: 'get',
    params
  })
}

/**
 * 查看明细
 * @param {*} id 角色id
 * @returns
 */
export const view = (id) => {
  return axios({
    url: '/api/sys/role/view/' + id,
    method: 'get'
  })
}

// 保存
export const save = (data) => {
  return axios({
    url: '/api/sys/role/save',
    method: 'post',
    data
  })
}

export const update = (data) => {
  return axios({
    url: '/api/sys/role/save',
    method: 'post',
    data
  })
}
// 更新状态
export const updateStatus = (data) => {
  return axios({
    url: '/api/sys/role/updateStatus',
    method: 'post',
    data
  })
}
// 删除
export const batchDelete = (data) => {
  return axios({
    url: '/api/sys/role/delete',
    method: 'post',
    data
  })
}

// 查询角色
export const findAll = (data) => {
  return axios({
    url: '/api/sys/role/queryall',
    method: 'post',
    data
  })
}

// 获取菜单
export const queryPerms = () => {
  return axios({
    url: '/api/sys/role/perms',
    method: 'get'
  })
}

// 获取机构树
export const orgTree = (data) => {
  return axios({
    url: '/api/sys/role/orgTree',
    method: 'post',
    data
  })
}

// 根据条件查询用户信息
export const queryUserInfo = (params) => {
  return axios({
    url: '/api/sys/user/findPage',
    method: 'get',
    params
  })
}

// 根据条件查询用户信息（无分页）
export const queryUserInfoNoPage = (params) => {
  return axios({
    url: '/api/sys/user/queryUserInfo',
    method: 'get',
    params
  })
}

// 分配用户---保存
export const saveRoleUser = (data) => {
  return axios({
    url: '/api/sys/role/saveRoleUser',
    method: 'post',
    data
  })
}

// 查看明细
export const selectObjectById = (data) => {
  return axios({
    url: '/api/sys/role/edit',
    method: 'post',
    data
  })
}

export const setUser = (data) => {
  return axios({
    url: '/api/sys/role/setUser',
    method: 'post',
    data
  })
}

// 构建资源数
export const toTreeData = (data, attr) => {
  const tree = []
  const resData = data
  for (let i = 0; i < resData.length; i++) {
    if (resData[i] != null && resData[i] != 'null') {
      if ((resData[i].parentId === attr.rootId) || (resData[i].parentId == '' || resData[i].parentId == null)) {
        const obj = {
          id: resData[i][attr.id],
          label: resData[i][attr.name],
          name: resData[i][attr.name],
          pId: resData[i][attr.parentId],
          parentId: resData[i][attr.parentId],
          parentName: resData[i][attr.parentName],
          children: [],
          list: []
        }
        tree.push(obj)
        resData.splice(i, 1)
        i--
      }
    }
  }
  var run = function(treeArrs) {
    if (resData.length > 0) {
      for (let i = 0; i < treeArrs.length; i++) {
        for (let j = 0; j < resData.length; j++) {
          if (resData[j] != null && resData[j] != 'null') {
            if (treeArrs[i].id === resData[j][attr.parentId]) {
              const obj = {
                id: resData[j][attr.id],
                label: resData[j][attr.name],
                name: resData[j][attr.name],
                pId: resData[j][attr.parentId],
                parentId: resData[j][attr.parentId],
                parentName: resData[j][attr.parentName],
                children: [],
                list: []
              }
              treeArrs[i].children.push(obj)
              treeArrs[i].list.push(obj)
              resData.splice(j, 1)
              j--
            }
          }
        }
        run(treeArrs[i].children)
      }
    }
  }
  run(tree)
  return tree
}

