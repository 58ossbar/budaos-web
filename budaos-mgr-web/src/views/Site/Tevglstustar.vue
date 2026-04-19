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
	                <span>所属院校</span>
	              </el-form-item>
	            </el-col>
	            <el-col :span="6">
	              <el-form-item class="dictInputQueryWidth ">
	                <cb-tree url='/api/sys/role/orgTree' placeholder="请选择所属院校" name="orgId" prop='{"id":"orgId", "name":"orgName"}'
                           :filters="filters" :parentVue="this._self" :change="findPage" ></cb-tree>
	              </el-form-item>
	            </el-col>
	            <el-col :span="2">
	              <el-form-item class="dictInputQueryLabelWidth">
	                <span>姓名</span>
	              </el-form-item>
	            </el-col>
	            <el-col :span="6">
	              <el-form-item class="dictInputQueryWidth ">
	                <el-input  v-model="filters.starName" placeholder="姓名"
                             clearable @clear="clearInputValueForQueryStarName"
                             @keyup.enter.native="keyupEnterForQueryStarName"></el-input>
	              </el-form-item>
	            </el-col>
	            <el-col :span="2">
	              <el-form-item class="dictInputQueryLabelWidth">
	                <span>首页显示</span>
	              </el-form-item>
	            </el-col>
	            <el-col :span="6">
	              <el-form-item class="dictInputQueryWidth ">
                  <cb-dict placeholder="请选择是否首页显示" name="state" dict="state1" type="select" :filters="filters" empty-label="全部" :change="findPage"></cb-dict>
	              </el-form-item>
	            </el-col>
	        </el-row><el-collapse-item class="elCollapseItemNoBoeder elCollapseItemMarginBottom">
                <el-row>
                <el-col :span="2">
                  <el-form-item class="dictInputQueryLabelWidth">
                    <span>工作年限</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item class="dictInputQueryWidth ">
                    <el-input  v-model="filters.workAge" placeholder="工作年限"
                               clearable @clear="clearInputValueForQueryWorkAge"
                               @keyup.enter.native="keyupEnterForQueryWorkAge"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item class="dictInputQueryLabelWidth">
                    <span>工作省份</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item class="dictInputQueryWidth ">
                    <el-input  v-model="filters.workProvice" placeholder="工作省份"
                               clearable @clear="clearInputValueForQueryWorkProvice"
                               @keyup.enter.native="keyupEnterForQueryWorkProvice"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item class="dictInputQueryLabelWidth">
                    <span>工作单位</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item class="dictInputQueryWidth ">
                    <el-input  v-model="filters.workCorp" placeholder="工作单位"
                               clearable @clear="clearInputValueForQueryWorkCorp"
                               @keyup.enter.native="keyupEnterForQueryWorkCorp"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-collapse-item>
          </el-collapse>
          <el-row class="elDeptFormButton dictQueryCenterButton">
            <el-col :span="24">
              <cb-button icon="fa fa-search" :label="$t('action.search')" perms="stu:tevglstustar:query" type="primary" @click="findPage(null)"/>
              <cb-button icon="fa fa-plus" :label="$t('action.add')" perms="stu:tevglstustar:add" type="primary" @click="handleAdd" />
            </el-col>
          </el-row>
        </el-form>
      </el-header>
      <el-main class="box_shadows bgcolor  scrollRightYDictMenu tableDict marginBottom">
        <!--表格内容栏-->
        <cb-tables :parentVue="this._self" permsBatchDelete="stu:tevglstustar:remove"
                   :tableData="pageResult" :columns="columns" :btnColumns="btnColumns">
        </cb-tables>
      </el-main>
    </el-container>
    <!--新增修改界面-->
    <el-dialog v-dialogDrag :title="operation?'新增':'修改'" top="5vh" width="60%" :visible.sync="dialogVisible" :close-on-click-modal="false" @close="dialogCloseForSave">
      <el-form :model="dataForm" label-width="100px" ref="dataForm" :rules="dataTevglStuStar"
               :size="size" style="max-height:440px;margin-top: 0px">
        <!--折叠面板 begin -->
        <el-collapse ref="elCollapseForSave" v-model="activeName" accordion style="width:98%;overflow:hidden;padding-right: 18px;">
          <!--基本信息 begin -->
          <el-collapse-item title="基本信息" name="1">
            <template slot="title">
              <el-button type="primary" class="collapseItemHr" ></el-button>基本信息
            </template>
            <div style="width: 49%; float: left;">
                <el-form-item label="姓名" prop="starName">
                  <el-input v-model="dataForm.starName" auto-complete="off" maxlength="50" autofocus></el-input>
                </el-form-item>
                <el-form-item label="工作单位" prop="workCorp">
                  <el-input v-model="dataForm.workCorp" auto-complete="off" maxlength="100"></el-input>
                </el-form-item>
                <el-form-item label="首页显示" prop="state">
                  <cb-dict :parentVue="this._self" placeholder="请选择是否首页显示" name="state" dict="state1" type="select" :dataForm="dataForm"></cb-dict>
                </el-form-item>
            </div>

            <div style="width: 49%; float: left;">
                <el-form-item label="头像" prop="starPic">
                  <div style="float: left"> <!--width="360" height="360" errorRange="20"-->
                    <cb-upload type="8" name='starPic' :dataForm="dataForm" placeholder="头像上传"></cb-upload>
                  </div>
                  <div style="float:left; text-align: center; padding-left: 15px;"><el-tag size="mini" type="danger" effect="plain">尺寸大小 360*360 最佳</el-tag></div>
                </el-form-item>
            </div>

            <div style="width: 98%; float:left">
              <el-form-item label="故事标题" prop="traineeStoryTitle">
                <el-input v-model="dataForm.traineeStoryTitle" auto-complete="off" maxlength="200"></el-input>
              </el-form-item>
              <el-form-item label="故事简介" prop="traineeStory">
                <el-input v-model="dataForm.traineeStory" class="handle-font" type="textarea" rows="3" auto-complete="off" name="traineeStory"></el-input>
              </el-form-item>
            </div>

          </el-collapse-item>
          <!--基本信息 end -->
          <!--更多信息 begin -->
          <el-collapse-item title="更多信息" name="2">
            <template slot="title">
              <el-button type="primary" class="collapseItemHr" ></el-button>更多信息
            </template>
            <div style="width: 49%; float:left;">
              <el-form-item label="所属院校" prop="orgId">
                <cb-tree url='/api/sys/role/orgTree' :parentVue="this._self" placeholder="请选择所属院校" name="orgId" prop='{"id":"orgId", "name":"orgName"}' :dataForm="dataForm"></cb-tree>
              </el-form-item>
              <el-form-item label="工资:单位K" prop="starSalary">
                <el-input v-model="dataForm.starSalary" auto-complete="off" maxlength="10"></el-input>
              </el-form-item>
            </div>
            <div style="width: 49%; float:left;">
              <el-form-item label="工作年限" prop="workAge">
                <el-input v-model="dataForm.workAge" auto-complete="off" maxlength="11" oninput="this.value=this.value.match(/^[1-9][0-9]*$/)"></el-input>
              </el-form-item>
              <el-form-item label="工作省份" prop="workProvice">
                <el-input v-model="dataForm.workProvice" auto-complete="off" maxlength="50"></el-input>
              </el-form-item>
            </div>
            <div style="width: 98%; float:left;">
              <el-form-item label="故事详情" prop="traineeStoryInfo">
                <cb-editor id="traineeStoryInfo" name="traineeStoryInfo" :dataForm="dataForm" :height="height"></cb-editor>
              </el-form-item>
            </div>
          </el-collapse-item>
          <!--更多信息 end -->
        </el-collapse>
        <!--折叠面板 end -->

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
        <el-button v-if="operation == true" :size="size" type="primary" @click.native="submitForm('saveContinue')"  :loading="editLoading">{{$t('action.saveContinue')}}</el-button>
        <el-button :size="size" type="primary" @click.native="submitForm"  :loading="editLoading">{{$t('action.preservation')}}</el-button>
      </div>
    </el-dialog>
    <!--预览界面-->
    <el-dialog v-dialogDrag title="查看明细" top="5vh" width="60%" :visible.sync="dialogVisibleForView" :close-on-click-modal="false" @close="dialogCloseForView">
      <el-form :model="dataFormForView" label-width="100px" ref="dataForm" :rules="dataTevglStuStar"
               :size="size" style="margin-top: 0px" :disabled="true">
        <!--折叠面板 begin -->
        <el-collapse ref="elCollapseForView" v-model="activeNameForView" accordion style="width:98%;overflow:hidden;padding-right: 18px;">
          <!--基本信息 begin -->
          <el-collapse-item title="基本信息" name="1">
            <template slot="title">
              <el-button type="primary" class="collapseItemHr" ></el-button>基本信息
            </template>
            <div style="width: 49%; float: left;">
              <el-form-item label="姓名" prop="starName">
                <el-input v-model="dataFormForView.starName" auto-complete="off" maxlength="50"></el-input>
              </el-form-item>
              <el-form-item label="工作单位" prop="workCorp">
                <el-input v-model="dataFormForView.workCorp" auto-complete="off" maxlength="100"></el-input>
              </el-form-item>
              <el-form-item label="首页显示" prop="state">
                <cb-dict placeholder="请选择是否首页显示" name="state" dict="state1" type="select" :dataForm="dataFormForView"></cb-dict>
              </el-form-item>
            </div>

            <div style="width: 49%; float: left;">
              <el-form-item label="头像" prop="starPic">
                <cb-upload type="8" name='starPic' :dataForm="dataFormForView" placeholder="头像上传"></cb-upload>
              </el-form-item>
            </div>

            <div style="width: 98%; float:left">
              <el-form-item label="故事标题" prop="traineeStoryTitle">
                <el-input v-model="dataFormForView.traineeStoryTitle" auto-complete="off" maxlength="200"></el-input>
              </el-form-item>
              <el-form-item label="故事简介" prop="traineeStory">
                <el-input v-model="dataFormForView.traineeStory" class="handle-font" type="textarea" rows="2" auto-complete="off" name="traineeStoryForView"></el-input>
              </el-form-item>
            </div>

          </el-collapse-item>
          <!--基本信息 end -->
          <!--更多信息 begin -->
          <el-collapse-item title="更多信息" name="2">
            <template slot="title">
              <el-button type="primary" class="collapseItemHr" ></el-button>更多信息
            </template>
            <div style="float: left; width: 49%">
              <el-form-item label="所属院校" prop="orgId">
                <cb-tree url='/api/sys/role/orgTree' :disabled="true" placeholder="请选择所属院校" name="orgId" prop='{"id":"orgId", "name":"orgName"}' :dataForm="dataFormForView"></cb-tree>
              </el-form-item>
              <el-form-item label="工资:单位K" prop="starSalary">
                <el-input v-model="dataFormForView.starSalary" auto-complete="off" maxlength="10"></el-input>
              </el-form-item>
            </div>
            <div style="float: left; width: 49%">
              <el-form-item label="工作年限" prop="workAge">
                <el-input v-model="dataFormForView.workAge" auto-complete="off" maxlength="11" oninput="this.value=this.value.match(/^[1-9][0-9]*$/)"></el-input>
              </el-form-item>
              <el-form-item label="工作省份" prop="workProvice">
                <el-input v-model="dataFormForView.workProvice" auto-complete="off" maxlength="50"></el-input>
              </el-form-item>
            </div>
            <div style="width: 98%; float:left;">
              <el-form-item label="故事详情" prop="traineeStoryInfo">
                <cb-editor id="traineeStoryInfoForView" name="traineeStoryInfo2" :dataForm="dataFormForView" :height="height" readonly="true" toolbar="false"></cb-editor>
              </el-form-item>
            </div>
          </el-collapse-item>
          <!--更多信息 end -->
        </el-collapse>
        <!--折叠面板 end -->

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="dialogVisibleForView = false">{{$t('action.cancel')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CbTable from "@/views/Core/CbTable"
import CbButton from "@/views/Core/CbButton"
import {format} from "@/utils/datetime"
import {baseUrl} from "../../utils/global";

export default {
    components:{
      CbTable,
      CbButton
    },
    data() {
      return {

        height:window.screen.height == '1080' ? '400' : '230',

        activeName : "1", // 新增修改界面中
        activeNameForView : "1", // 预览界面中折叠面板
        dataTevglStuStar: {
          //orgId: [{ required: true, message: "所属院校不能为空", trigger: "blur" }],
          starPic: [{ required: true, message: "头像不能为空", trigger: "blur" }],
          starName: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
          workCorp: [{ required: true, message: "工作单位不能为空", trigger: "blur" }],
          traineeStoryTitle: [{ required: true, message: "故事标题不能为空", trigger: "blur" }],
          traineeStory: [{ required: true, message: "故事简介不能为空", trigger: "blur" }],
          state: [{ required: true, message: "首页显示不能为空", trigger: "blur" }],
        },
        size: 'small',
        filters: {}, // 表格组件对应查询条件对象
        dataForm:{
          starId: '',
          orgId: '',
          starPic: '',
          starName: '',
          starSalary: '',
          workAge: '',
          workProvice: '',
          workCorp: '',
          traineeStory: '',
          traineeStoryInfo: '',
          traineeStoryTitle: '',
          state: 'N', // 是否推荐到首页(Y是N否)
        },
        dataFormForView:{
          starId: '',
          orgId: '',
          starPic: '',
          starName: '',
          starSalary: '',
          workAge: '',
          workProvice: '',
          workCorp: '',
          traineeStory: '',
          traineeStoryInfo: '',
          traineeStoryTitle: '',
          state: 'N',
        },
        columns: [
          {prop:"starPic", label:"头像", minWidth:70, dataType: "image",},
          {prop:"starName", label:"姓名", minWidth:70, dataType: "link", callback: 'linkClick', title:'asdads'},
          {prop:"orgId", label:"所属院校", minWidth:70, dataType:'', type:'', effect:'', size:""},
          {prop:"workCorp", label:"工作单位", minWidth:100},
          {prop:"traineeStoryTitle", label:"故事标题", minWidth:200},
          {prop:"state", label:"首页显示", minWidth:100, dataType: "switch", callback: 'switchClick',
            formatter: function(row, column, cellValue){
              return cellValue == '是' ? true : false
            }
          },
        ],
        btnColumns: [
          {icon: "fa fa-edit", label: "修改", perms: "stu:tevglstustar:edit", callback: "handleEdit"},
          {icon: "fa fa-trash", label: "删除", perms: "stu:tevglstustar:remove", callback: "handleDelete"},
        ],
        pageResult: {},
        value: '',
        dialogVisible: false,
        operation: false, // true:新增, false:修改
        editDialogVisible: false, // 新增修改界面是否显示
        editLoading: false,
        dialogVisibleForView : false, // 是否显示预览界面
      }
    },
    methods: {

      // 表格组件中图片的点击事件
      linkClick(data){
        this.dialogVisibleForView = true; // 显示预览界面
        //this.changeSaveOrUpdateHeight();
        this.$api.tevglstustar.view(data.row.starId).then((res) => {
          if (res.code == 0){
            this.dataFormForView = Object.assign({}, res.data);
          }
        })
      },

      switchClick(data){
        let obj = {};
        obj.starId = data.row.starId;
        if (data.e == true){
          obj.state = "Y"
        } else {
          obj.state = "N"
        }
        this.$api.tevglstustar.updateState(obj).then((res) => {
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
        jj.order = "desc"
        this.$api.tevglstustar.findPage(jj).then((res) => {
          if (res.code == 0){
            if (res.data.list.length > 0){
              res.data.list.forEach(a => {
                // 处理图片，便于表格组件显示
                a.starPic = baseUrl + a.starPic;
                // 切换值，便于表格组件switch开关
                if (a.state == "是"){
                  a.state = true
                } else if (a.state == "否"){
                  a.state = false
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
        arr.push(data.row.starId);
        this.delete(arr, data)
      },
      // 表格组件中的批量删除
      handleBatchDelete(data){
        let arr = [];
        for (let i=0; i<data.params.length; i++){
          arr.push(data.params[i].starId);
        }
        this.delete(arr, data)
      },
      //执行删除
      delete:function(jj,darass){
        this.$confirm("确认删除选中记录吗？", "提示", {
          type: "warning",
          closeOnClickModal:false
        }).then(() => {
          this.$api.tevglstustar.doDelete(jj).then(res => {
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
        this.dataForm = Object.assign({}, this.dataForm);
        this.changeSaveOrUpdateHeight();
        this.activeName = "1";
      },
      // 显示修改界面
      handleEdit: function (params) {
		    if(this.$refs['dataForm']){
          this.$refs['dataForm'].clearValidate();
        }
        this.dialogVisible = true;
        this.operation = false; // 标识为修改
        this.$api.tevglstustar.view(params.row.starId).then((res) => {
          if (res.code == 0){
            this.dataForm = Object.assign({}, res.data)
            this.dataForm.starPicAttachId = ""
          }
        })
        this.changeSaveOrUpdateHeight();
        this.activeName = "1";
      },
      // 新增修改界面的关闭触发事件
      dialogCloseForSave(){
        this.clearDataFormValueForSaveContinue();
      },
      // 预览界面的关闭触发事件
      dialogCloseForView(){
        this.activeNameForView = "1";
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
              if (this.dataForm.teacherPic != ""){
                let arr = this.dataForm.starPic.split("/");
                if (arr.length > 0){
                  this.dataForm.starPic = arr[arr.length-1];
                }
              }
              let params = Object.assign({}, this.dataForm);
              this.$api.tevglstustar.save(params).then((res) => {
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
      // 清除表单数据，富文本
      clearDataFormValueForSaveContinue(){
        // 清除表单验证
        if(this.$refs['dataForm']){
          this.$refs['dataForm'].clearValidate();
        }
        this.dataForm = {
          starId: '',
          orgId: '',
          starPic: '',
          starName: '',
          starSalary: '',
          workAge: '',
          workProvice: '',
          workCorp: '',
          traineeStory: '',
          traineeStoryInfo: '',
          traineeStoryTitle: '',
          state: 'Y',
          starPicAttachId : '',
        }
        tinyMCE.editors['traineeStoryInfo'].setContent('');
      },

      changeSaveOrUpdateHeight(){
        let height = window.screen.height;
        if (height == 1080){
          this.$nextTick(function(){
            //this.height = "100"
            // 改变表单的高度
            if (this.$refs.dataForm){
              let dataFormEle = this.$refs.dataForm.$el;
              if (dataFormEle != null){
                dataFormEle.style.maxHeight = "675px";
                // TODO 新增界面
                // 折叠面板的高度跟随表单高度改变
                if (this.$refs.elCollapseForSave){
                  let elCollapseForSaveEle = this.$refs.elCollapseForSave.$el;
                  elCollapseForSaveEle.style.height = dataFormEle.style.height;
                  // 改变简介
                  let traineeStory = document.getElementsByName("traineeStory")[0];
                  if (traineeStory != null){
                    traineeStory.setAttribute("rows", "11");
                  }
                }
                // TODO 预览界面
                if (this.$refs.elCollapseForView){
                  let elCollapseForViewEle = this.$refs.elCollapseForView.$el;
                  elCollapseForViewEle.style.height = dataFormEle.style.height;
                  let traineeStoryForView = document.getElementsByName("traineeStoryForView")[0];
                  if (traineeStoryForView != null){
                    traineeStoryForView.setAttribute("rows", "11");
                  }
                }
              }
            }
          });
        }
      },

      // 时间格式化
      dateFormat: function (row, column, cellValue, index){
        return format(row[column.property])
      },
      clearInputValueForQueryStarName(){this.findPage()},
      keyupEnterForQueryStarName(){this.findPage()},
      clearInputValueForQueryWorkAge(){this.findPage()},
      keyupEnterForQueryWorkAge(){this.findPage()},
      clearInputValueForQueryWorkProvice(){this.findPage()},
      keyupEnterForQueryWorkProvice(){this.findPage()},
      clearInputValueForQueryWorkCorp(){this.findPage()},
      keyupEnterForQueryWorkCorp(){this.findPage()},
    },
    mounted() {
    }
  }
</script>

<style scoped>

</style>
