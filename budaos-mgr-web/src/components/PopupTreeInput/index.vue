<template>
  <div>
    <el-popover ref="popover" :width="width"  :placement="placement" trigger="click" :disabled="disabled">
      <el-tree
        style="overflow:scroll; height:200px;overflow-x:hidden;"
        :data="data"
        :props="props"
        :node-key="nodeKey"
        ref="popupTree"
        @current-change="currentChangeHandle"
        :default-expand-all="defaultExpandAll"
        :highlight-current="true"
        :expand-on-click-node="true" :lazy="lazy"
        :load="loadNode1">
      </el-tree>
    </el-popover>
    <el-input v-model="propInput" v-popover:popover style="cursor:pointer;"
              :readonly="readonly"
              :placeholder="placeholder"
              :change="change"
              @clear="clear"
              @focus="inputFocus"
              :clearable="clearable"
              ></el-input>
  </div>
</template>

<script>
export default {
  name: 'PopupTreeInput',
  data(){
    return {
      propInput:this.prop
     /* prop:''*/
    }
  },
  watch: {
    prop(val) {
      this.propInput = val;//②监听外部对props属性result的变更，并同步到组件内的data属性myResult中
    },
    propInput(val){
      //xxcanghai 小小沧海 博客园
      this.$emit("changeProp",val);//③组件内对myResult变更后向外部发送事件通知
    }
  },
  props: {
    disabled: {
      type: Boolean,
      default:false
    },
    lazy: {
      type: Boolean,
      default:false
    },
    data: {
      type: Array,
      default: []
    },
    props: {
      type: Object,
      default:function () {
        return {}
      }
    },
    prop: {
      type: String,
      default: ''
    },
    nodeKey: {
      type: String,
      default: ''
    },
    width:{
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '点击选择内容'
    },
    placement: {
      type: String,
      default: 'right-start'
    },
    defaultExpandAll: {
      type: Boolean,
      default: false
    },
    currentChangeHandle: {
      type: Function,
      default: null
    },
    inputFocus: {
      type: Function,
      default: null
    },
    loadNode1:{
      type: Function,
      default: null
    },
    handleLoad:{
      type: Function,
      default: null
    },
    // 新加的东西往下怼
    readonly:{
      type: Boolean,
      default: false
    },
    clearable:{
      type:Boolean,
      default:false
    },
    change:{
      type:Function,
      default:null
    },
    clear:{
      type:Function,
      default:null
    }
  }
}
</script>

<style scoped>

</style>
