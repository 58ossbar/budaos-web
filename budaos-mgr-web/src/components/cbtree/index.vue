<template>
  <div>
    <el-popover :width="popoverWidth" :disabled="disabled">
      <el-input slot="reference" :placeholder="v_placeholder" class="cb-tree" name="outInput" readonly>
        <el-tag
          v-for="item in items"
          slot="prefix"
          :closable="closable && !disabled"
          :key="item.id"
          :id="item.id"
          :cbid="item.id"
          :label="item.label"
          size="mini"
          type="danger"
          effect="plain"
          style="margin-left:3px; cursor: pointer;"
          @close="handleTagClose">
          {{ item.label }}
        </el-tag>
      </el-input>
      <el-input
        v-model="filterText"
        placeholder="输入关键字进行过滤"/>
      <el-tree
        :ref="name"
        :default-expanded-keys="defaultExpandedKeys"
        :data="data"
        :node-key="nodeKey"
        :show-checkbox="isMult == 'true' ? true : false"
        :filter-node-method="filterNode"
        class="filter-tree cb-el-trees-scroll cb-tree"
        highlight-current
        @current-change="currentChange"
        @check-change="checkChange"/>
    </el-popover>
  </div>
</template>
<!--
  示例
      作为单选查询条件时使用，如果要多选，加上isMult="true"
      <cb-tree
        :parent-vue="_self"
        :filters="filters"
        :change="findPage"
        :prop="{id: 'orgId', name: 'orgName'}"
        url="/api/sys/org/getOrgTree"
        placeholder="请选择所属机构"
        name="orgId"
        default-expanded-level="1"
      />

      注意
      url：[String]，获取树数据的接口地址：数据格式不需要children,只需要告诉父子关系的字段是哪个即可,必传参数
      method：[String]，url请求类型，默认get，可选参数
      params：[JSONObject]，url请求参数，强json格式，可选参数
      prop：[JSONObject]，属性配置，强json格式，告诉树的id,name和parentId为别在url返回的数据格式中是对应哪些字段,如果字段刚好是id,name,parentId。相同字段可不传，只传不同的字段映射，可选参数
      name：[String]，属性与JavaBean字段一致，获取树方法：this.$refs.name，必传参数
      parentVue：[Object]，传固定值this._self，不能改变，表单校验时会用到，必传固定参数
      change：[Function]，选值改变时的回调函数，可选参数
      dataForm：[Object]，固定写法，不要改变，新增修改界面中必传
      filters：[Object]，固定写法，不要改变，查询界面中必传
      isMult：[String]，是否支持多选，默认值为false，可选参数
      rootNode：[String]，追加根节点的名称，可选参数
      defaultExpandedLevel：[String]，树展开的层级，默认值为1，展开第一级根节点。取值说明（-1为全部展开，0为全部收缩，1，2，3，4，5....等等为展开对应层级），可选参数
      placeholder：[String]，提示语，默认值为：请选择，可选参数
  默认支持新增、修改及表单校验，不需要额外做处理
 -->
<script>

import axios from '@/http/axios'

export default {
  name: 'CbTree',
  components: {
  },
  props: {
    parentVue: {
      type: Object,
      default: () => {
        return {}
      }
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    url: {
      type: String,
      default: ''
    },
    method: {
      type: String,
      default: 'get'
    },
    params: {
      type: String,
      default: ''
    },
    // 配置树形数据的id和name
    prop: {
      type: [String, Object],
      default: ''
    },
    name: {
      type: String,
      default: 'name'
    },
    filters: {
      type: Object,
      default: () => {
        return {}
      }
    },
    dataForm: {
      type: Object,
      default: () => {
        return {}
      }
    },
    isMult: {
      type: [String],
      default: 'false'
    },
    change: {
      type: Function,
      default: () => {}
    },
    defaultExpandedLevel: {
      type: String,
      default: '1'
    },
    rootNode: {
      type: Object,
      default: () => {
        return null
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    width: {
      type: [String, Number],
      required: false,
      default: 0
    }
  },
  data() {
    return {
      closable: true,
      filterText: '',
      v_placeholder: this.placeholder,
      data: [],
      items: [],
      nodeKey: 'id',
      propJSON: {},
      defaultExpandedKeys: [],
      errerMsg: '',
      popoverWidth: ''
      // width: '200',
    }
  },
  watch: {
    filterText(val) {
      this.$refs[this.name].filter(val)
    },
    filters(n, o) {
      this.defaultData(n)
    },
    dataForm(n, o) {
      this.defaultData(n)
    }
  },
  mounted() {
    // 设置返回数据中的哪个字段是nodeKey
    this.propJSON = typeof this.prop === 'string' ? JSON.parse(this.prop) : this.prop
    this.nodeKey = this.propJSON.id || 'id'
    // 查询树节点数据
    this.queryTree(this.params ? JSON.parse(this.params) : {})
    this.$refs[this.name].reload = this.queryTree
    if (this.parentVue) {
      this.parentVue.$refs[this.name] = this.$refs[this.name]
    }
    if (!this.width) {
      if (this.$el.offsetWidth === 0) {
        // TODO
      } else {
        this.popoverWidth = this.$el.offsetWidth * 1
      }
    } else {
      this.popoverWidth = this.width
    }
    this.changeCursor()
  },
  methods: {
    // 将树中选择的数据传递到父组件中去
    initData: function() {
      let ids = ''
      this.items.forEach(item => {
        ids += ',' + item.id
      })
      ids = ids.length > 0 ? ids.substring(1) : ids
      if (this.filters) {
        this.filters[this.name] = ids
      }
      if (this.dataForm) {
        this.dataForm[this.name] = ids
      }
      // 如果传递了父vue，则重新将表单进行一次校验
      if (this.parentVue && this.dataForm) {
        // 当页面存在多个表单时，需要遍历找到各自对应的表单进行校验重置
        for (const ref in this.parentVue.$refs) {
          if (this.parentVue.$refs[ref].model === this.dataForm) {
            this.parentVue.$refs[ref].validateField(this.name)
          }
        }
      }
    },
    // 将父组件中的默认值渲染到树上和tag上
    defaultData: function(n) {
      const defData = n[this.name]
      this.canceCheckTree()
      this.items = []
      if (!defData) {
        this.v_placeholder = this.placeholder
        return false
      }
      const data = defData instanceof Array ? defData : defData.split(',')
      data.forEach(data => {
        const node = this.$refs[this.name].getNode(data.trim())
        if (node) {
          this.showTag(node.data, node, true)
          if (this.isMult === 'true') { this.$refs[this.name].setChecked(node.key, true, false) } else { this.$refs[this.name].setCurrentKey(node.key) }
        }
      })
    },
    // 取消树上所有选中的节点
    canceCheckTree: function() {
      const nodes = this.$refs[this.name].getCheckedNodes()
      nodes.forEach(node => {
        this.$refs[this.name].setChecked(node[this.name], false, false)
      })
    },
    // 删除tag
    delTag: function(id) {
      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].id === id) {
          this.items.splice(i, 1)
        }
      }
      if (this.items.length > 0) {
        this.v_placeholder = ''
      } else {
        this.v_placeholder = this.placeholder
      }
    },
    // 添加tag
    showTag: function(data, node, check, subCheck) {
      const item = {}
      item.id = data[this.propJSON.id || 'id']
      item.label = data[this.propJSON.name || 'id']
      if (this.isMult === 'true') {
        this.delTag(item.id)
      }
      if (check) {
        this.items.push(item)
      }
      if (this.items.length > 0) {
        this.v_placeholder = ''
      } else {
        this.v_placeholder = this.placeholder
      }
      this.initData()
    },
    // 点击删除tag按钮事件
    handleTagClose: function(tag) {
      var span = tag.target.parentElement // 获取x小标的父元素
      var id = span.getAttribute('id')
      this.delTag(id)
      this.$refs[this.name].setChecked(id, false, false)
      this.initData()
      if (this.change) {
        this.change()
      }
    },
    // 点击树节点事件
    currentChange(data, node) {
      if (this.isMult !== 'true') {
        this.items = []
        this.showTag(data, node, true)
        if (this.change) {
          this.change()
        }
      }
    },
    // 选中树节点事件
    checkChange(data, check, subCheck) {
      this.showTag(data, null, check, subCheck)
      if (this.change && check) {
        this.change()
      }
    },
    // 树过滤条件事件
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 设置某些属性，如id,name, 以便其它方法使用
    setDataProperties: function(id, name, data, parentId, parentName) {
      if (data.length > 0) {
        data.forEach((obj, i) => {
          obj.id = obj[id]
          obj.cbid = obj[id]
          obj.name = obj[name]
          obj.label = obj[name]
          if (parentId !== undefined && parentId != null && parentId !== '') {
            obj.parentId = obj[parentId]
          } else if (parentName !== undefined && parentName != null && parentName !== '') {
            obj.parentName = obj[parentName]
          }
        })
      }
      return data
    },
    // 将原生数据转换为树形数据
    convertTreeData(arr) {
      //  删除所有 children,以防止多次调用
      arr.forEach(function(item) {
        delete item.children
      })
      const map = {} // 构建map
      arr.forEach(i => {
        map[i.id] = i // 构建以id为键 当前数据为值
      })
      const treeData = []
      arr.forEach((child, index) => {
        const mapItem = map[child.parentId] // 判断当前数据的parentId是否存在map中
        if (mapItem) { // 存在则表示当前数据不是最顶层数据
          // 注意: 这里的map中的数据是引用了arr的它的指向还是arr，当mapItem改变时arr也会改变,踩坑点
          (mapItem.children || (mapItem.children = [])).push(child) // 这里判断mapItem中是否存在children, 存在则插入当前数据, 不存在则赋值children为[]然后再插入当前数据
        } else { // 不存在则是组顶层数据
          treeData.push(child)
        }
      })
      return treeData
    },
    // 查询树数据
    queryTree: function(queryData) {
      axios({
        url: this.url,
        method: this.method,
        params: (this.method === 'post' || this.method === 'POST') ? {} : queryData,
        data: (this.method === 'get' || this.method === 'GET') ? {} : queryData
      }).then(res => {
        const prop = typeof this.prop === 'string' ? JSON.parse(this.prop) : this.prop
        const data = this.setDataProperties(prop.id || 'id', prop.name || 'name', res.data, prop.parentId || 'parentId')
        const treeData = this.convertTreeData(data)
        let obj = []
        // 如果需要追加根节点，则手动捏一个根节点
        if (this.rootNode) {
          const o = {}
          o.menuId = ''
          o.id = ''
          o.name = this.rootNode
          o.label = this.rootNode
          o.children = treeData
          o.type = '0'
          obj.push(o)
        } else {
          obj = treeData
        }
        this.data = obj
        // 延迟设置树的默认值，防止树的数据还没渲染就开始设置，导致默认值无效
        const comp = this
        setTimeout(() => {
          if (comp.dataForm) {
            comp.defaultData(comp.dataForm)
          }
          comp.setDefaultExpandedKeys()
        }, 100)
      })
    },
    // 获取并设置需要展开的节点
    setDefaultExpandedKeys() {
      if (this.data == null || this.data.length === 0 || this.defaultExpandedLevel === '0') {
        return false
      }
      this.initDefaultExpandedKeys(this.data, 1)
    },
    // 递归展开节点
    initDefaultExpandedKeys(data, level) {
      for (let i = 0; i < data.length; i++) {
        this.defaultExpandedKeys.push(data[i][this.nodeKey]) // 默认展开
        if (this.defaultExpandedLevel > level || this.defaultExpandedLevel === '-1') {
          const children = data[i].children
          if (children != null && children.length > 0 && children !== undefined) {
            this.initDefaultExpandedKeys(children, level + 1)
          }
        }
      }
    },
    // 改变外层input鼠标样式
    changeCursor() {
      this.$nextTick(function() {
        const inputs = document.getElementsByName('outInput')
        if (inputs.length > 0) {
          inputs.forEach(input => {
            input.style.cursor = 'pointer'
          })
        }
      })
    }
  }
}
</script>

<style scoped>
  /*悬浮树控件的滚动条*/
  .cb-el-trees-scroll{
    overflow:auto;
    height:250px;
    overflow-x:hidden;
    width:100%;
  }
  .cb-el-input-scroll {
    overflow: auto;
  }
</style>
