<template>
  <div class="page-container">
    <el-container class="page-container scrollAllY">

      <!--左侧 begin-->
      <el-aside width="200px" class="box_shadows bgcolor LeftPadding marginBottom">
        <div class="displayFlex marginBottom">
          <el-input placeholder="输入关键字进行过滤"
                    v-model="filterText" size="small"
                    suffix-icon="el-icon-search" clearable>
          </el-input>
        </div>
        <el-tree style="margin-top: 10px" class="filter-tree"
                 ref="leftTree" node-key="id"
                 :data="leftTreeData" :props="defaultProps"
                 :default-expanded-keys="defaultExpandedKeysForLeftTree"
                 :filter-node-method="filterNodeleft"
                 highlight-current accordion icon-class=""
                 @node-click="nodeClickForLeft" @node-contextmenu="nodeContextmenu">
        </el-tree>
      </el-aside>
      <!--左侧 end-->
      <el-container>
        <el-header  class="box_shadows bgcolor  scrollRightYDictMenu " style="height: auto;">
          <!--工具栏-->
          <el-form class="queryForm" label-width="100px" ref="queryForm" :inline="true" :model="filters" :size="size">
            <el-collapse class="elCollapseItemNoBoeder elCollapseDict">
              <el-row class="elCollapseDict">
                <el-col :span="2">
                  <el-form-item class="dictInputQueryLabelWidth">
                    <span>广告标题</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item class="dictInputQueryWidth ">
                    <el-input  v-model="filters.avdTitle" placeholder="广告标题"
                               clearable @clear="clearInputValueForQueryAvdTitle"
                               @keyup.enter.native="keyupEnterForQueryAvdTitle"
                               @keyup.delete.native="keyupDeleteForQueryAvdTitle"
                               @keyup.space.native="keyupSpaceForQueryAvdTitle"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item class="dictInputQueryLabelWidth">
                    <span>投放开始时间</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item class="dictInputQueryWidth">
                    <el-date-picker v-model="filters.avdBegintime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" placeholder="投放开始时间" style="width: 100%;" name="avdBegintime"></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item class="dictInputQueryLabelWidth">
                    <span>投放结束时间</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item class="dictInputQueryWidth ">
                    <el-date-picker v-model="filters.avdEndtime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" placeholder="投放结束时间" style="width: 100%;" name="avdEndtime"></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-collapse-item class="elCollapseItemNoBoeder elCollapseItemMarginBottom">
                <el-row>
                  <el-col :span="2">
                    <el-form-item class="dictInputQueryLabelWidth">
                      <span>状态</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item class="dictInputQueryWidth ">
                      <cb-dict placeholder="状态" name="avdState" dict="avdState" type="select" :filters="filters" empty-label="全部" :change="findPage"></cb-dict>
                    </el-form-item>
                  </el-col>

                </el-row>
              </el-collapse-item>
            </el-collapse>
            <el-row class="elDeptFormButton dictQueryCenterButton">
              <el-col :span="24">
                <cb-button icon="fa fa-search" :label="$t('action.search')" perms="site:tevglsiteavd:query" type="primary" @click="findPage(null)"/>
                <cb-button icon="fa fa-plus" :label="$t('action.add')" perms="site:tevglsiteavd:add" type="primary" @click="handleAdd" />
              </el-col>
            </el-row>
          </el-form>
        </el-header>
        <el-main class="box_shadows bgcolor  scrollRightYDictMenu tableDict marginBottom">
          <!--表格内容栏-->
          <cb-tables :parentVue="this._self" permsBatchDelete="site:tevglsiteavd:remove"
                     :tableData="pageResult" :columns="columns" :btnColumns="btnColumns">
          </cb-tables>
        </el-main>
      </el-container>

    </el-container>
    <!--新增修改界面-->
    <el-dialog v-dialogDrag ref="elDialogForSave" :title="operation?'新增':'修改'" top="5vh" width="70%" :visible.sync="dialogVisible" :close-on-click-modal="false" @close="dialogCloseForSaveOrUpdate">
      <el-form :model="dataForm" label-width="120px" ref="dataForm" :rules="dataTevglSiteAvd"
               :size="size" style="margin-top: 10px">
        <div style="width: 49%; float: left;">
          <el-form-item label="广告标题" prop="avdTitle">
            <el-input v-model="dataForm.avdTitle" auto-complete="off" maxlength="100" autofocus></el-input>
          </el-form-item>
          <el-form-item label="跳转链接" prop="avdLinkhref">
            <el-input v-model="dataForm.avdLinkhref" auto-complete="off" maxlength="100"></el-input>
          </el-form-item>
          <el-form-item label="投放开始时间" prop="avdBegintime">
            <el-date-picker v-model="dataForm.avdBegintime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期" style="width: 100%;" name="avdBegintime" @change="changeBeginTime"></el-date-picker>
          </el-form-item>
          <el-form-item label="投放结束时间" prop="avdEndtime">
            <el-date-picker v-model="dataForm.avdEndtime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期" style="width: 100%;" name="avdEndtime" @change="changeEndTime"></el-date-picker>
          </el-form-item>
          <el-form-item label="状态" prop="avdState">
            <cb-dict :parentVue="this._self" placeholder="状态" name="avdState" dict="avdState" type="select" :dataForm="dataForm"></cb-dict>
          </el-form-item>
          <el-form-item label="所属位置" prop="avdPosition">
            <cb-dict :parentVue="this._self" placeholder="状态" name="avdPosition" dict="advertisingPlacement" type="select" :dataForm="dataForm"></cb-dict>
          </el-form-item>
          <el-form-item label="所属栏目" prop="menuId">
            <cb-tree url='/api/site/tevglsiteresourceext/querySite' placeholder="请选择所属栏目" name="menuId" prop='{"id":"menuId", "name":"name"}' :dataForm="dataForm"></cb-tree>
          </el-form-item>
        </div>

        <div style="width: 49%; float: left;">
            <el-form-item label="PC端图片" prop="avdPicurlPc">
              <div style="float: left">
                <cb-upload type="5" name='avdPicurlPc' width="1920" height="450" errorRange="20" :dataForm="dataForm" placeholder="上传PC端图片" title="点击上传PC端图片,尺寸大小 1920*400 最佳"></cb-upload>
              </div>
              <div style="float:left; text-align: center; padding-left: 15px;"><el-tag size="mini" type="danger" effect="plain">尺寸大小 1920*450 最佳</el-tag></div>
            </el-form-item>
            <el-form-item label="手机端图片" prop="avdPicurlMobile">
              <div style="float: left">
                <cb-upload type="5" name='avdPicurlMobile' width="430" height="170" errorRange="20" :dataForm="dataForm" placeholder="上传手机端图片" title="点击上传手机端图片,尺寸大小 430*170 最佳"></cb-upload>
              </div>
              <div style="float:left; text-align: center; padding-left: 15px;"><el-tag size="mini" type="danger" effect="plain">尺寸大小 430*170 最佳</el-tag></div>
            </el-form-item>

          <el-form-item label="排序号" prop="avdNum">
            <el-input-number v-model="dataForm.avdNum" class="widthAll" controls-position="right" :min="1" :max="99999"></el-input-number>
          </el-form-item>
        </div>

        <div style="float: left; width: 98%;">
          <el-form-item label="广告内容" prop="content">
            <cb-editor id="content" name="content" :dataForm="dataForm" :height="cbeditorHeight"></cb-editor>
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
import CbTable from "@/views/Core/CbTable"
import CbButton from "@/views/Core/CbButton"
import {format} from "@/utils/datetime"
import {convertTreeData_2, setDataProperties} from "../../utils/cbUtils";
import {baseUrl} from "../../utils/global";
import CbEditor from "../../components/cbeditor/index";
import CbUpload from "../../components/cbupload/index";

export default {
    components:{
      CbUpload,
      CbEditor,
      CbTable,
      CbButton
    },
    data() {
      return {
        cbeditorHeight : "150",
        // TODO 左侧树相关配置 begin
        filterText : '', // 过滤框的值
        leftTreeData : [], // 树形数据
        defaultExpandedKeysForLeftTree : [], // 树默认展开的节点
        defaultProps : {
          children: 'children',
          label: 'name'
        },
        menuObj : {  // 选中时的对象
          menuId : "",
          type : "",
          name : "",
          parentId : "",
        },

        dataTevglSiteAvd: {
          menuId: [{ required: true, message: "所属栏目不能为空", trigger: "blur" }],
          avdTitle: [{ required: true, message: "广告主题不能为空", trigger: "blur" }],
          avdNum: [{ required: true, message: "排序号不能为空", trigger: "blur" }],
          avdBegintime: [{ required: true, message: "投放开始时间不能为空", trigger: "blur" }],
          avdEndtime: [{ required: true, message: "投放结束时间不能为空", trigger: "blur" }],
          avdLinkhref: [{ required: true, message: "跳转链接不能为空", trigger: "blur" }],
          avdPicurlPc: [{ required: true, message: "电脑端图片不能为空", trigger: "blur" }],
          avdPicurlMobile: [{ required: true, message: "手机端图片不能为空", trigger: "blur" }],
          avdPosition: [{ required: true, message: "投放位置不能为空", trigger: "blur" }],
          //content: [{ required: true, message: "广告内容不能为空", trigger: "blur" }],
          //deployTime: [{ required: true, message: "发布时间不能为空", trigger: "blur" }],
          avdState: [{ required: true, message: "状态不能为空", trigger: "blur" }],
        },
        size: 'small',
        filters: {},
        dataForm:{
          avdId: '',
          menuId: '',
          avdTitle: '',
          avdNum: '',
          avdBegintime: '',
          avdEndtime: '',
          avdLinkhref: '',
          avdPicurlPc: '',
          avdPicurlMobile: '',
          avdPosition: '1',
          content: '',
          deployUserId: '',
          deployTime: '',
          avdState: 'Y',
          remark: '',
        },
        columns: [
          {prop:"avdPicurlPc", label:"栏目图片", minWidth:100, dataType:'image', type:'2', imgWidth:'120px', imgHeight:'40px', callback:'imageClick',  },
          {prop:"avdTitle", label:"广告标题", minWidth:80},
          {prop:"avdNum", label:"排序号", minWidth:70},
          {prop:"avdBegintime", label:"投放开始时间", minWidth:100},
          {prop:"avdEndtime", label:"投放结束时间", minWidth:100},
          {prop:"menuName", label:"所属栏目", minWidth:80, dataType:'tag', type:'success'},
          {prop:"avdState", label:"状态", minWidth:60, dataType:'switch', callback:'switchClick'},
        ],
        btnColumns: [
          {icon: "fa fa-edit", label: "修改", perms: "site:tevglsiteavd:edit", callback: "handleEdit"},
          {icon: "fa fa-trash", label: "删除", perms: "site:tevglsiteavd:remove", callback: "handleDelete"},
        ],
        pageResult: {},
        value: '',
        dialogVisible: false,
        operation: false, // true:新增, false:修改
        editDialogVisible: false, // 新增修改界面是否显示
        editLoading: false,
        dialogVisibleForImg:false, // 放大图片的界面
        imgUrlForImg : '',
      }
    },

    watch: {
      filterText(val) {
        this.$refs.leftTree.filter(val);
      }
    },

    methods: {
      imageClick(data){

      },
      /**
       * switch开关
       * @param data
       */
      switchClick(data){
        let obj = {};
        obj.avdId = data.row.avdId;
        if (data.e == true){
          obj.avdState = "Y"
        } else {
          obj.avdState = "N"
        }
        this.$api.tevglsiteavd.updateState(obj).then((res) => {
          if (res.code == 0){
            this.$message({ message: "操作成功", type: "success" });
          } else {
            this.$message({ message: "操作失败", type: "error" });
          }
        });
      },

      // TODO 左侧树相关事件 begin
      // 获取站点栏目树形数据，
      querySite(){
        this.$api.tevglsiteresourceext.querySite().then((res) => {
          if (res.code == 0){
            this.flag = true;
            this.leftTreeData = []; // 先清空
            res.data.forEach(a => {
              a.id = a.menuId;
            })
            let data = setDataProperties("menuId", "name", res.data, "parentId", "parentName");
            let arr = convertTreeData_2(data);
            let obj = {};
            obj.menuId = "-1";
            obj.name = "站点栏目列表";
            obj.children = arr;
            obj.type = "0";
            this.leftTreeData.push(obj); // 再赋值
            //let treeData = convertTreeData("5bb687aa97dd4084871bdc700789b5c4", res.data, 0);
            this.defaultExpandedKeysForLeftTree.push("5bb687aa97dd4084871bdc700789b5c4");
          }
        });
      },

      /**
       * 带搜索框的树的过滤事件
       * @param value
       * @param data
       * @returns {boolean}
       */
      filterNodeleft(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },

      /**
       *
       * @param obj 传递给 data 属性的数组中该节点所对应的对象
       * @param node 节点对应的 Node
       * @param vueComponent 节点组件本身
       */
      nodeClickForLeft(obj, node, vueComponent){
        this.menuObj = obj;
        this.findPage(null);
      },
      // 当某一节点被鼠标右键点击时会触发该事件
      nodeContextmenu(event, data, node, vueComponent){

      },

      // TODO 查询条件之资讯标题
      clearInputValueForQueryAvdTitle(){
        this.pageRequest.pageNum = 1;
        this.findPage();
      },
      keyupEnterForQueryAvdTitle(){
        this.pageRequest.pageNum = 1;
        this.findPage();
      },
      keyupDeleteForQueryAvdTitle(e){
        if (e.target.value.length == 0){
          this.pageRequest.pageNum = 1;
          this.findPage();
        }
      },
      keyupSpaceForQueryNewTitle(){},

      // 获取分页数据
      findPage: function (data) {
        if(data !== null && data != undefined) {
          this.pageRequest = data.pageRequest
        }
        let jj={};
        jj = Object.assign({}, this.filters);
        jj.pageNum=this.pageRequest.pageNum;
        jj.pageSize=this.pageRequest.PageSize;
        jj.menuId = this.menuObj.menuId; // 栏目ID
        this.$api.tevglsiteavd.findPage(jj).then((res) => {
          if (res.data.list.length > 0){
            res.data.list.forEach(a => {
              // 处理图片，便于表格组件显示
              a.avdPicurlPc = baseUrl + a.avdPicurlPc;
              // 切换值，便于表格组件switch开关
              if (a.avdState == "已上线"){
                a.avdState = true
              } else if (a.avdState == "已下线"){
                a.avdState = false
              }
            });
          }
          this.pageResult = res.data
        }).then(data!=null?data.callback:'')
      },
      // 表格组件中的单条删除
      handleDelete(data){
        let arr = [];
        arr.push(data.row.avdId);
        this.delete(arr, data)
      },
      // 表格组件中的批量删除
      handleBatchDelete(data){
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
          this.$api.tevglsiteavd.doDelete(jj).then(res => {
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
        if (this.menuObj.menuId == "" || this.menuObj.menuId == null || this.menuObj == undefined){
          this.$message({ message: "请在左侧选择广告所属栏目", type: "warning" });
          return false;
        }
        if (this.menuObj.type == "0" || this.menuObj.type == "3"){
          this.$message({ message: "请在左侧选择广告所属栏目", type: "warning" });
          return false;
        }
        this.dialogVisible = true;
        this.operation = true;
        this.doSomeThing();
        this.changeCursorToPointer(); // 处理样式
        this.changeSaveOrUpdateHeight();
        tinyMCE.editors['content'].setContent(''); // 富文本
      },
      // 显示修改界面
      handleEdit: function (params) {
        this.dialogVisible = true;
        this.operation = false; // 标识为修改
        this.changeCursorToPointer(); // 处理样式
        this.changeSaveOrUpdateHeight(); // 改变高度
        this.$api.tevglsiteavd.view(params.row.avdId).then((res) => {
          if (res.code == 0){
            this.showAvdInfo(res.data);
            this.dataForm.avdPicurlPc = res.avdPicurlPc;
            this.dataForm.avdPicurlMobile = res.avdPicurlMobile;
            this.dataForm = Object.assign({}, this.dataForm);
          }
        });
      },
      showAvdInfo(data){
        this.dataForm.attachId = "";
        this.dataForm.avdId = data.avdId; // 主键ID
        this.dataForm.menuId = data.menuId; // 所属栏目ID
        this.showNameForMenuId = data.menuName;
        this.dataForm.avdTitle = data.avdTitle; // 标题
        this.dataForm.avdNum = data.avdNum // 排序号
        this.dataForm.avdBegintime = data.avdBegintime; // 投放开始时间
        this.dataForm.avdEndtime = data.avdEndtime; // 结束时间
        this.dataForm.avdLinkhref = data.avdLinkhref; // 跳转链接
        //this.dataForm.avdPicurlPc = data.avdPicurlPc; // 电脑端图片访问地址
        //this.dataForm.avdPicurlMobile = data.avdPicurlMobile; // 手机端图片访问地址
        this.dataForm.avdPosition = data.avdPosition; // 投放位置(东南西北组合)
        this.dataForm.content = data.content; // 广告内容
        this.dataForm.deployTime = data.deployTime;
        this.dataForm.avdState = data.avdState; // 状态
        this.dataForm.remark = data.remark; // 备注
        this.dataForm.avdPicurlPcAttachId = "";
        this.dataForm.avdPicurlMobileAttachId = "";
      },
      // 修改
      submitForm: function (type) {
        this.$refs.dataForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true;
              this.dialogVisible = false;
              if (type == "saveContinue"){ // 保存并继续，界面不关闭
                this.dialogVisible = true;
              }
              if (this.operation == false){
                if (this.dataForm.avdPicurlPc != null && this.dataForm.avdPicurlPc != ""){
                  let arr = this.dataForm.avdPicurlPc.split("/");
                  if (arr.length > 1){
                    this.dataForm.avdPicurlPc = arr[arr.length];
                  }
                }
                if (this.dataForm.avdPicurlMobile != null && this.dataForm.avdPicurlMobile != ""){
                  let arr = this.dataForm.avdPicurlMobile.split("/");
                  if (arr.length > 1){
                    this.dataForm.avdPicurlMobile = arr[arr.length];
                  }
                }
              }
              let params = Object.assign({}, this.dataForm);
              this.$api.tevglsiteavd.save(params).then((res) => {
                  if(res.code == 0) {
                    this.$message({ message: '操作成功', type: 'success' })
                    if (type == "saveContinue"){
                      this.clearDataFormValueForSaveContinue();
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
          }
        })
      },
      dialogCloseForSaveOrUpdate(){
        this.clearDataFormValueForSaveContinue();

      },
      clearDataFormValueForSaveContinue(){
        // 清除表单验证
        if(this.$refs['dataForm']){
          this.$refs['dataForm'].clearValidate();
        }
        this.dataForm = {
          avdId: '',
          menuId: this.menuObj.menuId,
          avdTitle: '',
          avdNum: '',
          avdBegintime: '',
          avdEndtime: '',
          avdLinkhref: '',
          avdPicurlPc: '',
          avdPicurlMobile: '',
          avdPosition: '1', // 所属位置
          content: '',
          createUserId: '',
          createTime: '',
          updateUserId: '',
          updateTime: '',
          deployUserId: '',
          deployTime: '',
          avdState: 'Y', // Y已上线
          remark: '',
        }
        tinyMCE.editors['content'].setContent(''); // 富文本
      },

      doSomeThing(){
        this.showNameForMenuId = this.menuObj.name; // 文本
        this.dataForm.menuId = this.menuObj.menuId; // ID
      },

      // 时间格式化
      dateFormat: function (row, column, cellValue, index){
        return format(row[column.property])
      },

      // TODO 栏目
      /**
       *
       * @param data
       * @param node
       * @param vueComponent
       */
      nodeClickForMenuIdSave(data, node, vueComponent ){
        this.dataForm.menuId = data.menuId;
        if(this.$refs['dataForm']){
          this.$refs['dataForm'].clearValidate('menuId');
        }
      },
      clearMenuIdForSave(){
        this.dataForm.menuId = "";
      },

      changeCursorToPointer(){
        this.$nextTick(function(){
          // 栏目
          let menuId = document.getElementsByName("menuId")[0];
          if (menuId != null){
            menuId.style.cursor = "pointer";
            menuId.setAttribute("readonly", "readonly");
          }
          // 投放开始时间
          let avdBegintime = document.getElementsByName("avdBegintime")[0];
          if (avdBegintime != null){
            avdBegintime.style.cursor = "pointer";
          }
          // 投放结束时间
          let avdEndtime = document.getElementsByName("avdEndtime")[0];
          if (avdEndtime != null){
            avdEndtime.style.cursor = "pointer";
          }
        });
      },

      // 获取屏幕高度
      getHeight(){
        let height = window.screen.height; // 屏幕分辨率的高
        if (height != null && height != "" && height != undefined){
          return height;
        } else {
          return null;
        }
      },

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

      // 合作时间验证
      changeBeginTime(){
        if (this.dataForm.avdBegintime == "" || this.dataForm.avdBegintime == null || this.dataForm.avdEndtime == "" || this.dataForm.avdEndtime == null || this.dataForm.avdBegintime == undefined){
          return false;
        }
        if (this.dataForm.avdEndtime <= this.dataForm.avdBegintime){
          this.$message({ message: '投放结束时间不得少于投放开始时间', type: 'warning' })
          this.dataForm.avdEndtime = "";
        }
      },
      changeEndTime(){
        if (this.dataForm.avdBegintime == "" || this.dataForm.avdBegintime == null || this.dataForm.avdEndtime == null || this.dataForm.avdBegintime == undefined){
          return false;
        }
        if (this.dataForm.avdEndtime <= this.dataForm.avdBegintime){
          this.$message({ message: '投放结束时间不得少于投放开始时间', type: 'warning' })
          this.dataForm.avdEndtime = "";
        }
      },

    },
    mounted() {
      this.querySite(); // 渲染栏目
      this.getHeight();
    }
  }
</script>

<style scoped>

</style>
