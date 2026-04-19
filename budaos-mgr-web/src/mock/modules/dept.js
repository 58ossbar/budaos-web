/* 
 * 机构管理模块
 */

// 保存
export function save() {
  return {
    url: '/api/sys/org/saveOrUpdate',
    type: 'post',
    data: {
      "code": 200,
      "msg": null,
      "data": 1
    }
  }
}
// 批量删除
export function batchDelete() {
  return {
    url: '/api/sys/org/delete',
    type: 'delete',
    data: {
      "code": 200,
      "msg": null,
      "data": 1
    }
  }
}
// 查询机构树
export function findDeptTree(params) {
  let findTreeData={
    "code": 0,
    "msg": null,
    "data": [
      {
        "orgId":1,//机构ID
        "orgSn":1,//	机构排序ID
        "orgName":"教育系统1"+kl,//机构名称
        "orgCode":"123456",//机构编号
        "orgXzqm":"145214",//行政区码
        "orgShowname":"望城教育系统1",//机构显示名称
        "parentId":"",//父机构ID
        "parentName":"",//父机构名称
        "layer":0,//层（阶次）
        "remark":"望城教育系统望城教育系统望城教育系统1",//单位简介
        "orgType":2,//机构类型:1、部门 2、公司
        "addr":"",//通讯地址
        "zip":"",//邮政编码
        "email":"",//电子邮箱
        "leader":"",//机构负责人
        "phone":"",//办公电话
        "fax":"",//传真号码
        "state":1,//	状态:1有效 2、停用
        "mobile":"",//负责人手机号码
        "jp":"jj",//简拼
        "qp":"jj",//全拼
        "ancestry":"",//排序
        "createUserId":"",
        "createTime":"",
        "updateUerId":"",
        "updateTime":"",
        "coverPic":"el-icon-news",//封面图
        "description":"",//机构描述
        "collegeCode":"",//学院代码
        "majorCode":"",//专业代码
        "hasChildren": true
      },
      {
        "orgId":2,//机构ID
        "orgSn":2,//	机构排序ID
        "orgName":"教育系统2"+kl,//机构名称
        "orgCode":"123456",//机构编号
        "orgXzqm":"145214",//行政区码
        "orgShowname":"望城教育系统2",//机构显示名称
        "parentId":"",//父机构ID
        "parentName":"",//父机构名称
        "layer":0,//层（阶次）
        "remark":"望城教育系统望城教育系统望城教育系统2",//单位简介
        "orgType":2,//机构类型:1、部门 2、公司
        "addr":"",//通讯地址
        "zip":"",//邮政编码
        "email":"",//电子邮箱
        "leader":"",//机构负责人
        "phone":"",//办公电话
        "fax":"",//传真号码
        "state":2,//	状态:1有效 2、停用
        "mobile":"",//负责人手机号码
        "jp":"jj",//简拼
        "qp":"jj",//全拼
        "ancestry":"",//排序
        "createUserId":"",
        "createTime":"",
        "updateUerId":"",
        "updateTime":"",
        "coverPic":"el-icon-news",//封面图
        "description":"",//机构描述
        "collegeCode":"",//学院代码
        "majorCode":"",//专业代码
      }
    ]
  }
  let kl=null;
  if(params){
    kl=params;
    findTreeData.data={
      "orgId": 55,//机构ID
      "orgSn": 55,//	机构排序ID
      "orgName": "教育系统5",//机构名称
      "orgCode": "123456",//机构编号
      "orgXzqm": "145214",//行政区码
      "orgShowname": "望城教育系统5",//机构显示名称
      "parentId": 1,//父机构ID
      "parentName": "",//父机构名称
      "layer": 1,//层（阶次）
      "remark": "望城教育系统望城教育系统望城教育系统5",//单位简介
      "orgType": 2,//机构类型:1、部门 2、公司
      "addr": "",//通讯地址
      "zip": "",//邮政编码
      "email": "",//电子邮箱
      "leader": "",//机构负责人
      "phone": "",//办公电话
      "fax": "",//传真号码
      "state": 1,//	状态:1有效 2、停用
      "mobile": "",//负责人手机号码
      "jp": "",//简拼
      "qp": "",//全拼
      "ancestry": "",//排序
      "createUserId": "",
      "createTime": "",
      "updateUerId": "",
      "updateTime": "",
      "coverPic": "el-icon-news",//封面图
      "description": "",//机构描述
      "collegeCode": "",//学院代码
      "majorCode": ""//专业代码
    }
  }else{
    kl=null;
  }
  return {
    url: '/api/sys/org/query',
    type: 'get',
    data: findTreeData
  }
}
