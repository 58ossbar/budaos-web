<template>
  <div class="page-container">
    <el-container class="page-container scrollAllY">

      <el-aside width="200px" class="box_shadows bgcolor LeftPadding marginBottom">
        <cb-tree-panel :parentVue="this._self" url="/api/site/tevglsiteresourceext/querySite?menuId=e517523468cf41bab3d77b7aa3fa4065"
                       rootNode="资讯栏目" name="majorTree" prop='{"id": "menuId", "name": "name"}' :nodeClick="changeMenu"
        ></cb-tree-panel>
      </el-aside>

      <el-container>
        <el-header  class="box_shadows bgcolor  scrollRightYDictMenu " style="height: auto;">
          <!--工具栏-->
          <el-form class="queryForm" label-width="100px" ref="queryForm" :inline="true" :model="filters" :size="size">
            <el-collapse class="elCollapseItemNoBoeder elCollapseDict">
              <el-row class="elCollapseDict">
                <el-col :span="2">
                  <el-form-item class="dictInputQueryLabelWidth">
                    <span>资讯标题</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item class="dictInputQueryWidth ">
                    <el-input  v-model="filters.newTitle" placeholder="资讯标题"
                               clearable @clear="clearInputValueForQueryNewTitle"
                               @keyup.enter.native="keyupEnterForQueryNewTitle"
                               @keyup.delete.native="keyupDeleteForQueryNewTitle"
                               @keyup.space.native="keyupSpaceForQueryNewTitle"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item class="dictInputQueryLabelWidth">
                    <span>是否头条</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item class="dictInputQueryWidth ">
                    <cb-dict placeholder="请选择是否头条" name="noone" dict="noone" type="select" :filters="filters" emptyLabel="全部" :change="findPage"></cb-dict>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item class="dictInputQueryLabelWidth">
                    <span>资讯分类</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item class="dictInputQueryWidth ">
                    <cb-dict placeholder="资讯分类" name="categoryId" dict="newsCategory" type="select" :filters="filters" emptyLabel="全部" :change="findPage"></cb-dict>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-collapse-item class="elCollapseItemNoBoeder elCollapseItemMarginBottom">
                <el-row>
                  <el-col :span="2">
                    <el-form-item class="dictInputQueryLabelWidth">
                      <span>资讯来源</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item class="dictInputQueryWidth ">
                      <el-input  v-model="filters.resource" placeholder="资讯来源"
                                 clearable @clear="clearInputValueForQueryResource"
                                 @keyup.enter.native="keyupEnterForQueryResource"
                                 @keyup.delete.native="keyupDeleteForQueryResource"
                                 @keyup.space.native="keyupSpaceForQueryResource"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="2">
                    <el-form-item class="dictInputQueryLabelWidth">
                      <span>发布方式</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item class="dictInputQueryWidth ">
                      <cb-dict placeholder="请选择发布方式" name="deployed" dict="deployed" type="select" :filters="filters" emptyLabel="全部" :change="findPage"></cb-dict>
                    </el-form-item>
                  </el-col>

                  <el-col :span="2">
                    <el-form-item class="dictInputQueryLabelWidth">
                      <span>状态</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item class="dictInputQueryWidth ">
                      <cb-dict placeholder="请选择状态" name="status" dict="newsStatus" type="select" :filters="filters" emptyLabel="全部" :change="findPage"></cb-dict>
                    </el-form-item>
                  </el-col>

                </el-row>
              </el-collapse-item>
            </el-collapse>
            <el-row class="elDeptFormButton dictQueryCenterButton">
              <el-col :span="24">
                <cb-button icon="fa fa-search" :label="$t('action.search')" perms="site:tevglsitenews:query" type="primary" @click="findPage(null)"/>
                <cb-button icon="fa fa-plus" :label="$t('action.add')" perms="site:tevglsitenews:add" type="primary" @click="handleAdd" />
                <!--<cb-button icon="fa fa-eye" :label="$t('action.preview')" perms="site:tevglsitenews:view" type="primary" @click="handlePreview" />-->
                <cb-button icon="fa fa-check-square-o" :label="$t('action.check')" perms="site:tevglsitenews:check" type="primary" @click="handleCheck" />
              </el-col>
            </el-row>
          </el-form>
        </el-header>
        <el-main class="box_shadows bgcolor  scrollRightYDictMenu tableDict marginBottom">
          <!--表格内容栏-->
          <cb-tables :parentVue="this._self" permsBatchDelete="site:tevglsitenews:remove"
                     :tableData="pageResult" :columns="columns" :btnColumns="btnColumns">
          </cb-tables>
        </el-main>
      </el-container>

    </el-container>
    <!--新增修改界面-->
    <el-dialog v-dialogDrag :title="operation?'新增':'修改'" top="5vh" width="60%" :visible.sync="dialogVisible" :close-on-click-modal="false" @close="dialogCloseForSaveOrUpdate">
      <el-form :model="dataForm" label-width="100px" ref="dataForm" :rules="dataTevglSiteNews"
               :size="size" style="margin-top: 0px">
        <el-collapse v-model="activeName" ref="elCollapseForSave" accordion style="width:98%;overflow:hidden;padding-right: 18px;">
          <el-collapse-item title="基本信息" name="1">
            <template slot="title">
              <el-button type="primary" class="collapseItemHr" ></el-button>基本信息
            </template>
            <div style="width: 49%; float: left;">
              <el-form-item label="资讯标题" prop="newTitle" style="text-align: left;">
                <el-input v-model="dataForm.newTitle" auto-complete="off" @input="inputNewTitle" style="" autofocus></el-input>
              </el-form-item>
              <el-form-item label="资讯来源" prop="resource">
                <el-input v-model="dataForm.resource" auto-complete="off" maxlength="100"></el-input>
              </el-form-item>
              <el-form-item label="资讯分类" prop="categoryId">
                <cb-dict :parentVue="this._self" placeholder="资讯分类" name="categoryId" dict="newsCategory" type="select" :dataForm="dataForm"></cb-dict>
              </el-form-item>
              <el-form-item label="是否头条" prop="noone">
                <cb-dict :parentVue="this._self" placeholder="是否头条" name="noone" dict="noone" type="select" :dataForm="dataForm"></cb-dict>
              </el-form-item>
              <el-form-item label="发布方式" prop="deployed">
                <cb-dict :parentVue="this._self" placeholder="发布方式" name="deployed" dict="deployed" type="select" :dataForm="dataForm"></cb-dict>
              </el-form-item>
            </div>

            <div style="width: 49%; float: left;">
              <el-form-item label="资讯logo" prop="newsLogo">
                <div style="float: left"><!--errorRange="20"-->
                  <cb-upload type="6" name='newsLogo' :dataForm="dataForm" width="480" height="300" placeholder="上传Logo"></cb-upload>
                </div>
                <div style="float:left; text-align: center; padding-left: 15px;"><el-tag size="mini" type="danger" effect="plain">尺寸大小 480*300 最佳</el-tag></div>
              </el-form-item>
              <el-form-item label="所属栏目" prop="menuId">
                <!--
                <el-popover placement="bottom-start" width="200" trigger="click">
                  <el-input v-model="showNameForMenuId" slot="reference" placeholder=""
                            clearable @clear="clearMenuIdForSave" name="menuId"
                  ></el-input>
                  <el-tree style="margin-top: 10px" class="filter-tree cb-el-tree-scroll"
                           ref="leftTree" node-key="menuId"
                           :data="leftTreeData" :props="defaultProps"
                           :default-expanded-keys="defaultExpandedKeysForLeftTree" default-expand-all
                           :filter-node-method="filterNodeForMenuIdSave"
                           highlight-current accordion icon-class=""
                           @node-click="nodeClickForMenuIdSave">
                  </el-tree>
                </el-popover>
                -->
                <cb-tree :parentVue="this._self" :dataForm="dataForm" url='/api/site/tevglsiteresourceext/querySite?menuId=e517523468cf41bab3d77b7aa3fa4065'
                         rootNode="资讯栏目" placeholder="" name="menuId" prop='{"id":"menuId", "name":"name"}' ></cb-tree>
              </el-form-item>
              <el-form-item label="发布时间" prop="deployTime" v-if="dataForm.deployed == '3'">
                <el-date-picker v-model="dataForm.deployTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" placeholder="请选择发布时间" style="width: 100%;" name="datetime"></el-date-picker>
              </el-form-item>
              <!--<el-form-item label="状态" prop="deployTime" v-if="dataForm.deployed == '2'">
                <cb-dict :parentVue="this._self" placeholder="资讯分类" name="status" dict="newsStatus" type="select" :dataForm="dataForm" :disabled="true"></cb-dict>
              </el-form-item>-->
            </div>

            <div style="width: 98%; float:left">
              <el-form-item label="新闻概要" prop="newsSummlar">
                <el-input v-model="dataForm.newsSummlar" class="handle-font" type="textarea" :rows="3" auto-complete="off" @input="inputNewsSummlar" name="newsSummlar"></el-input>
              </el-form-item>
            </div>

          </el-collapse-item>

          <el-collapse-item title="更多信息" name="2">
            <template slot="title">
              <el-button type="primary" class="collapseItemHr" ></el-button>更多信息
            </template>
            <el-form-item label="资讯内容" prop="content" style="width: 99.8%;">
              <cb-editor id="content" name="content" :dataForm="dataForm" :height="height"></cb-editor>
            </el-form-item>
            <!--<el-form-item label="所属社区" prop="orgId">
              <cb-tree url='/api/sys/role/orgTree' placeholder="请选择所属社区" name="orgId" prop='{"id":"orgId", "name":"orgName"}' :dataForm="dataForm"></cb-tree>
            </el-form-item>-->
            <el-form-item label="原文地址" prop="address">
              <el-input v-model="dataForm.address" auto-complete="off" maxlength="200"></el-input>
            </el-form-item>
            <el-form-item label="浏览量" prop="viewNum">
              <el-input-number v-model="dataForm.viewNum" :min="1" :max="99999999999" label="描述文字" style="width: 100%;"></el-input-number>
            </el-form-item>
            <el-form-item label="资讯编号" prop="newsNo">
              <el-input-number v-model="dataForm.newsNo" :disabled="true" style="width: 100%;"></el-input-number>
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

    <!--预览界面begin-->
    <el-dialog v-dialogDrag title="查看" top="5vh" width="60%" :visible.sync="dialogVisibleForView" :close-on-click-modal="false">
      <el-form :model="dataFormForView" label-width="100px" ref="dataFormForView" :disabled="true"
               :size="size" style="margin-top: 0px">
        <el-collapse v-model="activeNameForView" ref="elCollapseForSave" accordion style="width:98%;overflow:hidden;padding-right: 18px;">
          <el-collapse-item title="基本信息" name="1">
            <template slot="title">
              <el-button type="primary" class="collapseItemHr" ></el-button>基本信息
            </template>
            <div style="width: 49%; float: left;">
              <el-form-item label="资讯标题" prop="newTitle" style="text-align: left;">
                <el-input v-model="dataFormForView.newTitle" auto-complete="off" @input="inputNewTitle" style="" autofocus></el-input>
              </el-form-item>
              <el-form-item label="资讯来源" prop="resource">
                <el-input v-model="dataFormForView.resource" auto-complete="off" maxlength="100"></el-input>
              </el-form-item>
              <el-form-item label="资讯分类" prop="categoryId">
                <cb-dict :parentVue="this._self" placeholder="资讯分类" name="categoryId" dict="newsCategory" type="select" :dataForm="dataFormForView"></cb-dict>
              </el-form-item>
              <el-form-item label="是否头条" prop="noone">
                <cb-dict :parentVue="this._self" placeholder="是否头条" name="noone" dict="noone" type="select" :dataForm="dataFormForView"></cb-dict>
              </el-form-item>
              <el-form-item label="发布方式" prop="deployed">
                <cb-dict :parentVue="this._self" placeholder="发布方式" name="deployed" dict="deployed" type="select" :dataForm="dataFormForView"></cb-dict>
              </el-form-item>
            </div>

            <div style="width: 49%; float: left;">
              <el-form-item label="资讯logo" prop="newsLogo">
                <div style="float: left">
                  <cb-upload type="6" name='newsLogo' :dataForm="dataForm" width="480" height="300" placeholder="上传Logo"></cb-upload>
                </div>
              </el-form-item>
              <el-form-item label="所属栏目" prop="menuId">
                <cb-tree url='/api/site/tevglsiteresourceext/querySite?menuId=e517523468cf41bab3d77b7aa3fa4065'
                         placeholder="" name="menuId" prop='{"id":"menuId", "name":"name"}' :dataForm="dataFormForView" :disabled="true"></cb-tree>
              </el-form-item>
              <el-form-item label="发布时间" prop="deployTime" v-if="dataFormForView.deployed == '3'">
                <el-date-picker v-model="dataFormForView.deployTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" placeholder="请选择发布时间" style="width: 100%;" name="datetime"></el-date-picker>
              </el-form-item>
            </div>

            <div style="width: 98%; float:left">
              <el-form-item label="新闻概要" prop="newsSummlar">
                <el-input v-model="dataFormForView.newsSummlar" class="handle-font" type="textarea" :rows="3" auto-complete="off" @input="inputNewsSummlar" name="newsSummlar"></el-input>
              </el-form-item>
            </div>

          </el-collapse-item>

          <el-collapse-item title="更多信息" name="2">
            <template slot="title">
              <el-button type="primary" class="collapseItemHr" ></el-button>更多信息
            </template>
            <el-form-item label="资讯内容" prop="content" style="width: 99.8%;">
              <cb-editor id="contentForView" name="content" :dataForm="dataFormForView" :height="height" readonly="true" toolbar="false"></cb-editor>
            </el-form-item>
            <el-form-item label="原文地址" prop="address">
              <el-input v-model="dataFormForView.address" auto-complete="off" maxlength="200"></el-input>
            </el-form-item>
            <el-form-item label="浏览量" prop="viewNum">
              <el-input-number v-model="dataFormForView.viewNum" :min="1" :max="99999999999" label="描述文字" style="width: 100%;"></el-input-number>
            </el-form-item>
            <el-form-item label="资讯编号" prop="newsNo">
              <el-input-number v-model="dataFormForView.newsNo" :disabled="true" style="width: 100%;"></el-input-number>
            </el-form-item>
          </el-collapse-item>

          <el-collapse-item title="审核信息" name="3">
            <template slot="title">
              <el-button type="primary" class="collapseItemHr" ></el-button>审核信息
            </template>
            <cb-tables :parentVue="this._self" name="tableForCheck" permsBatchDelete="site:tevglsitecheckinfo:remove"
                       :checkbox="false" handleQueryDataName="queryCheckInfo"
                       :tableData="pageResultForCheck" :columns="columnsForCheck" > <!--:btnColumns="btnColumnsForCheck"-->
            </cb-tables>
          </el-collapse-item>

        </el-collapse>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="dialogVisibleForView = false">{{$t('action.cancel')}}</el-button>
      </div>
    </el-dialog>
    <!--预览界面end-->

    <!--审核界面begin-->
    <el-dialog v-dialogDrag title="审核" top="10%" width="60%" :visible.sync="dialogVisibleForCheck" :close-on-click-modal="false" @close="dialogCloseForCheck">
      <el-form :model="dataFormForView" label-width="100px" ref="dataFormForView"
               :size="size" style="margin-top: 15px">
        <el-form-item label="是否通过" prop="newTitle" style="text-align: left;">
          <el-radio-group v-model="dataFormForCheck.status" size="small" @change="elRadioGroupChangeForCheck">
            <el-radio label="2" border>通过</el-radio>
            <el-radio label="4" border>不通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="未通过理由" prop="reason" style="width: 98%" v-if="dataFormForCheck.status == '4' ">
          <el-input v-model="dataFormForCheck.reason" placeholder="请填写未通过理由" class="handle-font" type="textarea" :rows="4" auto-complete="off" name=""></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="dialogVisibleForCheck = false">{{$t('action.cancel')}}</el-button>
        <el-button :size="size" type="primary" @click.native="submitFormForCheck"  :loading="editLoading">{{$t('action.preservation')}}</el-button>
      </div>
    </el-dialog>
    <!--审核界面end-->

  </div>
</template>

<script>
import CbTable from "@/views/Core/CbTable"
import CbButton from "@/views/Core/CbButton"
import {format} from "@/utils/datetime"
import {convertTreeData_2, getDefaultExpandedKeys, setDataProperties} from "../../utils/cbUtils";
import {baseUrl, evglUrl} from "../../utils/global";
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

      // 验证资讯标题
      let validateNewTitle = (rule, value, callback) => {
        value = value.trim();
        if (value == null || value == "" || value == undefined){
          callback(new Error('资讯标题不能为空'));
        } else if (value.length > 200){
          callback(new Error('资讯标题不能超过200个字符'));
        } else {
          callback();
        }
      };

      return {

        menuId:'',
        dataFormForCheck:{
          status:'',
          reason:'',
        },
        dialogVisibleForCheck : false, // 是否审核界面
        activeNameForView : '1',
        height:'280', // 富文本高度

        ids : [],
        options: [{
          value: 'HTML',
          label: 'HTML'
        }, {
          value: 'CSS',
          label: 'CSS'
        }, {
          value: 'JavaScript',
          label: 'JavaScript'
        }],

        // TODO 左侧树相关配置 begin
        filterText : '', // 过滤框的值
        leftTreeData : [], // 树形数据
        defaultExpandedKeysForLeftTree : [], // 树默认展开的节点
        defaultProps : {
          children: 'children',
          label: 'name'
        },
        menuObj : {
          menuId : "",
          type : "",
          name : "",
          parentId : "",
        }, // 选中时的对象

        // TODO 栏目
        showNameForMenuId : '',
        // TODO 所属机构相关配置 begin
        defaultPropsForOrg : { // 机构树属性配置
          children: 'children',
          label: 'orgName'
        },
        defaultExpandedKeysForOrgTree : [], // 默认展开的节点
        treeDataForOrg : [], // 所属机构树形数据
        showNameForOrgId : '', // 所属机构文本

        // TODO 图片上传相关配置 begin
        uploadHeaders : {},
        actionUrl : baseUrl + "/api/site/tevglsitenews/uploadPic",
        attachId : "",
        dialogImageUrl: '',
        dialogVisibleForPic: false,

        // TODO 表单验证
        dataTevglSiteNews: {
          newTitle: [{ required: true, validator: validateNewTitle, trigger: "blur" }],
          newsSummlar: [{ required: true, message: "新闻概要不能为空", trigger: "blur" }],
          //content: [{ required: true, message: "资讯内容不能为空", trigger: "blur" }],
          categoryId: [{ required: true, message: "资讯分类不能为空", trigger: "blur" }],
          noone: [{ required: true, message: "是否不能为空", trigger: "blur" }],
          deployed: [{ required: true, message: "发布方式不能为空", trigger: "blur" }],
          resource: [{ required: true, message: "资讯来源不能为空", trigger: "blur" }],
          menuId: [{ required: true, message: "所属栏目不能为空", trigger: "blur" }],
          newsLogo: [{ required: true, message: "资讯logo不能为空", trigger: "blur" }],
        },
        size: 'small',
        filters: {},
        isOpen : true, // 是否开启点击表格行也选中
        activeName : "1", // 新增修改界面中折叠面板默认展开1
        categoryIdListForQuery : [], // 查询条件中的资讯分类
        categoryIdList : [], // 资讯分类
        deployedList : [], // 发布方式
        nooneList : [], // 是否头条资讯
        signUpList : [{ // 显示报名按钮
          value: 'Y',
          label: '显示'
        }, {
          value: 'N',
          label: '隐藏'
        }],
        statusList : [], // 状态
        displayList : [], // 是否展示
        selections : [], // 表格选中列
        newsLogo : '', // 新闻logo
        dataForm:{
          newsid: '',
          newTitle: '',
          content: '',
          newsLogo: '',
          newsLogoAttachId: '',
          resource: '',
          address: '',
          newsSummlar: '',
          newsKey: '',
          deployUserId: '',
          deployTime: '',
          orgId: '',
          deployUrl: '',
          langType: '',
          display: '',
          menuId: '',
          viewNum: '', // 浏览次数
          newsNo: this.getNewsNo(), // 资讯编号
          categoryId: '3', // 默认为校内新闻
          deployed: '1', // 默认直接发布
          noone: 'Y', // 是否头条
          status: '2', // 状态1待审2已发布 3删除
          signUpBtn : "N", // 默认隐藏报名按钮
        },
        dataFormForView:{
          newsid: '',
          newTitle: '',
          content: '',
          viewNum: '',
          newsLogo: '',
          status: '',
          resource: '',
          address: '',
          newsSummlar: '',
          newsKey: '',
          deployed: '',
          noone: '',
          deployUserId: '',
          deployTime: '',
          orgId: '',
          deployUrl: '',
          newsNo: '',
          categoryId: '',
          langType: '',
          display: '',
          menuId: '',
          signUpBtn : '',
        },
        columns: [
          {prop:"newsLogo", label:"资讯logo", minWidth:80, dataType:'image'},
          {prop:"newTitle", label:"资讯标题", minWidth:80, dataType: "link", callback: 'linkClick'},
          {prop:"categoryId", label:"资讯分类", minWidth:80},
          {prop:"menuName", label:"所属栏目", minWidth:80},
          {prop:"deployed", label:"发布方式", minWidth:80},
          {prop:"viewNum", label:"浏览量", minWidth:70}, /**/
          //{prop:"status", label:"状态", minWidth:60, dataType:'tag', type:'', id:'newsid', mapper:'{"key":"待审核", "value":"danger"}'},
          {prop:"status", label:"状态", minWidth:60, dataType:'tag', type:'success', id:'newsid', mapper:'[{"key":"待审核", "value":"danger"},{"key":"未通过", "value":"warning"}]'},
          {prop:"noone", label:"是否头条", minWidth:80, dataType:"switch", callback:'switchForNoone'},
        ],
        btnColumns: [
          {icon: "fa fa-edit", label: "修改", perms: "site:tevglsitenews:edit", callback: "handleEdit"},
          {icon: "fa fa-trash", label: "删除", perms: "site:tevglsitenews:remove", callback: "handleDelete"},
        ],
        pageResult: {},
        value: '',
        dialogVisible: false,
        operation: false, // true:新增, false:修改
        editDialogVisible: false, // 新增修改界面是否显示
        editLoading: false,
        dialogVisibleForView : false,

        columnsForCheck: [
          //{prop:"refId", label:"关联id", minWidth:70},
          {prop:"pass", label:"是否通过", minWidth:70, dataType:'tag', type:'success', mapper:'{"key":"未通过", "value":"danger"}'},
          {prop:"createUserId", label:"审核人", minWidth:70},
          {prop:"reason", label:"理由", minWidth:70},
          {prop:"createTime", label:"审核时间", minWidth:70},
          //{prop:"state", label:"状态", minWidth:70},
          //{prop:"type", label:"审核类型(1新闻2广告3等等等)", minWidth:70},
        ],
        btnColumnsForCheck: [
          {icon: "fa fa-edit", label: "修改", perms: "site:tevglsitecheckinfo:edit", callback: "handleEdit"},
          {icon: "fa fa-trash", label: "删除", perms: "site:tevglsitecheckinfo:remove", callback: "handleDelete"},
        ],
        pageResultForCheck: {},
        newsid:'',
      }
    },

    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      },
    },

    methods: {

      linkClick(params){
        this.dialogVisibleForView = true; // 显示预览界面
        this.activeNameForView = "1";
        this.queryCheckInfo();
        // 基本信息
        this.newsid = params.row.newsid
        this.$api.tevglsitenews.view(params.row.newsid).then((res) => {
          if (res.code == 0){
            this.dataFormForView = Object.assign({}, res.data);
          }
        });
      },

      // 表格组件中是否头条switch开关
      switchForNoone(data){
        let obj = {};
        obj.newsid = data.row.newsid;
        if (data.e == true){
          obj.noone = "Y"
        } else {
          obj.noone = "N"
        }
        this.$api.tevglsitenews.updateState(obj).then((res) => {
          if (res.code == 0){
            this.$message({ message: "操作成功", type: "success" });
          } else {
            this.$message({ message: "操作失败", type: "error" });
          }
        });
      },

      changeMenu(data){
        this.filters.menuId = data.menuId;
        this.findPage()
        this.menuObj = data;
        this.menuId = data.menuId;
      },

      // TODO 左侧树相关事件 begin
      // 获取站点栏目树形数据，
      querySite(){
        this.$api.tevglsiteresourceext.querySite({menuId : "e517523468cf41bab3d77b7aa3fa4065"}).then((res) => {
          if (res.code == 0){
            this.flag = true;
            this.leftTreeData = []; // 先清空
            res.data.forEach(a => {
              a.id = a.menuId;
            })
            let data = setDataProperties("menuId", "name", res.data, "parentId", "parentName");
            let arr = convertTreeData_2(data);
            let obj = {};
            obj.menuId = "";
            obj.name = "资讯栏目";
            obj.children = arr;
            obj.type = "0";
            this.leftTreeData.push(obj); // 再赋值
          }
        });
      },

      /**
       * 带搜索框的树的过滤事件
       * @param value
       * @param data
       * @returns {boolean}
       */
      filterNode(value, data) {
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
        this.filters.menuId = obj.menuId;
        this.findPage();
      },

      // TODO 查询条件之资讯标题
      clearInputValueForQueryNewTitle(){
        this.pageRequest.pageNum = 1;
        this.findPage();
      },
      keyupEnterForQueryNewTitle(){
        this.pageRequest.pageNum = 1;
        this.findPage();
      },
      keyupDeleteForQueryNewTitle(e){
        if (e.target.value.length == 0){
          this.pageRequest.pageNum = 1;
          this.findPage();
        }
      },
      keyupSpaceForQueryNewTitle(){

      },
      // TODO 查询条件之来源
      clearInputValueForQueryResource(){
        this.pageRequest.pageNum = 1;
        this.findPage();
      },
      keyupEnterForQueryResource(){
        this.pageRequest.pageNum = 1;
        this.findPage();
      },
      keyupDeleteForQueryResource(e){
        if (e.target.value.length == 0){
          this.pageRequest.pageNum = 1;
          this.findPage();
        }
      },
      keyupSpaceForQueryResource(){

      },
      //
      clearSelectForQueryCategoryId(){
        this.findPage();
      },
      changeSelectForQueryCategoryId(val){
        this.filters.categoryId = val;
        this.findPage();
      },

      // TODO 新闻标题
      // 在 Input 值改变时触发
      inputNewTitle(val){
        if (val != "" && val != null){
          this.$refs['dataForm'].clearValidate('newTitle');
        } else {
          this.$refs['dataForm'].validateField('newTitle');
        }
      },
      // TODO 新闻概要
      inputNewsSummlar(val){
        if (val != "" && val != null){
          this.$refs['dataForm'].clearValidate('newsSummlar');
        } else {
          this.$refs['dataForm'].validateField('newsSummlar');
        }
      },

      // TODO 栏目
      /**
       *
       * @param data
       * @param node
       * @param vueComponent
       */
      nodeClickForMenuIdSave(data, node, vueComponent ){
        this.showNameForMenuId = data.name;
        this.dataForm.menuId = data.menuId;
        if(this.$refs['dataForm']){
          this.$refs['dataForm'].clearValidate('menuId');
        }
      },
      clearMenuIdForSave(){
        this.dataForm.menuId = "";
        this.$refs['dataForm'].validateField('menuId');
      },

      /**
       * 带搜索框的树的过滤事件（新增修改）
       * @param value
       * @param data
       * @returns {boolean}
       */
      filterNodeForMenuIdSave(value, data){
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },

      // TODO 所属机构相关事件
      /**
       * 所属机构树形中改变值触发事件
       * @param data
       * @param node
       */
      handleTreeSelectChangeForSave (data, node){
        this.showNameForOrgId  = data.orgName
        this.dataForm.orgId = data.id; // 给新增或修改界面中javabean所属机构赋值
      },
      // 新增修改界面中所属机构,在点击由 clearable 属性生成的清空按钮时触发(x小图标)
      clearInputOrgIdForSave(){
        this.dataForm.orgId = '';
      },
      // 控制所属机构输入框不可输入
      focusForQuery(event){
        event.target.setAttribute("readonly", "readonly")
      },

      // 获取分页数据
      findPage: function (data) {
        if(data !== null && data != undefined) {
          this.pageRequest = data.pageRequest
        }
        let jj={};
        jj = Object.assign({}, this.filters)
        jj.pageNum=this.pageRequest.pageNum;
        jj.pageSize=this.pageRequest.PageSize;
        jj.sidx = "update_time";
        jj.order = "desc";
        this.$api.tevglsitenews.findPage(jj).then((res) => {
          if (res.code == 0){
            if (res.data.list.length > 0){
              res.data.list.forEach(a => {
                // 图片路径
                a.newsLogo = baseUrl + a.newsLogo;
                // 切换值，便于表格组件switch开关
                if (a.noone == "是"){
                  a.noone = true
                } else if (a.noone == "否"){
                  a.noone = false
                }
              });
            }
          }
          this.pageResult = res.data;
        }).then(data!=null?data.callback:'')

      },
      // 表格组件中的单条删除
      handleDelete(data){
        let arr = [];
        arr.push(data.row.newsid);
        this.delete(arr, data)
      },
      // 表格组件中的批量删除
      handleBatchDelete(data){
        let arr = [];
        for (let i=0; i<data.params.length; i++){
          arr.push(data.params[i].newsid);
        }
        this.delete(arr, data)
      },
      //执行删除
      delete:function(jj,darass){
        this.$confirm("确认删除选中记录吗？", "提示", {
          type: "warning",
          closeOnClickModal:false
        }).then(() => {
          this.$api.tevglsitenews.doDelete(jj).then(res => {
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
          this.$message({ message: "请在左侧选择所属栏目", type: "warning" });
          return false;
        }
        this.dialogVisible = true; // 显示新增界面
        this.operation = true; // 新增
        this.dataForm.menuId = this.menuId
        //this.dataForm = Object.assign({}, this.dataForm);
        this.queryOrgTree();
        this.doSomething();
        this.changeSaveOrUpdateHeight();
        this.activeName = "1";
        this.showNameForMenuId = this.menuObj.name;
        console.log(this.dataForm)
      },
      // 显示修改界面
      handleEdit: function (params) {
        this.dialogVisible = true;
        this.operation = false; // 标识为修改
        this.queryOrgTree();
        this.doSomething();
        this.$api.tevglsitenews.view(params.row.newsid).then((res) => {
          if (res.code == 0){
            this.dataForm = Object.assign({}, res.data);
            this.dataForm.newsLogo = res.newsLogo;
            this.dataForm.newsLogoAttachId = "";// 附件关联ID
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
              // 图片处理
              if (this.operation == false){
                if (this.dataForm.newsLogo != null && this.dataForm.newsLogo != ""){
                  let arr = this.dataForm.newsLogo.split("/");
                  if (arr.length > 1){
                    this.dataForm.newsLogo = arr[arr.length-1];
                  }
                }
              }
              let params = Object.assign({}, this.dataForm);
              this.$api.tevglsitenews.save(params).then((res) => {
                  if(res.code == 0) {
                    this.$message({ message: '保存成功', type: 'success' });
                    if (type == "saveContinue"){
                      //this.clearDataFormValueForSaveContinue();
                      tinyMCE.editors['content'].setContent(''); // 富文本
                    }
                  } else {
                    this.$message({message: '保存失败, ' + res.msg, type: 'error'})
                  }
                  this.editLoading = false
                  this.$refs['dataForm'].resetFields()
                  this.editDialogVisible = false
                  this.pageRequest.pageSize = 1;
                  this.findPage(null)
                })
            })
          } else {
            this.activeName = "1";
          }
        })
      },

      clearDataFormValueForSaveContinue(){
        // 清除表单验证
        if(this.$refs['dataForm']){
          this.$refs['dataForm'].clearValidate();
        }
        this.dataForm = {
          newsid: '',
          newTitle: '',
          content: '',
          viewNum: this.getViewNum(),
          newsLogo: '',
          resource: '',
          address: '',
          newsSummlar: '',
          newsKey: '',
          deployUserId: '',
          deployTime: '',
          orgId: '', // 所属社区
          deployUrl: '',
          newsNo: this.getNewsNo(),
          categoryId: '2', // 默认为行内新闻
          deployed: '1', // 默认直接发布
          noone: 'Y', // 是否头条
          status: '2', // 状态1待审2已发布 3删除
          signUpBtn : "N", // 默认隐藏报名按钮
          langType: '',
          display: '',
        }
        this.showNameForMenuId = ""; // 所属栏目文本
        this.showNameForOrgId = ""; // 所属社区文本
        tinyMCE.editors['content'].setContent(''); // 富文本
        this.dialogImageUrl = ""; // logo处理
      },

      // 新增修改界面关闭时触发事件
      dialogCloseForSaveOrUpdate(){
        this.clearDataFormValueForSaveContinue();
        tinyMCE.editors['content'].setContent(''); // 富文本清除
        this.activeName = "1"; // 激活重要信息面板
      },

      selectionChange(data){
        this.selections = data.selections;
      },

      // 预览
      handlePreview(){
        if (this.selections.length == 0){
          this.$message({ message: '请至多选择一条记录', type: 'warning' });
          return false;
        } else if (this.selections.length > 1){
          this.$message({ message: '只能选择一条记录', type: 'warning' });
          return false;
        }
        window.open(evglUrl + "newsRead/?id=" + this.selections[0].newsid, '_blank');
      },

      // 时间格式化
      dateFormat: function (row, column, cellValue, index){
        return format(row[column.property])
      },

      // 获取浏览量
      getViewNum(){
        return Math.ceil(Math.random()*100);
      },
      // 获取资讯编号
      getNewsNo(){
        let date = new Date();
        let year = date.getFullYear().toString(); // 年
        let month = (date.getMonth()+1).toString().length <= 1 ? "0"+(date.getMonth()+1).toString() : (date.getMonth()+1).toString(); // 月
        let day = date.getDate().toString().length <= 1 ? "0"+date.getDate().toString() : date.getDate().toString(); // 日
        let hours = date.getHours().toString().length <= 1 ? "0"+date.getHours().toString() : date.getHours().toString(); // 时
        let minutes = date.getMinutes().toString().length <= 1 ? "0"+date.getMinutes().toString() : date.getMinutes().toString(); // 分
        let seconds = date.getSeconds().toString().length <= 1 ? "0"+date.getSeconds().toString() : date.getSeconds().toString(); // 秒
        let val = year+month+day+hours+minutes+seconds;
        return val.toString();
      },

      // 查询所属机构
      queryOrgTree(){
        this.$api.role.orgTree().then(res => {
          if (res.code == 0){
            if (res.data.length > 0){
              res.data.forEach(a => {
                a.id = a.orgId;
              });
            }
            this.treeDataForOrg = convertTreeData_2(res.data);
            this.defaultExpandedKeysForOrgTree = getDefaultExpandedKeys(this.treeDataForOrg);
          }
        });
      },
      /*
      doSomething(){
        this.showNameForMenuId = this.menuObj.name;
        this.dataForm.menuId = this.menuObj.menuId;
        this.$nextTick(function(){
          let menuId = document.getElementsByName("menuId")[0];
          menuId.style.cursor = "pointer";
          menuId.setAttribute("readonly", "readonly");
          let orgName = document.getElementsByName("orgName")[0];
          orgName.style.cursor = "pointer";
          orgName.setAttribute("readonly", "readonly");
        });
      },
      */
      doSomething(){
        this.$nextTick(function(){
          let menuId = document.getElementsByName("menuId")[0];
          let orgName = document.getElementsByName("orgName")[0];
          if (menuId != null){
            menuId.style.cursor = "pointer";
            menuId.setAttribute("readonly", "readonly");
          }
          if (orgName != null){
            orgName.style.cursor = "pointer";
            orgName.setAttribute("readonly", "readonly");
          }
        });
      },

      changeSaveOrUpdateHeight(){
        let height = window.screen.height;
        if (height == 1080){
          this.$nextTick(function(){
            // 改变表单的高度
            let dataFormEle = this.$refs.dataForm.$el;
            if (dataFormEle != null){
              //dataFormEle.style.maxHeight = "675px";
              if (this.$refs.elCollapseForSave){
                // 折叠面板的高度跟随表单高度改变
                let elCollapseForSaveEle = this.$refs.elCollapseForSave.$el;
                elCollapseForSaveEle.style.height = dataFormEle.style.height;
                // 改变简介
                let newsSummlar = document.getElementsByName("newsSummlar")[0];
                if (newsSummlar != null){
                  newsSummlar.setAttribute("rows", "13");
                }
              }
            }
          });
        }
      },

      // 显示审核界面
      handleCheck(){
        if (this.selections.length == 0){
          this.$message({ message: '请至少选择一条记录', type: 'warning' });
          return false;
        }
        this.dialogVisibleForCheck = true; // 显示审核界面
      },

      // 审核保存
      submitFormForCheck:function () {
        if (this.dataFormForCheck.status == "" || this.dataFormForCheck.status == null){
          this.$message({ message: '请选择是否通过', type: 'warning' });
          return false;
        }
        if (this.dataFormForCheck.status == "4" && this.dataFormForCheck.reason == ""){
          this.$message({ message: '请填写未通过理由', type: 'warning' });
          return false;
        }
        let ids = []
        this.selections.forEach(a => {
          ids.push(a.newsid)
        })
        this.$api.tevglsitenews.check(ids, this.dataFormForCheck).then((res) => {
          if (res.code == 0){
            this.$message({ message: '操作成功', type: 'success' });
            this.findPage()
          }
        })
        this.dialogVisibleForCheck = false;
      },
      dialogCloseForCheck:function () {
        this.dataFormForCheck.status = ''
        this.dataFormForCheck.reason  = ''
      },
      elRadioGroupChangeForCheck:function (val) {

      },
      queryCheckInfo:function (data) {
        if(data) {
          this.pageRequestForCheck = data.pageRequest
        }
        // 审核记录
        let jj = {}
        jj.refId = this.newsid
        jj.sidx = "create_time"
        jj.order = 'desc'
        if (this.pageRequestForCheck){
          jj.pageNum=this.pageRequestForCheck.pageNum;
          jj.pageSize=this.pageRequestForCheck.PageSize;
        }
        this.$api.tevglsitenews.queryCheckInfo(jj).then((res) => {
          if (res.code == 0){
            this.pageResultForCheck = res.data;
          }
        }).then(data!=null?data.callback:'');
      },
    },
    mounted() {
      this.querySite(); // 初始化左侧栏目树
      this.doSomething();
    },

  }
</script>

<style scoped>

</style>

<style>

  /*悬浮树控件的滚动条*/
  .cb-el-tree-scroll{
    overflow:scroll;
    height:250px;
    overflow-x:hidden;
    width:100%;
  }

</style>
