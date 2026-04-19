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
                <span>职业路径</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="dictInputQueryWidth ">
                <el-input  v-model="filters.reason" placeholder="职业路径" clearable @clear="findPage"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-form-item class="dictInputQueryLabelWidth">
                <span>教学包名称</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="dictInputQueryWidth ">
                <el-input  v-model="filters.pkgName" placeholder="教学包名称" clearable @clear="findPage"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-form-item class="dictInputQueryLabelWidth">
                <span>作者</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="dictInputQueryWidth ">
                <el-input  v-model="filters.pkgName" placeholder="作者" clearable @clear="findPage"></el-input>
              </el-form-item>
            </el-col>
	        </el-row>
          <el-collapse-item class="elCollapseItemNoBoeder elCollapseItemMarginBottom">
            <el-row>
	            <el-col :span="2">
	              <el-form-item class="dictInputQueryLabelWidth">
	                <span>创建人</span>
	              </el-form-item>
	            </el-col>
	            <el-col :span="6">
	              <el-form-item class="dictInputQueryWidth ">
	                <el-input  v-model="filters.createUserId" placeholder="创建人" clearable @clear="findPage"></el-input>
	              </el-form-item>
	            </el-col>
              <el-col :span="2">
                <el-form-item class="dictInputQueryLabelWidth">
                  <span>创建时间</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item class="dictInputQueryWidth ">
                  <el-input  v-model="filters.createTime" placeholder="创建时间" clearable @clear="findPage"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-form-item class="dictInputQueryLabelWidth">
                  <span>版本</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item class="dictInputQueryWidth ">
                  <el-input  v-model="filters.pkgName" placeholder="版本" clearable @clear="findPage"></el-input>
                </el-form-item>
              </el-col>
	          </el-row>
	        </el-collapse-item>
	      </el-collapse>
          <el-row class="elDeptFormButton dictQueryCenterButton">
            <el-col :span="24">
              <cb-button icon="fa fa-search" :label="$t('action.search')" perms="pkg:tevglpkgcheck:query" type="primary" @click="findPage(null)"/>
            </el-col>
          </el-row>
        </el-form>
      </el-header>
      <el-main class="box_shadows bgcolor  scrollRightYDictMenu tableDict marginBottom">
        <!--表格内容栏-->
        <cb-tables :parentVue="this._self" permsBatchDelete="pkg:tevglpkgcheck:remove"
          :tableData="pageResult" :columns="columns" :btnColumns="btnColumns">
        </cb-tables>
      </el-main>
    </el-container>
    <!--审核界面-->
    <el-dialog v-dialogDrag title="审核"  top="5vh" width="60%" :visible.sync="dialogVisible" :close-on-click-modal="false"  @close="dialogVisible = false">
      <el-tabs type="border-card">
        <el-tab-pane>
          <span slot="label"><i class="el-icon-s-management"></i> 活教材</span>
          <div class="audit-content">
            <!-- 左侧章节显示 -->
            <div class="chapter-left">
              <cbtreepanel></cbtreepanel>
            </div>
            <!-- 右侧章节内容显示 -->
            <div class="chapter-right">
              <cbeditor id="chapterInfo" :parentVue="this._self" name="chapterInfo" :dataForm="chapterInfo" :height="height"></cbeditor>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane>
          <span slot="label"><i class="el-icon-s-flag"></i> 活动</span>
          <div class="audit-content">
            <!-- 左侧章节显示 -->
            <div class="activtiy-left">
              <el-menu
                default-active="2"
                style="height:100%;text-align: left;"
                class="el-menu-vertical-demo">
                <el-menu-item index="1">
                  <i class="el-icon-menu"></i>
                  <span slot="title">活动一</span>
                </el-menu-item>
                <el-menu-item index="2">
                  <i class="el-icon-menu"></i>
                  <span slot="title">活动二</span>
                </el-menu-item>
                <el-menu-item index="3">
                  <i class="el-icon-setting"></i>
                  <span slot="title">活动三</span>
                </el-menu-item>
                <el-menu-item index="4">
                  <i class="el-icon-setting"></i>
                  <span slot="title">活动四</span>
                </el-menu-item>
              </el-menu>
            </div>
            <!-- 右侧章节内容显示 -->
            <div class="activtiy-right">

            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane>
          <span slot="label"><i class="el-icon-s-platform"></i> 云盘</span>
          <div class="audit-content">

          </div>
        </el-tab-pane>
      </el-tabs>
      <el-dialog
        width="30%"
        title="理由填写"
        @close="innerVisible = false"
        :visible.sync="innerVisible"
        append-to-body>
        <el-form :model="dataForm" ref="reasonForm" :rules="dataTevglPkgCheck" label-width="100px" class="demo-ruleForm" style="padding: 20px 20px 20px 0;">
          <el-form-item
            label="理由："
            prop="reason">
            <el-input type="textarea" v-model="dataForm.reason"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button :size="size" type="primary" @click.native="innerVisible = false">取消</el-button>
          <el-button :size="size" type="primary" @click.native="notThrough"  :loading="editLoading">确定</el-button>
        </div>
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" type="primary" @click.native="innerVisible = true">不通过</el-button>
        <el-button :size="size" type="primary" @click.native="through"  :loading="editLoading">通过</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CbButton from "@/views/Core/CbButton"
import cbtreepanel from "@/components/cbtreepanel/index"
import cbeditor from "@/components/cbeditor/index"
import {baseUrl} from "../../utils/global";

export default {
    components:{
      CbButton,
      cbtreepanel,
      cbeditor
    },
    data() {
      return {
        // 当前被选中等待审核的教学包
        pkgId: '',
        innerVisible: false,  //是否打开不通过理由填写弹出框
        dataTevglPkgCheck: {
          pkgId: [{ required: true, message: "教学包id不能为空", trigger: "blur" }],
          checkState: [{ required: true, message: "审核状态（Y/N）不能为空", trigger: "blur" }],
          createTime: [{ required: true, message: "创建时间不能为空", trigger: "blur" }],
          createUserId: [{ required: true, message: "创建人不能为空", trigger: "blur" }],
          reason: [{ required: true, message: "不通过理由不能为空", trigger: "blur" }],
        },
        size: 'small',
        filters: {
        },
        chapterInfo:{

        },
        height: '440',
        dataForm:{
          pcId: '', //主键id
          pkgId: '', //教学包id
          checkState: '', //审核状态（Y/N）
          createTime: '', //创建时间
          createUserId: '', //创建人
          reason: '', //不通过理由
        },
        columns: [
          {prop:"pkgLogo", label:"教学包封面", minWidth:100, dataType:'image', type:'2', imgWidth:'120px', imgHeight:'40px',
            formatter: function(r, c, v){return baseUrl + v }
          },
          {prop:"pkgName", label:"教学包名称", minWidth:70},
          {prop:"pkgVersion", label:"教学包版本", minWidth:70},
          {prop:"checkState", label:"审核状态", minWidth:70},
          {prop:"createTime", label:"提交时间", minWidth:70},
          {prop:"traineeName", label:"提交人", minWidth:70},
          {prop:"checkTime", label:"审核时间", minWidth:70},
          {prop:"reviewerName", label:"审核人", minWidth:70},
          {prop:"reason", label:"不通过理由", minWidth:70},
        ],
        btnColumns: [
          {icon: "fa fa-edit", label: "审核", perms: "pkg:tevglpkgcheck:updatePkgReleaseStatus", callback: "handleEdit"}
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
      // 获取分页数据
      findPage: function (data) {
        if(data) {
          this.pageRequest = data.pageRequest
        } else {
          this.pageRequest.pageNum = 1
        }
        let jj = Object.assign({}, this.filters)
        jj.pageNum=this.pageRequest.pageNum;
        jj.pageSize=this.pageRequest.PageSize;
        console.log(data)
        data.callback;
         this.$api.tevglpkgcheck.findPage(jj).then((res) => {
           this.pageResult = res.data
         }).then(data!=null?data.callback:'')

      },
      // 删除
      handleDelete: function (data) {
        let arr = [];
        arr.push(data.row.pcId);
        this.delete(arr, data)
      },
      // 批量删除
      handleBatchDelete: function (data) {
        let arr = [];
        for (let i=0; i<data.params.length; i++){
          arr.push(data.params[i].pcId);
        }
        this.delete(arr, data)
      },
      //执行删除
      delete:function(jj,darass){
        this.$confirm("确认删除选中记录吗？", "提示", {
          type: "warning",
          closeOnClickModal:false
        }).then(() => {
          this.$api.tevglpkgcheck.doDelete(jj).then(res => {
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
      handleAdd: function (params) {
		    if(this.$refs['dataForm']){
          this.$refs['dataForm'].clearValidate();
        }
        this.dialogVisible = true;
        this.operation = true;
        this.$refs['dataForm'].resetFields()
      },
      // 显示修改界面
      handleEdit: function (params) {
        this.pkgId = params.row.pkgId
		    if(this.$refs['dataForm']){
          this.$refs['dataForm'].clearValidate();
        }
        this.dialogVisible = true;
      },
      // 修改
      submitForm: function (type) {
        this.$refs.dataForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true;
              this.dialogVisible = type == "saveContinue";
              let params = Object.assign({}, this.dataForm);
              this.$api.tevglpkgcheck.save(params).then((res) => {
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
      //不通过
      notThrough: function(){
        this.$refs['reasonForm'].validate((valid) => {
          if (valid) {
            this.innerVisible = false;
            this.dialogVisible = false;
            //this.dataForm.reason = '';
            let obj = {
              pkgId: this.pkgId,
              checkState: 'N',
              reason: this.dataForm.reason
            }
            this.$api.tevglpkgcheck.updatePkgReleaseStatus(obj).then(res => {
              if (res.code === 0) {
                this.$message({ message: res.msg, type: 'success' })
                this.dialogVisible = false
                this.findPage(null)
              }
            })
          } else {
            return false;
          }
        });
      },
      //通过
      through: function(){
        let obj = {
          pkgId: this.pkgId,
          checkState: 'Y'
        }
        this.$api.tevglpkgcheck.updatePkgReleaseStatus(obj).then(res => {
          if (res.code === 0) {
            this.$message({ message: res.msg, type: 'success' })
            this.dialogVisible = false
            this.findPage(null)
          }
        })
      },
    },
    mounted() {

    }
  }
</script>

<style scoped>
  .audit-content{
    height: 500px;
    display: flex;
  }
  /* 章节审核 */
  .audit-content .chapter-left{
    width: 25%;
    height: 100%;
    overflow-x: scroll;
    margin-right: 2%;
  }
  .audit-content .chapter-right{
    width: 73%;
    height: 100%;
  }
  .audit-content  .activtiy-left{
    width: 250px;
    height: 100%;
  }
  .activtiy-left /deep/ li{
    height: 50px;
    line-height: 50px;
  }
  .audit-content .activtiy-right{
    width: 100%;
    height: 100%;
  }
</style>
