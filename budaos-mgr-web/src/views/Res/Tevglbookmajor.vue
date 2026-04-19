<template>
  <div class="page-container">
    <el-container class="page-container scrollAllY">
      <el-aside width="200px" class="box_shadows bgcolor LeftPadding marginBottom">
        <cb-tree-panel :parentVue="this._self" url="/api/book/tevglbookmajor/queryForTree" :btnColumns="treeBtnColumns" rootNode="职业路径" name="majorTree" prop='{"id": "majorId", "name": "majorName"}' :nodeClick="changeMajor"></cb-tree-panel>
      </el-aside>
      <el-container>
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
                  <cb-tree :parentVue="this._self" url='/api/sys/role/orgTree' placeholder="请选择所属院校" :change="findPage" name="orgId" prop='{"id":"orgId", "name":"orgName"}' :filters="filters"></cb-tree>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-form-item class="dictInputQueryLabelWidth">
                  <span>课程名称</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item class="dictInputQueryWidth ">
                  <el-input  v-model="filters.subjectName" placeholder="课程名称" clearable @clear="findPage"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-form-item class="dictInputQueryLabelWidth">
                  <span>状态</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item class="dictInputQueryWidth ">
                  <cb-dict placeholder="请选择状态" name="state" dict="state4" type="select" :filters="filters" :change="findPage"></cb-dict>
                </el-form-item>
              </el-col>
            </el-row>
              <el-collapse-item class="elCollapseItemNoBoeder elCollapseItemMarginBottom">
                <el-row>
                <el-col :span="2">
                  <el-form-item class="dictInputQueryLabelWidth">
                    <span>出版社</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item class="dictInputQueryWidth ">
                    <el-input  v-model="filters.publishingHouse" placeholder="出版社" clearable @clear="findPage"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item class="dictInputQueryLabelWidth">
                    <span>作者</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item class="dictInputQueryWidth ">
                    <el-input  v-model="filters.subjectAuthor" placeholder="作者" clearable @clear="findPage"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item class="dictInputQueryLabelWidth">
                    <span>总学分</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item class="dictInputQueryWidth ">
                    <el-input  v-model="filters.classScore" placeholder="总学分" clearable @clear="findPage"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-collapse-item>
          </el-collapse>
            <el-row class="elDeptFormButton dictQueryCenterButton">
              <el-col :span="24">
                <cb-button icon="fa fa-search" :label="$t('action.search')" perms="book:tevglbookmajor:query" type="primary" @click="findPage(null)"/>
                <cb-button icon="fa fa-plus" :label="$t('action.add')" perms="book:tevglbookmajor:add" type="primary" @click="handleAdd" />
              </el-col>
            </el-row>
          </el-form>
        </el-header>
        <el-main class="box_shadows bgcolor  scrollRightYDictMenu tableDict marginBottom">
          <el-tabs v-model="activeName" type="card" @tab-click="tabClick">
            <el-tab-pane :label="term.dictValue" :name="term.dictCode" v-for="term in terms" v-bind:key="term.dictId">
            </el-tab-pane>
          </el-tabs>
          <!--表格内容栏-->
          <cb-tables :parentVue="this._self" permsBatchDelete="book:tevglbooksubject:remove"
            :tableData="pageResult" :columns="columns" :btnColumns="btnColumns">
          </cb-tables>
        </el-main>
      </el-container>
    </el-container>
    <!--新增修改课程界面-->
    <el-dialog v-dialogDrag :title="operation?'新增':'修改'" width="60%" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-form :model="dataForm" label-width="100px" ref="dataForm" :rules="dataTevglBookSubject"
               :size="size" style="display: flex;  margin-top: 10px">
               <!--折叠面板 begin -->
        <el-collapse ref="elCollapseForSave" v-model="activeNameAdd" accordion style="width:98%;overflow:hidden;padding-right: 18px;">
          <!--基本信息 begin -->
          <el-collapse-item title="基本信息" name="1">
            <template slot="title">
              <el-button type="primary" class="collapseItemHr" ></el-button>基本信息
            </template>
            <div style="width: 50%; float:left">
              <el-form-item label="职业路径" prop="majorId">
                <cb-tree :parentVue="this._self" url="/api/book/tevglbookmajor/queryForTree" isMult="true" :dataForm="dataForm" placeholder="请选择所属职业路径" name="majorId" prop='{"id": "majorId", "name": "majorName"}'></cb-tree>
              </el-form-item>
              <el-form-item label="课程名称" prop="subjectName">
                <el-input v-model="dataForm.subjectName" auto-complete="off" maxlength="50"></el-input>
              </el-form-item>
              <el-form-item label="总学分" prop="classScore">
                <el-input v-model="dataForm.classScore" auto-complete="off" maxlength="2"></el-input>
              </el-form-item>
              <el-form-item label="出版社" prop="publishingHouse">
                <el-input v-model="dataForm.publishingHouse" auto-complete="off" maxlength="50"></el-input>
              </el-form-item>
              <el-form-item label="状态" prop="state">
                <cb-dict placeholder="请选择状态" name="state" dict="state4" type="select" :dataForm="dataForm"></cb-dict>
              </el-form-item>
            </div>
            <div style="width: 50%; float:left">
              <el-form-item label="所属学期" prop="term">
                <cb-dict placeholder="请选择所属学期" name="term" dict="term" type="select" :dataForm="dataForm"></cb-dict>
              </el-form-item>
              <el-form-item label="课程属性" prop="subjectProperty">
                <cb-dict placeholder="请选择状态" name="subjectProperty" dict="subjectProperty" type="select" :dataForm="dataForm"></cb-dict>
              </el-form-item>
              <el-form-item label="总课时" prop="classHour">
                <el-input v-model="dataForm.classHour" auto-complete="off" maxlength="8"></el-input>
              </el-form-item>
              <el-form-item label="作者" prop="subjectAuthor">
                <el-input v-model="dataForm.subjectAuthor" auto-complete="off" maxlength="50"></el-input>
              </el-form-item>
            </div>
          </el-collapse-item>
          <!--基本信息 begin -->
          <!--更多信息 begin -->
          <el-collapse-item title="更多信息" name="2">
            <template slot="title">
              <el-button type="primary" class="collapseItemHr" ></el-button>更多信息
            </template>
            <el-form-item label="课程封面图" prop="subjectLogo">
              <div style="display: flex; width: 100%;">
              <div v-for="itemLogo in subjectLogos" v-bind:key="itemLogo.dictId" class="subjectLogo" style="margin: 0 10px">
                <img @click="imgClick(itemLogo.dictId)" :id="itemLogo.dictId" :url="itemLogo.shortUrl"  :iid="itemLogo.dictCode"  :src="itemLogo.dictUrl" />
              </div>
              </div>
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
        <el-button v-if="operation == true" :size="size" type="primary" @click.native="submitForm('saveContinue')"  :loading="editLoading">{{$t('action.saveContinue')}}</el-button>
        <el-button :size="size" type="primary" @click.native="submitForm"  :loading="editLoading">{{$t('action.preservation')}}</el-button>
      </div>
    </el-dialog>
    <!--新增修改职业课程路径界面-->
    <el-dialog v-dialogDrag :title="operation?'新增':'修改'" top="5vh" width="60%" :visible.sync="majorDialogVisible" :close-on-click-modal="false">
      <el-form :model="majorDataForm" label-width="100px" ref="majorDataForm" :rules="dataTevglBookMajor"
               :size="size" style="height: 670px;margin-top: 10px">
        <div style="width: 49%; float: left;">
          <el-form-item label="所属院校" prop="orgId">
            <cb-tree :parentVue="this._self" url='/api/sys/role/orgTree' placeholder="请选择所属院校" name="orgId" prop='{"id":"orgId", "name":"orgName"}' :dataForm="majorDataForm"></cb-tree>
          </el-form-item>
          <el-form-item label="专业名称" prop="majorName">
            <el-input v-model="majorDataForm.majorName" auto-complete="off" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="排序号" prop="sortNum">
            <el-input v-model="majorDataForm.sortNum" type="number" auto-complete="off" maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="state">
            <cb-dict placeholder="请选择状态" name="state" dict="state4" type="select" :dataForm="majorDataForm"></cb-dict>
          </el-form-item>
          <el-form-item label="首页显示" prop="state">
            <cb-dict placeholder="请选择首页显示" name="showIndex" dict="state1" type="select" :dataForm="majorDataForm"></cb-dict>
          </el-form-item>
        </div>
        <div style="width: 49%; float: left;">
          <el-form-item label="专业logo图" prop="majorLogo">
            <cb-upload type="11" name='majorLogo' :dataForm="majorDataForm" placeholder="图片上传"></cb-upload>
          </el-form-item>
          <el-form-item label="版本号" prop="majorVersion">
            <el-input v-model="majorDataForm.majorVersion" auto-complete="off" maxlength="10"></el-input>
          </el-form-item>
          <el-form-item label="是否热门" prop="hot">
            <cb-dict placeholder="请选择是否热门" name="hot" dict="hot" type="select" :dataForm="majorDataForm"></cb-dict>
          </el-form-item>
        </div>
        <div style="width: 98%; float:left">
          <el-form-item label="专业简介" prop="majorDesc">
            <el-input v-model="majorDataForm.majorDesc" type="textarea" rows="6" auto-complete="off" maxlength="500"></el-input>
          </el-form-item>
          <el-form-item label="详细描述" prop="majorRemark">
            <cb-editor name="majorRemark" :dataForm="majorDataForm" height="250"></cb-editor>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="majorDialogVisible = false">{{$t('action.cancel')}}</el-button>
        <el-button v-if="operation == true" :size="size" type="primary" @click.native="submitMajorForm('saveContinue')"  :loading="editLoading">{{$t('action.saveContinue')}}</el-button>
        <el-button :size="size" type="primary" @click.native="submitMajorForm"  :loading="editLoading">{{$t('action.preservation')}}</el-button>
      </div>
    </el-dialog>
    <!-- 章节树章节内容界面-->
    <save-chapter :dialog-visible="chapterDialogVisible" :subject-id="subjectId" :subject-name="subjectName" :subject-info="subjectInfo" @close="closeChapterDialog" />
    <!-- 移交教学包界面-->
    <change-package :dialog-visible="dialogVisibleChangePackage" :subject-id="subjectId" :subject-name="subjectName" :subject-info="subjectInfo" @close="closePackageDialog" />
  </div>
</template>

<script>
import SaveChapter from './subject/save-chapter'
import ChangePackage from './subject/change-package'
import CbButton from "@/views/Core/CbButton"
import {baseUrl} from "@/utils/global"

export default {
    components:{
      CbButton,
      'save-chapter': SaveChapter,
      'change-package': ChangePackage
    },
    data() {
      return {
        dialogVisibleChangePackage: false,
        subjectId: '',
        subjectName: '',
        subjectInfo: {},
        chapterDialogVisible: false,
        subjectLogos: [],
        terms: [],
        activeName: "1",
        activeNameAdd: "1",
        term: "1",
        majorId: "",
        dataTevglBookMajor: {
          orgId: [{ required: true, message: "所属院校不能为空", trigger: "blur" }],
          majorName: [{ required: true, message: "专业名称不能为空", trigger: "blur" }],
          majorLogo: [{ required: true, message: "专业logo图不能为空", trigger: "blur" }],
          majorDesc: [{ required: true, message: "专业简介(文本)不能为空", trigger: "blur" }],
          majorRemark: [{ required: true, message: "专业详细描述(富文本)不能为空", trigger: "blur" }],
          majorType: [{ required: true, message: "专业类型(拓展字段)不能为空", trigger: "blur" }],
          parentId: [{ required: true, message: "父级ID不能为空", trigger: "blur" }],
          level: [{ required: true, message: "层级不能为空", trigger: "blur" }],
          majorVersion: [{ required: true, message: "版本号不能为空", trigger: "blur" }],
          lastVersionId: [{ required: true, message: "上一版本ID不能为空", trigger: "blur" }],
          showIndex: [{ required: true, message: "是否推荐到首页(Y是N否)不能为空", trigger: "blur" }],
          sortNum: [{ required: true, message: "排序号不能为空", trigger: "blur" }],
          state: [{ required: true, message: "状态不能为空", trigger: "blur" }],
        },
        dataTevglBookSubject: {
          orgId: [{ required: true, message: "所属院校不能为空", trigger: "blur" }],
          term: [{ required: true, message: "所属学期不能为空", trigger: "blur" }],
          subjectProperty: [{ required: true, message: "课程属性不能为空", trigger: "blur" }],
          majorId: [{ required: true, message: "所属职业课程路径不能为空", trigger: "blur" }],
          subjectNo: [{ required: true, message: "课程编号不能为空", trigger: "blur" }],
          subjectName: [{ required: true, message: "课程名称不能为空", trigger: "blur" }],
          subjectAuthor: [{ required: false, message: "作者不能为空", trigger: "blur" }],
          publishingHouse: [{ required: false, message: "出版社不能为空", trigger: "blur" }],
          subjectDesc: [{ required: true, message: "课程简介(文本)不能为空", trigger: "blur" }],
          subjectRemark: [{ required: true, message: "课程详细描述(富文本)不能为空", trigger: "blur" }],
          subjectTag: [{ required: true, message: "课程关键字标签不能为空", trigger: "blur" }],
          subjectLogo: [{ required: false, message: "课程封面图不能为空", trigger: "blur" }],
          subjectType: [{ required: true, message: "课程类型不能为空", trigger: "blur" }],
          subjectVersion: [{ required: true, message: "课程版本不能为空", trigger: "blur" }],
          lastVersionId: [{ required: true, message: "上一版本ID不能为空", trigger: "blur" }],
          subjectPrice: [{ required: true, message: "课程原价不能为空", trigger: "blur" }],
          classScore: [{ required: false, message: "总学分不能为空", trigger: "blur" }],
          classHour: [{ required: false, message: "总课时不能为空", trigger: "blur" }],
          subjectRef: [{ required: true, message: "来源课程不能为空", trigger: "blur" }],
          display: [{ required: true, message: "可见性不能为空", trigger: "blur" }],
          state: [{ required: true, message: "状态不能为空", trigger: "blur" }],
          subjectTechnology: [{ required: true, message: "所属技术不能为空", trigger: "blur" }],
          viewNum: [{ required: true, message: "浏览量不能为空", trigger: "blur" }],
        },
        size: 'small',
        filters: {
        },
        dataForm:{
          subjectId: '', //课程主键ID
          term: '',
          orgId: '', //所属院校
          majorId: '', //所属职业课程路径
          subjectNo: '', //课程编号
          subjectName: '', //课程名称
          subjectAuthor: '', //作者
          subjectLogo: '', //封面图
          publishingHouse: '', //出版社
          subjectDesc: '', //课程简介(文本)
          subjectRemark: '', //课程详细描述(富文本)
          subjectTag: '', //课程关键字标签
          subjectLogo: '', //课程logo
          subjectType: '', //课程类型(来源字典:学校，平台等)
          subjectVersion: '', //课程版本
          lastVersionId: '', //上一版本ID
          subjectPrice: '', //课程原价
          classScore: '', //总学分
          classHour: '', //总课时
          subjectRef: '', //来源课程
          createUserId: '', //创建人
          createTime: '', //创建时间
          updateUserId: '', //修改人
          updateTime: '', //修改时间
          deployUserId: '', //发布人
          deployTime: '', //发布时间
          display: '', //可见性(来源字典:私有or公有)
          state: 'Y', //状态(Y已发布N未发布)
          subjectTechnology: '', //所属技术（来源字典）
          viewNum: '', //浏览量
        },
        columns: [
          {prop:"subject_logo", label:"课程封面", minWidth:95, dataType: "image", type:"2", imgWidth:'45px', imgHeight:'45px', formatter: function(r, c, v){
            return baseUrl + v
          }},
          {prop:"subject_name", label:"课程名称", minWidth:120},
          {prop:"subject_property", label:"课程属性", minWidth:120},
          {prop:"publishing_house", label:"出版社", minWidth:120},
          {prop:"subject_author", label:"作者", minWidth:100},
          {prop:"class_score", label:"总学分", minWidth:100},
          {prop:"class_hour", label:"总课时", minWidth:100},
          {prop:"state", label:"状态", minWidth:90, dataType: "switch", callback: 'changeState'},
        ],
        majorDataForm:{
          majorId: '', //专业方向主键ID
          orgId: '', //所属院校
          majorName: '', //专业名称
          majorLogo: '', //专业logo图
          majorDesc: '', //专业简介(文本)
          majorRemark: '', //专业详细描述(富文本)
          majorType: '', //专业类型(拓展字段)
          parentId: '', //父级ID
          level: '', //层级
          majorVersion: '', //版本号
          lastVersionId: '', //上一版本ID
          showIndex: 'Y', //是否推荐到首页(Y是N否)
          sortNum: '', //排序号
          state: 'Y', //状态(Y有效N无效)
          hot: 'Y', // 是否热门(Y热门N普通)
        },
        btnColumns: [
          {icon: "fa fa-edit", label: "修改", perms: "book:tevglbookmajor:edit", callback: "handleEdit"},
          {icon: "fa fa-bars", label: "维护活教材", perms: "book:tevglbookmajor:content", callback: "handleContent"},
          {icon: "fa fa-bars", label: "移交教学包", perms: "pkg:tevglpkginfo:changePackage", callback: "handlePackage"},
          {icon: "fa fa-trash", label: "删除", perms: "book:tevglbookmajor:remove", callback: "handleDelete"},
        ],
        treeBtnColumns: [
          {icon: "fa fa-plus", label: "新增", perms: "book:tevglbookmajor:add", callback: "handleMajorAdd"},
          {icon: "fa fa-edit", label: "修改", perms: "book:tevglbookmajor:edit", callback: "handleMajorEdit"},
          {icon: "fa fa-trash", label: "删除", perms: "book:tevglbookmajor:remove", callback: "handleMajorDelete"},
        ],
        pageResult: {},
        value: '',
        dialogVisible: false,
        majorDialogVisible: false,
        operation: false, // true:新增, false:修改
        editDialogVisible: false, // 新增修改界面是否显示
        editLoading: false,
      }
    },
    methods: {
      handlePackage(obj) {
        this.dialogVisibleChangePackage = true
        this.subjectId = obj.row.subject_id
        this.subjectName = obj.row.subject_name
        this.subjectInfo = Object.assign({}, obj.row)
      },
      // 关闭页面
      closePackageDialog() {
        this.dialogVisibleChangePackage = false
      },
      handleContent(obj) {
        // 赋值，打开弹出
        this.chapterDialogVisible = true
        this.subjectId = obj.row.subject_id
        this.subjectName = obj.row.subject_name
        this.subjectInfo = Object.assign({}, obj.row)
      },
      // 关闭页面
      closeChapterDialog() {
        this.chapterDialogVisible = false
      },
      // 图片点击
      imgClick: function (data) {
        if (!$('#' + data).hasClass('subjectLogoSelectedImg')) {
          $('.subjectLogoSelectedImgI').remove()
          $('.subjectLogoSelectedImg').removeClass('subjectLogoSelectedImg')
          $('#' + data).addClass('subjectLogoSelectedImg')
          let kk = '<i class="fa fa-check-circle subjectLogoSelectedImgI" aria-hidden="true"></i>'
          $('#' + data).after($(kk))
          this.dataForm.subjectLogo = $('#' + data).attr("url")
        }
      },
      getSubjectLogo: function(){
        this.$api.tevglbooksubject.getSubjectLogo().then((res) => {
          this.subjectLogos = res.data
          this.subjectLogos.map(logo => {
            //logo.shortUrl = logo.dictUrl.substring(logo.dictUrl.lastIndexOf("/") + 1)
            logo.shortUrl = logo.dictUrl
            logo.dictUrl = baseUrl + logo.dictUrl
          })
        })
      },
      findDict: function(jj){
        let queryData = {}
        queryData.sidx = 'SORT_NUM';
        queryData.order = 'asc';
        queryData.dictType = "term";
        this.$api.dict.cbdict(queryData).then((res) => {
          this.terms = res.data;
        })
      },
      tabClick: function(tab, event){
        let data = {}
        if(this.pageRequest){
          data.pageRequest = this.pageRequest;
        }
        this.term = tab.name;
        this.findPage(data);
      },
      // 获取分页数据
      findPage: function (data) {
        if(data) {
          this.pageRequest = data.pageRequest
        } else {
          this.pageRequest.pageNum = 1
        }
        let jj = Object.assign({}, this.filters)
        jj.pageNum = this.pageRequest.pageNum;
        jj.pageSize = this.pageRequest.PageSize;
        jj.term = this.term;
        if(this.majorId){
          jj.majorId = this.majorId
        }
        this.$api.tevglbooksubject.findPage(jj).then((res) => {
          this.pageResult = res.data
          res.data.list.forEach(a => {
            // 切换值，便于表格组件switch开关
            if (a.state == "Y"){
              a.state = true
            } else if (a.state == "N"){
              a.state = false
            }
          });
        }).then(data!=null?data.callback:'')

      },
      //单个课程删除按钮事件
      handleDelete: function (data) {
        let arr = [];
        arr.push(data.row.subperiod_id);
        this.delete(arr)
      },
      //单个职业删除按钮事件
      handleMajorDelete: function (node) {
        let arr = [];
        arr.push(node.data.majorId);
        this.deleteMajor(arr)
      },
      //批量课程删除按钮事件
      handleBatchDelete: function (data) {
        let arr = [];
        for (let i=0; i<data.params.length; i++){
          arr.push(data.params[i].subperiod_id);
        }
        this.delete(arr, data)
      },
      //执行课程删除
      delete:function(jj,darass){
        this.$confirm("确认删除选中记录吗？", "提示", {
          type: "warning",
          closeOnClickModal:false
        }).then(() => {
          this.$api.tevglbooksubperiod.doDelete(jj).then(res => {
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
      //执行职业删除
      deleteMajor:function(jj,darass){
        this.$confirm("确认删除选中记录吗？", "提示", {
          type: "warning",
          closeOnClickModal:false
        }).then(() => {
          this.$api.tevglbookmajor.doDelete(jj).then(res => {
            if(res.code!==0){//删除失败
              this.$message.error(res.msg);
              return;
            }else{
              this.majorId = null
              this.$message({ message: "操作成功", type: "success" });
              this.findPage(null);
            }
            this.$refs.majorTree.reload();
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
      //显示新增职业界面
      handleMajorAdd: function () {
		    if(this.$refs['majorDataForm']){
          this.$refs['majorDataForm'].resetFields()
        }
        this.majorDataForm = {};
        this.majorDialogVisible = true;
        this.operation = true;
      },
      //显示新增课程界面
      handleAdd: function () {
		    if(this.$refs['dataForm']){
          this.$refs['dataForm'].resetFields()
        }
        this.dataForm = {
          majorId: this.majorId,
          term: this.term,
          state: "Y",
          subjectProperty: "1",
          subjectLogo: this.subjectLogos[0].shortUrl
        }
        this.activeNameAdd = "1"
        this.dialogVisible = true;
        this.operation = true;
        setTimeout(() => {
          this.imgClick(this.subjectLogos[0].dictId)
        }, 300);
      },
      //显示修改职业界面
      handleMajorEdit: function (node) {
		    if(this.$refs['majorDataForm']){
          this.$refs['majorDataForm'].clearValidate();
        }
        this.majorDialogVisible = true;
        this.operation = false; // 标识为修改
        this.$api.tevglbookmajor.view(node.data.majorId).then((res) => {
          if (res.code == 0){
            this.majorDataForm = Object.assign({}, res.data);
          }
        });
      },
      //显示修改课程界面
      handleEdit: function (params) {
		    if(this.$refs['dataForm']){
          this.$refs['dataForm'].clearValidate();
        }
        this.activeNameAdd = "1"
        this.dialogVisible = true;
        this.operation = false; // 标识为修改
        this.$api.tevglbooksubperiod.view(params.row.subperiod_id).then((res) => {
          if (res.code == 0){
            this.dataForm = Object.assign({}, res.data);
            this.subjectLogos.forEach(logo => {
              if(logo.shortUrl == res.data.subjectLogo){
                this.dataForm.subjectLogo = res.data.subjectLogo
                setTimeout(() => {
                  this.imgClick(logo.dictId);
                }, 300);
              }
            })
          }
        });
      },
      //提交保存课程数据
      submitForm: function (type) {
        this.$refs.dataForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true;
              this.dialogVisible = type == "saveContinue";
              let params = Object.assign({}, this.dataForm);
              params.majorIdList = []
              params.majorIdList.push(this.dataForm.majorId)
              this.$api.tevglbooksubject.save(params).then((res) => {
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
      //提交保存职业数据
      submitMajorForm: function (type) {
        this.$refs.majorDataForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true;
              this.majorDialogVisible = type == "saveContinue";
              // 图片处理
              if (this.operation == false){
                if (this.majorDataForm.majorLogo){
                  let arr = this.majorDataForm.majorLogo.split("/");
                  if (arr.length > 1){
                    this.majorDataForm.majorLogo = arr[arr.length-1];
                  }
                }
              }
              let params = Object.assign({}, this.majorDataForm);
              this.$api.tevglbookmajor.save(params).then((res) => {
                  if(res.code == 0) {
                    this.$message({ message: '操作成功', type: 'success' })
                    if(type == "saveContinue"){
                      this.$refs['majorDataForm'].resetFields()
                    }
                  } else {
                    this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                  }
                  this.editLoading = false
                  this.$refs['majorDataForm'].resetFields()
                  this.editDialogVisible = false
                  this.$refs.majorTree.reload();
                  this.findPage()
                })
            })
          }
        })
      },
      //左侧职业树节点切换事件
      changeMajor: function(data){
        this.majorId = data.majorId
        this.findPage()
      },
      changeState: function(data){
        let obj = {};
        obj.subjectId = data.row.subject_id;
        obj.state = data.e ? "Y" : "N"
        this.$api.tevglbooksubject.updateStatus(obj).then((res) => {
          if (res.code == 0){
            this.$message({ message: "操作成功", type: "success" });
          } else {
            this.$message({ message: "操作失败", type: "error" });
          }
        });
      }
    },
    mounted() {
      this.findDict()
      this.getSubjectLogo()
    }
  }
</script>

<style scoped>
  .subjectLogoSelectedImg {
      border: 4px solid #28a745;
      position: relative;
  }
</style>
