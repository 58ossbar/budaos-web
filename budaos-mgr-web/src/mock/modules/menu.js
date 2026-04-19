/*
 * 菜单管理模块
 */

// 获取导航菜单树

export function findNavTree() {
  const navTreeData = {
    "code": 200,
    "msg": null,
    "data": [
      {
  "createTime": null,
  "createUserId":"",
  "delFlag":null,
  "display":null,
  "icon":"el-icon-setting",
  "menuId":"1",
  "name" :"系统管理",
  "open":null,
  "orderNum":1,
  "orgId": "1",
  "orgName":"1",
  "parentId":"19c786f2bfbf46398e3b495f6c7014b1",
 "parentName":null,
  "perms":"",
  "remark":null,
  "resourceClass":null,
  "sqlMap":{},
  "type":0,
  "updateTime" :"2017-08-12 15:45:18",
  "updateUserId":"系统管理员",
  "url":"",
   "list": [
        {
          "createTime": null,
          "createUserId":"",
          "delFlag":null,
          "display":1,
          "icon":"el-icon-news",
          "menuId":"99c786f2bfbf46399e3b495f6c7014bc",
          "name" :"机构管理",
          "open":null,
          "orderNum":1,
          "orgId": "11",
          "orgName":"11",
          "parentId":"1",
          "parentName":"系统管理1",
          "perms":"sys:tsysorg:query,sys:tsysorg:view",
          "remark":null,
          "resourceClass":null,
          "sqlMap":{},
          "type":1,
          "updateTime" :"2018-03-28 11:20:19",
          "updateUserId":"系统管理员",
          "url":"/sys/dept",
          "list":[]
      },
        {
          "createTime": null,
          "createUserId":"",
          "delFlag":null,
          "display":1,
          "icon":"el-icon-service",
          "menuId":"92c786f2bfbf46398e3b495f6c70156c",
          "name" :"用户管理",
          "open":null,
          "orderNum":2,
          "orgId": "12",
          "orgName":"12",
          "parentId":"1",
          "parentName":"系统管理1",
          "perms":"sys:tsysuserinfo:query,sys:tsysuserinfo:view,sys:tsysuserinfo:list",
          "remark":null,
          "resourceClass":null,
          "sqlMap":{},
          "type":1,
          "updateTime" :"2018-03-28 11:20:19",
          "updateUserId":"系统管理员",
          "url":"/sys/user",
          "list":[]
      },
        {
          "createTime": null,
          "createUserId":"",
          "delFlag":null,
          "display":1,
          "icon":"el-icon-view",
          "menuId":"93d786f2bfbf46398e3b495f6c70156c",
          "name" :"角色管理",
          "open":null,
          "orderNum":2,
          "orgId": "13",
          "orgName":"13",
          "parentId":"1",
          "parentName":null,
          "perms":"sys:role:list",
          "remark":null,
          "resourceClass":null,
          "sqlMap":{},
          "type":1,
          "updateTime" :"2018-03-28 11:20:19",
          "updateUserId":"系统管理员",
          "url":"/sys/role",
          "list":[]
      },
        {
          "createTime": null,
          "createUserId":"",
          "delFlag":null,
          "display":1,
          "icon":"el-icon-edit-outline",
          "menuId":"f9e8bed5cf6a485db552e0602741564c",
          "name" :"字典管理",
          "open":null,
          "orderNum":6,
          "orgId": "14",
          "orgName":"14",
          "parentId":"1",
          "parentName":null,
          "perms":"sys:tsysdict:query",
          "remark":null,
          "resourceClass":null,
          "sqlMap":{},
          "type":1,
          "updateTime" :"2018-03-28 11:20:19",
          "updateUserId":"系统管理员",
          "url":"/sys/dict",
          "list":[]
      },
        {
          "createTime": null,
          "createUserId":"",
          "delFlag":null,
          "display":1,
          "icon":"el-icon-menu",
          "menuId":"83d796f2bf2f46398e3b487f6c99156c",
          "name" :"岗位管理",
          "open":null,
          "orderNum":7,
          "orgId": "15",
          "orgName":"15",
          "parentId":"1",
          "parentName":null,
          "perms":"sys:tsyspost:query",
          "remark":null,
          "resourceClass":null,
          "sqlMap":{},
          "type":1,
          "updateTime" :"2018-03-28 11:20:19",
          "updateUserId":"系统管理员",
          "url":"sys/tsyspost/list",
          "list":[]
      }
      ]
    },
    {
      "createTime": null,
      "createUserId":"",
      "delFlag":null,
      "display":null,
      "icon":"glyphicon glyphicon-list-alt",
      "menuId":"cc3e5f98fb9d4c83bbb29332f4b0d85e",
      "name" :"开发管理",
      "open":null,
      "orderNum":2,
      "orgId": "2",
      "orgName":"2",
      "parentId":"19c786f2bfbf46398e3b495f6c7014b1",
      "parentName":null,
      "perms":"",
      "remark":null,
      "resourceClass":null,
      "sqlMap":{},
      "type":0,
      "updateTime" :"2017-08-12 15:45:18",
      "updateUserId":"系统管理员",
      "url":"",
      "list": [
        {
          "createTime": null,
          "createUserId":"",
          "delFlag":null,
          "display":1,
          "icon":"glyphicon glyphicon-th",
          "menuId":"f9e8bed5cf6a485db552e0602741894c",
          "name" :"资源管理",
          "open":null,
          "orderNum":1,
          "orgId": "21",
          "orgName":"21",
          "parentId":"cc3e5f98fb9d4c83bbb29332f4b0d85e",
          "parentName":null,
          "perms":"sys:tsysloginlog:query,sys:tsysloginlog:remove",
          "remark":null,
          "resourceClass":null,
          "sqlMap":{},
          "type":1,
          "updateTime" :"2018-03-28 11:20:19",
          "updateUserId":"系统管理员",
          "url":"/sys/menu"
          /*,"list":[]*/
        },
        {
          "createTime": null,
          "createUserId":"",
          "delFlag":null,
          "display":1,
          "icon":"glyphicon glyphicon-th",
          "menuId":"f9e8bed5cf6a485db552e0602741874c",
          "name" :"登录日志2",
          "open":null,
          "orderNum":1,
          "orgId": "22",
          "orgName":"22",
          "parentId":"cc3e5f98fb9d4c83bbb29332f4b0d85e",
          "parentName":null,
          "perms":"sys:tsysloginlog:query,sys:tsysloginlog:remove",
          "remark":null,
          "resourceClass":null,
          "sqlMap":{},
          "type":1,
          "updateTime" :"2018-03-28 11:20:19",
          "updateUserId":"系统管理员",
          "url":"sys/tsysloginlog/list"
          /*,"list":[]*/
        },
        {
          "createTime": null,
          "createUserId":"",
          "delFlag":null,
          "display":1,
          "icon":"glyphicon glyphicon-th",
          "menuId":"f9e8bed5cf6a485db552e1602741894c",
          "name" :"登录日志3",
          "open":null,
          "orderNum":1,
          "orgId": "23",
          "orgName":"23",
          "parentId":"cc3e5f98fb9d4c83bbb29332f4b0d85e",
          "parentName":null,
          "perms":"sys:tsysloginlog:query,sys:tsysloginlog:remove",
          "remark":null,
          "resourceClass":null,
          "sqlMap":{},
          "type":1,
          "updateTime" :"2018-03-28 11:20:19",
          "updateUserId":"系统管理员",
          "url":"sys/tsysloginlog/list"
         /* ,
          "list":[]*/
        },
        {
          "createTime": null,
          "createUserId":"",
          "delFlag":null,
          "display":1,
          "icon":"glyphicon glyphicon-th",
          "menuId":"f9e8bed5cf6a485db752e0602741894c",
          "name" :"登录日志4",
          "open":null,
          "orderNum":1,
          "orgId": "24",
          "orgName":"24",
          "parentId":"cc3e5f98fb9d4c83bbb29332f4b0d85e",
          "parentName":null,
          "perms":"sys:tsysloginlog:query,sys:tsysloginlog:remove",
          "remark":null,
          "resourceClass":null,
          "sqlMap":{},
          "type":1,
          "updateTime" :"2018-03-28 11:20:19",
          "updateUserId":"系统管理员",
          "url":"sys/tsysloginlog/list"
         /* ,
          "list":[]*/
        }
      ]
    }
    ]
  }
  return {
    url: 'menu/findNavTree',
    type: 'get',
    data: navTreeData
  }
}
// 保存
export function save(params){
  return {
    url: '/menu/save',
    method: 'get',
    data: {
      "code": 200,
      "msg": null,
      "data": 1
    }
  }
}
// 删除
export function batchDelete(params) {
  return {
    url: '/menu/delete',
    type: 'get',
    data: {
      "code": 200,
      "msg": null,
      "data": 1
    }
  }
}
// 获取菜单树
export function findMenuTree(params) {
  const menuTreeData =
    {
      "code": 200,
      "msg": null,
      "data": [
        {
          "createTime": null,
          "createUserId":"",
          "delFlag":null,
          "display":1,
          "icon":"el-icon-setting",
          "menuId":"1",
          "name" :"系统管理",
          "open":null,
          "orderNum":1,
          "orgId": "1",
          "orgName":"1",
          "parentId":"19c786f2bfbf46398e3b495f6c7014b1",
          "parentName":null,
          "perms":"",
          "remark":null,
          "resourceClass":0,
          "sqlMap":{},
          "type":0,
          "updateTime" :"2017-08-12 15:45:18",
          "updateUserId":"系统管理员",
          "url":"",
          "hasChildren": true
        },
        {
          "createTime": null,
          "createUserId":"",
          "delFlag":null,
          "display":1,
          "icon":"glyphicon glyphicon-list-alt",
          "menuId":"cc3e5f98fb9d4c83bbb29332f4b0d85e",
          "name" :"开发管理",
          "open":null,
          "orderNum":2,
          "orgId": "2",
          "orgName":"2",
          "parentId":"19c786f2bfbf46398e3b495f6c7014b1",
          "parentName":null,
          "perms":"",
          "remark":null,
          "resourceClass":0,
          "sqlMap":{},
          "type":0,
          "updateTime" :"2017-08-12 15:45:18",
          "updateUserId":"系统管理员",
          "url":""
        }
      ]
    }

  let kl=null;
  if(params){
    kl=params;
    menuTreeData.data=  {
      "createTime": null,
      "createUserId":"",
      "delFlag":null,
      "display":1,
      "icon":"el-icon-news",
      "menuId":"99c786f2bfbf46399e3b495f6c7014bc",
      "name" :"机构管理",
      "open":null,
      "orderNum":1,
      "orgId": "11",
      "orgName":"11",
      "parentId":"1",
      "parentName":"系统管理",
      "perms":"sys:tsysorg:query,sys:tsysorg:view",
      "remark":null,
      "resourceClass":1,
      "sqlMap":{},
      "type":1,
      "updateTime" :"2018-03-28 11:20:19",
      "updateUserId":"系统管理员",
      "url":"/sys/dept"
    }
  }else{
    kl=null;
  }

  return {
    url: '/api/sys/resource/query',
    type: 'get',
    data: menuTreeData
  }
}

/*//根据menuId获取子数据
export function findMenuTreeByMenuId(){
  const menuTreeChildren= {
    "code": 200,
    "msg": null,
    "data":[
      {
        "createTime": null,
        "createUserId":"",
        "delFlag":null,
        "display":1,
        "icon":"el-icon-news",
        "menuId":"99c786f2bfbf46399e3b495f6c7014bc",
        "name" :"机构管理",
        "open":null,
        "orderNum":1,
        "orgId": "11",
        "orgName":"11",
        "parentId":"1",
        "parentName":"系统管理",
        "perms":"sys:tsysorg:query,sys:tsysorg:view",
        "remark":null,
        "resourceClass":1,
        "sqlMap":{},
        "type":1,
        "updateTime" :"2018-03-28 11:20:19",
        "updateUserId":"系统管理员",
        "url":"/sys/dept"
      },
      {
        "createTime": null,
        "createUserId":"",
        "delFlag":null,
        "display":1,
        "icon":"el-icon-service",
        "menuId":"92c786f2bfbf46398e3b495f6c70156c",
        "name" :"用户管理3",
        "open":null,
        "orderNum":2,
        "orgId": "12",
        "orgName":"12",
        "parentId":"1",
        "parentName":"系统管理",
        "perms":"sys:tsysuserinfo:query,sys:tsysuserinfo:view,sys:tsysuserinfo:list",
        "remark":null,
        "resourceClass":1,
        "sqlMap":{},
        "type":1,
        "updateTime" :"2018-03-28 11:20:19",
        "updateUserId":"系统管理员",
        "url":"/sys/user"
      },
      {
        "createTime": null,
        "createUserId":"",
        "delFlag":null,
        "display":1,
        "icon":"el-icon-view",
        "menuId":"93d786f2bfbf46398e3b495f6c70156c",
        "name" :"角色管理",
        "open":null,
        "orderNum":2,
        "orgId": "13",
        "orgName":"13",
        "parentId":"1",
        "parentName":null,
        "perms":"sys:role:list",
        "remark":null,
        "resourceClass":1,
        "sqlMap":{},
        "type":1,
        "updateTime" :"2018-03-28 11:20:19",
        "updateUserId":"系统管理员",
        "url":"/sys/role"
      },
      {
        "createTime": null,
        "createUserId":"",
        "delFlag":null,
        "display":1,
        "icon":"el-icon-edit-outline",
        "menuId":"f9e8bed5cf6a485db552e0602741564c",
        "name" :"字典管理",
        "open":null,
        "orderNum":6,
        "orgId": "14",
        "orgName":"14",
        "parentId":"1",
        "parentName":null,
        "perms":"sys:tsysdict:query",
        "remark":null,
        "resourceClass":1,
        "sqlMap":{},
        "type":1,
        "updateTime" :"2018-03-28 11:20:19",
        "updateUserId":"系统管理员",
        "url":"/sys/dict"
      },
      {
        "createTime": null,
        "createUserId":"",
        "delFlag":null,
        "display":0,
        "icon":"el-icon-menu",
        "menuId":"83d796f2bf2f46398e3b487f6c99156c",
        "name" :"岗位管理",
        "open":null,
        "orderNum":7,
        "orgId": "15",
        "orgName":"15",
        "parentId":"1",
        "parentName":null,
        "perms":"sys:tsyspost:query",
        "remark":null,
        "resourceClass":1,
        "sqlMap":{},
        "type":1,
        "updateTime" :"2018-03-28 11:20:19",
        "updateUserId":"系统管理员",
        "url":"sys/tsyspost/list"
      }
    ]
  }
  for(let i=0;i<menuTreeChildren.data.length;i++){
    if(menuTreeChildren.data[i].display==1){
      menuTreeChildren.data[i].swithToggle=true;
    }else{
      menuTreeChildren.data[i].swithToggle=false;
    }
  }

  return {
    url: 'menu/findMenuTreeByMenuId',
    type: 'get',
    data: menuTreeChildren
  }
}*/


