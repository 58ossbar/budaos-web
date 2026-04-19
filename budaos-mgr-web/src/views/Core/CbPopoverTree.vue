<template>
  <el-popover
    v-model="isShowElPopover"
    ref="popover"
    :trigger="trigger"
    :placement="placement"
    :title="title"
    :width="width"
    :content="content"
    :disabled="disabled"
  >

    <el-input slot="reference" :placeholder="placeholder" :readonly="readonly"
              @focus="focus"
              :width="inputWidth"
              :clearable="clearable" @clear="clear" v-model="inputValue" name="inputName">
      <el-tag slot="prefix" :size="size"
              v-for="item in items"
              :key="item.id"
              :type="item.type"
              :id="item.id" :cbid="item.id"
              :label="item.label"
              effect="plain"
              :closable="closable" @close="handleTagClose" @click="handleTagClick"
              :isMultiShowTag="isMultiShowTag"
              style="margin-left:3px; cursor: pointer"
      >{{ item.label }}</el-tag>
    </el-input>

    <el-input v-if="isShowFilterInput" placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
    <el-tree
      ref="tree" :highlight-current="highlightCurrent" :show-checkbox="showCheckbox"
      class="filter-tree cb-el-tree-scroll"
      :data="data"
      :props="defaultProps"
      :default-expanded-keys="defaultExpandedKeys"
      :defaultExpandedLevel="defaultExpandedLevel"
      :accordion="accordion"
      :empty-text="emptyText"
      :nodeKey="nodeKey"
      :filter-node-method="filterNode"
      @current-change="currentChange">
    </el-tree>
  </el-popover>
</template>

<script>
  export default {
    name: "CbPopoverTree",
    data(){
      return {

        defaultExpandedKeys : [], // 树形控件默认展开的节点
        isShowElPopover : false, // 是否显示 Popover 弹出框 true 显示
        selections : [], // 所有显示的tag标签

        // 树形控件的input过滤
        filterText: '',
        // tag标签的数据，接受一个数组。例:[{"type":"", "label",:"这个是显示的名称"}, {"type":"success", "label",:"这个是显示的名称"}]
        items : [],
      }
    },
    props : {

      // todo --------------------- 外层 el-input 的相关配置 begin ---------------------
      placeholder : {
        type: String,
        default: '请输入'
      },
      // 是否可清空
      clearable : {
        type: Boolean,
        default: true
      },
      readonly : {
        type: Boolean,
        default: false
      },
      inputValue : { // 默认有个空字符
        type: String,
        default: ''
      },
      inputWidth : {
        type: String,
        default: '50px'
      },
      // todo 外层 el-input 的相关配置 end

      // todo --------------------- 标签 el-tag 的相关配置 begin ---------------------
      // 是否允许显示多个标签
      isMultiShowTag : {
        type : Boolean,
        default : false
      },
      closable : {
        type : Boolean,
        default : false
      },
      // 额外的尺寸：medium、small、mini，通过设置size属性来配置它们。
      size:{
        type : String,
        default : ''
      },
      // todo 标签 el-tag 的相关配置 end

      // todo --------------------- 树形控件 el-tree 相关配置 begin ---------------------
      // 是否显示树控件上方的input
      isShowFilterInput : {
        type : Boolean,
        default : false
      },
      // 树形数据,接受一个具有父子关系的数组数据
      data : Array,
      // 树形控件的属性配置
      defaultProps : {
        children: 'children',
        label: 'label'
      },
      // 默认展开几级的节点，目前只支持1，2,全部
      defaultExpandedLevel : {
        type: String,
        default: '1'
      },
      // 手风琴模式，是否每次只打开一个同级树节点展开
      accordion : {
        type : Boolean,
        default : false
      },
      // 内容为空的时候展示的文本
      emptyText : {
        type: String,
        default: '暂无数据'
      },
      // 每个树节点用来作为唯一标识的属性，整棵树应该是唯一的
      nodeKey : {
        type: String,
        default: 'id'
      },
      // 节点是否可被选择
      showCheckbox : {
        type : Boolean,
        default : false
      },
      highlightCurrent : {
        type : Boolean,
        default : false
      },

      // todo --------------------- el-popover 控件相关配置 begin ---------------------

      // 悬浮触发方式，click/focus/hover/manual 默认 click
      trigger : {
        type: String,
        default: 'click'
      },
      // 悬浮框出现位置，top/top-start/top-end/bottom/bottom-start/bottom-end/left/left-start/left-end/right/right-start/right-end 默认 bottom
      placement : {
        type: String,
        default: 'bottom'
      },
      // 悬浮框标题，可自定义，默认为空
      title : {
        type: String,
        default: ''
      },
      // 悬浮框宽度 最小宽度 150px
      width : {
        type: String,
        default: '200'
      },
      // 显示的内容，也可以通过 slot 传入 DOM
      content : {
        type: String,
        default: ''
      },
      // Popover 是否可用 false:可用，true:不可用
      disabled : {
        type : Boolean,
        default : false
      },
      // todo el-popover控件相关配置 end

    },

    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },

    methods: {

      // todo --------------------- 外层 el-input 的相关事件 begin ---------------------
      // 外层input的相关事件
      focus(){
        this.setDefaultExpandedKeys();
      },
      // 在点击由 clearable 属性生成的清空按钮时触发
      clear(){

      },
      // todo 外层 el-input 的相关事件 end

      // todo --------------------- 标签 el-tag 的相关事件 begin ---------------------
      // 点击 Tag 时触发的事件
      handleTagClick(){
        this.isShowElPopover = true;
      },
      // 关闭 Tag 时触发的事件
      handleTagClose:function(tag){
        this.isShowElPopover = false; // 点击x同时关闭悬浮框
        var span = tag.target.parentElement; // 获取x小标的父元素
        var id = span.getAttribute("id");
        for(var i=0; i<this.selections.length; i++){
          if (id == this.selections[i].id){
            this.selections.splice(i, 1); // 同时也移除该对象
          }
        }
        // 移除tag标签
        for(let i=0; i<this.items.length; i++){
          if (id == this.items[i].id){
            this.items.splice(i, 1);
          }
        }
        if (this.items.length == 0){
          // 处理placeholder的文字显示
          var ele = document.getElementsByName("inputName")[0];
          ele.setAttribute("placeholder", this.placeholder);
          this.selections = [];
        }
        this.filterText = null; // 移除过滤框中的值
        this.$emit('handleTagClose', {selections:this.selections});
      },
      // todo 标签 el-tag 的相关事件 end

      // todo --------------------- 树形控件 el-tree 相关事件 begin ---------------------
      // 树形控件节点的过滤
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      // 当前选中节点变化时触发的事件, 共两个参数，依次为：当前节点的数据，当前节点的 Node 对象
      currentChange(data, node){
        if (data.id){
          data.cbid = data.id;
        }
        var ele = document.getElementsByName("inputName")[0];
        let width = ele.style.width;
        ele.setAttribute("placeholder", "");
        var mydate=new Date();
        var css = ["", "success", "info", "warning", "danger"];
        var obj = {"cbid":data.cbid, "id":data.id, "type":css[mydate.getDay()], "label":data.label}; // 每天换一个色
        if (JSON.stringify(this.selections).indexOf(JSON.stringify(obj)) === -1){
          this.selections.push(obj);
        }
        var next = document.getElementsByName("inputName")[0].nextElementSibling;
        if(next != null){ // 说明外层input已经有一个tag标签了
          if (this.isMultiShowTag){ // 是否多选
          } else { // 默认只显示一个tag标签
            for(var i=0; i<next.childNodes.length; i++){
              var name = next.childNodes[i].innerText;
              for(var j=0; j<this.items.length; j++){
                if(name.trim() == this.items[j].label){
                  this.items.splice(j,1);
                }
              }
            }
            for(var j=0; j<this.items.length; j++){
              for(var k=0; k<this.selections.length; k++){
                if(this.items[j].id == this.selections[k].id){

                }
              }
            }
          }
          if(JSON.stringify(this.items).indexOf(JSON.stringify(obj)) == -1){
            if (this.isMultiShowTag) { // 是否多选
              this.items.push(obj);
              /*if (this.items.length >= 2){ // 默认只能显示3个
                obj.id = "moreTag";
                obj.label = "+1";
                if (next.children[2] != undefined){
                  return false;
                }
                this.items.push(obj);
                setTimeout(function(){
                  console.log(next.children[2]);
                }, 200);
              }*/
            }
            if(JSON.stringify(this.items).indexOf(JSON.stringify(obj)) == -1){
              this.items.push(obj);
            }
          }
       } else { // 说明是第一次点击
          if(JSON.stringify(this.items).indexOf(JSON.stringify(obj)) == -1){
            this.items.push(obj);
          }
        }
        //this.$emit('currentChange', {selections:this.selections, node:node});
        if (this.isMultiShowTag){ // 如果开启了显示多个tag标签
          this.$emit('currentChange', this.selections, node);
        } else {
          for(var i=0; i<this.selections.length; i++){
            if (data.id != this.selections[i].id){
              this.selections.splice(i, 1);
            }
          }
          this.$emit('currentChange', this.selections[0], node);
        }
      },
      // todo 树形控件 el-tree 相关事件 end

      // 获取并设置需要展开的节点
      setDefaultExpandedKeys(){
        if(this.data.length > 0){
          if (this.defaultExpandedLevel == 1 || this.defaultExpandedLevel == "1"){
            for(var i=0; i<this.data.length; i++){
              this.defaultExpandedKeys.push(this.data[i].id); // 默认展开
            }
          } else if (this.defaultExpandedLevel == 2 || this.defaultExpandedLevel == "2"){
            for(var i=0; i<this.data.length; i++){
              for(var j=0; j<this.data[i].children.length; j++){
                this.defaultExpandedKeys.push(this.data[i].children[j].id); // 默认展开
              }
            }
          }
        }
      }

    },
    mounted() {
      var ele = document.getElementsByName("inputName")[0];
      // 设置默认展开的节点
      this.setDefaultExpandedKeys();
      ele.style.cursor = "pointer";
      // 处理placeholder
      var placeholder = ele.getAttribute("placeholder");
      this.placeholder = placeholder;
      // 处理宽度
      var inputWidth = ele.getAttribute("width");
      if (inputWidth == "" || inputWidth == null){
        return false;
      }
      var hasPx = ele.getAttribute("width").substring(ele.getAttribute("width").length-2, ele.getAttribute("width").length);
      if (hasPx != "px"){
        inputWidth = inputWidth+"px";
      }
      ele.style.width = inputWidth;

    },
  }
</script>

<style scoped>

  /*悬浮树控件的滚动条*/
  .cb-el-tree-scroll{
    overflow:scroll;
    height:250px;
    overflow-x:hidden;
    width:100%;
  }
  .cb-el-input-scroll{
    overflow:scroll;
    overflow: hidden;
  }

</style>
