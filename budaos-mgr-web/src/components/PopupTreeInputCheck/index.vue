<template>
  <div>
    <el-popover ref="popover" :placement="placement" trigger="click">
      <el-tree
        :data="data"
        :props="props"
        node-key="nodeKey"
        ref="popupTree"
        show-checkbox
        :default-expand-all="defaultExpandAll"
        :highlight-current="true">
      </el-tree>
    </el-popover>
    <el-input v-model="propTwo" v-popover:popover style="cursor:pointer;"
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
    props: {
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
        default: {}
      },
      propTwo: {
        type: String,
        default: ''
      },
      nodeKey: {
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
