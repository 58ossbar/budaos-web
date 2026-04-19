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
	                <span>姓名</span>
	              </el-form-item>
	            </el-col>
	            <el-col :span="6">
	              <el-form-item class="dictInputQueryWidth ">
	                <el-input  v-model="filters.traineeName" placeholder="姓名" clearable @clear="findPage"></el-input>
	              </el-form-item>
	            </el-col>
              <el-col :span="2">
                <el-form-item class="dictInputQueryLabelWidth">
                  <span>学号/工号</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item class="dictInputQueryWidth ">
                  <el-input  v-model="filters.jobNumber" placeholder="学号/工号" clearable @clear="findPage"></el-input>
                </el-form-item>
              </el-col>
	            <el-col :span="2">
	              <el-form-item class="dictInputQueryLabelWidth">
	                <span>性别</span>
	              </el-form-item>
	            </el-col>
	            <el-col :span="6">
	              <el-form-item class="dictInputQueryWidth ">
	                <el-input  v-model="filters.traineeSex" placeholder="性别" clearable @clear="findPage"></el-input>
	              </el-form-item>
	            </el-col>
	        </el-row>
            <el-collapse-item class="elCollapseItemNoBoeder elCollapseItemMarginBottom">
              <el-row>
	            <el-col :span="2">
	              <el-form-item class="dictInputQueryLabelWidth">
	                <span>手机号码</span>
	              </el-form-item>
	            </el-col>
	            <el-col :span="6">
	              <el-form-item class="dictInputQueryWidth ">
	                <el-input  v-model="filters.mobile" placeholder="手机号码" clearable @clear="findPage"></el-input>
	              </el-form-item>
	            </el-col>
	            <el-col :span="2">
	              <el-form-item class="dictInputQueryLabelWidth">
	                <span>状态</span>
	              </el-form-item>
	            </el-col>
	            <el-col :span="6">
	              <el-form-item class="dictInputQueryWidth ">
	                <el-input  v-model="filters.traineeState" placeholder="状态" clearable @clear="findPage"></el-input>
	              </el-form-item>
	            </el-col>
	            <el-col :span="2">
	              <el-form-item class="dictInputQueryLabelWidth">
	                <span>排序号</span>
	              </el-form-item>
	            </el-col>
	            <el-col :span="6">
	              <el-form-item class="dictInputQueryWidth ">
	                <el-input  v-model="filters.sortNum" placeholder="排序号" clearable @clear="findPage"></el-input>
	              </el-form-item>
	            </el-col>

	          </el-row>
	        </el-collapse-item>
	      </el-collapse>
          <el-row class="elDeptFormButton dictQueryCenterButton">
            <el-col :span="24">
              <cb-button icon="fa fa-search" :label="$t('action.search')" perms="trainee:tevgltraineeinfo:query" type="primary" @click="findPage(null)"/>
              <cb-button icon="fa fa-plus" :label="$t('action.add')" perms="trainee:tevgltraineeinfo:add" type="primary" @click="handleAdd" />
              <cb-button icon="fa fa-plus" :label="$t('action.importRoster')" perms="trainee:tevgltraineeinfo:add" type="primary" @click="importRoster" />
              <cb-button icon="fa fa-plus" :label="$t('action.exportRoster')" perms="trainee:tevgltraineeinfo:add" type="primary" @click="exportRoster" />
            </el-col>
            <input type="file"
                   id="importRoster"
                   name="importRoster"
                   accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                   @change="selectExcel"
                   style="display: none;"/>
          </el-row>
        </el-form>
      </el-header>
      <el-main class="box_shadows bgcolor  scrollRightYDictMenu tableDict marginBottom">
        <!--表格内容栏-->
        <cb-tables :parentVue="this._self" permsBatchDelete="trainee:tevgltraineeinfo:remove"
          :tableData="pageResult" :columns="columns" :btnColumns="btnColumns">
        </cb-tables>
      </el-main>
    </el-container>
    <!--新增修改界面-->
    <el-dialog v-dialogDrag :title="operation?'新增':'修改'"  top="5vh" width="60%" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-form :model="dataForm" label-width="100px" ref="dataForm" :rules="dataTevglTraineeInfo"
               :size="size" style="margin-top: 10px">
        <div style="width: 49%; float:left;">
          <el-form-item label="昵称" prop="nickName">
            <el-input v-model="dataForm.nickName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="身份证号码" prop="traineeCard">
            <el-input v-model="dataForm.traineeCard" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="dataForm.mobile" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="排序号" prop="sortNum">
            <el-input v-model="dataForm.sortNum" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="在校专业" prop="major">
            <el-input v-model="dataForm.major" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="就读院校" prop="traineeSchool">
            <el-input v-model="dataForm.traineeSchool" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="紧急联系电话" prop="contactTel">
            <el-input v-model="dataForm.contactTel" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="头像" prop="traineeHead">
            <el-input v-model="dataForm.traineeHead" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="学历" prop="traineeEducation">
            <el-input v-model="dataForm.traineeEducation" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="学号/工号" prop="jobNumber">
            <el-input v-model="dataForm.jobNumber" auto-complete="off"></el-input>
          </el-form-item>
        </div>
        <div style="width: 49%; float:left;">
          <el-form-item label="姓名" prop="traineeName">
            <el-input v-model="dataForm.traineeName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="traineeSex">
            <el-input v-model="dataForm.traineeSex" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="出生年月" prop="traineeBirthday">
            <el-input v-model="dataForm.traineeBirthday" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="traineeState">
            <el-input v-model="dataForm.traineeState" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="dataForm.remark" auto-complete="off"></el-input>
          </el-form-item>

          <el-form-item label="证件照" prop="traineePic">
            <el-input v-model="dataForm.traineePic" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="qq号码" prop="traineeQq">
            <el-input v-model="dataForm.traineeQq" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="用户邮箱" prop="email">
            <el-input v-model="dataForm.email" auto-complete="off"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
        <el-button v-if="operation == true" :size="size" type="primary" @click.native="submitForm('saveContinue')"  :loading="editLoading">{{$t('action.saveContinue')}}</el-button>
        <el-button :size="size" type="primary" @click.native="submitForm"  :loading="editLoading">{{$t('action.preservation')}}</el-button>
      </div>
    </el-dialog>
    <!--导入-->
    <el-dialog v-dialogDrag title="导入Excel"  top="5vh" width="60%" :visible.sync="isShowPage" :close-on-click-modal="false">
      <el-form label-width="100px" :size="size" style="margin-top: 10px">
        <div style="width: 30%; float:left;">

          <el-form-item label="选择班级" prop="nickName">
            <template>
              <el-select v-model="classId" placeholder="请选择" class="widthAll">
                <el-option
                  v-for="item in classList"
                  :key="item.classId"
                  :label="item.className"
                  :value="item.classId">
                  <el-image
                    style="width: 35px; height: 35px;float: left; margin: 3px 0;"
                    :src="item.classPic"
                    fit="fill"></el-image>
                  <span style="float: right">{{ item.className }}</span>
                </el-option>
              </el-select>
            </template>
          </el-form-item>

        </div>
        <div style="width: 49%; float:left;">
          <el-form-item label="选择Excel" prop="traineeName">
            <el-button size="small" type="primary" @click="clickBtn">点击选择</el-button>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="isShowPage = false">{{$t('action.cancel')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CbButton from "@/views/Core/CbButton"
import {baseUrl} from "../../utils/global";

export default {
    components:{
      CbButton
    },
    data() {
      return {
        classList: [],
        classId: '',
        dataTevglTraineeInfo: {
          traineeName: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
          nickName: [{ required: true, message: "昵称不能为空", trigger: "blur" }],
          traineeSex: [{ required: true, message: "性别不能为空", trigger: "blur" }],
          traineeCard: [{ required: true, message: "身份证号码不能为空", trigger: "blur" }],
          traineeBirthday: [{ required: true, message: "出生年月不能为空", trigger: "blur" }],
          mobile: [{ required: true, message: "手机号码不能为空", trigger: "blur" }],
          traineeState: [{ required: true, message: "状态不能为空", trigger: "blur" }],
          sortNum: [{ required: true, message: "排序号不能为空", trigger: "blur" }],
          remark: [{ required: true, message: "备注不能为空", trigger: "blur" }],
          major: [{ required: true, message: "在校专业不能为空", trigger: "blur" }],
          company: [{ required: true, message: "就职公司不能为空", trigger: "blur" }],
          traineeSchool: [{ required: true, message: "就读院校不能为空", trigger: "blur" }],
          contactMan: [{ required: true, message: "紧急联系人不能为空", trigger: "blur" }],
          contactTel: [{ required: true, message: "紧急联系电话不能为空", trigger: "blur" }],
          traineePic: [{ required: true, message: "证件照不能为空", trigger: "blur" }],
          traineeHead: [{ required: true, message: "头像不能为空", trigger: "blur" }],
          traineeQq: [{ required: true, message: "qq号码不能为空", trigger: "blur" }],
          traineeEducation: [{ required: true, message: "学历不能为空", trigger: "blur" }],
          email: [{ required: true, message: "用户邮箱不能为空", trigger: "blur" }],
          userPasswd: [{ required: true, message: "密码不能为空", trigger: "blur" }],
          userYan: [{ required: true, message: "加密盐不能为空", trigger: "blur" }],
          token: [{ required: true, message: "登陆标识不能为空", trigger: "blur" }],
          traineeWxid: [{ required: true, message: "小程序微信ID不能为空", trigger: "blur" }],
          traineeWxidBind: [{ required: true, message: "小程序微信ID绑定状态(Y有效N无效)不能为空", trigger: "blur" }],
          wxOpenid: [{ required: true, message: "网站微信ID不能为空", trigger: "blur" }],
          qqOpenid: [{ required: true, message: "qq接入openid不能为空", trigger: "blur" }],
          weiboOpenid: [{ required: true, message: "新浪微薄接入openid不能为空", trigger: "blur" }],
          createUserId: [{ required: true, message: "创建人不能为空", trigger: "blur" }],
          createTime: [{ required: true, message: "创建时间不能为空", trigger: "blur" }],
          updateUserId: [{ required: true, message: "修改人不能为空", trigger: "blur" }],
          updateTime: [{ required: true, message: "修改时间不能为空", trigger: "blur" }],
          traineeType: [{ required: true, message: "用户类型(1客户2系统用户3学员4教师)不能为空", trigger: "blur" }],
          empiricalValue: [{ required: true, message: "总经验值不能为空", trigger: "blur" }],
          blogsNum: [{ required: true, message: "博客数不能为空", trigger: "blur" }],
          classroomNum: [{ required: true, message: "开设课堂数量不能为空", trigger: "blur" }],
          jobNumber: [{ required: true, message: "学号/工号不能为空", trigger: "blur" }],
        },
        size: 'small',
        filters: {
        },
        dataForm:{
          traineeId: '', //粉丝主键ID
          traineeName: '', //姓名
          nickName: '', //昵称
          traineeSex: '', //性别
          traineeCard: '', //身份证号码
          traineeBirthday: '', //出生年月
          mobile: '', //手机号码
          traineeState: '', //状态
          sortNum: '', //排序号
          remark: '', //备注
          major: '', //在校专业
          company: '', //就职公司
          traineeSchool: '', //就读院校
          contactMan: '', //紧急联系人
          contactTel: '', //紧急联系电话
          traineePic: '', //证件照
          traineeHead: '', //头像
          traineeQq: '', //qq号码
          traineeEducation: '', //学历
          email: '', //用户邮箱
          userPasswd: '', //密码
          userYan: '', //加密盐
          token: '', //登陆标识
          traineeWxid: '', //小程序微信ID
          traineeWxidBind: '', //小程序微信ID绑定状态(Y有效N无效)
          wxOpenid: '', //网站微信ID
          qqOpenid: '', //qq接入openid
          weiboOpenid: '', //新浪微薄接入openid
          createUserId: '', //创建人
          createTime: '', //创建时间
          updateUserId: '', //修改人
          updateTime: '', //修改时间
          traineeType: '', //用户类型(1客户2系统用户3学员4教师)
          empiricalValue: '', //总经验值
          blogsNum: '', //博客数
          classroomNum: '', //开设课堂数量
          jobNumber: '', //学号/工号
        },
        columns: [
          {prop:"traineeName", label:"姓名", minWidth:70, dataType: 'link'},
          {prop:"traineeHead", label:"头像", minWidth:70, dataType: 'image'},
          {prop:"nickName", label:"昵称", minWidth:70},
          {prop:"jobNumber", label:"学号/工号", minWidth:70},
          {prop:"mobile", label:"手机号码", minWidth:70},
          {prop:"traineeSex", label:"性别", minWidth:70},
          {prop:"traineeState", label:"状态", minWidth:70},
          {prop:"traineePic", label:"证件照", minWidth:70},
          //{prop:"traineeType", label:"用户类型", minWidth:70},
        ],
        btnColumns: [
          {icon: "fa fa-edit", label: "修改", perms: "trainee:tevgltraineeinfo:edit", callback: "handleEdit"},
          {icon: "fa fa-trash", label: "删除", perms: "trainee:tevgltraineeinfo:remove", callback: "handleDelete"},
        ],
        pageResult: {},
        value: '',
        dialogVisible: false,
        operation: false, // true:新增, false:修改
        editDialogVisible: false, // 新增修改界面是否显示
        editLoading: false,
        isShowPage: false,
      }
    },
    methods: {

      // 导入花名册
      importRoster () {
        this.isShowPage = true
        let params = {
          majorId: '',
          orgId: '',
          className: ''
        }
        this.$api.tevgltchclass.listClassTrainee(params).then(res => {
          if (res.code == 0) {
            res.data.forEach(item => {
              item.classPic = baseUrl + item.classPic
            })
            this.classList = res.data
          }
        })
      },

      clickBtn () {
        if (!this.classId) {
          this.$message({ message: '请先选择一个班级', type: "warning" })
          return false
        }
        let ele = document.getElementById('importRoster')
        if (ele) {
          ele.click()
        }
      },

      selectExcel (e) {
        let formData = new FormData()
        formData.append('classId', this.classId)
        let ele = document.getElementById('importRoster')
        if (ele.files) {
          if (ele.files[0]) {
            formData.append('file', ele.files[0])
          }
        }
        this.$api.tevgltraineeinfo.importExcel(formData).then(res => {
          if (res.code == 0) {
            this.$message({ message: '导入成功', type: 'success' });
            this.findPage(null)
          } else {
            this.$message({ message: res.msg, type: 'error' });
          }
        })
      },
      // 导出花名册
      exportRoster () {

      },
      // 获取分页数据
      findPage: function (data) {
        if(data) {
          this.pageRequest = data.pageRequest
        }
        let jj = Object.assign({}, this.filters)
        jj.pageNum=this.pageRequest.pageNum;
        jj.pageSize=this.pageRequest.PageSize;
        this.$api.tevgltraineeinfo.findPage(jj).then((res) => {
          this.pageResult = res.data
        }).then(data!=null?data.callback:'')

      },
      // 删除
      handleDelete: function (data) {
        let arr = [];
        arr.push(data.row.traineeId);
        this.delete(arr, data)
      },
      // 批量删除
      handleBatchDelete: function (data) {
        let arr = [];
        for (let i=0; i<data.params.length; i++){
          arr.push(data.params[i].traineeId);
        }
        this.delete(arr, data)
      },
      //执行删除
      delete:function(jj,darass){
        this.$confirm("确认删除选中记录吗？", "提示", {
          type: "warning",
          closeOnClickModal:false
        }).then(() => {
          this.$api.tevgltraineeinfo.doDelete(jj).then(res => {
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
		if(this.$refs['dataForm']){
          this.$refs['dataForm'].clearValidate();
        }
        this.dialogVisible = true;
        this.operation = true;
        this.$refs['dataForm'].resetFields()
      },
      // 显示修改界面
      handleEdit: function (params) {
		if(this.$refs['dataForm']){
          this.$refs['dataForm'].clearValidate();
        }
        this.dialogVisible = true;
        this.operation = false; // 标识为修改
        this.$api.tevgltraineeinfo.view(params.row.traineeId).then((res) => {
          if (res.code == 0){
            this.dataForm = Object.assign({}, res.data);
          }
        });
      },
      // 修改
      submitForm: function (type) {
        this.$refs.dataForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true;
              this.dialogVisible = type == "saveContinue";
              let params = Object.assign({}, this.dataForm);
              this.$api.tevgltraineeinfo.save(params).then((res) => {
                  if(res.code == 0) {
                    this.$message({ message: '操作成功', type: 'success' })
                    if(type == "saveContinue"){
                      this.$refs['dataForm'].resetFields()
                    }
                  } else {
                    this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                  }
                  this.editLoading = false
                  this.$refs['dataForm'].resetFields()
                  this.editDialogVisible = false
                  this.findPage()
                })
            })
          }
        })
      },
    },
    mounted() {
    }
  }
</script>

<style scoped>

</style>
