<template>
  <el-autocomplete class="cb-autocomplete" style="width: 100%"
    v-model="modelData" clearable @clear="clearData"
    :fetch-suggestions="findData"
    :placeholder="placeholder"
    @select="handleSelect" >
    <!--是否显示封面-->
    <template slot-scope="{ item }" v-if="image && image != ''">
      <el-image
        style="width: 40px; height: 40px;"
        :src="item[image]"
        fit="fill"></el-image>
      <span>{{item[propJSON.value]}}</span>
    </template>
  </el-autocomplete>
</template>
<!--
  示例：
      <cb-autocomplete :parentVue="this._self" name="traineeId" value="traineeName" :dataForm="dataForm" url="/api/trainee/tevgltraineeinfo/query" prop='{"id":"traineeId", "value":"nickName"}' placeholder="请选择关联的粉丝ID"></cb-autocomplete>
      注意
      parentVue：[Object]，传固定值this._self，不能改变，表单校验时会用到，必传固定参数
      name：[String]，属性与JavaBean字段一致，必传
      value: [String]，数据回显时使用字段，默认跟name属性一样，如果不一样则传指定属性字段，可选参数
      change：[Function]，选值改变时的回调函数，可选参数
      dataForm：[Object]，固定写法，不要改变，新增修改界面中必传
      url：[String]，获取数据的接口地址，必传参数
      filters：[Object]，固定写法，不要改变，查询界面中必传
      prop：[JSONObject]，属性配置，强json格式，告诉下拉面板展示数据时对应哪些字段(id为隐藏值，value为显示值),如果字段刚好是id,value。相同字段可不传，只传不同的字段映射，可选参数
      placeholder：[String]，提示语，可选参数
  默认支持新增、修改及表单校验，不需要额外做处理
 -->
<script>
import axios from '@/http/axios'

export default {
    name: 'cb-autocomplete',
    props: {
      name:{},
      dataForm: {},
      filters: {},
      value: {},
      url: {},
      method: {
        type: String,
        default: "get"
      },
      change: {},
      parentVue: {},
      prop: {
        type: String,
        default: {}
      },
      placeholder: {
        type: String,
        default: '请输入内容'
      },
      image: {
        type: String,
        default: '',
        required: false
      }
    },//继承父组件中的name, dataForm属性，拓展功能请在此配置
    components:{
    },
    data() {
      return {
        propJSON: {},
        modelData: '',
      }
    },
    methods: {
      clearData: function(){
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
      },
      findData: function(queryString, callback){
        let queryData = {}
        queryData[this.propJSON.value] = queryString
        axios({
          url: this.url,
          method: this.method,
          params: (this.method == 'post' || this.method == 'POST') ? {} : queryData,
          data: (this.method == 'get' || this.method == 'GET') ? {} : queryData,
        }).then(res => {
          let resultData = []
          if (res.data.list) {
            resultData = res.data.list
          } else {
            resultData = res.data
          }
          resultData.forEach(data => {
            if (data[this.image]) {
              let pic = data[this.image]
              // 如果不是网络头像，则需要拼接
              if (pic.indexOf('https') == -1 && pic.indexOf('http') == -1) {
                data[this.image] = this.global.baseUrl + pic
              }
            }
            data.value = data[this.propJSON.value]
          });
          callback(resultData)
        })
      },
      handleSelect: function(item){
        if(this.dataForm){
          this.dataForm[this.name] = item[this.propJSON.id]
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
          this.filters[this.name] = item[this.propJSON.id]
        }
        if(this.change){
          this.change()
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
    }
  }

</script>

<style scoped>

</style>
