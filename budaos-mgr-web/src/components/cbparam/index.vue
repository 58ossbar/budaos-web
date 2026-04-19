<template>
  <div style="text-align: left;">
    <el-radio-group v-if="type == 'radio'" v-model="modelData" class="cb-param">
      <el-radio v-if="emptyLabel || emptyLabel == ''" label="" key="">{{emptyLabel}}</el-radio>
      <el-radio v-for="data in params" :label="data.parano" :key="data.parano">{{ data.paraKey }}</el-radio>
    </el-radio-group>

    <el-select v-if="type == 'select'" v-model="modelData" :placeholder="placeholder" clearable style="width: 100%" class="cb-param">
      <el-option v-if="emptyLabel || emptyLabel == ''" key='' value='' :label='emptyLabel'></el-option>
      <el-option
        v-for="data in params"
        :key="data.parano"
        :label="data.paraKey"
        :value="data.parano">
      </el-option>
    </el-select>

    <el-switch v-if="type == 'switch'" v-model="modelData" class="cb-param"></el-switch>
  </div>
</template>
<!--
  示例
      <cb-param :parentVue="this._self" placeholder="请选择是否首页显示" name="state" :change="findPage" param="sex" type="switch" :dataForm="dataForm" :filters="filters" emptyLabel="全部"></cb-param>
      注意
      parentVue：[Object]，传固定值this._self，不能改变，表单校验时会用到，必传固定参数
      name：[String]，属性与JavaBean字段一致，必传
      type：[String]，显示类型：select下拉框，radio单选框,switch开关，必传
      param：[String]，参数分类编码，必传
      change：[Function]，选值改变时的回调函数，可选参数
      dataForm：[Object]，固定写法，不要改变，新增修改界面中必传
      filters：[Object]，固定写法，不要改变，查询界面中必传
      emptyLabel：[String]，只在type为select时生效，功能为额外增加一个空的的下拉选项，值为显示的label，方便查询时，可以查询全部，可选参数
      placeholder：[String]，提示语，可选参数
  默认支持新增、修改及表单校验，不需要额外做处理
 -->
<script>
import axios from '@/http/axios'

export default {
    name: 'cb-param',
    props: ['placeholder', 'name', 'dataForm', 'filters', 'type', 'param', 'emptyLabel', 'change', 'parentVue'],//继承父组件中的id，name属性，拓展功能请在此配置
    components:{
    },
    data() {
      return {
        params: [],
        modelData: this.type == 'switch' ? 'false' : ''
      }
    },
    methods: {
      getParam: function(){
        let queryData = {}
        queryData.paraType = this.param;
        axios({
          url: '/api/sys/parameter/getPara',
          method: 'get',
          params: queryData
        }).then(res => {
          this.params = res.data;
        });
      }
    },
    watch: {
      modelData: function(n, o) {
        let temp = this.type == 'switch' ? (n  ? 'Y' : 'N') : n;
        if(this.filters){
          this.filters[this.name] = temp
        }
        if(this.dataForm){
          this.dataForm[this.name] = temp
          //如果传递了父vue，则重新将表单进行一次校验
          if(this.parentVue){
            //当页面存在多个表单时，需要遍历找到各自对应的表单进行校验重置
            for(let ref in this.parentVue.$refs){
              if(this.parentVue.$refs[ref].model == this.dataForm){
                this.parentVue.$refs[ref].validateField(this.name)
              }
            }
          }
        }
        if(this.change){
          this.change()
        }
      },
      dataForm: function(n, o) {
        if(this.type == 'switch'){
          this.modelData = n[this.name] == 'Y' ? true : false
        }else{
          this.modelData = n[this.name];
        }
      },
      filters: function(n, o) {
        if(this.type == 'switch'){
          this.modelData = n[this.name] == 'Y' ? true : false
        }else{
          this.modelData = n[this.name];
        }
      }
    },
    mounted() {
      this.getParam();
      if(this.dataForm){
        this.modelData = this.type == 'switch' ? this.dataForm[this.name] == 'Y' ? true : false : this.dataForm[this.name]
      }
    }
  }
</script>

<style scoped>

</style>
