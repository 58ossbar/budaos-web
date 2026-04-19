<template>
  <div  class="page-container" >
    <el-container class="page-container scrollAllY">
       <!-- class="box_shadows bgcolor  scrollRightYDictMenu "  -->

      <el-header style="height: auto;">
        <el-tabs v-model="filters.type" @tab-click="handleClick">
          <el-tab-pane label="图片" name="image"></el-tab-pane>
          <el-tab-pane label="音频" name="voice"></el-tab-pane>
          <el-tab-pane label="视频" name="video"></el-tab-pane>
        </el-tabs>
      </el-header>

      <el-main class="box_shadows bgcolor  scrollRightYDictMenu tableDict marginBottom">

        <div class="sourceMaterialTopWrap">
          <h3>
            <span>{{filters.type == 'voice'?('音频'):(filters.type == 'video'?('视频'):('图片'))}}</span>
            <span>（共{{totalCount}}条）</span>
          </h3>
          <div class="sourceMaterialTopRightWrap">
            <el-input v-show="filters.type == 'voice' || filters.type == 'video'" size="mini" class="sourceMaterialTopInput" v-model="filters.title" :placeholder="'搜索' + (filters.type == 'voice'?('音频'):(filters.type == 'video'?('视频'):('图片')))" clearable @clear="clearClick" @keyup.enter.native="keyupEnterClick" @keyup.delete.native="keyupDeleteClick" @keyup.space.native="keyupSpaceClick">
              <i slot="suffix" class="el-input__icon el-icon-search" @click="keyupEnterClick"></i>
            </el-input>

            <cb-button :label="'上传' + (filters.type == 'voice'?('音频'):(filters.type == 'video'?('视频'):('图片')))" perms="site:tevglsiteupdatelog:query" type="primary" @click="toClickUploadBtn"/>

          </div>
        </div>
        <!--表格栏-->
        <el-table :data="tableList" style="width: 100%" size="small" highlight-current-row @row-click="rowClick" @selection-change="selectionChange" ref="sourceMaterialTableRef" v-loading="loading">

          <!--checkbox列-->
          <el-table-column type="selection" width="45"></el-table-column>

          <!--数据列   width="155" prop="url"   key="url" header-align="center" align="center" -->
          <el-table-column label="名称" :sortable="true" prop="name" key="name">
            <template slot-scope="scope">
              <div class="sourceMaterialTableCustomColumnWrap">
                <!-- :ref="'imageByTable'+scope.$index" -->
                <el-image v-if="filters.type == 'image'" class="sourceMaterialTableImg" :src="scope.row.url" fit="cover" :preview-src-list="[scope.row.url]" @click="handleLink($event,scope.$index,scope.row,'image')" ></el-image>

                <!-- <div class="sourceMaterialTableVoice" > -->
                <div class="sourceMaterialTableVoiceInner" v-if="filters.type == 'voice'" @click="handleLink($event,scope.$index,scope.row,'voice')">
                  <el-image v-if="scope.row.isPlay" class="sourceMaterialTableVoiceInnerImg" :src="require('@/assets/my/audioPlay.gif')" ></el-image>
                  <el-image v-else class="sourceMaterialTableVoiceInnerImg" :src="require('@/assets/my/audioPause.png')" ></el-image>
                </div>
                <!-- </div> -->

                <div class="sourceMaterialTableVideoInner" v-if="filters.type == 'video'" @click="handleLink($event,scope.$index,scope.row,'video')">
                  <el-image v-if="scope.row.cover_url"  :src="scope.row.cover_url" class="sourceMaterialTableVideoInnerImg"></el-image>
                  <i class="el-icon-video-play"></i>
                </div>

                <div class="sourceMaterialTableCustomColumnRightWrap">
                  <el-tooltip effect="dark" :content="scope.row.name" placement="top">
                    <span class="hide_double">{{scope.row.name}}</span>
                  </el-tooltip>
                  <!-- 音频或者视频时长 -->
                  <div v-if="scope.row.duration && (filters.type == 'voice' || filters.type == 'video')">{{scope.row.duration}}</div>
                </div>
              </div>




              <!-- <div v-if="filters.type == 'voice'" class="sourceMaterialTableVoice">
                <i class="el-icon-microphone"></i>
                <div>
                  <p>管理后台不支持预览</p>
                  <p>微信中可正常播放</p>
                </div>
              </div> -->

              <!-- <div v-if="filters.type == 'video'"  class="sourceMaterialTableVideo">
                <i class="el-icon-video-camera"></i>
              </div> -->
              <!-- <video v-if="filters.type == 'video'" width="130" height="60" :src="scope.row.cover_url"></video> -->

            </template>
          </el-table-column>
          <!-- <el-table-column header-align="center" align="center" prop="name" label="名称" key="name" :sortable="true" :show-overflow-tooltip="true">
          </el-table-column> -->
          <el-table-column header-align="center" align="center" prop="updateTimeStr" label="时间" key="updateTimeStr" :sortable="true" width="155" :show-overflow-tooltip="true"></el-table-column>

          <!--操作列-->
          <el-table-column :label="$t('action.operation')" width="155" fixed="right" header-align="center" align="center">
            <template slot-scope="scope" >
              <cb-button icon="fa fa-trash" label="删除" perms="site:tevglsiteupdatelog:remove" type="primary"
                    class="editButtonPost" @click="handleDelete($event,scope.$index,scope.row)"/>
            </template>
          </el-table-column>
        </el-table>
        <!--分页栏-->
        <div class="toolbar" style="padding:10px;margin-bottom: 20px;margin-top: 10px">
          <cb-button size="small" type="primary" :label="$t('action.batchDelete')" style="float:left;" perms="site:tevglsiteupdatelog:remove" v-if="this.selections.length > 0"
            @click="handleBatchDelete"/>

          <el-pagination  @current-change="handleCurrentChange"
                          @size-change="handleSizeChange"
                          :current-page="pageRequest.pageNum" :page-sizes="pageRequest.pageSizes"
                          :page-size="pageRequest.pageSize"
                          layout="total, sizes, prev, pager, next, jumper"
                          :total="totalCount" style="float:right;">
          </el-pagination>
        </div>

      </el-main>
    </el-container>

    <!--新增修改界面-->
    <el-dialog v-dialogDrag :title="'上传' + (filters.type == 'voice'?('音频'):(filters.type == 'video'?('视频'):('图片')))" top="5vh" width="60%" :visible.sync="dialogVisible" :close-on-click-modal="false" @close="dialogClose">
      <!-- :rules="dataFormRules" -->
      <el-form :model="dataForm" class="sourceMaterialAddWrap" label-width="60px" ref="dataForm"  :size="size">
        <el-form-item v-if="filters.type == 'voice' || filters.type == 'video'" label="标题" prop="title" :rules="[{ required: true, message: '标题不能为空', trigger: ['blur','change'] }]">
          <el-input v-model="dataForm.title" auto-complete="off" autofocus></el-input>
        </el-form-item>

        <el-form-item v-if="filters.type == 'voice' || filters.type == 'video'" label="描述" prop="introduction" :rules="[{ required: true, message: '描述不能为空', trigger: ['blur','change'] }]">
          <el-input v-model="dataForm.introduction" class="handle-font" type="textarea" :rows="3" auto-complete="off" name="introduction"></el-input>
        </el-form-item>

        <!-- <el-form-item label="文件" prop="file" :rules="[{ required: true, message: '文件不能为空', trigger: ['blur','change'] }]">
          、、、   :disabled="dataForm.fileList && dataForm.fileList.length > 1"
          、、、   :limit="1"
          <el-upload class="sourceMaterialAddUploadWrap" :action="action" ref="sourceMaterialUploadRef" :auto-upload="false"  list-type="picture" :before-upload="handleBeforeUpload" :file-list="dataForm.fileList" :on-change="handleChange" :data="dataObjByUpload" :http-request="handleHttpRequest">
            <el-button size="small" type="primary">点击上传</el-button>
            <div class="el-upload__tip" slot="tip" v-show="filters.type == 'image'">大小不超过10M</div>
            <div class="el-upload__tip" slot="tip" v-show="filters.type == 'voice'">格式支持mp3、wma、wav、amr、m4a，文件大小不超过200M，音频时长不超过2小时</div>
            <div class="el-upload__tip" slot="tip" v-show="filters.type == 'video'">视频时长不超过1小时，支持主流的 视频格式</div>
          </el-upload>
        </el-form-item> -->


         <el-form-item label="文件" prop="file" :rules="[{ required: true, message: '文件不能为空', trigger: ['blur','change'] }]">
          <!-- :disabled="dataForm.fileList && dataForm.fileList.length > 1" -->
          <!-- :limit="1"    -->
          <el-upload drag class="sourceMaterialAddUploadCustomWrap" :action="action" ref="sourceMaterialUploadRef" :auto-upload="false"  list-type="picture" :before-upload="handleBeforeUpload" :file-list="dataForm.fileList" :on-change="handleChange" :data="dataObjByUpload" :http-request="handleHttpRequest" :show-file-list="false">
            <!-- <div class=""></div> -->

            <div v-if="dataForm.fileList && dataForm.fileList[0]" class="sourceMaterialAddUploadInner">
              <el-image class="sourceMaterialAddUploadInnerImg" :src="dataForm.fileList[0].url"></el-image>
              <div class="sourceMaterialAddUploadInnerLabel hide_double">{{dataForm.fileList[0].name || ''}}</div>
              <i class="el-icon-close" @click.stop="handleRemove"></i>
            </div>

            <div v-else class="sourceMaterialAddUploadIcon">
              <i class="el-icon-upload" ></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </div>

            <div class="el-upload__tip" slot="tip" v-show="filters.type == 'image'">大小不超过10M</div>
            <div class="el-upload__tip" slot="tip" v-show="filters.type == 'voice'">格式支持mp3、wma、wav、amr、m4a，文件大小不超过200M，音频时长不超过2小时</div>
            <div class="el-upload__tip" slot="tip" v-show="filters.type == 'video'">视频时长不超过1小时，支持主流的 视频格式</div>
          </el-upload>

        </el-form-item>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
        <el-button :size="size" type="primary" @click.native="submitForm('saveContinue')"  :loading="editLoading">{{$t('action.saveContinue')}}</el-button>
        <el-button :size="size" type="primary" @click.native="submitForm"  :loading="editLoading">{{$t('action.preservation')}}</el-button>
      </div>
    </el-dialog>

    <!-- 预览图片 -->
    <el-dialog v-dialogDrag :title="'预览' + (dialogByPreviewInfo.type == 'voice'?('音频'):(dialogByPreviewInfo.type == 'video'?('视频'):('图片')))" top="5vh" width="60%" :visible.sync="dialogByPreviewVisible" @close="dialogByPreviewClose">
      <video v-if="dialogByPreviewInfo.type == 'video'" :src="dialogByPreviewInfo.url" :poster="dialogByPreviewInfo.poster || ''"  controls class="dialogByPrevVideo" id="dialogByPrevVideoId">
          您的浏览器不支持 video 标签。
      </video>
      <audio v-if="dialogByPreviewInfo.type == 'voice'" :src="dialogByPreviewInfo.url" :poster="dialogByPreviewInfo.poster || ''"  controls class="dialogByPrevVideo" id="dialogByPrevAudioId">
          您的浏览器不支持 audio 标签。
      </audio>
      <el-image v-else class="dialogByPrevImg" :src="dialogByPreviewInfo.url" fit="contain" :preview-src-list="[dialogByPreviewInfo.url]" ></el-image>

    </el-dialog>

  </div>
</template>

<script>
import CbButton from "@/views/Core/CbButton";
import {baseUrl} from "@/utils/global";

export default {
    components:{
      CbButton
    },
    data() {
      return {
        dialogByPreviewVisible:false,//预览图片弹窗 是否显示
        dialogByPreviewInfo:{
          url:'',
          type:''
        },//预览图片弹窗 的 信息
        action: baseUrl + '/api/wx/material/upload',
        filters: {
          title:'',//搜索的名称
          type: 'image',
          // 从全部素材的该偏移位置开始返回，0表示从第一个素材 返回
          offset: 0,
          // 返回素材的数量，取值在1到20之间
          count: 10
        },
         // 分页信息
        pageRequest: {
          PageSize: 10,//一页显示几条  limit
          pageNum: 1,//当前页码  page
          pageSizes:[10, 20],
        },
        totalCount:0,
        tableList:[],//表格数据
        loading: false,  // 加载标识
        selections: [],  // 列表选中列
        dialogVisible: false, // 上传弹窗 是否显示
        dataForm:{},// 表单 数据
        dataFormInit:{
          title:'',//标题
          introduction:'',//描述
          url:'',//文件路径
          file:'',//上传的文件
          fileList:[],//上传的文件列表
          dataObj:{},// 上传时附带的额外参数
          isSaveContinue:false,//是否点击了 保存并继续
        },// 表单 初始 数据
        dataFormRules: {
          title: [{ required: true, message: "标题不能为空", trigger: "blur" }],
          introduction: [{ required: true, message: "描述不能为空", trigger: "blur" }],
          file: [{ required: true, message: "文件不能为空", trigger: "blur" }],
        },//表单验证规则
        size: 'small',
        editLoading: false,
        audio:null,//音频播放 器
      }
    },
    watch: {
    },
    computed:{
      dataObjByUpload: function(){
        let params = {
          type: this.filters.type
        };
        if (this.filters.type == 'voice' || this.filters.type == 'video') {
          params.title = this.dataForm.title;
          params.introduction = this.dataForm.introduction;
        }
        return params
      }
    },
    methods: {
      // 表格 图片 点击预览
      handleLink (event,index,row,type) {
        if (!row || !row.url) {
          this.$message.warning('管理后台不支持预览，微信中可正常播放！')
          return false;
        }
        // if (type == 'image') {
        //   this.dialogByPreviewVisible = true;
        //   this.dialogByPreviewInfo.url = row.url;
        //   this.dialogByPreviewInfo.type = type;
        //   // 使用element ui 的 image组件的 点击预览效果 进行 图片的 预览
        //   // this.$refs['imageByTable' + index].showViewer = true
        // } else if (type == 'video') {
          this.dialogByPreviewVisible = true;

          this.dialogByPreviewInfo.url = row.url; //'https://www.budaos.com/bds//uploads/auxiliary-teaching-video/dbaabed4b809453eb99504789b46737d.mp4'; //

          this.dialogByPreviewInfo.type = type;

          this.dialogByPreviewInfo.poster = row.cover_url || '';

          // document.getElementById('dialogByPrevVideoId').load();
        // } else if (type == 'voice') {
        //   let url = row.url;
        //   this.audio = new Audio(url);
        //   audio.play();
        // }
      },
      // 预览弹窗 关闭 事件
      dialogByPreviewClose () {
        this.dialogByPreviewVisible = false;
        if (this.dialogByPreviewInfo.type == 'video') {
          let video = document.getElementById('dialogByPrevVideoId');
          video.currentTime = 0;
          video.pause();
        } else  if (this.dialogByPreviewInfo.type == 'voice') {
          let video = document.getElementById('dialogByPrevAudioId');
          video.currentTime = 0;
          video.pause();
        }
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
                this.dataForm.isSaveContinue = true;
              }

              this.dataForm.dataObj = {
                type: this.filters.type
              };
              if (this.filters.type == 'voice' || this.filters.type == 'video') {
                this.dataForm.dataObj.title = this.dataForm.title;
                this.dataForm.dataObj.introduction = this.dataForm.introduction;
              }
              this.$forceUpdate();

              // 手动上传文件列表 调用接口
              this.$refs.sourceMaterialUploadRef.submit();
            })
          } else {
          }
        })
      },
      // upload 自定义上传
      handleHttpRequest (params) {
        const formData = new FormData();
        formData.append('file', params.file);
        formData.append('type', this.filters.type);
        if (this.filters.type == 'voice' || this.filters.type == 'video') {
          formData.append('title', this.dataForm.title);
          formData.append('introduction', this.dataForm.introduction);
        }
        this.$api.wxMaterial.upload(formData).then((res) => {
          // this.elementLoadingText = '拼命加载中'
          if (res.code === 0) {
            this.$message.success('上传成功')

            if (this.dataForm.isSaveContinue) {
              this.dataForm = { ...this.dataFormInit };
            }

            // this.filters.offset = 0
            // this.currentPage = 1
            // this.batchgetMaterial()
          } else {
            this.$message.error('上传失败')
          }
          // 清空已上传的文件列表
          this.$refs.sourceMaterialUploadRef.clearFiles();
          this.editLoading = false
          this.$refs['dataForm'].resetFields()
          this.clearClick();
        })
      },
      // 上传弹窗  关闭时触发事件
      dialogClose(){
         // 清除表单验证
        if(this.$refs['dataForm']){
          this.$refs['dataForm'].clearValidate();
          this.$refs['dataForm'].resetFields()
        }
        if (this.$refs.sourceMaterialUploadRef) {
          // 清空已上传的文件列表
          this.$refs.sourceMaterialUploadRef.clearFiles();
        }
        this.dataForm = { ...this.dataFormInit };
      },
      // 自定义 删除 upload
      handleRemove(){
        this.dataForm.fileList = [];
      },
      // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
      handleChange(file,fileList){
        console.log('file2222', file)
        if (file.status == 'ready') {
          if (!this.handleBeforeUpload(file.raw)) {
            // 清空已上传的文件列表
            this.$refs.sourceMaterialUploadRef.clearFiles();
            return false;
          }
          this.dataForm.file = file.raw;
          // 当多余一个的时候替换文件
          if (fileList.length > 1) {
            fileList.splice(0,1);
            this.dataForm.fileList = fileList;
          } else {
            this.dataForm.fileList = [file];
          }

        }

      },
      // 上传之前 进行 文件 格式or 大小 等 限制
      handleBeforeUpload(file){
        let result = true;
        // 支持的图片格式
        const imageList = ['image/bmp','image/png','image/pjp','image/jpg','image/pjpeg','image/jpeg','image/jfif','image/gif'];
        // 支持的音频格式
        const voiceList = ['audio/mp3','audio/wma','audio/wav','audio/amr','audio/m4a'];
        // 支持的视频格式
        const videoList = [ 'video/mp4','video/flv','video/f4v','video/webm','video/m4v','video/mov','video/3gp','video/3g2','video/rm','video/rmvb','video/wmv','video/avi','video/asf','video/mpg','video/mpeg','video/mpe','video/ts','video/div','video/dv','video/divx','video/vob','video/dat','video/mkv','video/lavf','video/cpk','video/dirac','video/ram','video/qt','video/fli','video/flc','video/mod'];

        if (this.filters.type == 'voice') {
          this.getFileTime(file);

          if (voiceList.indexOf(file.type) < 0) {
            this.$message.warning('格式只支持mp3、wma、wav、amr、m4a')
            result = false;
          } else if (file.size > 1024 * 1024 * 200) {
            this.$message.warning('大小不能超过200MB，不允许上传')
            result = false;
          } else if (file.duration > 2*60*60) {
            this.$message.warning('时长不能超过2小时，不允许上传')
            result = false;
          }
        } else if (this.filters.type == 'video') {
          this.getFileTime(file);

          if (videoList.indexOf(file.type) < 0) {
            this.$message.warning('格式只支持mp4、flv、f4v、webm,m4v、mov、3gp、3g2,rm、rmvb,wmv、avi、asf,mpg、mpeg、mpe、ts,div、dv、divx,vob、dat、mkv、lavf、cpk、dirac、ram、qt、fli、flc、mod')
            result = false;
          }else if (file.duration > 1*60*60) {
            this.$message.warning('时长不能超过1小时，不允许上传')
            result = false;
          }
        } else { // 'image'
          if (imageList.indexOf(file.type) < 0) {
            this.$message.warning('格式只支持bmp、png、pjp、jpg、pjpeg、jpeg、jfif、gif')
            result = false;
          }else if (file.size > 1024 * 1024 * 10) {
            this.$message.warning('大小不能超过10MB，不允许上传')
            result = false;
          }
        }
        return result;
      },
      //获取 音频或者 视频 的 时长，单位 s
      getFileTime(file){
        var url = URL.createObjectURL(new Blob([file]));
        // var url = URL.createObjectURL(file);
        //经测试，发现audio也可获取视频的时长
        var audioElement = new Audio(url);
        audioElement.addEventListener("loadedmetadata", (_event) => {
            // file.duration = parseInt(audioElement.duration);
            file.duration = audioElement.duration;
        });
      },
      // 点击上传按钮 显示 上传弹窗
      toClickUploadBtn () {
        this.dialogVisible = true; // 显示新增界面
        this.dataForm = { ...this.dataFormInit };
      },
      // 搜索 输入框 清除事件
      clearClick() {
        this.pageRequest.pageNum = 1;
        this.filters.offset = 0;
        this.batchgetMaterial();
      },
      // 搜索 输入框 按下换行键事件
      keyupEnterClick() {
        this.pageRequest.pageNum = 1;
        this.filters.offset = 0;
        this.batchgetMaterial();
      },
      // 搜索 输入框 按下删除键事件
      keyupDeleteClick(e) {
        if (e.target.value.length == 0) {
          this.pageRequest.pageNum = 1;
          this.filters.offset = 0;
          this.batchgetMaterial();
        }
      },
      // 搜索 输入框 按下空格键事件
      keyupSpaceClick() {},
      // 分页 改变  pageSize
      handleSizeChange(val) {
        this.filters.offset = 0
        this.filters.count = val
        this.pageRequest.pageNum = 1
        // this.pageRequest.PageSize = val
        this.batchgetMaterial()
      },
      // 分页 改变  pageRequest.pageNum
      handleCurrentChange(val) {
        if (val == 1) {
          this.filters.offset = 0
        } else {
          this.filters.offset = (this.filters.count * (val - 1))
        }
        // this.pageRequest.pageNum = val
        this.batchgetMaterial()
      },
      // tab 切换
      handleClick(tab) {
        this.filters.offset = 0
        this.filters.type = tab.name
        this.batchgetMaterial()
      },
      // 查询 列表
      batchgetMaterial () {
        this.loading = true
        this.$api.wxMaterial.batchgetMaterial(this.filters).then(res => {
          this.loading = false
          if (res.code == 0) {
            this.tableList = res.data.item
            this.totalCount = res.data.total_count
          }
        })
      },
      // 删除
      handleDelete: function (event,index,row) {
        let arr = [];
        arr.push(row.media_id);
        this.delete(arr)
      },
      // 批量删除
      handleBatchDelete: function () {
        let arr = [];
        for (let i=0; i<this.selections.length; i++){
          arr.push(this.selections[i].media_id);
        }
        this.delete(arr)
      },
      //执行删除
      delete:function(jj){
        const formData = new FormData();
        formData.append('media_id', jj);

        this.$confirm("确认删除选中记录吗？", "提示", {
          type: "warning",
          closeOnClickModal:false
        }).then(() => {
          this.$api.wxMaterial.delMaterial(formData).then(res => {
            if (res.code === 0) {
              this.$message.success('删除成功')
              this.filters.offset = 0
              this.pageRequest.pageNum = 1
              this.batchgetMaterial()
            } else {
              this.$message.error('删除失败')
            }
          }).catch(res => {
            this.$message.error("删除失败，请联系管理员!");
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
       // 选择切换  当选择项发生变化时会触发该事件
      selectionChange: function (selections) {
        this.selections = selections;
      },
      // 点击表格中的行触发该事件
      rowClick: function(row, column, event){
        this.$refs['sourceMaterialTableRef'].toggleRowSelection(row);
      },
    },
    mounted() {
      this.batchgetMaterial()
    }
  }
</script>

<style scoped>
.sourceMaterialTableCustomColumnWrap{
  display: flex;
  align-items: center;
}
.sourceMaterialTableCustomColumnRightWrap{
  padding-left: 10px;
  flex: 1;
  display: flex;
  /* justify-content: flex-start; */
  /* align-items: center; */
  justify-items: center;
  flex-direction: column;
}
.sourceMaterialTableImg{
  width: 70px;
  height: 70px;
}
/* .sourceMaterialTableVoice,
.sourceMaterialTableVideo{
  width: 60px;
  height: 60px;
} */
.sourceMaterialTableVoiceInner{
  width: 60px;
  height: 60px;
  background-color: #f6f7f8;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.sourceMaterialTableVoiceInnerImg{
  width: 36px;
  height: 36px;
}
.sourceMaterialTableVideoInner{
  width: 160px;
  height: 90px;
  background-color: #000;
  position: relative;
}
.sourceMaterialTableVideoInner i{
  position: absolute;
  left: calc(50% - 18px);
  top: calc(50% - 18px);
  font-size: 36px;
  color: #fff;
}
.sourceMaterialTableVideoInnerImg{
  width: 100%;
  height: 100%;
}

.sourceMaterialTopWrap{
  padding: 10px 14px 0px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.sourceMaterialTopInput{
  width: 200px;
  margin-right: 10px;
}
.sourceMaterialTopRightWrap{
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.sourceMaterialAddWrap{
  padding: 30px 20px 10px;
  text-align: left;
}
.sourceMaterialAddUploadWrap .el-upload__tip{
  line-height: 1;
}
.sourceMaterialAddUploadWrap{
  width: 60%;
  /* height: 100px; */

  /* display: flex; */
}

/*
去除动画
.sourceMaterialAddUploadWrap /deep/ .el-list-enter-active,
.sourceMaterialAddUploadWrap /deep/ .el-list-leave-active{
  transition: none;
}
.sourceMaterialAddUploadWrap /deep/ .el-list-enter,
.sourceMaterialAddUploadWrap /deep/ .el-list-leave-active {
  opacity: 0;
}
.sourceMaterialAddUploadWrap /deep/ .el-upload-list {
  height: 40px;
} */

.sourceMaterialAddUploadCustomWrap{
  width: 60%;
  /* height: 100px; */
}
.sourceMaterialAddUploadCustomWrap .el-upload__tip{
  line-height: 1.5;
  margin-top: -8px;
}
 .sourceMaterialAddUploadCustomWrap /deep/ .el-upload{
    /* border: 1px dashed #c0ccda;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden; */

    width: 100%;
    height: 100px;
    /* height: 100%; */
  }
 .sourceMaterialAddUploadCustomWrap /deep/ .el-upload-dragger {
    border: 1px dashed #c0ccda;
    /* border: 1px dashed transparent; */
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;

    width: 100%;
    height: 100px;
    /* height: 100%; */
  }
  .sourceMaterialAddUploadCustomWrap /deep/ .el-upload-dragger:hover {
    border-color: #409EFF;
  }

  .sourceMaterialAddUploadInner,
  .sourceMaterialAddUploadIcon{
    width: 100%;
    height: 100%;
    color: #8c939d;
    display: flex;
    align-items: center;
    /* width: 200px; */
    /* height: 100px; */
  }
  .sourceMaterialAddUploadInner{
    flex-direction: row;
    position: relative;
    padding: 10px;
    box-sizing: border-box;
  }
  .sourceMaterialAddUploadInner i{
    position: absolute;
    right: 5px;
    top: 5px;
    cursor: pointer;
    display: none;
  }
  .sourceMaterialAddUploadInner:hover i{
    display: inline-block;
  }

  .sourceMaterialAddUploadInnerImg{
    width: 70px;
    height: 70px;
  }
  .sourceMaterialAddUploadInnerLabel{
    flex: 1;
    text-align: left;
    padding-left: 10px;
    box-sizing: border-box;
    line-height: 1.5;
  }
  .sourceMaterialAddUploadIcon{
    /* font-size: 28px; */
    /* line-height: 178px; */
    text-align: center;
    flex-direction: column;
    justify-content: center;
  }
  .sourceMaterialAddUploadIcon i{
    font-size: 30px;
    margin: 0;
  }
  .sourceMaterialAddUploadIcon em{
    color: #409eff;
    font-style: normal;
  }
  .dialogByPrevImg{
    width: 90%;
    height: 65vh;
    margin: 30px 20px;
    box-sizing: border-box;
  }
  .dialogByPrevVideo{
    width: 90%;
    /* height: 65vh; */
    margin: 30px 20px;
    box-sizing: border-box;
  }
</style>
