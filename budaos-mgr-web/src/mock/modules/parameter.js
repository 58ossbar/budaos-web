/* 
 * 字典管理模块
 */

// 保存
export function save() {
  return {
    url: '/api/sys/parameter/saveOrUpdate',
    type: 'post',
    data: {
      "code": 0,
      "msg": "成功",
      "data": 1
    }
  }
}
// 批量删除
export function batchDelete() {
  return {
    url: '/api/sys/parameter/deletes',
    type: 'post',
    data: {
      "code": 0,
      "msg": "成功",
      "data": 1
    }
  }
}
// 分页查询
export function findPage(params) {
  let findPageData = {
    "code": 0,
    "msg": null,
    "data": {}
  }
  let pageNum = 1
  let pageSize = 8
  if(params !== null) {
    // pageNum = params.pageNum
  }
  if(params !== null) {
    // pageSize = params.pageSize
  }
  let content = this.getContent(pageNum, pageSize)
  findPageData.data.pageNum = pageNum
  findPageData.data.pageSize = pageSize
  findPageData.data.totalSize = 50
  findPageData.data.list = content
  return {
    url: 'dict/findPage',
    type: 'post',
    data: findPageData
  }
}

export function findTree(params) {
  let findPageData = {
    "code": 0,
    "msg": null,
    "data": {}
  }
  if(params !== null) {
    // pageNum = params.pageNum
  }
  if(params !== null) {
    // pageSize = params.pageSize
  }
  let content = this.getContent(1, 8)
  findPageData.data = content
  return {
    url: '/api/sys/parameter/paraTree',
    type: 'get',
    data: findPageData
  }
}

export function getContent(pageNum, pageSize) {
  let content = []
  for(let i=0; i<pageSize; i++) {
    let obj = {}
    let index = ((pageNum - 1) * pageSize) + i + 1
    obj.dictId = "dictId"+index
    obj.dictType = "dictType"+index
    obj.dictName = '社区消息类型' + index
    obj.dictCode = 'dictCode' + index
    obj.dictValue = 'dictValue' + index
    obj.parentType="dictId"+index+1;
    obj.sortNum = 1
    obj.isdefault = "1"
    obj.displaying = "1"
    obj.dictUrl="el-icon-eleme"
    obj.dictSort="1"
    if(i % 2 === 0) {

    }
    obj.createBy= 'admin'
    obj.createTime= '2018-08-14 11:11:11'
    obj.createBy= 'admin'
    obj.createTime= '2018-09-14 12:12:12'
    content.push(obj)
  }
  return content
}


/*
DICT_ID	varchar	32	0	0	0	0	0	0		0		utf8mb4	utf8mb4_general_ci		-1	0
DICT_TYPE	varchar	30	0	-1	0	0	0	0		0	字典分类	utf8mb4	utf8mb4_general_ci		0	0
DICT_NAME	varchar	60	0	-1	0	0	0	0		0	字典分类名称	utf8mb4	utf8mb4_general_ci		0	0
DICT_VALUE	varchar	200	0	-1	0	0	0	0		0	字典值	utf8mb4	utf8mb4_general_ci		0	0
DICT_CODE	varchar	60	0	-1	0	0	0	0		0	字典编码	utf8mb4	utf8mb4_general_ci		0	0
REMARK	varchar	100	0	-1	0	0	0	0		0	字典描述	utf8mb4	utf8mb4_general_ci		0	0
DICT_SORT	varchar	2	0	-1	0	0	0	0		0	1、平台内2、平台外	utf8mb4	utf8mb4_general_ci		0	0
SORT_NUM	int	11	0	-1	0	0	0	0		0	排序号				0	0
PARENT_TYPE	varchar	32	0	-1	0	0	0	0		0	父分类	utf8mb4	utf8mb4_general_ci		0	0
DISPLAY_SORT	varchar	10	0	-1	0	0	0	0		0	字典展现分类:下拉类型(select)树形(tree) 复选型(checkbox)单选radio	utf8mb4	utf8mb4_general_ci		0	0
DICT_CLASS	int	11	0	-1	0	0	0	0		0					0	0
MULTI_TYPE	varchar	1	0	-1	0	0	0	0		0	单选或多选：主要针对树形控件	utf8mb4	utf8mb4_general_ci		0	0
ORG_ID	varchar	32	0	-1	0	0	0	0		0	所属机构	utf8mb4	utf8mb4_general_ci		0	0
ISDEFAULT	varchar	10	0	-1	0	0	0	0		0	默认值	utf8mb4	utf8mb4_general_ci		0	0
displaying	varchar	2	0	-1	0	0	0	0		0	是否显示	utf8mb4	utf8mb4_general_ci		0	0
create_user_id	varchar	32	0	-1	0	0	0	0		0	创建人	utf8mb4	utf8mb4_general_ci		0	0
create_time	varchar	32	0	-1	0	0	0	0		0	创建时间	utf8mb4	utf8mb4_general_ci		0	0
update_user_id	varchar	32	0	-1	0	0	0	0		0	修改人	utf8mb4	utf8mb4_general_ci		0	0
update_time	varchar	32	0	-1	0	0	0	0		0	修改时间	utf8mb4	utf8mb4_general_ci		0	0
dict_url	varchar	500	0	-1	0	0	0	0		0	字典图标	utf8mb4	utf8mb4_general_ci		0	0

*/

