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
                  <span>所属分类</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item class="dictInputQueryWidth ">
                  <cb-dict placeholder="首页显示" name="type" dict="video_type" type="select" :filters="filters" :change="findPage" empty-label="全部"></cb-dict>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-form-item class="dictInputQueryLabelWidth">
                  <span>视频标题</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item class="dictInputQueryWidth ">
                  <el-input  v-model="filters.title" placeholder="请输入视频标题" clearable @clear="findPage"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-form-item class="dictInputQueryLabelWidth">
                  <span>文件后缀</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item class="dictInputQueryWidth ">
                  <el-input  v-model="filters.fileSuffix" placeholder="文件后缀" clearable @clear="findPage"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
	        </el-collapse>
          <el-row class="elDeptFormButton dictQueryCenterButton">
            <el-col :span="24">
              <cb-button icon="fa fa-search" :label="$t('action.search')" perms="site:tevglsitevideo:query" type="primary" @click="findPage(null)"/>
              <cb-button icon="fa fa-plus" :label="$t('action.add')" perms="site:tevglsitevideo:add" type="primary" @click="handleAdd" />
            </el-col>
          </el-row>
        </el-form>
      </el-header>
      <el-main class="box_shadows bgcolor  scrollRightYDictMenu tableDict marginBottom">
        <!--表格内容栏-->
        <cb-tables :parentVue="this._self" permsBatchDelete="site:tevglsitevideo:delete"
          :tableData="pageResult" :columns="columns" :btnColumns="btnColumns">
        </cb-tables>
      </el-main>
    </el-container>
    <!--新增修改界面-->
    <el-dialog v-dialogDrag :title="operation?'新增':'修改'"  top="5vh" width="60%" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-form :model="dataForm" label-width="100px" ref="dataForm" :rules="dataTevglSiteVideo"
               :size="size" style="margin-top: 10px">
        <div style="width: 49%; float:left;">
          <el-form-item label="所属分类" prop="type">
            <cb-dict :parentVue="this._self" placeholder="所属分类" name="type" dict="video_type" type="select" :dataForm="dataForm"></cb-dict>
          </el-form-item>
          <el-form-item label="职业路径" prop="majorId">
            <cb-tree :parentVue="this._self" url="/api/book/tevglbookmajor/queryForTree" isMult="true" :dataForm="dataForm" placeholder="请选择所属职业路径" name="majorId" prop='{"id": "majorId", "name": "majorName"}'></cb-tree>
          </el-form-item>
          <el-form-item label="视频标题" prop="title">
            <el-input v-model="dataForm.title" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model="dataForm.remark" auto-complete="off" :rows="5"></el-input>
          </el-form-item>
        </div>
        <div style="width: 49%; float:left;">
          <el-form-item class="upload-btn" label="视频文件" prop="file">
            <input id="video-demo" type="file" name="video" accept="video/*" @change="changeFile($event)" style="display: none" />
            <el-button type="primary" size="mini" @click="clickBtn">选择视频文件<i class="el-icon-upload el-icon--right"></i></el-button>
            <video id="video" class="video" src="" controls width="300" height="220" style="display: none"></video>
          </el-form-item>
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
import {baseUrl} from '../../utils/global'

export default {
    components:{
      CbButton
    },
    data() {
      return {
        dataTevglSiteVideo: {
          majorId: [{ required: true, message: "职业路径不能为空", trigger: "blur" }],
          originalFilename: [{ required: true, message: "源名称不能为空", trigger: "blur" }],
          type: [{ required: true, message: "所属分类不能为空", trigger: "blur" }],
          file: [{ required: true, message: "请选择视频", trigger: "blur" }],
        },
        size: 'small',
        filters: {},
        dataForm:{
          videoId: '', //主键id
          title: '', //标题
          name: '', //名称（uuid组成）
          remark: '', //备注
          majorId: '',
          type: '2',
          file: ''
        },
        columns: [
          {prop:"title", label:"标题", minWidth:70, dataType: 'link', callback: 'linkVideo'},
          {prop:"originalFilename", label:"源名称", minWidth:70},
          {prop:"type", label:"所属分类", minWidth:70},
          {prop:"fileSuffix", label:"文件后缀", minWidth:70},
          {prop:"createTime", label:"创建时间", minWidth:70},
          {prop:"sysCreateUserId", label:"创建人", minWidth:70}
        ],
        btnColumns: [
          {icon: "fa fa-edit", label: "修改", perms: "site:tevglsitevideo:edit", callback: "handleEdit"},
          {icon: "fa fa-trash", label: "删除", perms: "site:tevglsitevideo:delete", callback: "handleDelete"},
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
      linkVideo(item) {
        window.open(baseUrl + item.row.name)
      },
      clickBtn () {
        document.getElementById('video-demo').click()
      },
      changeFile (e) {
        let file = e.target.files[0]
        if (file) {
          if (file.size > 1024 * 1024 * 300) {
            this.$message.warning('选择的视频文件大小超过300MB，不允许上传')
            return false
          }
          let video = document.querySelector('#video')
          video.src = URL.createObjectURL(file)
          video.style.display = 'block'
          this.dataForm.title = file.name
          this.dataForm.file = file
          this.$refs['dataForm'].clearValidate('file')
        }
      },
      // 获取分页数据
      findPage: function (data) {
        if(data) {
          this.pageRequest = data.pageRequest
        }
        let jj = Object.assign({}, this.filters)
        jj.pageNum=this.pageRequest.pageNum;
        jj.pageSize=this.pageRequest.PageSize;
        this.$api.tevglSiteVideo.findPage(jj).then((res) => {
          this.pageResult = res.data
        }).then(data!=null?data.callback:'')

      },
      // 删除
      handleDelete: function (data) {
        let arr = [];
        arr.push(data.row.videoId);
        arr.push(data.row.title);
        this.delete(arr, data)
      },
      // 批量删除
      handleBatchDelete: function (data) {
        let arr = [];
        for (let i=0; i<data.params.length; i++){
          arr.push(data.params[i].videoId);
          arr.push(data.params[i].title);
        }
        this.delete(arr, data)
      },
      //执行删除
      delete:function(jj,darass){
        this.$confirm("确认删除选中记录吗？", "提示", {
          type: "warning",
          closeOnClickModal:false
        }).then(() => {
          this.$api.tevglSiteVideo.doDelete(jj).then(res => {
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
        this.dataForm = {
          videoId: '', //主键id
          title: '', //标题
          name: '', //名称（uuid组成）
          remark: '', //备注
          majorId: '',
          type: '2',
          file: ''
        }
        let video = document.querySelector('#video')
        if (video) {
          video.src = ''
          video.style.display = 'none'
        }
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
        this.$api.tevglSiteVideo.view(params.row.videoId).then((res) => {
          if (res.code == 0){
            this.dataForm = Object.assign({}, res.data);
            this.dataForm.name = baseUrl + '/uploads/auxiliary-teaching-video/' + res.data.name
            let video = document.querySelector('#video')
            video.src = this.dataForm.name
            video.style.display = 'block'
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
              const formData = new FormData()
              formData.append('file', this.dataForm.file)
              formData.append('videoId', this.dataForm.videoId)
              formData.append('title', this.dataForm.title)
              formData.append('type', this.dataForm.type)
              formData.append('majorIdList', this.dataForm.majorId)
              formData.append('remark', this.dataForm.remark)
              this.$api.tevglSiteVideo.save(formData).then((res) => {
                  if(res.code == 0) {
                    this.$message({ message: '操作成功', type: 'success' })
                    if (type == "saveContinue"){
                      this.dataForm = {
                        videoId: '', //主键id
                        title: '', //标题
                        name: '', //名称（uuid组成）
                        remark: '', //备注
                        majorId: '',
                        type: '2',
                        file: ''
                      }
                    }
                  } else {
                    this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                  }
                  this.editLoading = false
                  this.editDialogVisible = false
                  this.findPage()
                  let video = document.querySelector('#video')
                  if (video) {
                    video.src = ''
                    video.style.display = 'none'
                  }
                }).catch(() => {
                  let video = document.querySelector('#video')
                  if (video) {
                    video.src = ''
                    video.style.display = 'none'
                  }
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
.upload-btn{
  text-align: left;
}
</style>
