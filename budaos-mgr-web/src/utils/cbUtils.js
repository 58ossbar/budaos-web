/**
 * 设置某些属性，如id,name, 以便其它方法使用
 * @param id 数据库中的主键ID
 * @param name 名称
 * @param data 原生数据
 * @param parentId 父ID
 * @param parentName 父名称
 * @returns {*}
 */
export function setDataProperties (id, name, data, parentId, parentName) {
  if (data.length > 0){
    data.forEach((obj, i) => {
      obj.id = obj[id];
      obj.cbid = obj[id];
      obj.name = obj[name];
      obj.label = obj[name];
      if (parentId != undefined && parentId != null && parentId != ""){
        obj.parentId = obj[parentId];
      } else if (parentName != undefined && parentName != null && parentName != ""){
        obj.parentName = obj[parentName];
      }
    });
  }
  return data;
}

/**
 * 将原生数据转换为树形数据
 * @param pid 根节点
 * @param data 原生数据(无层次关系)
 * @returns {Array}
 */
export function convertTreeData_1(pid, data) {
  function tree(id) {
    let arr = []
    data.filter(item => {
      return item.parentId === id;
    }).forEach(item => {
      arr.push({
        cbid: item.id,
        id: item.id,
        name: item.name,
        label: item.name,
        parentId: item.parentId,
        parentName: item.parentName,
        children: tree(item.id)
      });
    });
    return arr;
  }
  return tree(pid)  // 第一级节点的父id，是null或者0，视情况传入
}

/**
 * 将原生数据转换为树形数据
 * @param arr
 * @returns {Array}
 */
export function convertTreeData_2(arr) {
  //  删除所有 children,以防止多次调用
  arr.forEach(function (item) {
    delete item.children;
  });
  let map = {}; // 构建map
  arr.forEach(i => {
    map[i.id] = i; // 构建以id为键 当前数据为值
  });
  let treeData = [];
  arr.forEach((child, index) => {
    const mapItem = map[child.parentId]; // 判断当前数据的parentId是否存在map中
    if (mapItem) { // 存在则表示当前数据不是最顶层数据
      // 注意: 这里的map中的数据是引用了arr的它的指向还是arr，当mapItem改变时arr也会改变,踩坑点
      (mapItem.children || ( mapItem.children = [] )).push(child); // 这里判断mapItem中是否存在children, 存在则插入当前数据, 不存在则赋值children为[]然后再插入当前数据
    } else { // 不存在则是组顶层数据
      treeData.push(child);
    }
  });
  return treeData;
}

/**
 * 获取展开的节点，默认展开根节点的下一级
 * @param data
 */
export function getDefaultExpandedKeys (data, level) {
  if (data == null || data.length == 0){
    return false;
  }
  if (level == "" || level == null || level == undefined){
    level == 1;
  }
  let defaultExpandedKeys = [];
  for(let i=0; i<data.length; i++){
    defaultExpandedKeys.push(data[i].id); // 默认展开
    if (level == 2 || level == "2"){
      let children = data[i].children;
      if (children != null && children.length > 0 && children != undefined){
        for (let j=0; j<children.length; j++){
          defaultExpandedKeys.push(children[j].id);
        }
      }
    }
  }
  return defaultExpandedKeys;
}

/**
 * 转换树形数据
 * @param parentId 根节点
 * @param list 原生数据
 * @param level 级别
 */
export function convertTreeData (parentId, allList, level) {
  if (parentId == null || parentId == "" || parentId == undefined){
    return false;
  }
  if (allList == null || allList.length <= 0 || allList == undefined){
    return false;
  }
  if (level == null || level == "" || level == undefined){
    level = 1;
  }
  let obj;
  let parentNode = [];
  allList.forEach(a => {
    if (a.parentId === parentId){
      parentNode.push(a);
    }
  })
  if (parentNode.length > 0){
    level ++;
    parentNode.forEach(b => {
      b.level = level;
      if (convertTreeData(b.id, allList, level) != null && convertTreeData(b.id, allList, level).length > 0){
        b.children = convertTreeData(b.id, allList, level);
      }
    });
  }
  allList.forEach(a => {
    if (a.id === parentId){
      a.children = parentNode;
      obj = a;
    }
  })
  return obj;
}

/**
 * 获取当前级别的节点数据
 * @param level 级别 接接收一个整数
 * @param list 树形数据 todo 可搭配 convertTreeData 使用
 * @param resultList 接收一个空数组
 * @returns {boolean}
 */
export function getChildrenByLevel(level, list, resultList) {
  if (list.length == 0 || list == null || list == undefined){
    return false;
  }
  let result = [];
  list.forEach(a => {
    if (a.level == level){
      result.push(a);
    }
  });
  if (result.length == 0){
    list.forEach(re => {
      if (re.children != null && re.children.length > 0){
        getChildrenByLevel(level, re.children, resultList);
      }
    });
  } else {
    result.forEach(r => {
      r.children = []; // 清空子数据
      resultList.push(r);
    });
  }
  return resultList;
}
