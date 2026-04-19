<template>
  <div class="page-container">
    <el-container class="page-container scrollAllY">
      <el-header  class="box_shadows bgcolor  scrollRightYDictMenu " style="height: auto;">
        <!--工具栏-->
        <el-form class="queryForm" label-width="100px" ref="queryForm" :inline="true" :model="filters" :size="size">
          <el-collapse class="elCollapseItemNoBoeder elCollapseDict">
	        <el-row class="elCollapseDict">
	            <el-col :span="2">
	              <el-form-item class="dictInputQueryLabelWidth">
	                <span>公司名称</span>
	              </el-form-item>
	            </el-col>
	            <el-col :span="6">
	              <el-form-item class="dictInputQueryWidth ">
	                <el-input  v-model="filters.companyName" placeholder="公司名称"
                             clearable @clear="clearInputValueForQueryCompanyName"
                             @keyup.enter.native="keyupEnterForQueryCompanyName"></el-input>
	              </el-form-item>
	            </el-col>
	            <el-col :span="2">
	              <el-form-item class="dictInputQueryLabelWidth">
	                <span>合作时间</span>
	              </el-form-item>
	            </el-col>
              <el-col :span="14">
                <el-form-item  class="dictInputQueryWidth textAlign">
                  <el-date-picker
                    v-model="timeAll"
                    class="widthAll"
                    type="datetimerange"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss"
                    range-separator="至"
                    start-placeholder="登录开始时间"
                    end-placeholder="登录结束时间"
                    align="right">
                  </el-date-picker>
                </el-form-item>
              </el-col>
	        </el-row>
            <el-collapse-item class="elCollapseItemNoBoeder elCollapseItemMarginBottom">
              <el-row>
	            <el-col :span="2">
	              <el-form-item class="dictInputQueryLabelWidth">
	                <span>联系人</span>
	              </el-form-item>
	            </el-col>
	            <el-col :span="6">
	              <el-form-item class="dictInputQueryWidth ">
	                <el-input  v-model="filters.companyLinkman" placeholder="联系人"
                             clearable @clear="clearInputValueForQueryCompanyLinkman"
                             @keyup.enter.native="keyupEnterForQueryCompanyLinkman"></el-input>
	              </el-form-item>
	            </el-col>
	            <el-col :span="2">
	              <el-form-item class="dictInputQueryLabelWidth">
	                <span>公司地址</span>
	              </el-form-item>
	            </el-col>
	            <el-col :span="6">
	              <el-form-item class="dictInputQueryWidth ">
	                <el-input  v-model="filters.companyAddr" placeholder="公司地址"
                             clearable @clear="clearInputValueForQueryCompanyAddr"
                             @keyup.enter.native="keyupEnterForQueryCompanyAddr"></el-input>
	              </el-form-item>
	            </el-col>
	            <el-col :span="2">
	              <el-form-item class="dictInputQueryLabelWidth">
	                <span>状态</span>
	              </el-form-item>
	            </el-col>
	            <el-col :span="6">
	              <el-form-item class="dictInputQueryWidth ">
                  <cb-dict placeholder="状态" name="state" dict="state4" type="select" :filters="filters" empty-label="全部" :change="findPage"></cb-dict>
	              </el-form-item>
	            </el-col>
	          </el-row>
	        </el-collapse-item>
	      </el-collapse>
          <el-row class="elDeptFormButton dictQueryCenterButton">
            <el-col :span="24">
              <cb-button icon="fa fa-search" :label="$t('action.search')" perms="site:tevglsitepartner:query" type="primary" @click="findPage(null)"/>
              <cb-button icon="fa fa-plus" :label="$t('action.add')" perms="site:tevglsitepartner:add" type="primary" @click="handleAdd" />
            </el-col>
          </el-row>
        </el-form>
      </el-header>
      <el-main class="box_shadows bgcolor  scrollRightYDictMenu tableDict marginBottom">
        <!--表格内容栏-->
        <cb-tables :parentVue="this._self" permsBatchDelete="site:tevglsitepartner:remove"
                   :tableData="pageResult" :columns="columns" :btnColumns="btnColumns">
        </cb-tables>
      </el-main>
    </el-container>
    <!--新增修改界面-->
    <el-dialog v-dialogDrag :title="operation?'新增':'修改'" top="5vh" width="60%" :visible.sync="dialogVisible" :close-on-click-modal="false" @close="dialogCloseForSaveOrUpdate">
      <el-form :model="dataForm" label-width="100px" ref="dataForm" :rules="dataTevglSitePartner"
               :size="size" style="margin-top: 0px">
        <el-collapse ref="elCollapseForSave" v-model="activeName" accordion style="width:98%;overflow:hidden;padding-right: 18px;">

          <el-collapse-item title="基本信息" name="1">
            <template slot="title">
              <el-button type="primary" class="collapseItemHr" ></el-button>基本信息
            </template>
            <div style="width: 49%; float:left">
              <el-form-item label="公司名称" prop="companyName">
                <el-input v-model="dataForm.companyName" auto-complete="off" maxlength="30" autofocus></el-input>
              </el-form-item>
              <el-form-item label="公司网站" prop="companyWebsite">
                <el-input v-model="dataForm.companyWebsite" auto-complete="off" maxlength="30"></el-input>
              </el-form-item>
              <el-form-item label="合作时间" prop="cooperationTime">
                <el-date-picker v-model="dataForm.cooperationTime" type="date"
                                value-format="yyyy-MM-dd" format="yyyy-MM-dd" @change="changeCooperationTime"
                                placeholder="请选择合作开始时间" style="width: 100%;" name="cooperationTime"></el-date-picker>
              </el-form-item>
              <el-form-item label="至" prop="cooperationEndTime">
                <el-date-picker v-model="dataForm.cooperationEndTime" type="date"
                                value-format="yyyy-MM-dd" format="yyyy-MM-dd" @change="changeCooperationEndTime"
                                placeholder="请选择合作结束时间" style="width: 100%;" name="cooperationEndTime"></el-date-picker>
              </el-form-item>
              <el-form-item label="状态" prop="state">
                <cb-dict :parentVue="this._self" placeholder="状态" name="state" dict="state4" type="select" :dataForm="dataForm"></cb-dict>
              </el-form-item>
            </div>

            <div style="width: 49%; float:left">
              <el-form-item label="公司logo" prop="companyLogo">
                <div style="float: left">
                  <cb-upload type="9" name='companyLogo' :dataForm="dataForm" placeholder="上传公司Logo"></cb-upload>
                </div>
                <div style="float:left; text-align: center; padding-left: 15px;"><el-tag size="mini" type="danger" effect="plain">尺寸大小 ??? 最佳</el-tag></div>
              </el-form-item>
              <el-form-item label="首页显示" prop="isKeyPoint">
                <cb-dict :parentVue="this._self" placeholder="是否首页显示" name="isKeyPoint" dict="state1" type="select" :dataForm="dataForm"></cb-dict>
              </el-form-item>
              <el-form-item label="上市公司" prop="isPublicCompany">
                <cb-dict :parentVue="this._self" placeholder="是否上市公司" name="isPublicCompany" dict="state1" type="select" :dataForm="dataForm"></cb-dict>
              </el-form-item>
            </div>

            <div style="width: 98%; float:left">
              <el-form-item label="公司简介" prop="companyIntro">
                <el-input v-model="dataForm.companyIntro" type="textarea" rows="3" auto-complete="off" maxlength="200" name="companyIntro"></el-input>
              </el-form-item>
            </div>

          </el-collapse-item>

          <el-collapse-item title="更多信息" name="2">
            <template slot="title">
              <el-button type="primary" class="collapseItemHr" ></el-button>更多信息
            </template>
            <el-form-item label="企业评价人" prop="companyEvaluationPerson">
              <el-input v-model="dataForm.companyEvaluationPerson" auto-complete="off" maxlength="8"></el-input>
            </el-form-item>
            <el-form-item label="企业评价" prop="companyEvaluation">
              <el-input v-model="dataForm.companyEvaluation" type="textarea" rows="3" auto-complete="off" maxlength="500"></el-input>
            </el-form-item>
            <el-form-item label="公司地址" prop="companyAddr">
              <el-input v-model="dataForm.companyAddr" auto-complete="off" maxlength="50"></el-input>
            </el-form-item>
            <div style="float: left;width: 100%;">
              <el-form-item label="联系人" prop="companyLinkman" style="float: left; width: 50%;">
                <el-input v-model="dataForm.companyLinkman" auto-complete="off" maxlength="8"></el-input>
              </el-form-item>
              <el-form-item label="联系方式" prop="linkmanPhone" style="float: left; width: 50%;"> <!--oninput="this.value=this.value.match(/^[1-9][0-9]*$/)"-->
                <el-input v-model="dataForm.linkmanPhone" auto-complete="off" placeholder="" maxlength="20" clearable></el-input>
              </el-form-item>
            </div>
            <div style="float: left;width: 100%;">
              <el-form-item label="企业规模" prop="companySize" style="float: left; width: 50%;">
                <el-input v-model="dataForm.companySize" auto-complete="off" placeholder="只能输入数字" maxlength="5" clearable oninput="this.value=this.value.match(/^[1-9][0-9]*$/)"></el-input>
              </el-form-item>
              <el-form-item label="是否签订战略合作框架协议" prop="cooperationAgreement" style="float: left; width: 50%;">
                <cb-dict :parentVue="this._self" placeholder="是否签订战略合作框架协议" name="cooperationAgreement" dict="state1" type="select" :dataForm="dataForm"></cb-dict>
              </el-form-item>
            </div>
            <div style="width: 99.8%; float:left">
              <el-form-item label="详细介绍" prop="companyDetailIntro">
                <cb-editor :parentVue="this._self" id="companyDetailIntro" name="companyDetailIntro" :dataForm="dataForm" height="180"></cb-editor>
              </el-form-item>
            </div>

          </el-collapse-item>
        </el-collapse>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
        <el-button v-if="operation == true" :size="size" type="primary" @click.native="submitForm('saveContinue')"  :loading="editLoading">{{$t('action.saveContinue')}}</el-button>
        <el-button :size="size" type="primary" @click.native="submitForm"  :loading="editLoading">{{$t('action.preservation')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CbTable from "@/views/Core/CbTable"
import CbButton from "@/views/Core/CbButton"
import {format} from "@/utils/datetime"
import CbUpload from "../../components/cbupload/index";
import {baseUrl} from "../../utils/global";
import CbEditor from "../../components/cbeditor/index";

export default {
    components:{
      CbEditor,
      CbUpload,
      CbTable,
      CbButton
    },
    data() {
      return {

        actionUrl : baseUrl + "/api/site/tevglsitepartner/uploadPic",
        showUrl : "/uploads/partner-img/", // 教师头像访问地址
        activeName : "1",
        dataTevglSitePartner: {
          companyName: [{ required: true, message: "公司名称不能为空", trigger: "blur" }],
          companyWebsite: [{ required: true, message: "公司网站不能为空", trigger: "blur" }],
          companyLogo: [{ required: true, message: "公司logo不能为空", trigger: "blur" }],
          cooperationTime: [{ required: true, message: "合作时间不能为空", trigger: "blur" }],
          cooperationEndTime: [{ required: true, message: "合作结束时间不能为空", trigger: "blur" }],
          companyIntro: [{ required: true, message: "公司简介不能为空", trigger: "blur" }],
          isKeyPoint: [{ required: true, message: "是否首页显示不能为空", trigger: "blur" }],
          state: [{ required: true, message: "状态不能为空", trigger: "blur" }],
          isPublicCompany: [{ required: true, message: "是否上市公司不能为空", trigger: "blur" }],
        },
        size: 'small',
        filters: {
          label: ''
        },
        isOpen : true, // 是否开启点击表格行也选中
        dataForm:{
          companyId: '',
          companyName: '',
          companyWebsite: '',
          companyLogo: '',
          companyAddr: '',
          cooperationTime: '',
          cooperationEndTime: '',
          companyIntro: '',
          companyDetailIntro: '',
          companyEvaluation: '',
          companyEvaluationPerson: '',
          companyLinkman: '',
          linkmanPhone: '',
          companySize: '',
          cooperationAgreement: 'N', // 是否签订合作框架协议
          isPublicCompany: 'N', // 是否上市公司
          isKeyPoint: 'N', // 是否首页展示
          state: 'Y', // 状态
        },
        columns: [
          {prop:"companyLogo", label:"公司logo", minWidth:80, dataType:'image'},
          {prop:"companyName", label:"公司名称", minWidth:120, dataType:'tag', type:''},
          {prop:"cooperationTime", label:"合作时间", minWidth:100},
          {prop:"cooperationEndTime", label:"合作结束时间", minWidth:120},
          {prop:"companyLinkman", label:"联系人", minWidth:90},
          {prop:"linkmanPhone", label:"联系方式", minWidth:100},
          {prop:"state", label:"状态", minWidth:70, dataType:'tag', type:'success', mapper:'{"key":"无效","value":"danger"}'},
          {prop:"isKeyPoint", label:"首页显示", minWidth:100, dataType:"switch", callback:'switchClick'},
        ],
        btnColumns: [
          {icon: "fa fa-edit", label: "修改", perms: "site:tevglsitepartner:edit", callback: "handleEdit"},
          {icon: "fa fa-trash", label: "删除", perms: "site:tevglsitepartner:remove", callback: "handleDelete"},
        ],
        pageResult: {},
        value: '',
        dialogVisible: false,
        operation: false, // true:新增, false:修改
        editDialogVisible: false, // 新增修改界面是否显示
        editLoading: false,

        timeAll : [], // 时间范围
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
      }
    },
    methods: {

      switchClick(data){
        let obj = {};
        obj.companyId = data.row.companyId;
        if (data.e == true){
          obj.isKeyPoint = "Y"
        } else {
          obj.isKeyPoint = "N"
        }
        this.$api.tevglsitepartner.updateState(obj).then((res) => {
          if (res.code == 0){
            this.$message({ message: "操作成功", type: "success" });
          } else {
            this.$message({ message: "操作失败", type: "error" });
          }
        });
      },

      // 获取分页数据
      findPage: function (data) {
        if(data !== null && data != undefined) {
          this.pageRequest = data.pageRequest
        }
        let jj={};
        jj = Object.assign({}, this.filters)
        jj.pageNum=this.pageRequest.pageNum;
        jj.pageSize=this.pageRequest.PageSize;
        jj.sidx = "update_time";
        jj.order = "desc";
        if(this.timeAll){
          jj.cooperationTime = this.timeAll[0];
          jj.cooperationEndTime = this.timeAll[1];
        }
        this.$api.tevglsitepartner.findPage(jj).then((res) => {
          if (res.code == 0){
            if (res.data.list.length > 0){
              res.data.list.forEach(a => {
                a.pic = baseUrl + a.companyLogo;
                a.companyLogo = baseUrl + a.companyLogo;
                // 切换值，便于表格组件switch开关
                if (a.isKeyPoint == "是"){
                  a.isKeyPoint = true
                } else if (a.isKeyPoint == "否"){
                  a.isKeyPoint = false
                }
              });
            }
          }
          this.pageResult = res.data
        }).then(data!=null?data.callback:'')

      },

      // 表格组件中的单条删除
      handleDelete(data){
        let arr = [];
        arr.push(data.row.companyId);
        this.delete(arr, data)
      },
      // 表格组件中的批量删除
      handleBatchDelete(data){
        let arr = [];
        for (let i=0; i<data.params.length; i++){
          arr.push(data.params[i].companyId);
        }
        this.delete(arr, data)
      },
      //执行删除
      delete:function(jj,darass){
        this.$confirm("确认删除选中记录吗？", "提示", {
          type: "warning",
          closeOnClickModal:false
        }).then(() => {
          this.$api.tevglsitepartner.doDelete(jj).then(res => {
            if(res.code!==0){//删除失败
              this.$message.error(res.msg);
              return;
            }else{
              this.$message({ message: "操作成功", type: "success" });
              this.findPage(null);
            }
          }).then(darass!=null?darass.callback:'').catch(res => {
            this.$message.error("删除失败，请联系管理员!");
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      // 显示新增界面
      handleAdd: function () {
        this.dialogVisible = true;
        this.operation = true;
        this.dataForm = Object.assign({}, this.dataForm)
        this.activeName = "1";
        this.changeSaveOrUpdateHeight();
      },
      // 显示修改界面
      handleEdit: function (params) {
        this.dialogVisible = true;
        this.operation = false; // 标识为修改
        this.changeSaveOrUpdateHeight(); // 调整高度
        this.$api.tevglsitepartner.view(params.row.companyId).then((res) => {
          if (res.code == 0){
            this.dataForm = Object.assign({}, res.data);
            this.dataForm.companyLogoAttachId = "";
          }
        });
      },
      // 修改
      submitForm: function (type) {
        this.$refs.dataForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true;
              this.dialogVisible = false;
              if (type === "saveContinue"){ // 保存并继续，界面不关闭
                this.dialogVisible = true;
              }
              // 图片若使用封装的控件，处理一下
              if (this.dataForm.companyLogo != ""){
                let arr = this.dataForm.companyLogo.split("/");
                if (arr.length > 0){
                  this.dataForm.companyLogo = arr[arr.length-1];
                }
              }
              this.dataForm.companySize = Number(this.dataForm.companySize);
              let params = Object.assign({}, this.dataForm);
              this.$api.tevglsitepartner.save(params).then((res) => {
                  if(res.code == 0) {
                    this.$message({ message: '操作成功', type: 'success' })
                    if (type == "saveContinue"){
                      this.clearDataFormValueForSaveContinue();
                      this.activeName = "1";
                    }
                  } else {
                    this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                  }
                  this.editLoading = false
                  this.$refs['dataForm'].resetFields()
                  this.editDialogVisible = false
                  this.findPage(null)
                })
            })
          } else {
            this.activeName = "1";
          }
        })
      },
      // 新增修改界面关闭时触发事件
      dialogCloseForSaveOrUpdate(){
        // 清除表单验证
        if(this.$refs['dataForm']){
          this.$refs['dataForm'].clearValidate();
        }
        this.activeName = "1";
        this.clearDataFormValueForSaveContinue()
      },
      clearDataFormValueForSaveContinue(){
        this.dataForm = {
          companyId: '',
          companyName: '',
          companyWebsite: '',
          companyLogo: '',
          companyAddr: '',
          cooperationTime: '',
          cooperationEndTime: '',
          companyIntro: '',
          companyDetailIntro: '',
          companyEvaluation: '',
          companyEvaluationPerson: '',
          companyLinkman: '',
          linkmanPhone: '',
          companySize: '',
          cooperationAgreement: 'N', // 是否签订合作框架协议
          isPublicCompany: 'N', // 是否上市公司
          isKeyPoint: 'N', // 是否首页展示
          state: 'Y', // 状态
        }
        tinyMCE.editors['companyDetailIntro'].setContent('');
      },
      // 时间格式化
      dateFormat: function (row, column, cellValue, index){
        return format(row[column.property])
      },

      changeSaveOrUpdateHeight(){
        let height = window.screen.height;
        if (height == 1080){
          this.$nextTick(function(){
            // 改变表单的高度
            let dataFormEle = this.$refs.dataForm.$el;
            if (dataFormEle != null){
              //dataFormEle.style.maxHeight = "680px";
              // 折叠面板的高度跟随表单高度改变
              let elCollapseForSaveEle = this.$refs.elCollapseForSave.$el;
              elCollapseForSaveEle.style.height = dataFormEle.style.height;
              // 改变简介
              let companyIntro = document.getElementsByName("companyIntro")[0];
              if (companyIntro != null){
                companyIntro.setAttribute("rows", "15");
              }
            }

          });
        }
      },

      clearInputValueForQueryCompanyName(){this.findPage()},
      keyupEnterForQueryCompanyName(){this.findPage()},
      clearInputValueForQueryCompanyLinkman(){this.findPage()},
      keyupEnterForQueryCompanyLinkman(){this.findPage()},
      clearInputValueForQueryCompanyAddr(){this.findPage()},
      keyupEnterForQueryCompanyAddr(){this.findPage()},
      // 合作时间验证
      changeCooperationTime(){
        if (this.dataForm.cooperationEndTime == "" || this.dataForm.cooperationEndTime == null || this.dataForm.cooperationEndTime == undefined){
          return false;
        }
        if (this.dataForm.cooperationEndTime <= this.dataForm.cooperationTime){
          this.$message({ message: '合作结束时间不得少于合作开始时间', type: 'warning' })
          this.dataForm.cooperationEndTime = "";
        }
      },
      changeCooperationEndTime(){
        if (this.dataForm.cooperationEndTime <= this.dataForm.cooperationTime){
          this.$message({ message: '合作结束时间不得少于合作开始时间', type: 'warning' })
          this.dataForm.cooperationEndTime = "";
        }
      },
    },
    mounted() {
    }
  }
</script>

<style scoped>

</style>
