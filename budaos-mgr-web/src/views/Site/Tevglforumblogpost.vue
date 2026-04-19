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
                  <span>博主</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item class="dictInputQueryWidth ">
                  <el-input  v-model="filters.traineeName" placeholder="" clearable @clear="findPage"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-form-item class="dictInputQueryLabelWidth">
                  <span>标题</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item class="dictInputQueryWidth ">
                  <el-input  v-model="filters.postTitle" placeholder="" clearable @clear="findPage"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-form-item class="dictInputQueryLabelWidth">
                  <span>技术标签</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item class="dictInputQueryWidth ">
                  <cb-dict placeholder="技术标签" name="dictCode" dict="subjectType" type="select" empty-label="全部" clearable :filters="filters" :change="findPage" ></cb-dict>
                </el-form-item>
              </el-col>
            </el-row>
            <el-collapse-item class="elCollapseItemNoBoeder elCollapseItemMarginBottom">
            <el-row>
              <el-col :span="2">
                <el-form-item class="dictInputQueryLabelWidth">
                  <span>文章标签</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item class="dictInputQueryWidth ">
                  <el-input  v-model="filters.postLable" placeholder="文章标签" clearable @clear="findPage"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-form-item class="dictInputQueryLabelWidth">
                  <span>发表时间</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item class="dictInputQueryWidth ">
                  <el-date-picker
                    v-model="value2"
                    type="daterange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptions">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
	        </el-collapse-item>
	        </el-collapse>
          <el-row class="elDeptFormButton dictQueryCenterButton">
            <el-col :span="24">
              <cb-button icon="fa fa-search" :label="$t('action.search')" perms="forum:tevglforumblogpost:query" type="primary" @click="findPage(null)"/>
              <cb-button icon="fa fa-plus" :label="$t('action.add')" perms="forum:tevglforumblogpost:add" type="primary" @click="handleAdd" />
            </el-col>
          </el-row>
        </el-form>
      </el-header>
      <el-main class="box_shadows bgcolor  scrollRightYDictMenu tableDict marginBottom">
        <!--表格内容栏-->
        <cb-tables :parentVue="this._self" permsBatchDelete="forum:tevglforumblogpost:delete"
          :tableData="pageResult" :columns="columns" :btnColumns="btnColumns">
        </cb-tables>
      </el-main>
    </el-container>
    <!--新增修改界面-->
    <el-dialog v-dialogDrag title="详情"  top="5vh" width="60%" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-form :model="dataForm" label-width="100px" ref="dataForm" :rules="dataTevglForumBlogPost"
               :size="size" style="margin-top: 10px">
        <div class="floating-all">
          <el-form-item label="内容" prop="postContent">
            <cb-editor id="postContent" name="postContent" :dataForm="dataForm" :parentVue="this._self" readonly="true" toolbar="false"></cb-editor>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
        <!--<el-button v-if="operation == true" :size="size" type="primary" @click.native="submitForm('saveContinue')"  :loading="editLoading">{{$t('action.saveContinue')}}</el-button>
        <el-button :size="size" type="primary" @click.native="submitForm"  :loading="editLoading">{{$t('action.preservation')}}</el-button>-->
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CbButton from "@/views/Core/CbButton"
import {baseUrl} from "@/utils/global";

export default {
    components:{
      CbButton
    },
    data() {
      return {
        value2: '',
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
        dataTevglForumBlogPost: {
          traineeId: [{ required: true, message: "博主不能为空", trigger: "blur" }],
          subjectId: [{ required: true, message: "所属课程不能为空", trigger: "blur" }],
          postTitle: [{ required: true, message: "主题不能为空", trigger: "blur" }],
          postContent: [{ required: true, message: "内容不能为空", trigger: "blur" }],
          postLable: [{ required: true, message: "文章标签不能为空", trigger: "blur" }],
          postTime: [{ required: true, message: "发表时间不能为空", trigger: "blur" }],
          postIsReply: [{ required: true, message: "是否可评论不能为空", trigger: "blur" }],
          postIsRecommend: [{ required: true, message: "是否推荐不能为空", trigger: "blur" }],
          postIsChoice: [{ required: true, message: "是否精选不能为空", trigger: "blur" }],
          postIsStick: [{ required: true, message: "是否置顶不能为空", trigger: "blur" }],
          postStickSort: [{ required: true, message: "置顶排序号不能为空", trigger: "blur" }],
          postIsResolve: [{ required: true, message: "是否已解决不能为空", trigger: "blur" }],
          viewNum: [{ required: true, message: "查阅数不能为空", trigger: "blur" }],
          storeNum: [{ required: true, message: "收藏数不能为空", trigger: "blur" }],
          replyNum: [{ required: true, message: "回复数不能为空", trigger: "blur" }],
          likeNum: [{ required: true, message: "点赞数不能为空", trigger: "blur" }],
          reportNum: [{ required: true, message: "举报数不能为空", trigger: "blur" }],
          lastReplyTrainee: [{ required: true, message: "最近回复人不能为空", trigger: "blur" }],
          lastReplyTime: [{ required: true, message: "最近回复时间不能为空", trigger: "blur" }],
          state: [{ required: true, message: "状态(Y正常N删除)不能为空", trigger: "blur" }],
          blogId: [{ required: true, message: "博客ID不能为空", trigger: "blur" }],
          blogType: [{ required: true, message: "版块ID不能为空", trigger: "blur" }],
          dictCode: [{ required: true, message: "技术标签，来源字典不能为空", trigger: "blur" }],
          updateTime: [{ required: true, message: "updateTime不能为空", trigger: "blur" }],
        },
        size: 'small',
        filters: {
        },
        dataForm:{
          postId: '', //主键ID
          traineeId: '', //博主
          subjectId: '', //所属课程
          postTitle: '', //主题
          postContent: '', //内容
          postLable: '', //文章标签
          postTime: '', //发表时间
          postIsReply: '', //是否可评论
          postIsRecommend: '', //是否推荐
          postIsChoice: '', //是否精选
          postIsStick: '', //是否置顶
          postStickSort: '', //置顶排序号
          postIsResolve: '', //是否已解决
          viewNum: '', //查阅数
          storeNum: '', //收藏数
          replyNum: '', //回复数
          likeNum: '', //点赞数
          reportNum: '', //举报数
          lastReplyTrainee: '', //最近回复人
          lastReplyTime: '', //最近回复时间
          state: '', //状态(Y正常N删除)
          blogId: '', //博客ID
          blogType: '', //版块ID
          dictCode: '', //技术标签，来源字典
          updateTime: '', //updateTime
        },
        columns: [
          {prop:"traineePic", label:"头像", minWidth:70, dataType: "image"},
          {prop:"traineeName", label:"博主", minWidth:70},
          //{prop:"subjectId", label:"所属课程", minWidth:70},
          {prop:"postTitle", label:"标题", minWidth:250, dataType: 'link', callback: 'linkClick'},
          //{prop:"postContent", label:"内容", minWidth:70},
          {prop:"postLable", label:"技术标签", minWidth:120},
          {prop:"postTime", label:"发表时间", minWidth:70},
          /*{prop:"postIsReply", label:"是否可评论", minWidth:70},
          {prop:"postIsRecommend", label:"是否推荐", minWidth:70},
          {prop:"postIsChoice", label:"是否精选", minWidth:70},
          {prop:"postIsStick", label:"是否置顶", minWidth:70},
          {prop:"postStickSort", label:"置顶排序号", minWidth:70},
          {prop:"postIsResolve", label:"是否已解决", minWidth:70},*/
          {prop:"viewNum", label:"查阅数", minWidth:70},
          //{prop:"storeNum", label:"收藏数", minWidth:70},
          //{prop:"replyNum", label:"回复数", minWidth:70},
          {prop:"likeNum", label:"点赞数", minWidth:70},
          /*{prop:"reportNum", label:"举报数", minWidth:70},
          {prop:"lastReplyTrainee", label:"最近回复人", minWidth:70},
          {prop:"lastReplyTime", label:"最近回复时间", minWidth:70},
          {prop:"state", label:"状态(Y正常N删除)", minWidth:70},
          {prop:"blogId", label:"博客ID", minWidth:70},
          {prop:"blogType", label:"版块ID", minWidth:70},
          {prop:"dictCode", label:"技术标签，来源字典", minWidth:70},
          {prop:"updateTime", label:"updateTime", minWidth:70},*/
        ],
        btnColumns: [
          {icon: "fa fa-edit", label: "修改", perms: "forum:tevglforumblogpost:edit", callback: "handleEdit"},
          {icon: "fa fa-trash", label: "删除", perms: "forum:tevglforumblogpost:delete", callback: "handleDelete"},
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
      linkClick(params) {
        this.dialogVisible = true
        this.$api.tevglforumblogpost.view(params.row.postId).then((res) => {
          if (res.code == 0){
            this.dataForm = Object.assign({}, res.data);
          }
        });
      },
      // 获取分页数据
      findPage: function (data) {
        if(data) {
          this.pageRequest = data.pageRequest
        }
        let jj = Object.assign({}, this.filters)
        jj.pageNum=this.pageRequest.pageNum;
        jj.pageSize=this.pageRequest.PageSize;
        if (this.value2 && this.value2.length === 2) {
          jj.beginTime = this.value2[0] + ' 00:00:00'
          jj.endTime = this.value2[1] + ' 23:59:59'
        }
        this.$api.tevglforumblogpost.findPage(jj).then((res) => {
          res.data.list.forEach(item => {
            if (item.traineePic) {
              if (item.traineePic.indexOf('https') === -1 && item.traineePic.indexOf('http') === -1) {
                item.traineePic = baseUrl + item.traineePic
              }
            }
          })
          this.pageResult = res.data
        }).then(data!=null?data.callback:'')

      },
      // 删除
      handleDelete: function (data) {
        let arr = [];
        arr.push(data.row.postId);
        this.delete(arr, data)
      },
      // 批量删除
      handleBatchDelete: function (data) {
        let arr = [];
        for (let i=0; i<data.params.length; i++){
          arr.push(data.params[i].postId);
        }
        this.delete(arr, data)
      },
      //执行删除
      delete:function(jj,darass){
        this.$confirm("确认删除选中记录吗？此操作将永久删除数据！", "提示", {
          type: "warning",
          closeOnClickModal:false
        }).then(() => {
          this.$api.tevglforumblogpost.doDelete(jj).then(res => {
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
        });
      },
      // 显示新增界面
      handleAdd: function () {
		if(this.$refs['dataForm']){
          this.$refs['dataForm'].clearValidate();
        }
        this.dataForm = {}
        this.dialogVisible = true;
        this.operation = true;
      },
      // 显示修改界面
      handleEdit: function (params) {
		if(this.$refs['dataForm']){
          this.$refs['dataForm'].clearValidate();
        }
        this.dialogVisible = true;
        this.operation = false; // 标识为修改
        this.$api.tevglforumblogpost.view(params.row.postId).then((res) => {
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
              this.$api.tevglforumblogpost.save(params).then((res) => {
                  if(res.code == 0) {
                    this.$message({ message: '操作成功', type: 'success' })
                    if(type == "saveContinue"){
                      this.dataForm = {}
                    }
                  } else {
                    this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                  }
                  this.editLoading = false
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
