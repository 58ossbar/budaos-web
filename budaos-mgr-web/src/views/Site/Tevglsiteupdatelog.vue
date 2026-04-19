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
	                <span>类型</span>
	              </el-form-item>
	            </el-col>
	            <el-col :span="6">
	              <el-form-item class="dictInputQueryWidth ">
	                <cb-dict placeholder="请选择类型" name="type" dict="feedbackBigType" type="select" :filters="filters" emptyLabel="全部" :change="findPage" clearable></cb-dict>
	              </el-form-item>
	            </el-col>
	            <el-col :span="2">
	              <el-form-item class="dictInputQueryLabelWidth">
	                <span>版本</span>
	              </el-form-item>
	            </el-col>
	            <el-col :span="6">
	              <el-form-item class="dictInputQueryWidth ">
	                <el-input  v-model="filters.version" placeholder="版本" clearable @clear="findPage"></el-input>
	              </el-form-item>
	            </el-col>
	            <el-col :span="2">
	              <el-form-item class="dictInputQueryLabelWidth">
	                <span>内容</span>
	              </el-form-item>
	            </el-col>
	            <el-col :span="6">
	              <el-form-item class="dictInputQueryWidth ">
	                <el-input  v-model="filters.content" placeholder="内容" clearable @clear="findPage"></el-input>
	              </el-form-item>
	            </el-col>
	        </el-row>

	      </el-collapse>
          <el-row class="elDeptFormButton dictQueryCenterButton">
            <el-col :span="24">
              <cb-button icon="fa fa-search" :label="$t('action.search')" perms="site:tevglsiteupdatelog:query" type="primary" @click="findPage(null)"/>
              <cb-button icon="fa fa-plus" :label="$t('action.add')" perms="site:tevglsiteupdatelog:add" type="primary" @click="handleAdd" />
              <cb-button icon="fa fa-low-vision" label="更新轨迹" perms="site:tevglsiteupdatelog:view" type="primary" @click="handleView" />
            </el-col>
          </el-row>
        </el-form>
      </el-header>
      <el-main class="box_shadows bgcolor  scrollRightYDictMenu tableDict marginBottom">
        <!--表格内容栏-->
        <cb-tables :parentVue="this._self" permsBatchDelete="site:tevglsiteupdatelog:remove"
          :tableData="pageResult" :columns="columns" :btnColumns="btnColumns">
        </cb-tables>
      </el-main>
    </el-container>
    <!--新增修改界面-->
    <el-dialog v-dialogDrag :title="operation?'新增':'修改'"  top="5vh" width="60%" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-form :model="dataForm" label-width="100px" ref="dataForm" :rules="dataTevglSiteUpdateLog"
               :size="size" style="margin-top: 10px">
        <div style="width: 49%; float:left;">
          <el-form-item label="版本" prop="version">
            <el-input v-model="dataForm.version" auto-complete="off"></el-input>
          </el-form-item>
        </div>
        <div style="width: 49%; float:left;">
          <el-form-item label="类型" prop="type">
            <cb-dict :parentVue="this._self" placeholder="类型" name="type" dict="feedbackBigType" type="select" :dataForm="dataForm"></cb-dict>
          </el-form-item>
        </div>
        <div style="width: 98%; float:left;">
          <el-form-item label="内容" prop="content">
            <cb-editor id="content" name="content" :dataForm="dataForm" height="400"></cb-editor>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
        <el-button v-if="operation == true" :size="size" type="primary" @click.native="submitForm('saveContinue')"  :loading="editLoading">{{$t('action.saveContinue')}}</el-button>
        <el-button :size="size" type="primary" @click.native="submitForm"  :loading="editLoading">{{$t('action.preservation')}}</el-button>
      </div>
    </el-dialog>
    <!-- 轨迹 begin -->
    <el-dialog v-dialogDrag :title="viewHistory ? '更新轨迹' : '查看'"  top="5vh" width="50%" :visible.sync="dialogVisibleView" :close-on-click-modal="false">
      <div v-if="viewHistory">
        <div class="history-type">选择要查看的类型：
          <template>
            <el-radio-group v-model="radio" @change="changeRadio">
              <el-radio v-for="dict in dictList" :key="dict.dictId" :label="dict.dictCode">{{dict.dictValue}}</el-radio>
            </el-radio-group>
          </template>
        </div>
        <div class="view-items">
          <el-timeline>
            <el-timeline-item v-for="item in logListData"
              :key="item.logId"
              :timestamp="item.createTime"
              placement="top">
              <el-card>
                <h4 v-html="item.content"></h4>
                <p>{{item.createUserId}} 提交于 {{item.createTime}}</p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
      <div v-show="!viewHistory" class="view-content">
        <cb-editor id="content2" name="content2" readonly="true" toolbar="false" :dataForm="dataForm" height="400"></cb-editor>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="dialogVisibleView = false">{{$t('action.cancel')}}</el-button>
      </div>
    </el-dialog>
    <!-- end begin -->
  </div>
</template>

<script>
import CbButton from "@/views/Core/CbButton"

export default {
    components:{
      CbButton
    },
    data() {
      return {
        viewHistory:true,
        logListData: [],
        dictList: [],
        radio: '1',
        dialogVisibleView:false,

        dataTevglSiteUpdateLog: {
          type: [{ required: true, message: "类型不能为空", trigger: "blur" }],
          version: [{ required: true, message: "版本不能为空", trigger: "blur" }],
          content: [{ required: true, message: "内容不能为空", trigger: "blur" }],
        },
        size: 'small',
        filters: {
        },
        dataForm:{
          logId: '', //主键id
          type: '', //类型(1网站2小程序3app)
          version: '', //版本
          content: '', //内容
        },
        columns: [
          {prop:"type", label:"类型", minWidth:70},
          {prop:"version", label:"版本", minWidth:70, dataType:'link', callback:'linkContent'},
          //{prop:"content", label:"内容", minWidth:70},
          {prop:"createUserId", label:"创建人", minWidth:70},
          {prop:"createTime", label:"创建时间", minWidth:70},
          {prop:"updateUserId", label:"修改人", minWidth:70},
          {prop:"updateTiem", label:"修改时间", minWidth:70},
        ],
        btnColumns: [
          {icon: "fa fa-edit", label: "修改", perms: "site:tevglsiteupdatelog:edit", callback: "handleEdit"},
          {icon: "fa fa-trash", label: "删除", perms: "site:tevglsiteupdatelog:remove", callback: "handleDelete"},
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

      linkContent (params) {
        this.viewHistory = false
        this.dialogVisibleView = true
        this.$api.tevglsiteupdatelog.view(params.row.logId).then(res => {
          if (res.code == 0) {
            this.dataForm = Object.assign({}, res.data)
            tinyMCE.editors['content2'].setContent(this.dataForm.content)
          }
        })
      },

      handleView () {
        this.viewHistory = true
        this.$api.tevglsiteupdatelog.getBigType().then(res => {
          if (res.code === 0) {
            this.dictList = res.data
            this.queryLogList()
          }
        })
        this.dialogVisibleView = true
      },
      changeRadio (val) {
        this.radio = val
        this.queryLogList()
      },

      queryLogList () {
        let params = {
          pageNum: 1,
          pageSize: 1000,
          type: this.radio
        }
        this.$api.tevglsiteupdatelog.findPage(params).then((res) => {
          this.logListData = res.data.list
        }).then()
      },


      // 获取分页数据
      findPage: function (data) {
        if(data) {
          this.pageRequest = data.pageRequest
        }
        let jj = Object.assign({}, this.filters)
        jj.pageNum=this.pageRequest.pageNum;
        jj.pageSize=this.pageRequest.PageSize;
        this.$api.tevglsiteupdatelog.findPage(jj).then((res) => {
          this.pageResult = res.data
        }).then(data!=null?data.callback:'')

      },
      // 删除
      handleDelete: function (data) {
        let arr = [];
        arr.push(data.row.logId);
        this.delete(arr, data)
      },
      // 批量删除
      handleBatchDelete: function (data) {
        let arr = [];
        for (let i=0; i<data.params.length; i++){
          arr.push(data.params[i].logId);
        }
        this.delete(arr, data)
      },
      //执行删除
      delete:function(jj,darass){
        this.$confirm("确认删除选中记录吗？", "提示", {
          type: "warning",
          closeOnClickModal:false
        }).then(() => {
          this.$api.tevglsiteupdatelog.doDelete(jj).then(res => {
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
          this.$refs['dataForm'].resetFields()
        }
		    this.dataForm = {
          logId: '', //主键id
          type: '', //类型(1网站2小程序3app)
          version: '', //版本
          content: '', //内容
        }
        this.dialogVisible = true;
        this.operation = true;
        // 清空富文本
        if (tinyMCE.editors['content']) {
          tinyMCE.editors['content'].setContent('')
        }
      },
      // 显示修改界面
      handleEdit: function (params) {
		    if(this.$refs['dataForm']){
          this.$refs['dataForm'].clearValidate();
        }
        this.dialogVisible = true;
        this.operation = false; // 标识为修改
        this.$api.tevglsiteupdatelog.view(params.row.logId).then((res) => {
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
              this.$api.tevglsiteupdatelog.save(params).then((res) => {
                  if(res.code == 0) {
                    this.$message({ message: '操作成功', type: 'success' })
                    if(type == "saveContinue"){
                      // this.$refs['dataForm'].resetFields()
                      this.dataForm = {
                        logId: '', //主键id
                        type: this.dataForm.type, //类型(1网站2小程序3app)
                        version: '', //版本
                        content: '', //内容
                      }
                      if (tinyMCE.editors['content']) {
                        tinyMCE.editors['content'].setContent('')
                      }
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

  .view-content{
    margin: 15px;
  }
  .history-type{
    margin-top:25px;
  }
  .view-items{
    text-align:left;
    padding:10px 10px;
  }
</style>
