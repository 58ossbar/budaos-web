<template>
  <div class="page-container">
    <el-container class="page-container scrollAllY">
      <el-header  class="box_shadows bgcolor  scrollRightYDictMenu " style="height: auto;">
        <!--工具栏-->
        <el-form class="queryForm" label-width="100px" ref="queryForm" :inline="true" :model="filters" :size="size">
          <el-collapse class="elCollapseItemNoBoeder elCollapseDict">
	        <el-row class="elCollapseDict">
	            <el-col :span="3">
	              <el-form-item class="dictInputQueryLabelWidth">
	                <span>广告标题</span>
	              </el-form-item>
	            </el-col>
	            <el-col :span="5">
	              <el-form-item class="dictInputQueryWidth ">
	                <el-input  v-model="filters.avdTitle" placeholder="广告标题" clearable @clear="findPage"></el-input>
	              </el-form-item>
	            </el-col>
              <el-col :span="3">
                <el-form-item class="dictInputQueryLabelWidth">
                  <span>投放开始时间</span>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item class="dictInputQueryWidth ">
                  <el-date-picker v-model="filters.avdBegintime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" placeholder="投放开始时间" style="width: 100%;" name="avdBegintime"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item class="dictInputQueryLabelWidth">
                  <span>投放结束时间</span>
                </el-form-item>
              </el-col>
              <el-col :span="5">
              <el-form-item class="dictInputQueryWidth ">
                <el-date-picker v-model="filters.avdEndtime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" placeholder="投放结束时间" style="width: 100%;" name="avdEndtime"></el-date-picker>
              </el-form-item>
            </el-col>

	        </el-row>
          <el-collapse-item class="elCollapseItemNoBoeder elCollapseItemMarginBottom">
              <el-row>
                <el-col :span="3">
                  <el-form-item class="dictInputQueryLabelWidth">
                    <span>状态</span>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item class="dictInputQueryWidth ">
                    <cb-dict placeholder="状态" name="avdState" dict="avdState" type="select" :filters="filters" empty-label="全部" :change="findPage"></cb-dict>
                  </el-form-item>
                </el-col>
                <el-col :span="3">
                  <el-form-item class="dictInputQueryLabelWidth">
                    <span>场景</span>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item class="dictInputQueryWidth ">
                    <cb-dict placeholder="场景" name="scene" dict="wx_avd_scene" type="select" :filters="filters" empty-label="全部" :change="findPage"></cb-dict>
                  </el-form-item>
                </el-col>
	          </el-row>
	        </el-collapse-item>
	      </el-collapse>
          <el-row class="elDeptFormButton dictQueryCenterButton">
            <el-col :span="24">
              <cb-button icon="fa fa-search" :label="$t('action.search')" perms="medu:tmedumediaavd:query" type="primary" @click="findPage(null)"/>
              <cb-button icon="fa fa-plus" :label="$t('action.add')" perms="medu:tmedumediaavd:add" type="primary" @click="handleAdd" />
            </el-col>
          </el-row>
        </el-form>
      </el-header>
      <el-main class="box_shadows bgcolor  scrollRightYDictMenu tableDict marginBottom">
        <!--表格内容栏-->
        <cb-tables :parentVue="this._self" permsBatchDelete="medu:tmedumediaavd:remove"
          :tableData="pageResult" :columns="columns" :btnColumns="btnColumns">
        </cb-tables>
      </el-main>
    </el-container>
    <!--新增修改界面-->
    <el-dialog v-dialogDrag :title="operation?'新增':'修改'"  top="5vh" width="60%" :visible.sync="dialogVisible" :close-on-click-modal="false" @close="dialogCloseForSaveOrUpdate">
      <el-form :model="dataForm" label-width="120px" ref="dataForm" :rules="dataTmeduMediaAvd"
               :size="size" style="margin-top: 10px">
        <div style="width: 49%; float:left;">
          <el-form-item label="广告标题" prop="avdTitle">
            <el-input v-model="dataForm.avdTitle" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="跳转链接" prop="avdLinkhref">
            <el-input v-model="dataForm.avdLinkhref" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="投放开始时间" prop="avdBegintime">
            <el-date-picker v-model="dataForm.avdBegintime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期" style="width: 100%;" name="avdBegintime" @change="changeBeginTime"></el-date-picker>
          </el-form-item>
          <el-form-item label="投放结束时间" prop="avdEndtime">
            <el-date-picker v-model="dataForm.avdEndtime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期" style="width: 100%;" name="avdEndtime" @change="changeEndTime"></el-date-picker>
          </el-form-item>
          <el-form-item label="使用场景" prop="scene">
            <cb-dict :parentVue="this._self" placeholder="使用场景，不选则默认为首页" name="scene" dict="wx_avd_scene" type="select" :dataForm="dataForm" clearable></cb-dict>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="dataForm.remark" auto-complete="off"></el-input>
          </el-form-item>
        </div>
        <div style="width: 49%; float:left;">
          <el-form-item label="上传图片" prop="avdPicurl">
            <div style="float: left">  <!--   width="430" height="170"   -->
              <cb-upload type="15" name='avdPicurl' errorRange="20" :dataForm="dataForm" width="450" height="160" placeholder="上传图片" title="点击上传图片,尺寸大小 450*160 最佳"></cb-upload>
            </div>
            <div style="float:left; text-align: center; padding-left: 15px;"><el-tag size="mini" type="danger" effect="plain">尺寸大小 450*160 最佳</el-tag></div>
          </el-form-item>
          <el-form-item label="排序号" prop="avdNum">
            <el-input-number v-model="dataForm.avdNum" class="widthAll" controls-position="right" :min="1" :max="99999"></el-input-number>
          </el-form-item>
          <el-form-item label="状态" prop="avdState">
            <cb-dict :parentVue="this._self" placeholder="状态" name="avdState" dict="avdState" type="select" :dataForm="dataForm"></cb-dict>
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
import CbEditor from "@/components/cbeditor/index"
import CbUpload from "@/components/cbupload/index"
import CbTable from "@/views/Core/CbTable"
import CbButton from "@/views/Core/CbButton"
import {baseUrl} from "@/utils/global"

export default {
    components:{
      CbButton,
      CbUpload,
      CbEditor,
      CbTable
    },
    data() {
      return {
        dataTmeduMediaAvd: {
          avdTitle: [{ required: true, message: "广告标题不能为空", trigger: "blur" }],
          avdNum: [{ required: true, message: "排序号不能为空", trigger: "blur" }],
          avdState: [{ required: true, message: "状态不能为空", trigger: "blur" }],  //:已上线、已下线
          avdBegintime: [{ required: true, message: "投放开始时间不能为空", trigger: "blur" }],
          avdEndtime: [{ required: true, message: "投放结束时间不能为空", trigger: "blur" }],
          avdLinkhref: [{ required: true, message: "跳转链接不能为空", trigger: "blur" }],
          avdPicurl: [{ required: true, message: "图片访问地址不能为空", trigger: "blur" }],
          createUserId: [{ required: true, message: "创建人不能为空", trigger: "blur" }],
          createTime: [{ required: true, message: "创建时间不能为空", trigger: "blur" }],
          updateUserId: [{ required: true, message: "最近修改人不能为空", trigger: "blur" }],
          updateTime: [{ required: true, message: "最近修改时间不能为空", trigger: "blur" }],
          // remark: [{ required: true, message: "备注不能为空", trigger: "blur" }],
        },
        size: 'small',
        filters: {
          scene: ''
        },
        dataForm:{
          avdId: '', //广告标识ID
          avdTitle: '', //广告标题
          avdNum: '', //排序号
          avdState: 'Y', //状态:已上线、已下线
          avdBegintime: '', //投放开始时间
          avdEndtime: '', //投放结束时间
          avdLinkhref: '', //跳转链接
          avdPicurl: '', //图片访问地址
          createUserId: '', //创建人
          createTime: '', //创建时间
          updateUserId: '', //最近修改人
          updateTime: '', //最近修改时间
          remark: '', //备注
          scene: ''
        },
        columns: [
          {prop:"avdPicurl", label:"图片访问地址", minWidth:70, dataType:'image', type:'2', imgWidth:'120px', imgHeight:'40px', callback:'imageClick',},
          {prop:"avdTitle", label:"广告标题", minWidth:70},
          {prop:"avdBegintime", label:"投放开始时间", minWidth:70},
          {prop:"avdEndtime", label:"投放结束时间", minWidth:70},
          {prop:"avdLinkhref", label:"跳转链接", minWidth:70},
          {prop:"avdNum", label:"排序号", minWidth:50},
          {prop:"avdState", label:"状态", minWidth:50, dataType:'switch', callback:'switchClick'},
        ],
        btnColumns: [
          {icon: "fa fa-edit", label: "修改", perms: "medu:tmedumediaavd:edit", callback: "handleEdit"},
          {icon: "fa fa-trash", label: "删除", perms: "medu:tmedumediaavd:remove", callback: "handleDelete"},
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
      //验证开始时间
      changeBeginTime(){
        if (this.dataForm.avdBegintime == "" || this.dataForm.avdBegintime == null || this.dataForm.avdEndtime == "" || this.dataForm.avdEndtime == null || this.dataForm.avdBegintime == undefined){
          return false;
        }
        if (this.dataForm.avdEndtime <= this.dataForm.avdBegintime){
          this.$message({ message: '投放结束时间不得少于投放开始时间', type: 'warning' })
          this.dataForm.avdEndtime = "";
        }
      },
      //验证结束时间
      changeEndTime(){
        if (this.dataForm.avdBegintime == "" || this.dataForm.avdBegintime == null || this.dataForm.avdEndtime == null || this.dataForm.avdBegintime == undefined){
          return false;
        }
        if (this.dataForm.avdEndtime <= this.dataForm.avdBegintime){
          this.$message({ message: '投放结束时间不得少于投放开始时间', type: 'warning' })
          this.dataForm.avdEndtime = "";
        }
      },
      //图片点击事件
      imageClick(data){

      },
      //switch开关
      switchClick(data){
        let obj = {};
        obj.avdId = data.row.avdId;
        if (data.e == true){
          obj.avdState = "Y"
        } else {
          obj.avdState = "N"
        }
        this.$api.tmedumediaavd.updateState(obj).then((res) => {
          if (res.code == 0){
            this.$message({ message: "操作成功", type: "success" });
          } else {
            this.$message({ message: "操作失败", type: "error" });
          }
        });
      },
      // 获取分页数据
      findPage: function (data) {
        if(data && data != undefined) {
          this.pageRequest = data.pageRequest
        }
        let jj = Object.assign({}, this.filters)
        jj.pageNum=this.pageRequest.pageNum;
        jj.pageSize=this.pageRequest.PageSize;
        this.$api.tmedumediaavd.findPage(jj).then((res) => {
          if (res.data.list.length > 0){
            res.data.list.forEach(a => {
              // 处理图片，便于表格组件显示
              a.avdPicurl = baseUrl + a.avdPicurl;
              // 切换值，便于表格组件switch开关
              if (a.avdState == "已上线"){
                a.avdState = true
              } else {  //if (a.avdState == "已下线")
                a.avdState = false
              }
            });
          }
          this.pageResult = res.data
        }).then(data!=null?data.callback:'')

      },
      // 删除
      handleDelete: function (data) {
        let arr = [];
        arr.push(data.row.avdId);
        this.delete(arr, data)
      },
      // 批量删除
      handleBatchDelete: function (data) {
        let arr = [];
        for (let i=0; i<data.params.length; i++){
          arr.push(data.params[i].avdId);
        }
        this.delete(arr, data)
      },
      //执行删除
      delete:function(jj,darass){
        this.$confirm("确认删除选中记录吗？", "提示", {
          type: "warning",
          closeOnClickModal:false
        }).then(() => {
          this.$api.tmedumediaavd.doDelete(jj).then(res => {
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
      //关闭新增or修改界面
      dialogCloseForSaveOrUpdate(){
        this.clearDataFormValueForSaveContinue();
      },
      // 显示新增界面
      handleAdd: function () {
		    // if(this.$refs['dataForm']){
        //   this.$refs['dataForm'].clearValidate();
        // }
        // this.dataForm = {}
        this.dialogVisible = true;
        this.operation = true;
        this.changeSaveOrUpdateHeight(); // 改变高度
      },
      // 显示修改界面
      handleEdit: function (params) {
		    // if(this.$refs['dataForm']){
        //   this.$refs['dataForm'].clearValidate();
        // }
        this.dialogVisible = true;
        this.operation = false; // 标识为修改
        this.changeSaveOrUpdateHeight(); // 改变高度
        this.$api.tmedumediaavd.view(params.row.avdId).then((res) => {
          if (res.code == 0){
            this.dataForm = Object.assign({}, res.data);
            this.dataForm.avdPicurl = res.avdPicurl;
            this.dataForm.avdPicurlAttachId = "";
            this.dataForm = Object.assign({}, this.dataForm);
          }
        });
      },
      // 改变修改新增or界面高度
      changeSaveOrUpdateHeight(){
        let height = window.screen.height;
        if (height == 1080){
          this.cbeditorHeight = "250";
          this.$nextTick(function(){
            // 改变表单的高度
            let dataFormEle = this.$refs.dataForm.$el;
            if (dataFormEle != null){
              //dataFormEle.style.height = "720px";
            }
            if (this.$refs.elDialogForSave){
              let dialog = this.$refs.elDialogForSave.$el;
              if (dialog != null){
                dialog.children[0].style.width = "60%";
              }
            }
          });
        }
      },
      // 修改
      submitForm: function (type) {
        this.$refs.dataForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true;
              this.dialogVisible = type == "saveContinue";
              if (this.operation == false){
                if (this.dataForm.avdPicurl != null && this.dataForm.avdPicurl != ""){
                  console.log(this.dataForm.avdPicurl)
                  let arr = this.dataForm.avdPicurl.split("/");
                  console.log(arr)
                  if (arr.length > 1){
                    this.dataForm.avdPicurl = arr[arr.length -1];
                    console.log(this.dataForm.avdPicurl)
                  }
                }
              }
              let params = Object.assign({}, this.dataForm);
              this.$api.tmedumediaavd.save(params).then((res) => {
                  if(res.code == 0) {
                    this.$message({ message: '操作成功', type: 'success' })
                    if(type == "saveContinue"){
                      // this.dataForm = {}
                      // 清除表单验证
                      this.clearDataFormValueForSaveContinue();
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
      // 清除表单验证
      clearDataFormValueForSaveContinue(){
        if(this.$refs['dataForm']){
          this.$refs['dataForm'].clearValidate();
        }
        this.dataForm = {
          avdId: '', //广告标识ID
          avdTitle: '', //广告标题
          avdNum: '', //排序号
          avdState: 'Y', //状态:已上线、已下线
          avdBegintime: '', //投放开始时间
          avdEndtime: '', //投放结束时间
          avdLinkhref: '', //跳转链接
          avdPicurl: '', //图片访问地址
          createUserId: '', //创建人
          createTime: '', //创建时间
          updateUserId: '', //最近修改人
          updateTime: '', //最近修改时间
          remark: '', //备注
          scene: ''
        }
      },

    },
    mounted() {
    }
  }
</script>

<style scoped>

</style>
