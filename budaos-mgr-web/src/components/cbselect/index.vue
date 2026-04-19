<template>
  <el-select v-model="modelData" :multiple="multiple" collapse-tags :placeholder="placeholder" :clearable="clearable" style="width: 100%;"
             filterable
             @change="handleChange" @clear="handleClear"
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
</template>

<!--
    示例
          <cb-select :parentVue="this._self" url="/api/tch/tevgltchteacher/query" placeholder="请选择班级助教"
             :dataForm="dataForm" name="teachingAssistant"
             prop='{"id":"teacherId", "value":"teacherName"}'
             multiple clearable
          ></cb-select>

    注意
          parentVue：[Object]，传固定值this._self，不能改变，表单校验时会用到，必传固定参数
          url：[String]，获取数据的接口地址，必传参数
          dataForm：[Object]，固定写法，不要改变，新增修改界面中必传
          name:[String]，属性与JavaBean字段一致，必传
          filters：[Object]，固定写法，不要改变，查询界面中必传
          prop：[JSONObject]，属性配置，强json格式，告诉下拉面板展示数据时对应哪些字段(id为隐藏值，value为显示值),如果字段刚好是id,value。相同字段可不传，只传不同的字段映射，可选参数
          placeholder：[String]，提示语，可选参数
          multiple: 是否多选, 默认false
          clearable: 是否可以清空选项, 默认false
-->

<script>
import axios from '@/http/axios'

export default {
    name: "cb-select",
    props: {
      id:{},
      name:{},
      dataForm: {},
      filters: {},
      prop: {},
      value: {},
      url: {},
      params: {},
      method: {
        type: String,
        default: "get"
      },
      change: {},
      parentVue: {},
      placeholder: {
        type: String,
        default: '请输入内容'
      },
      multiple:{
        type: Boolean,
        default: false
      },
      clearable:{
        type: Boolean,
        default: false
      },
    },//继承父组件中的name, dataForm属性，拓展功能请在此配置
    components:{
    },
    data() {
      return {
        propJSON: {},
        modelData: '',

        options: [],
        value1: [],


      }
    },
    methods: {

      findData: function(queryString, callback){
        let queryData = {}
        axios({
          url: this.url,
          method: this.method,
          params: (this.method == 'post' || this.method == 'POST') ? {} : queryData,
          data: (this.method == 'get' || this.method == 'GET') ? {} : queryData,
        }).then(res => {
          let resultData = res.data.list
          resultData.forEach(data => {
            data.label = data[this.propJSON.value]
            data.value = data[this.propJSON.id]
            data.key = data[this.propJSON.id]
          });
          this.options = resultData
        })
      },

      handleChange:function (val) {
        if(this.dataForm){
          this.dataForm[this.name] = val
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
        if(this.filters){
          this.filters[this.name] = val
        }
        if(this.change){
          this.change()
        }
      },

      handleClear:function () {
        if(this.change){
          this.change()
        }
        this.modelData = ''
        if(this.dataForm){
          this.dataForm[this.name] = ''
          if(this.parentVue){
            //当页面存在多个表单时，需要遍历找到各自对应的表单进行校验重置
            for(let ref in this.parentVue.$refs){
              if(this.parentVue.$refs[ref].model == this.dataForm){
                this.parentVue.$refs[ref].validateField(this.name)
              }
            }
          }
        }
      }

    },
    watch: {
      dataForm: function(n, o){
        let field = this.value || this.name
        if(n[field]){
          this.modelData = n[field]
        }else {
          this.modelData = ''
        }
      },
      filters: function(n, o) {
        let field = this.value || this.name
        if(n[field]){
          this.modelData = n[field]
        }else {
          this.modelData = ''
        }
      }
    },
    mounted() {
      this.propJSON = JSON.parse(this.prop)
      this.propJSON.id = this.propJSON.id || "id"
      this.propJSON.value = this.propJSON.value || "value"
      this.findData()
    }
  }
</script>

<style scoped>

</style>
