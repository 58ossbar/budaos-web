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
                           :filters="filters" :parentVue="this._self" :change="findPage" defaultExpandedLevel="1"></cb-tree>
	              </el-form-item>
	            </el-col>
	            <el-col :span="2">
	              <el-form-item class="dictInputQueryLabelWidth">
	                <span>教师名称</span>
	              </el-form-item>
	            </el-col>
	            <el-col :span="6">
	              <el-form-item class="dictInputQueryWidth ">
                  <!--<cb-input :parentVue="this._self" placeholder="请输入教师名称" name="teacherName" :filters="filters" :change="findPage"></cb-input>-->
	                <el-input  v-model="filters.teacherName" placeholder="教师名称"
                             clearable @clear="clearInputValueForQueryTeacherName"
                             @keyup.enter.native="keyupEnterForQueryTeacherName"></el-input>
	              </el-form-item>
	            </el-col>
	            <el-col :span="2">
	              <el-form-item class="dictInputQueryLabelWidth">
	                <span>首页显示</span>
	              </el-form-item>
	            </el-col>
	            <el-col :span="6">
	              <el-form-item class="dictInputQueryWidth ">
                  <cb-dict placeholder="首页显示" name="showIndex" dict="state1" type="select" :filters="filters" :change="findPage" empty-label="全部"></cb-dict>
	              </el-form-item>
	            </el-col>
	          </el-row>
              <el-collapse-item class="elCollapseItemNoBoeder elCollapseItemMarginBottom">
                <el-row>
                <el-col :span="2">
                  <el-form-item class="dictInputQueryLabelWidth">
                    <span>账号</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item class="dictInputQueryWidth ">
                    <el-input  v-model="filters.username" placeholder="账号" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item class="dictInputQueryLabelWidth">
                    <span>职位</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item class="dictInputQueryWidth ">
                    <el-select v-model="filters.teacherPost" placeholder="请选择职位" style="width: 100%;" clearable>
                      <el-option
                        v-for="item in teacherPostList"
                        :key="item.postId"
                        :label="item.postName"
                        :value="item.postId">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item class="dictInputQueryLabelWidth">
                    <span>教师状态</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item class="dictInputQueryWidth ">
                    <cb-dict placeholder="教师状态" name="state" dict="teacher_state" type="select" :filters="filters" :change="findPage" empty-label="全部"></cb-dict>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-collapse-item>
          </el-collapse>
          <el-row class="elDeptFormButton dictQueryCenterButton">
            <el-col :span="24">
              <cb-button icon="fa fa-search" :label="$t('action.search')" perms="tch:tevgltchteacher:query" type="primary" @click="findPage(null)"/>
              <cb-button icon="fa fa-plus" :label="$t('action.add')" perms="tch:tevgltchteacher:add" type="primary" @click="handleAdd" />
            </el-col>
          </el-row>
        </el-form>
      </el-header>
      <el-main class="box_shadows bgcolor  scrollRightYDictMenu tableDict marginBottom">
        <!--表格内容栏-->
        <cb-tables :parentVue="this._self" permsBatchDelete="tch:tevgltchteacher:remove"
                   :tableData="pageResult" :columns="columns" :btnColumns="btnColumns">
        </cb-tables>
      </el-main>
    </el-container>
    <!--新增修改界面-->
    <el-dialog v-dialogDrag :title="operation?'新增':'修改'" top="5vh" width="60%" :visible.sync="dialogVisible" :close-on-click-modal="false" @close="dialogCloseForSaveOrUpdate">
      <el-form :model="dataForm" label-width="100px" ref="dataForm" :rules="dataTevglTchTeacher"
               :size="size" style="margin-top: 0px">
        <!--折叠面板 begin -->
        <el-collapse ref="elCollapseForSave" v-model="activeName" accordion style="width:98%;overflow:hidden;padding-right: 18px;">
          <!--基本信息 begin -->
          <el-collapse-item title="" name="1">
            <template slot="title">
              <el-button type="primary" class="collapseItemHr" ></el-button>基本信息
            </template>
            <div style="width: 49%; float: left;">
              <el-form-item label="教师名称" prop="teacherName">
                <el-input v-model="dataForm.teacherName" auto-complete="off" maxlength="50" autofocus></el-input>
                <!--<cb-input :parentVue="this._self" placeholder="请输入教师名称" name="teacherName" :dataForm="dataForm"></cb-input>-->
              </el-form-item>
              <el-form-item label="所属院校" prop="orgId">
                <cb-tree url='/api/sys/role/orgTree' :parentVue="this._self" placeholder="请选择所属院校" name="orgId" prop='{"id":"orgId", "name":"orgName"}' :dataForm="dataForm"></cb-tree>
              </el-form-item>
              <el-form-item label="二级部门" prop="orgIdDepartment">
                <cb-tree url='/api/sys/role/orgTree' :parentVue="this._self" placeholder="请选择二级部门" name="orgIdDepartment" prop='{"id":"orgId", "name":"orgName"}' :dataForm="dataForm"></cb-tree>
              </el-form-item>
              <el-form-item label="职业路径" prop="majorId">
                <cb-tree :parentVue="this._self" url="/api/book/tevglbookmajor/queryForTree" isMult="true" :dataForm="dataForm" placeholder="请选择所属职业路径" name="majorId" prop='{"id": "majorId", "name": "majorName"}'></cb-tree>
              </el-form-item>
              <el-form-item label="账号名称" prop="username">
                <el-input v-model="dataForm.username" auto-complete="off" placeholder="此处填写手机号码" maxlength="11"></el-input>
              </el-form-item>
              <el-form-item label="关联粉丝ID" prop="traineeId">
                <cb-autocomplete
                  :parentVue="this._self"
                  name="traineeId"
                  value="traineeName"
                  image="traineePic"
                  :dataForm="dataForm"
                  url="/api/trainee/tevgltraineeinfo/listTrainee"
                  prop='{"id":"traineeId", "value":"traineeName"}'
                  placeholder="请选择关联的粉丝ID"
                ></cb-autocomplete>
              </el-form-item>
              <el-form-item label="工号/学号" prop="jobNumber">
                <el-input v-model="dataForm.jobNumber" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="教师证件号" prop="teacherErtificateNumber">
                <el-input v-model="dataForm.teacherErtificateNumber" auto-complete="off"></el-input>
              </el-form-item>
            </div>

            <div style="width: 49%; float: left;">
              <el-form-item label="教师头像" prop="teacherPic">
                <div style="float: left">
                  <cb-upload type="7" name='teacherPic' width="600" height="800" errorRange="20" :dataForm="dataForm" placeholder="上传教师头像" title="点击上传教师头像,尺寸大小"></cb-upload>
                </div>
                <div style="float:left; text-align: center; padding-left: 15px;"><el-tag size="mini" type="danger" effect="plain">尺寸大小 600*800 最佳</el-tag></div>
              </el-form-item>
              <el-form-item label="首页显示" prop="showIndex">
                <cb-dict :parentVue="this._self" placeholder="首页显示" name="showIndex" dict="state1" type="select" :dataForm="dataForm"></cb-dict>
              </el-form-item>
              <el-form-item label="教师状态" prop="state">
                <cb-dict :parentVue="this._self" placeholder="教师状态" name="state" dict="teacher_state" type="select" :dataForm="dataForm"></cb-dict>
              </el-form-item>
              <el-form-item label="排序号码" prop="orderNum">
                <el-input-number v-model="dataForm.sortNum" class="widthAll"
                                 controls-position="right" :min="1" :max="99999">
                </el-input-number>
              </el-form-item>
              <el-form-item label="教师职位" prop="teacherPost">
                <el-select v-model="dataForm.teacherPost" placeholder="" style="width: 100%;" clearable>
                  <el-option
                    v-for="item in teacherPostList"
                    :key="item.postId"
                    :label="item.postName"
                    :value="item.postId">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="教师性别" prop="sex">
                <cb-dict
                  :parentVue="this._self"
                  placeholder=""
                  name="sex"
                  dict="sex"
                  type="select"
                  :dataForm="dataForm"
                ></cb-dict>
              </el-form-item>
            </div>

            <div style="width: 98%; float:left">
              <el-form-item label="老师简介" prop="teacherDesc">
                <el-input v-model="dataForm.teacherDesc" class="handle-font" name="teacherDesc" type="textarea" rows="2" style="width: 100%;" auto-complete="off" maxlength="500"></el-input>
              </el-form-item>
            </div>

          </el-collapse-item>
          <!--基本信息 end -->
          <!--更多信息 begin -->
          <el-collapse-item title="" name="2">
            <template slot="title">
              <el-button type="primary" class="collapseItemHr" ></el-button>更多信息
            </template>
            <div style="width: 99%; float:left;">
              <el-form-item label="教师介绍" prop="teacherRemark">
                <cb-editor id="teacherRemark" :parentVue="this._self" name="teacherRemark" :dataForm="dataForm" :height="height"></cb-editor>
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

    <!--预览界面begin-->
    <el-dialog v-dialogDrag title="查看" top="5vh" width="60%" :visible.sync="dialogVisibleForView" :close-on-click-modal="false">
      <el-form :model="dataFormForView" label-width="100px" ref="dataFormForView" :rules="dataTevglTchTeacher" :disabled="true"
               :size="size" style="margin-top: 0px">
        <!--折叠面板 begin -->
        <el-collapse ref="elCollapseForSave" v-model="activeNameForView" accordion style="width:98%;overflow:hidden;padding-right: 18px;">
          <!--基本信息 begin -->
          <el-collapse-item title="基本信息" name="1">
            <template slot="title">
              <el-button type="primary" class="collapseItemHr" ></el-button>基本信息
            </template>
            <div style="width: 49%; float: left;">
              <el-form-item label="教师名称" prop="teacherName">
                <el-input v-model="dataFormForView.teacherName" auto-complete="off" maxlength="50" autofocus></el-input>
              </el-form-item>
              <el-form-item label="所属院校" prop="orgId">
                <cb-tree url='/api/sys/role/orgTree' :parentVue="this._self" :disabled="true" placeholder="请选择所属院校" name="orgId" prop='{"id":"orgId", "name":"orgName"}' :dataForm="dataFormForView"></cb-tree>
              </el-form-item>
              <el-form-item label="二级部门" prop="orgIdDepartment">
                <cb-tree url='/api/sys/role/orgTree' :parentVue="this._self" :disabled="true" placeholder="请选择二级部门" name="orgIdDepartment" prop='{"id":"orgId", "name":"orgName"}' :dataForm="dataFormForView"></cb-tree>
              </el-form-item>
              <el-form-item label="职业路径" prop="majorId">
                <cb-tree :parentVue="this._self" url="/api/book/tevglbookmajor/queryForTree" :disabled="true" isMult="true" :dataForm="dataFormForView" placeholder="请选择所属职业路径" name="majorId" prop='{"id": "majorId", "name": "majorName"}'></cb-tree>
              </el-form-item>
              <el-form-item label="账号名称" prop="username">
                <el-input v-model="dataFormForView.username" auto-complete="off" placeholder="此处填写手机号码" maxlength="11"></el-input>
              </el-form-item>
              <el-form-item label="关联粉丝ID" prop="traineeId">
                <el-input v-model="dataFormForView.traineeName"></el-input>
              </el-form-item>
              <el-form-item label="工号/学号" prop="jobNumber">
                <el-input v-model="dataFormForView.jobNumber" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="教师证件号" prop="teacherErtificateNumber">
                <el-input v-model="dataFormForView.teacherErtificateNumber" auto-complete="off"></el-input>
              </el-form-item>

            </div>

            <div style="width: 49%; float: left;">
              <el-form-item label="教师头像" prop="teacherPic">
                <div style="float: left">
                  <cb-upload type="7" name='teacherPic' width="600" height="800" :dataForm="dataFormForView" placeholder="上传教师头像" title="点击上传教师头像,尺寸大小"></cb-upload>
                </div>
              </el-form-item>
              <el-form-item label="首页显示" prop="showIndex">
                <cb-dict :parentVue="this._self" placeholder="首页显示" name="showIndex" dict="state1" type="select" :dataForm="dataFormForView"></cb-dict>
              </el-form-item>
              <el-form-item label="教师状态" prop="state">
                <cb-dict :parentVue="this._self" placeholder="教师状态" name="state" dict="teacher_state" type="select" :dataForm="dataFormForView"></cb-dict>
              </el-form-item>
              <el-form-item label="排序号码" prop="orderNum">
                <el-input-number v-model="dataFormForView.sortNum" class="widthAll"
                                 controls-position="right" :min="1" :max="99999">
                </el-input-number>
              </el-form-item>
              <el-form-item label="教师职位" prop="teacherPost">
                <el-select v-model="dataFormForView.teacherPost" placeholder="" style="width: 100%;" clearable>
                  <el-option
                    v-for="item in teacherPostList"
                    :key="item.postId"
                    :label="item.postName"
                    :value="item.postId">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="教师性别" prop="sex">
                <cb-dict
                  :parentVue="this._self"
                  placeholder=""
                  name="sex"
                  dict="sex"
                  type="select"
                  :dataForm="dataFormForView"
                ></cb-dict>
              </el-form-item>
            </div>

            <div style="width: 98%; float:left">
              <el-form-item label="老师简介" prop="teacherDesc">
                <el-input v-model="dataFormForView.teacherDesc" class="handle-font" name="teacherDesc" type="textarea" rows="5" style="width: 100%;" auto-complete="off" maxlength="500"></el-input>
              </el-form-item>
            </div>

          </el-collapse-item>
          <!--基本信息 end -->
          <!--更多信息 begin -->
          <el-collapse-item title="更多信息" name="2">
            <template slot="title">
              <el-button type="primary" class="collapseItemHr" ></el-button>更多信息
            </template>
            <div style="width: 99%; float:left;">
              <el-form-item label="教师介绍" prop="teacherRemark">
                <cb-editor id="teacherRemarkForView" :parentVue="this._self" name="teacherRemark" :dataForm="dataFormForView" :height="height" readonly="true" toolbar="false"></cb-editor>
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
    <!--预览界面end-->

  </div>
</template>

<script>
import CbTable from "@/views/Core/CbTable"
import CbButton from "@/views/Core/CbButton"
import cbeditor from "@/components/cbeditor"
import {format} from "@/utils/datetime"
import CbUpload from "../../components/cbupload/index";
import CbEditor from "../../components/cbeditor/index";
import CbDict from "../../components/cbdict/index";
import {baseUrl} from "../../utils/global";

export default {
    components:{
      CbDict,
      CbEditor,
      CbUpload,
      CbTable,
      CbButton,
      cbeditor
    },
    data() {
      return {

        height:window.screen.height == '1080' ? '450' : '210', // 富文本高度
        activeNameForView:"1",
        dialogVisibleForView : false, // 是否显示预览界面
        dataFormForView : {},


        teacherPostList : [], // 职位
        activeName : "1", // 折叠面板默认显示的值

        dataTevglTchTeacher: {
          orgId: [{ required: true, message: "所属院校不能为空", trigger: "blur" }],
          teacherName: [{ required: true, message: "教师名称不能为空", trigger: "blur" }],
          //teacherPost: [{ required: true, message: "教师职位不能为空", trigger: "blur" }],
          teacherPic: [{ required: true, message: "教师头像不能为空", trigger: "blur" }],
          teacherDesc: [{ required: true, message: "老师简介不能为空", trigger: "blur" }],
          username: [{ required: true, message: "账号名称不能为空", trigger: "blur" }],
          showIndex: [{ required: true, message: "首页显示不能为空", trigger: "blur" }],
          state: [{ required: true, message: "状态不能为空", trigger: "blur" }],
          majorId: [{ required: true, message: "职业路径不能为空", trigger: "blur" }],
          jobNumber: [{ required: true, message: "工号/学号不能为空", trigger: "blur" }],
          teacherErtificateNumber: [{ required: true, message: "教师证件号不能为空", trigger: "blur" }],
        },
        size: 'small',
        filters: {},
        dataForm:{
          teacherId: '',
          orgId: '',
          teacherName: '',
          teacherPost: '',
          teacherPic: '',
          teacherDesc: '',
          teacherRemark: '',
          userId: '',
          username: '',
          traineeId: '',
          majorId: '',
          showIndex: 'N', // 是否首页显示
          state: 'Y', // 状态
          sortNum:'', // 排序号
          jobNumber: '',
          teacherErtificateNumber: '',
          sex: '0'
        },
        columns: [
          {prop:"teacherPic", label:"教师头像", minWidth:80, dataType: "image", callback: "imageClick", title:'teacherName'},
          {prop:"teacherName", label:"教师名称", minWidth:100, dataType: "link", callback: 'linkClick'},
          {prop:"orgId", label:"所属院校", minWidth:100},
          {prop:"postName", label:"教师职位", minWidth:100},
          {prop:"username", label:"账号", minWidth:100},
          {prop:"majorName", label:"职业路径", minWidth:100},
          {prop:"state", label:"教师状态", minWidth:100, dataType:'tag', type:'success', mapper:'{"key":"离职","value":"danger"}'},
          {prop:"showIndex", label:"首页显示", minWidth:100, dataType: "switch", callback: 'switchClick',
            formatter: function(row, column, cellValue){
              return cellValue == '是' ? true : false
            }
          },
        ],
        btnColumns: [
          {icon: "fa fa-edit", label: "修改", perms: "tch:tevgltchteacher:edit", callback: "handleEdit"},
          {icon: "fa fa-trash", label: "删除", perms: "tch:tevgltchteacher:remove", callback: "handleDelete"},
        ],
        pageResult: {},
        value: '',
        dialogVisible: false,
        operation: false, // true:新增, false:修改
        editDialogVisible: false, // 新增修改界面是否显示
        editLoading: false,
      }
    },
    methods: {
      linkClick(params){
        this.dialogVisibleForView = true;
        this.$api.tevgltchteacher.view(params.row.teacherId).then((res) => {
          if (res.code == 0){
            this.dataFormForView = Object.assign({}, res.data);
          }
        });
        this.activeNameForView = "1";
      },
      /**
       * switch开关
       * @param data
       */
      switchClick(data){
        let obj = {};
        obj.teacherId = data.row.teacherId;
        if (data.e == true){
          obj.showIndex = "Y"
        } else {
          obj.showIndex = "N"
        }
        this.$api.tevgltchteacher.updateStatus(obj).then((res) => {
          if (res.code == 0){
            this.$message({ message: "操作成功", type: "success" });
          } else {
            this.$message({ message: "操作失败", type: "error" });
          }
        });
      },

      imageClick(){

      },

      // 获取分页数据
      findPage: function (data) {
        if(data !== null && data != undefined) {
          this.pageRequest = data.pageRequest
        } else {
          this.pageRequest.pageNum = 1
        }
        let jj = Object.assign({}, this.filters)
        jj.pageNum=this.pageRequest.pageNum;
        jj.pageSize=this.pageRequest.PageSize;
        jj.sidx = "update_time";
        jj.order = "desc";
        this.$api.tevgltchteacher.findPage(jj).then((res) => {
          if (res.code == 0){
            if (res.data.list.length > 0){
              res.data.list.forEach(a => {
                a.pic = baseUrl + a.teacherPic;
                // 处理图片，便于表格组件显示
                a.teacherPic = baseUrl + a.teacherPic;
                // 切换值，便于表格组件switch开关
                if (a.showIndex == "是"){
                  a.showIndex = true
                } else if (a.showIndex == "否"){
                  a.showIndex = false
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
        arr.push(data.row.teacherId);
        this.delete(arr, data)
      },
      // 表格组件中的批量删除
      handleBatchDelete(data){
        let arr = [];
        for (let i=0; i<data.params.length; i++){
          arr.push(data.params[i].teacherId);
        }
        this.delete(arr, data)
      },
      // 删除
      handleDeleteOther: function (data) {
        let arr = [];
        arr.push(data.obj.teacherId);
        this.delete(arr, data)
      },
      // 批量删除
      handleBatchDeleteOther: function (data) {
        let arr = [];
        for (let i=0; i<data.params.length; i++){
          arr.push(data.params[i].teacherId);
        }
        this.delete(arr, data)
      },
      //执行删除
      delete:function(jj,darass){
        this.$confirm("确认删除选中记录吗？", "提示", {
          type: "warning",
          closeOnClickModal:false
        }).then(() => {
          this.$api.tevgltchteacher.doDelete(jj).then(res => {
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
        this.dataForm = Object.assign({}, this.dataForm);
        this.activeName = "1";
        this.changeSaveOrUpdateHeight();
      },
      // 显示修改界面
      handleEdit: function (params) {
        this.dialogVisible = true;
        this.operation = false; // 标识为修改
        this.$api.tevgltchteacher.view(params.row.teacherId).then((res) => {
          if (res.code == 0){
            this.dataForm = Object.assign({}, res.data);
            this.dataForm.teacherPicAttachId = "";
          }
        });
        this.changeSaveOrUpdateHeight();
        this.activeName = "1";
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
                let arr = this.dataForm.teacherPic.split("/");
                if (arr.length > 0){
                  this.dataForm.teacherPic = arr[arr.length-1];
                }
              }
              let params = Object.assign({}, this.dataForm);
              this.$api.tevgltchteacher.save(params).then((res) => {
                  if(res.code == 0) {
                    this.$message({ message: '操作成功', type: 'success' })
                    if (type == "saveContinue"){
                      this.clearDataFormValueForSaveContinue();
                      this.activeName = "1";
                    }
                    this.$refs['dataForm'].resetFields()
                  } else {
                    this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                  }
                  this.editLoading = false
                  this.editDialogVisible = false
                  this.findPage(null)
                })
            })
          } else {
            this.activeName = "1";
          }
        })
      },
      clearDataFormValueForSaveContinue(){
        this.dataForm = {
          teacherId: '',
          orgId: '',
          teacherName: '',
          teacherPost: '',
          teacherPic: '',
          teacherDesc: '',
          teacherRemark: '',
          userId: '',
          username: '',
          traineeId: '',
          majorId: '',
          showIndex: 'N',
          state: 'Y',
          teacherPicAttachId : '',
          jobNumber: '',
          teacherErtificateNumber: '',
          sex: '0'
        }
        // 清除表单验证
        if(this.$refs['dataForm']){
          this.$refs['dataForm'].clearValidate();
        }
      },
      dialogCloseForSaveOrUpdate(){
        this.dataForm = {
          teacherId: '',
          orgId: '',
          teacherName: '',
          teacherPost: '',
          teacherPic: '',
          teacherDesc: '',
          teacherRemark: '',
          userId: '',
          username: '',
          traineeId: '',
          majorId: '',
          showIndex: 'N',
          state: 'Y',
          teacherPicAttachId : '',
          jobNumber: '',
          teacherErtificateNumber: '',
          sex: '0'
        }
        tinyMCE.editors['teacherRemark'].setContent('');
        // 清除表单验证
        if(this.$refs['dataForm']){
          this.$refs['dataForm'].clearValidate();
        }
      },
      // 时间格式化
      dateFormat: function (row, column, cellValue, index){
        return format(row[column.property])
      },

      // 职位
      getTeacherPost(){
        this.$api.tevgltchteacher.getTeacherPost().then((res) => {
          if (res.code == 0){
            this.teacherPostList = res.data;
          }
        });
      },

      changeSaveOrUpdateHeight(){
        let height = window.screen.height;
        if (height == 1080){
          this.$nextTick(function(){
            this.height = '520'
            // 改变表单的高度
            let dataFormEle = this.$refs.dataForm.$el;
            if (dataFormEle != null){
              //dataFormEle.style.maxHeight = "675px";
              // 折叠面板的高度跟随表单高度改变
              if (this.$refs.elCollapseForSave){
                let elCollapseForSaveEle = this.$refs.elCollapseForSave.$el;
                elCollapseForSaveEle.style.height = dataFormEle.style.height;
                // 改变简介
                let teacherDesc = document.getElementsByName("teacherDesc")[0];
                if (teacherDesc != null){
                  teacherDesc.setAttribute("rows", "6");
                }
              }
            }
          });
        }
      },

      clearInputValueForQueryTeacherName(){this.findPage()},
      keyupEnterForQueryTeacherName(){this.findPage()},

    },
    mounted() {
      this.getTeacherPost(); // 初始化职位
    }
  }
</script>

<style scoped>

</style>
