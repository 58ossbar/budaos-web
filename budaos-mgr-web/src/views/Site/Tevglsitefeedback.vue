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
	                <span>意见反馈类型</span>
	              </el-form-item>
	            </el-col>
	            <el-col :span="6">
	              <el-form-item class="dictInputQueryWidth ">
                  <cb-dict placeholder="意见反馈类型" name="feedbackType" dict="feedbackType" type="select" :filters="filters" emptyLabel="全部" :change="findPage" clearable></cb-dict>
	              </el-form-item>
	            </el-col>
	            <el-col :span="2">
	              <el-form-item class="dictInputQueryLabelWidth">
	                <span>用户类型</span>
	              </el-form-item>
	            </el-col>
	            <el-col :span="6">
	              <el-form-item class="dictInputQueryWidth ">
	                <cb-dict placeholder="用户类型" name="traineeType" dict="trainee_type" type="select" :filters="filters" emptyLabel="全部" :change="findPage" clearable></cb-dict>
	              </el-form-item>
	            </el-col>
	        </el-row>
            <el-collapse-item class="elCollapseItemNoBoeder elCollapseItemMarginBottom">
              <el-row>
	            <el-col :span="2">
	              <el-form-item class="dictInputQueryLabelWidth">
	                <span>提交人</span>
	              </el-form-item>
	            </el-col>
	            <el-col :span="6">
	              <el-form-item class="dictInputQueryWidth ">
	                <el-input  v-model="filters.traineeName" placeholder="提交人" clearable @clear="findPage"></el-input>
	              </el-form-item>
	            </el-col>

	            <el-col :span="2">
	              <el-form-item class="dictInputQueryLabelWidth">
	                <span>状态</span>
	              </el-form-item>
	            </el-col>
	            <el-col :span="6">
	              <el-form-item class="dictInputQueryWidth ">
                  <cb-dict placeholder="意见反馈类型" name="state" dict="state4" type="select" :filters="filters" emptyLabel="全部" :change="findPage" clearable></cb-dict>
	              </el-form-item>
	            </el-col>
	            <!-- <el-col :span="2">
	              <el-form-item class="dictInputQueryLabelWidth">
	                <span>是否已回复</span>
	              </el-form-item>
	            </el-col>
	            <el-col :span="6">
	              <el-form-item class="dictInputQueryWidth ">
	                <el-input  v-model="filters.hasReplied" placeholder="是否已回复" clearable @clear="findPage"></el-input>
	              </el-form-item>
	            </el-col> -->
	          </el-row>
	        </el-collapse-item>
	      </el-collapse>
          <el-row class="elDeptFormButton dictQueryCenterButton">
            <el-col :span="24">
              <cb-button icon="fa fa-search" :label="$t('action.search')" perms="site:tevglsitefeedback:query" type="primary" @click="findPage(null)"/>
            </el-col>
          </el-row>
        </el-form>
      </el-header>
      <el-main class="box_shadows bgcolor  scrollRightYDictMenu tableDict marginBottom">
        <!--表格内容栏-->
        <cb-tables :parentVue="this._self" permsBatchDelete="site:tevglsitefeedback:remove"
          :tableData="pageResult" :columns="columns" :btnColumns="btnColumns">
        </cb-tables>
      </el-main>
    </el-container>
    <!--新增修改界面-->
    <el-dialog v-dialogDrag :title="operation?'新增':'修改'"  top="5vh" width="50%" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-form :model="dataForm" label-width="100px" ref="dataForm" :rules="dataTevglSiteFeedbackReply"
               :size="size" style="margin-top: 10px">
        <div class="feedback-reply">
          <div class="feedback-reply-trainee" style="float:left;">
            <el-avatar :size="50" :src="dataForm.traineePic"></el-avatar>
            <div class="trainee-info">
              <span>{{dataForm.traineeName}}</span><el-tag key="item.label" type="info" size="mini" effect="plain">{{dataForm.traineeType}}</el-tag><br>
              <span>{{dataForm.createTime}}</span>
            </div>
          </div>
          <div class="feedback-content">{{dataForm.feedbackContent}}</div>
        </div>
        <div class="feedback-reply-content">
          <el-input ref="content"
            type="textarea"
            :rows="8"
            placeholder="在此填写回复内容..."
            v-model="dataFormReply.content">
          </el-input>
        </div>
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
import CbButton from "@/views/Core/CbButton"

export default {
    components:{
      CbButton
    },
    data() {
      return {
        dataTevglSiteFeedbackReply: {
          content: [{ required: true, message: "回复内容不能为空", trigger: "blur" }],
        },
        size: 'small',
        filters: {
        },
        dataForm:{
          feedbackId: '', //意见反馈id
          type: '', //类型(1网站2小程序3app)
          feedbackType: '', //意见反馈类型(1功能异常2体验问题3新功能建议4其它)
          feedbackContent: '', //内容
          state: '', //状态(Y有效N无效)
          hasReplied: '', //是否已回复(Y已回复N未回复)
          traineeId:'',
          traineeName:'',
          traineePic:''
        },
        dataFormReply: {
          replyId: '',
          feedbackId:'',
          content: ''
        },
        columns: [
          {prop:"traineePic", label:"头像", minWidth:70, dataType:'image'},
          {prop:"type", label:"类型", minWidth:40},
          {prop:"feedbackType", label:"意见反馈类型", minWidth:70},
          {prop:"feedbackContent", label:"内容", minWidth:150},
          {prop:"traineeName", label:"提交人", minWidth:70},
          {prop:"createTime", label:"提交时间", minWidth:70},
          {prop:"traineeType", label:"用户类型", minWidth:70},
          //{prop:"state", label:"状态", minWidth:70},
          {prop:"hasReplied", label:"回复状态", minWidth:70},
        ],
        btnColumns: [
          {icon: "fa fa-edit", label: "回复", perms: "site:tevglsitefeedback:edit", callback: "handleEdit"},
          {icon: "fa fa-trash", label: "删除", perms: "site:tevglsitefeedback:remove", callback: "handleDelete"},
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
        }
        let jj = Object.assign({}, this.filters)
        jj.pageNum=this.pageRequest.pageNum;
        jj.pageSize=this.pageRequest.PageSize;
        this.$api.tevglsitefeedback.findPage(jj).then((res) => {
          this.pageResult = res.data
        }).then(data!=null?data.callback:'')

      },
      // 删除
      handleDelete: function (data) {
        let arr = [];
        arr.push(data.row.feedbackId);
        this.delete(arr, data)
      },
      // 批量删除
      handleBatchDelete: function (data) {
        let arr = [];
        for (let i=0; i<data.params.length; i++){
          arr.push(data.params[i].feedbackId);
        }
        this.delete(arr, data)
      },
      //执行删除
      delete:function(jj,darass){
        this.$confirm("确认删除选中记录吗？", "提示", {
          type: "warning",
          closeOnClickModal:false
        }).then(() => {
          this.$api.tevglsitefeedback.doDelete(jj).then(res => {
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
      // 显示修改界面
      handleEdit: function (params) {
		    if(this.$refs['dataForm']){
          this.$refs['dataForm'].clearValidate();
        }
        this.dialogVisible = true;
        this.operation = false; // 标识为修改
        this.dataForm = Object.assign({}, params.row)
        this.dataFormReply.feedbackId = params.row.feedbackId
        this.$api.tevglsitefeedbackreply.viewFeedbackReplyInfo({feedbackId:params.row.feedbackId}).then(res => {
          if (res.code === 0) {
            if (res.data.length > 0) {
              this.dataFormReply = Object.assign({}, res.data[0])
            }
          }
        })
      },
      // 修改
      submitForm: function (type) {
        if (!this.dataFormReply.content) {
          this.$message({ message: '请填写回复内容', type: 'warning' })
          this.$refs.content.focus()
          return false
        }
        this.$refs.dataForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true;
              this.dialogVisible = type == "saveContinue";
              let params = Object.assign({}, this.dataFormReply);
              this.$api.tevglsitefeedbackreply.save(params).then((res) => {
                  if(res.code == 0) {
                    this.$message({ message: '操作成功', type: 'success' })
                    if(type == "saveContinue"){
                      this.$refs['dataFormReply'].resetFields()
                    }
                  } else {
                    this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                  }
                  this.editLoading = false
                  if (this.$refs['dataFormReply']) {
                    this.$refs['dataFormReply'].resetFields()
                  }
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
  .feedback-reply{
    width: 98%;
    float:left;
    text-align: left;
  }
  .feedback-reply-trainee{
    padding: 10px;
  }

  .trainee-info{
    float:right;
    padding:3px 10px;
  }
  .feedback-content{
    float:left;
    padding-top:12px;
  }

  .feedback-reply-content {
    width: 98%; float:left;
    padding-left:10px;
    padding-bottom:10px;
  }

</style>
