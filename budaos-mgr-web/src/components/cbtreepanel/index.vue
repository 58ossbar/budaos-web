<template>
  <div style="height: 99%">
    <el-input size="small" v-if="!btn"
      placeholder="输入关键字进行过滤"
      v-model="filterText">
    </el-input>
    <div class="displayFlex marginBottom" v-if="btn">
      <!--过滤输入框-->
      <el-input class="buttomMargin"  size="small" placeholder="输入关键字进行过滤" v-model="filterText"
                suffix-icon="el-icon-search" clearable  maxlength="50" type="text" ><!-- @focus="inputFocus" @blur="inputBlur"-->
      </el-input>
      <cb-button class="queryButtonPlus" icon="el-icon-plus"  :perms="perms"
                 type="primary"  @click="handleBtnAdd"/>
    </div>
    <el-tree
      class="filter-tree cb-el-tree-panel-scroll cb-tree-panel" style="height: 93%"
      :default-expanded-keys="defaultExpandedKeys" highlight-current
      :data="data" :nodeKey="nodeKey" :show-checkbox="isMult == 'true' ? true : false" :filter-node-method="filterNode"
      :ref="name" @node-click="nodeClick" @check-change="checkChange" :current-node-key="currentNodeKey" >
        <div class="fontSizeComm widthAll"   :class="{displayColor: data.state == 'N'}"
              @mouseleave="() => mouseleaves(data)" @mouseenter="() => mouseenters(data)"
              slot-scope="{ node, data }">
          <span>
              <i   :class="data.icon" class="buttomMargin" ></i>{{ node.label }}
          </span>
          <span  class="treeIconHover" v-if="btnColumns && btnColumns.length > 0"
                  @mouseleave="() => mouseleave(data)" @mouseenter="() => mouseenter(data)"
                  :style="data.iconStyleI ?'display:none' : 'display:inline-block; margin-top: 3px;'">
            <i   class="el-icon-more buttomMargin "></i>
          </span>
          <ul class="treeHoverUl" :style="data.ulStyle ?'display:none' : 'display:inline-block'"
              @mouseenter="() => mouseenter(data)" @mouseleave="() => mouseleave(data)" v-if="btnColumns && btnColumns.length > 0">
            <li v-for="column in btnColumns" :key="column.label">
              <cb-button  :icon="column.icon"   :perms="column.perms" :label="column.label" class="treeHoverUlButtom" @click="handleClick(node, column.callback, data)"/>
            </li>
          </ul>
        </div>
    </el-tree>
  </div>
</template>
<!--
  示例
      <cb-tree-panel :parentVue="this._self" name="testTree" url="/api/site/tevglsiteresourceext/querySite"
        prop='{"id": "menuId"}' :nodeClick="nodeClickForLeft" isMult="true" :checkChange="checkChange"
        :btn="true" perms="site:tevglsiteresourceext:add"
      ></cb-tree-panel>
      注意
      url：[String]，获取树数据的接口地址：数据格式不需要children,只需要告诉父子关系的字段是哪个即可,通过prop属性配置字段映射关系，必传参数
      prop：[JSONObject]，属性配置，强json格式，告诉树的id,name和parentId为别在url返回的数据格式中是对应哪些字段,如果字段刚好是id,name,parentId。相同字段可不传，只传不同的字段映射，可选参数
      method：[String]，url请求类型，默认get，可选参数
      params：[JSONObject]，url请求参数，强json格式，可选参数
      name：[String]，树的唯一标识，同时存在多棵树，以该值区分，获取树方法：this.$refs.name，必传参数
      parentVue：[Object]，传固定值this._self，不能改变，必传固定参数
      isMult：[String]，是否支持多选，默认值为false，可选参数
      rootNode：[String]，追加根节点的名称，可选参数
      defaultExpandedLevel：[String]，树展开的层级，默认值为1，展开第一级根节点。取值说明（-1为全部展开，0为全部收缩，1，2，3，4，5....等等为展开对应层级），可选参数
      nodeClick：[Function]，点击事件：共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身，可选参数
      checkChange：[Function]，选中事件：共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点本身是否被选中、节点的子树中是否有被选中的节点，可选参数
      currentNodeKey：[String]，默认选中节点的key，可选参数
      btnColumns：[Array]，树节点右侧操作列中的按钮定义，数据格式为json数组，示例如下，如果不需要操作列，则不传
        [
          {icon: "fa fa-edit", label: "修改", perms: "site:tevglsitepartner:edit", callback: "handleEdit"},
          {icon: "fa fa-trash", label: "删除", perms: "site:tevglsitepartner:remove", callback: "handleDelete"},
          {icon: "fa fa-plus", label: "上移", perms: "site:tevglsitepartner:move", callback: "handleAdd"},
        ]
      btn: [String], 是否显示过滤框旁边的按钮，默认false
      perms: [String], 权限控制，搭配btn一起使用
 -->
<script>
import axios from '@/http/axios'
import CbButton from "@/views/Core/CbButton";

export default {
    name: 'cb-tree-panel',
    props: {
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
      prop: {
        type: String,
        default: {}
      },
      parentVue: {},
      name: {
        type: String,
        default: 'name'
      },
      isMult: {
        type: String,
        default: 'false'
      },
      defaultExpandedLevel : {
        type: String,
        default: '1'
      },
      nodeClick : {
        type: Function,
        default: function(obj, node, vueComponent){}
      },
      checkChange : {
        type: Function,
        default: function(obj, check, subCheck){}
      },
      currentNodeKey : {
        type: String,
        default: null
      },
      rootNode: {},
      btnColumns: {},
      btn:false, // 是否需要按钮
      perms: '',
    },
    components:{
      CbButton
    },
    data() {
      return {
        closable: true,
        filterText: '',
        data: [],
        items: [],
        nodeKey: 'id',
        propJSON: {},
        defaultExpandedKeys: [],
      }
    },
    methods: {
      mouseenters:function(data){
        data.iconStyleI=false;
      },
      mouseleaves:function(data){
        data.iconStyleI=true;
      },
      mouseenter:function(data){
        data.ulStyle=false;
      },
      mouseleave:function(data){
        data.ulStyle=true;
      },
      handleClick: function(node, callback, data){
        this.$refs[this.name].setCurrentNode(data); // 设置当前节点选中
        if(callback){
          if (this.btn){ // 是为了不影响原来职业课程路径中的
            this.parentVue[callback](data)
          } else {
            this.parentVue[callback](node)
          }
        }
      },
      handleBtnAdd: function(){
        let node = this.$refs[this.name].getCurrentNode();
        if (node == null){
          return false;
        }
        this.parentVue['handleAdd'](node)
      },
      //树过滤条件事件
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      //设置某些属性，如id,name, 以便其它方法使用
      setDataProperties: function(id, name, data, parentId, parentName) {
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
      },
      //将原生数据转换为树形数据
      convertTreeData(arr) {
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
      },
      //查询树数据
      queryTree:function (queryData) {
        axios({
          url: this.url,
          method: this.method,
          params: (this.method == 'post' || this.method == 'POST') ? {} : queryData,
          data: (this.method == 'get' || this.method == 'GET') ? {} : queryData,
        }).then(res => {
          res.data.forEach(d => {
            d.iconStyleI = true
            d.ulStyle = true
          })
          let prop = JSON.parse(this.prop)
          let data = this.setDataProperties(prop.id || "id", prop.name || "name", res.data, prop.parentId || "parentId")
          let treeData = this.convertTreeData(data);
          let obj = [];
          //如果需要追加根节点，则手动捏一个根节点
          if(this.rootNode){
            let o = {}
            o.menuId = "";
            o.id = "";
            o.name = this.rootNode;
            o.label = this.rootNode;
            o.children = treeData;
            o.iconStyleI = true
            o.ulStyle = true
            o.type = "0";
            obj.push(o);
          }else {
            obj = treeData
          }
          this.data = obj
          //延迟设置树的默认值，防止树的数据还没渲染就开始设置，导致默认值无效
          let comp = this;
          setTimeout(() => {
            comp.setDefaultExpandedKeys()
          }, 100);
          setTimeout(() => {
            if (this.currentNodeKey){
              // 展开该节点
              this.defaultExpandedKeys = []
              this.defaultExpandedKeys.push(this.currentNodeKey);
              // 设置节点
              this.$refs[this.name].setCurrentKey(this.currentNodeKey)
              let node = this.$refs[this.name].getCurrentNode();
              // 选中节点
              if (node != null){
                this.$refs[this.name].setCurrentNode(node)
              }
            }
          }, 100)
        });
      },
      // 获取并设置需要展开的节点
      setDefaultExpandedKeys(){
        if (this.data == null || this.data.length == 0 || this.defaultExpandedLevel == '0'){
          return false;
        }
        this.initDefaultExpandedKeys(this.data, 1)
      },
      //递归展开节点
      initDefaultExpandedKeys(data, level){
        for(let i=0; i<data.length; i++){
          this.defaultExpandedKeys.push(data[i][this.nodeKey]); // 默认展开
          if (this.defaultExpandedLevel > level || this.defaultExpandedLevel == '-1'){
            let children = data[i].children;
            if (children != null && children.length > 0 && children != undefined){
              this.initDefaultExpandedKeys(children, level + 1)
            }
          }
        }
      }
    },
    watch: {
      filterText(val) {
        this.$refs[this.name].filter(val);
      },
    },
    mounted() {
      this.queryTree()
      this.$refs[this.name].reload = this.queryTree
      if(this.parentVue){
        this.parentVue.$refs[this.name] = this.$refs[this.name]
      }
    }
  }
</script>

<style scoped>
  /*面板树控件的滚动条*/
  .cb-el-tree-panel-scroll{
    overflow:auto;
    overflow-x:hidden;
    width:100%;
  }
  .cb-el-input-scroll {
    overflow: auto;
  }
</style>
