<template>
<div>
  <el-container class="page-container scrollAllY">
    <el-aside width="220px" class="box_shadows bgcolor LeftPadding marginBottom">
      <div class="displayFlex marginBottom">
        <!--过滤输入框-->
        <el-input class="buttomMargin"  size="small" placeholder="输入字典名称查询" v-model="filterText"
                  suffix-icon="el-icon-search" clearable  maxlength="30" type="text" ><!-- @focus="inputFocus" @blur="inputBlur"-->
        </el-input>
        <cb-button class="queryButtonPlus" icon="el-icon-plus"  perms="sys:tsysdict:add"
                   type="primary"  @click="handleAdd({dictSort:'1'})"/>
      </div>
      <el-tree  :data="listData" :highlight-current="true" :props="dictTreeProps"
                :element-loading-text="$t('action.loading')" v-loading="loadingTree"
                node-key="dictId" :filter-node-method="filterNode" current-node-key=""
                ref="dictTree"  > <!-- @node-click="handleSelectDeptTree" -->
        <div  class="fontSizeComm widthAll dictDivSlot"  :class="{displayColor:!data.swithToggle}"
              @click="() => handleSelectDeptTree(data)"
              @mouseleave="() => mouseleaves(data)" @mouseenter="() => mouseenters(data)"
              slot-scope="{ node, data }">
          <div >
            <span>
              <img v-if="data.dictUrl" class="dictIconTreeStyle"  :src="baseDictUrls+data.dictUrl" />
              <img v-else class="dictIconTreeStyle"  src="../../assets/user1.png" />
              {{ node.label }}
            </span>
            <span  class="treeIconHover"
                   @mouseleave="() => mouseleave(data)" @mouseenter="() => mouseenter(data)"
                   :style="data.iconStyleI ?'display:none' : 'display:inline-block'">
              <i   class="el-icon-more buttomMargin "></i>
            </span>
            <ul class="treeHoverUl" :style="data.ulStyle ?'display:none' : 'display:inline-block'"
                @mouseenter="() => mouseenter(data)" @mouseleave="() => mouseleave(data)" >
              <li><cb-button  icon="fa fa-plus"   perms="sys:menu:add" :label="$t('action.add')"
                              class="treeHoverUlButtom " @click="() => handleAdd(data)" />
              </li>
              <li><cb-button  icon="fa fa-edit"   perms="sys:tsysdict:edit" :label="$t('action.edit')"
                              class="treeHoverUlButtom " @click="() => handleEdit(data)" />
              </li>
              <li>
                <cb-button icon="fa fa-trash-o" perms="sys:tsysdict:remove" :label="$t('action.delete')"
                           class="treeHoverUlButtom" @click="() => handleDelete(data)"  />
              </li>
            </ul>
          </div>
        </div>
      </el-tree>
    </el-aside>
    <el-container>
      <el-header  class="box_shadows bgcolor  scrollRightYDictMenu " style="height: auto;">
        <!--工具栏-->
        <el-form class="queryForm textAlign" label-width="100px" ref="queryForm" :inline="true" :model="filters" :size="size" label-position="right">
          <el-collapse class="elCollapseItemNoBoeder elCollapseDict">
            <el-row>
              <el-col :span="3">
                <el-form-item class="dictInputQueryLabelWidth">
                  <span>字典分类名称</span>
                </el-form-item>
                </el-col>
              <el-col :span="5">
                <el-form-item  class="dictInputQueryWidth textAlign">
                  <el-input  maxlength="30" type="text"  v-model="filters.dictName" placeholder="字典分类名称" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item class="dictInputQueryLabelWidth">
                  <span>字典展示分类</span>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item class="dictInputQueryWidth">
                  <el-select class="widthAll"   v-model="filters.displaySort" placeholder="请选择" clearable >
                    <el-option class="dictQueryOptionPadding" v-for="item in queryFormDisplaySortOptions" :key="item.value" :label="item.label"
                               :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item class="dictInputQueryLabelWidth">
                  <span>是否默认值</span>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item class="dictInputQueryWidth textAlign">
                  <el-select  class="widthAll"  v-model="filters.isdefault" placeholder="请选择" clearable>
                    <el-option class="dictQueryOptionPadding" v-for="item in queryFormDefaultOptions"
                               :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-collapse-item class="elCollapseItemNoBoeder elCollapseItemMarginBottom">
              <el-row>
                <el-col :span="3">
                  <el-form-item class="dictInputQueryLabelWidth">
                    <span>字典值</span>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item class="dictInputQueryWidth ">
                    <el-input  v-model="filters.dictValue" maxlength="100" type="text" placeholder="字典值" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="3">
                  <el-form-item class="dictInputQueryLabelWidth">
                    <span>字典编码</span>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item class="dictInputQueryWidth ">
                    <el-input   v-model="filters.dictCode" maxlength="60" type="text" placeholder="字典编码" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="3">
                  <el-form-item class="dictInputQueryLabelWidth">
                    <span>是否显示</span>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item class="dictInputQueryWidth" >
                    <el-select class="widthAll"   v-model="filters.displaying" placeholder="请选择" clearable >
                      <el-option class="dictQueryOptionPadding" v-for="item in queryFormDisplayOptions" :key="item.value" :label="item.label"
                                 :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

              </el-row>
            </el-collapse-item>
          </el-collapse>
          <el-row class="elDeptFormButton dictQueryCenterButton">
            <el-col :span="24">
              <cb-button icon="fa fa-search" :label="$t('action.search')"   perms="sys:tsysdict:query"
                         type="primary" @click="findPages(null)"/>
              <cb-button icon="fa fa-plus" :label="$t('action.add')"  type="primary" @click="handleAdd"  perms="sys:tsysdict:add" />
            </el-col>
          </el-row>

        </el-form>
      </el-header>
      <el-main class="box_shadows bgcolor  scrollRightYDictMenu tableDict marginBottom">
        <!--表格内容栏-->
        <!--表格内容栏-->
        <cb-table permsEdit="sys:tsysdict:edit" permsDelete="sys:tsysdict:remove"
                   :isOpen="isOpen"
                  :data="pageResult" :columns="filterColumns" @selectionChange="selectionChange"
                  @toggleRowSelection="toggleRowSelection"
                  @findPage="findPages" @handleEdit="handleEdit" @handleDeleteOther="handleDelete" >
        </cb-table>
      </el-main>
    </el-container>
  </el-container>
  <!--新增修改界面-->
  <el-dialog v-dialogDrag
      :title="operation?dataForm.dictSort==='1'?$t('action.add')+'字典目录':$t('action.add')+'字典':dataForm.dictSort==='1'?$t('action.edit')+'字典目录':$t('action.edit')+'字典'"
             width="50%" :visible.sync="editDialogVisible" :close-on-click-modal="false">
    <el-form class="formInfo dialogFormTop" :model="dataForm" @keyup.enter.native="submitForm()" label-width="120px"
             :rules="dataFormRules" ref="dataForm" :size="size">
      <el-row>
        <el-col :span="12">
          <el-form-item label="字典分类编码" prop="dictType">
            <el-input v-model="dataForm.dictType" auto-complete="off" clearable maxlength="30" type="text"
                      placeholder="字典分类编码"  :disabled="dataForm.dictSort === '2'"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="字典分类名称" prop="dictName">
            <el-input v-model="dataForm.dictName" auto-complete="off" clearable maxlength="30" type="text"
                      placeholder="字典分类名称" :disabled="dataForm.dictSort === '2'"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item v-if="dataForm.dictSort === '2'" label="字典编码" prop="dictCode">
            <el-input v-model="dataForm.dictCode" auto-complete="off" placeholder="字典编码" clearable ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-if="dataForm.dictSort === '2'" label="字典值" prop="dictValue">
            <el-input v-model="dataForm.dictValue" auto-complete="off" placeholder="字典值" clearable ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item v-if="dataForm.dictSort === '2'"  label="排序号" prop="sortNum">
            <el-input-number v-model="dataForm.sortNum" controls-position="right"
                             :min="1" :max="99999999999" label="排序号" class="widthAll">
            </el-input-number>
          </el-form-item>

        </el-col>
        <el-col :span="12">
          <el-form-item v-if="dataForm.dictSort === '2'" label="默认值" prop="isdefault">
            <el-radio-group  class=" textAlign widthAll" v-model="dataForm.isdefault">
              <el-radio  v-for="data in dictDefaultList" class="elRadioMargin"
                         :label="data.value" :key="data.value">{{ data.label}}</el-radio>
            </el-radio-group>
          </el-form-item>

        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-row>
            <el-col :span="24">
              <el-form-item label="字典展现分类 " prop="displaySort">
                <el-select clearable  class="widthAll"  v-model="dataForm.displaySort" placeholder="请选择" :disabled="dataForm.dictSort === '2'" >
                  <el-option class="dictQueryOptionPadding" v-for="item in queryFormDisplaySortOptionsTwo" :key="item.value" :label="item.label"
                             :value="item.value"></el-option>
                </el-select>
              </el-form-item>

            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="所属机构" prop="orgName">
                <!--<el-popover placement="bottom-start"  trigger="click" > &lt;!&ndash; hover &ndash;&gt;
                  <el-tree class="elTreeDeptScroll" :data="tableTreeDdataDept" :props="treePropsDept" ref="popupTreeForSave" node-key="orgId"
                           @current-change="handleTreeSelectChangeDept" :default-expanded-keys="defaultExpandedKey"
                  ></el-tree>
                  <el-input v-model="dataForm.orgName==null||dataForm.orgName==''?'':dataForm.orgName"
                            slot="reference" style="cursor:pointer;" placeholder="点击选择所属机构"
                            :clearable="true" @clear="clear" @focus="inputFocusTree"
                  ></el-input>
                </el-popover>-->

                <popup-tree-input :clear="clear"   placement="bottom-start" width="200"
                                  :data="tableTreeDdataDept" :props="treePropsDept"  :defaultExpandedKeys="defaultExpandedKey"
                                  :prop="propDept"  @changeProp="changeProp"
                                  nodeKey="orgId"   :clearable="true"
                                  :currentChangeHandle="handleTreeSelectChangeDept" :inputFocus="inputFocusTree" >
                  <!-- dataForm.orgName==null||dataForm.orgName==''?'':dataForm.orgName -->
                </popup-tree-input>
              </el-form-item>

            </el-col>
          </el-row><el-row>
          <el-col :span="24">

            <el-form-item label="是否显示" prop="displaying">
              <el-radio-group class=" textAlign widthAll"  v-model="dataForm.displaying">
                <el-radio  v-for="data in dictDisplayingList" class="elRadioMargin"
                           :label="data.value" :key="data.value">{{ data.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        </el-col>
        <el-col :span="12">
          <el-form-item label="字典图标" prop="dictUrl">
            <!--<el-input v-model="dataForm.dictUrl" auto-complete="off" ></el-input>-->
            <el-upload  ref="uploader"
                       class="avatar-uploader dictUPloadWidth"
                       :action="baseDictUploaderUrls"
                       :show-file-list="false"
                       :headers="uplaodHeaders"
                       name="dictIcon"
                       with-credentials
                       :on-success="handleAvatarSuccess"
                       :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl" :src="imageUrl" class="avatar"> <!-- -->
              <!--<i v-else class="el-icon-upload avatar-uploader-icon"></i>-->
              <img v-else src="../../assets/my/upload.png"
                  class="dictUPloadImgs">
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button :size="size" @click="editDialogVisible = false">{{$t('action.cancel')}}</el-button>
      <el-button :size="size" type="primary" @click="submitForm({continue:'1'})" >{{$t('action.saveContinue')}}</el-button>
      <el-button :size="size" type="primary" @click="submitForm" >{{$t('action.preservation')}}</el-button>

    </div>
  </el-dialog>
</div>

</template>

<script>
import CbTableDict from "@/views/Core/CbTableDict"
import CbTable from "@/views/Core/CbTable"
import CbButton from "@/views/Core/CbButton"
import PopupTreeInput from "@/components/PopupTreeInput"
import {format} from "@/utils/datetime"
import {baseDictUploaderUrl, baseDictUrl} from "@/utils/global"

import Cookies from "js-cookie";

export default {
    components:{
      CbTableDict,
      CbTable,
      CbButton,
      PopupTreeInput
    },
    watch: {
      filterText(val) {
        this.$refs.dictTree.filter(val);
      }
    },
    data() {
      var validateName1=(rule, value, callback) => {
        value=$.trim(value);
        if (!value) {
          return callback(new Error('字典分类名称不能为空'));
        }else{
          callback();
        }
      };
      var validateName2=(rule, value, callback) => {
        value=$.trim(value);
        if (!value) {
          return callback(new Error('字典分类编码不能为空'));
        }else{
          callback();
        }
      };
      var validateName3=(rule, value, callback) => {
        value=$.trim(value);
        if (!value) {
          return callback(new Error('字典编码不能为空'));
        }else{
          callback();
        }
      };
      var validateName4=(rule, value, callback) => {
        value=$.trim(value);
        if (!value) {
          return callback(new Error('字典值不能为空'));
        }else{
          callback();
        }
      };
      return {
        propDept:"",
        dataFormRules: {
          dictName: [{ validator: validateName1,required: true, message: '字典分类名称不能为空', trigger: 'blur' }],
          dictType: [{ validator: validateName2,required: true, message: '字典分类编码不能为空', trigger: 'blur' }],
          dictCode: [{ validator: validateName3,required: true, message: '字典编码不能为空', trigger: 'blur' }],
          dictValue: [{validator: validateName4, required: true, message: '字典值不能为空', trigger: 'blur' }],
        },
        isOpen : true, // 是否开启点击表格行也选中
        loadingTree:false,  // 加载标识
        baseDictUploaderUrls:baseDictUploaderUrl,//字典图标上传地址
        baseDictUrls:baseDictUrl,//字典图标显示地址
        uplaodHeaders:{},//字典图标上传头部信息
        filterText: '',
        imageUrl: '',
        tableTreeDdataDept: [],//树父数据
        defaultExpandedKey:[],
        treePropsDept: {
          label: 'orgName',
          children: 'children'
        },//树懒加载的props
        dictTreeProps: {
          label: 'dictName',
          children: 'list'
        },//树懒加载的props
        size: 'small',
        queryFormDefaultOptions:[
          {value: '',label: '全部' },
          {value: '0',label: '否' },
          {value: '1',label: '是' }
        ],
        queryFormDisplayOptions:[
          {value: '',label: '全部' },
          {value: '0',label: '隐藏' },
          {value: '1',label: '显示' }
        ],
        queryFormDisplaySortOptions:[
          {value: '',label: '全部' },
          {value: '1',label: '列表结构' },
          {value: '2',label: '树型结构' }
        ],
        queryFormDisplaySortOptionsTwo:[
          {value: '1',label: '列表结构' },
          {value: '2',label: '树型结构' }
        ],
        filters: {
          dictName: "",
          isdefault:"",
          dictType:"",
          dictValue:"",
          displaying:"",
          displaySort:"",
        },
        filterColumns:[],
        columns: [
          {prop:"dictType", label:"分类编码", minWidth:100},
          {prop:"dictName", label:"分类名称", minWidth:105},
          {prop:"dictCode", label:"字典编码", minWidth:105},
          {prop:"dictValue", label:"字典值", minWidth:85},
         /* {prop:"sortNum", label:"排序号", minWidth:85},*/
          {prop:"isdefault", label:"是否默认值", minWidth:95},//0是默认
          {prop:"displaying", label:"是否显示", minWidth:95},//0是显示
        ],
        listData:[],
        pageRequest: {
          totalCount: 188,//总共多少条数据
          PageSize: 10,//一页显示几条  limit
          totalPage: 63,//有多少页
          pageSizes:[10, 20, 30, 40],
          pageNum: 1,//当前页码  page
          pagerCount:5,//显示几个页数按钮
      },
        pageResult: {},
        operation: false, // true:新增, false:修改
        editDialogVisible: false, // 新增修改界面是否显示

        menuTypeList: [{type:"1",name:"目录"},{type:"2",name:"字典"}],
        dictDisplayingList:[
          {value: '0',label: '隐藏' },
          {value: '1',label: '显示' }],
        dictDefaultList:[
          {value: '0',label: '否' },
          {value: '1',label: '是' }
        ],
        // 新增修改界面数据
        dataForm: {
          remark:null,//字典描述  1、平台内2、平台外
          dictClass:null,//
          multiType:null,//单选或多选：主要针对树形控件
          dictId:null,//ID
          dictSort:"1",//字典类型
          orgName:null,//所属机构name
          orgId:null,//所属机构id
          dictType:null,//字典分类编码
          dictName:null,//字典分类名称
          displaySort:"1",//字典展现分类  下拉类型(select)树形(tree) 复选型(checkbox)单选radio
          dictCode:null,//字典编码
          dictValue:null,//字典值
          sortNum:1,//排序号
          isdefault:"1",// 默认值
          displaying:"1",//是否显示
          dictUrl:null,//字典图标
          parentType:"0",//	父分类
          attachId:null,
          ulStyle:true,
          swithToggle:true,
          iconStyleI:true
        },
        selections: [] // 列表选中列
      }
    },
    methods: {
      changeProp:function(val){
        this.propDept = val;//④外层调用组件方注册变更方法，将组件内的数据变更，同步到组件外的数据状态中

      },
      clear(){
        this.dataForm.orgId='';
        this.dataForm.orgName=null;
        this.propDept=this.dataForm.orgName;
        this.dataForm=Object.assign({}, this.dataForm);
      },
      toggleRowSelection(result) {
        this.selections=[];
        this.selections = result.list;
      },
      mouseenters:function(data){
        data.iconStyleI=false;
      },
      mouseleaves:function(data){
        data.iconStyleI=true;
      },
      mouseenter:function(data){
        data.ulStyle=false;
      },
      mouseleave:function(data){
        data.ulStyle=true;
      },
      //树选中获取右侧表格数据
      handleSelectDeptTree: function(data){
        this.$api.dict.findPage({page:this.pageRequest.pageNum,limit:this.pageRequest.PageSize,parentType:data.dictId}).then(res => {
          this.pageResult=res.data;
        });
      },
      // 获取分页数据
      findPages: function (data) {
        if(data !== null) {
          this.pageRequest = data.pageRequest
        }
        let currDatas=this.$refs.dictTree.getCurrentNode();
        this.filters.page=this.pageRequest.pageNum;
        this.filters.limit=this.pageRequest.PageSize;
        if(currDatas!==null){
          this.filters.parentType=currDatas.dictId;
        }
        this.$api.dict.findPage(this.filters).then(res => {
          this.pageResult=res.data;
        }).then(data!=null?data.callback:'');
      },
      // 批量删除
      handleDelete: function (data) {
        if(data.dictSort){
            this.$api.dict.findPage({page:this.pageRequest.pageNum,limit:this.pageRequest.PageSize,parentType:data.dictId}).then(res => {
              if(res.data.length>0){
                this.$message({message: "该数据下面存在子数据，请先删除子数据！", type: 'warning'});
                return;
              }else{
                let jj=[];
                jj.push(data.dictId);
                data.dictSort="1";
                this.delete(jj,data);
              }
            });
        }else{
          if(data.obj){
            let jj=[];
            jj.push(data.obj.dictId);
            this.delete(jj,{dictSort:"2"});
          }else{
            if(data.params){
              let jj=[];
              for(let k=0;k<data.params.length;k++){
                jj.push(data.params[k].dictId);
              }
              this.delete(jj,{dictSort:"2"});
            }
          }
        }
      },
      delete:function(jj,darass){
        this.$confirm("确认删除选中记录吗？", "提示", {
          type: "warning",
          closeOnClickModal:false
        }).then(() => {
          this.$api.dict.batchDelete(jj).then(res => {
            if(res.code!==0){//删除失败
              this.$message.error(res.msg);
              return;
            }else{
              this.$message({ message: "操作成功", type: "success" });
            }
            if(darass.dictSort==="1"){
              this.$refs.dictTree.setCurrentKey(this.listData[0].dictId);
              this.$refs.dictTree.remove(this.$refs.dictTree.getNode(darass.dictId));
              /*this.findTreeYS();*/
            }else{
              let currDatas=this.$refs.dictTree.getCurrentNode();
              if(currDatas===null){
                this.findDictDataTable();
              }else{
                /*this.$api.dict.findPage({page:this.pageRequest.currPage,limit:this.pageRequest.PageSize,parentType:currDatas.dictId}).then(res => {
                  if(res.data.list.length<1){
                    this.findDictDataTable();
                  }else{
                    this.pageResult=res.data;
                  }
                });*/
                this.handleSelectDeptTree(currDatas);
              }
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
      loadSX:function(params,dataOld){
        if(params.dictSort==="1"){
          if(dataOld.dictId){
            this.$refs.dictTree.remove(this.$refs.dictTree.getNode(params.dictId));
          }
          if(params.displaying==="1"){
            params.swithToggle=true;
          }else{
            params.swithToggle=false;
          }
          params.ulStyle=true;
          params.iconStyleI=true;
          this.$refs.dictTree.insertBefore( params,this.$refs.dictTree.getNode(this.listData[0].dictId));
          this.$refs.dictTree.setCurrentKey(params.dictId);

          let currParams={page:this.pageRequest.pageNum,limit:this.pageRequest.PageSize,parentType:params.dictId};
          //this.findTreeYS();
          this.$api.dict.findPage(currParams).then(res1 => {
            this.pageResult=res1.data;
          });
        }else{
          this.loadSXChildren(params);
        }
      },
      loadSXChildren:function(params){
        let currDatas=this.$refs.dictTree.getCurrentNode();
        if(currDatas===null){
          this.findDictDataTable();
        }else{
          this.$api.dict.findPage({page:this.pageRequest.pageNum,limit:this.pageRequest.PageSize,parentType:params.parentType}).then(res => {
            this.pageResult=res.data;
          });
        }
      },
      // 保存
      submitForm: function (continues) {
        this.$refs.dataForm.validate((valid) => {
          if (valid) {
            if(this.dataForm.dictSort==="1"){
              this.dataForm.parentType="0";
            }
            delete this.dataForm.swithToggle;
            delete this.dataForm.ulStyle;
            delete this.dataForm.iconStyleI;
            let params = Object.assign({}, this.dataForm);
            this.$confirm('确认提交吗？', '提示', { closeOnClickModal:false, type: "warning" }).then(() => {
              this.$api.dict.save(params).then((res) => {
                if(res.code === 0) {
                  this.$message({ message: '操作成功', type: 'success' });
                  if(res.data){
                    this.loadSX(res.data,params);
                  }

                  if(continues.continue){  /*  */
                    this.dataForm.dictId=null;
                    this.dataForm= Object.assign({}, this.dataForm);
                    this.propDept=this.dataForm.orgName;
                  }else{
                    this.editDialogVisible = false;
                    this.$refs['dataForm'].resetFields();
                  }
                } else {
                  this.$message({message: '操作失败, ' + res.msg, type: 'error'});
                  this.editDialogVisible = false;
                  //this.loadSX(paraimageUrlms);
                  this.$refs['dataForm'].resetFields();
                }

              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消提交'
              });
            });
          }
        })
      },
      // 显示新增界面
      handleAdd: function (data) {
        if(this.$refs['dataForm']){
          this.$refs['dataForm'].clearValidate();
        }
        this.dataForm = {
          remark:null,//字典描述  1、平台内2、平台外
          dictClass:null,//
          multiType:null,//单选或多选：主要针对树形控件
          dictId:null,//ID
          dictSort:"2",//字典类型
          orgName:null,//所属机构name
          orgId:null,//所属机构id
          dictType:null,//字典分类编码
          dictName:null,//字典分类名称
          displaySort:"1",//字典展现分类  下拉类型(select)树形(tree) 复选型(checkbox)单选radio
          dictCode:null,//字典编码
          dictValue:null,//字典值
          sortNum:1,//排序号
          isdefault:"1",// 默认值
          displaying:"1",//是否显示
          dictUrl:null,//字典图标
          parentType:null,//	父分类
          attachId:null,
          swithToggle:true,
          ulStyle:true,
          iconStyleI:true
        };
        if(data.dictSort){
          this.editDialogVisible = true
          this.operation = true
          this.dataForm.dictSort="1";
        }else{
          let currDatas=this.$refs.dictTree.getCurrentNode();
          if(currDatas===null){
            this.$message({message: "请先选择一条目录再新增字典!", type: 'warning'});
            return;
          }else{
            this.editDialogVisible = true
            this.operation = true

            this.dataForm = Object.assign({}, currDatas);
            this.dataForm.sortNum=1;
            this.dataForm.isdefault="1";
            this.dataForm.dictCode=null;
            this.dataForm.dictValue=null;
            this.dataForm.parentType=this.dataForm.dictId;
            this.dataForm.dictId=null;
            this.dataForm.dictSort="2";
          }
        }
        this.dataForm.dictUrl=null;
        this.imageUrl=null;
        this.dataForm = Object.assign({}, this.dataForm);
        this.propDept=this.dataForm.orgName;
      },
      //获取当前选中行
      selectionChange:function(params){
        this.selections=params.selections;
      },
      // 显示修改界面
      handleEdit: function (data) {
        if(this.$refs['dataForm']){
          this.$refs['dataForm'].clearValidate();
        }
        if(data.dictSort){
            this.editDialogVisible = true
            this.operation = false
            this.dataForm = Object.assign({}, data);
            this.dataForm.dictSort="1";
            if(this.dataForm.dictUrl){
              this.imageUrl=baseDictUrl+this.dataForm.dictUrl;
            }
        }else{
              this.editDialogVisible = true;
              this.operation = false;
          this.dataForm=Object.assign({}, data.row);
              for(let i=0;i<this.queryFormDisplaySortOptionsTwo.length;i++){
                if(this.dataForm.displaySort===this.queryFormDisplaySortOptionsTwo[i].label){
                  this.dataForm.displaySort=this.queryFormDisplaySortOptionsTwo[i].value;
                }
              }
              for(let i=0;i<this.dictDisplayingList.length;i++){
                if(this.dataForm.displaying===this.dictDisplayingList[i].label){
                  this.dataForm.displaying=this.dictDisplayingList[i].value;
                }
              }
              for(let i=0;i<this.dictDefaultList.length;i++){
                if(this.dataForm.isdefault===this.dictDefaultList[i].label){
                  this.dataForm.isdefault=this.dictDefaultList[i].value;
                }
              }

              if(this.dataForm.dictUrl){
                this.imageUrl=baseDictUrl+this.dataForm.dictUrl;
              }
              this.dataForm.dictSort="2";
          this.dataForm=Object.assign({},this.dataForm);
        }
        this.propDept=this.dataForm.orgName;
      },
      // 时间格式化
      dateFormat: function (row, column, cellValue, index){
        return format(row[column.property])
      },
      //头像上传成功事件
      handleAvatarSuccess(res, file) {
        if(res.code === 0){
          this.$message({ message: "图片上传成功", type: "success" });
          this.imageUrl=URL.createObjectURL(file.raw);
          this.dataForm.dictUrl=res.data.imgNamePc;
          this.dataForm.attachId=res.data.attachId;
        }else{
          this.$message.error(res.msg);
          return;
        }
        /* this.imageUrl =baseDictUrl+res.data.imgNamePc ;*/
      },
      getUploaderHeader:function(){//得到图片上传的请求头
        let token = Cookies.get('token')
        // 1. 请求开始的时候可以结合 vuex 开启全屏 loading 动画
        // 2. 带上token
        if (token) {
          this.uplaodHeaders.authorization = "Bearer" + token
        }
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isGIF = file.type === 'image/gif';
        const isPNG = file.type === 'image/png';
        const isBMP = file.type === 'image/bmp';

        /*const isJPG = file.type === 'image/jpeg';*/
        const isLt2M = file.size / 1024 / 1024 < 1;
        if (!isJPG && !isGIF && !isPNG && !isBMP ) {
          this.$message({message: "上传图片必须是JPG/GIF/PNG/BMP 格式!", type: 'warning'});
        }
        if (!isLt2M) {
          this.$message({message: "上传图片大小不能超过 1MB!", type: 'warning'});
        }
        return (isJPG || isBMP || isGIF || isPNG) && isLt2M;
      },
      // 菜单树选中
      handleTreeSelectChangeDept(data, node) {
        this.dataForm.orgId = data.orgId;
        this.dataForm.orgName = data.orgName;
        this.propDept=this.dataForm.orgName;
      },
//树懒加载时触发，进行初始化
      loadNodeDept: function(node, resolve) {
        if (node.level  === 0) {
          return resolve(this.tableTreeDdataDept);
        }else{
          this.getLoadTreeTwoDept(node,resolve);
        }
      },
      //获取第二级及其以上级的数据
      getLoadTreeTwoDept: function(node,resolve){
        this.$api.dept.findDeptTree({parentId:node.data.orgId,type:1}).then(res => {
          if(res.data.length){
            if(res.data.length>0){
              node.data.list=[];
              node.data.list=res.data;
            }
            resolve( node.data.list);
          }else{
            resolve([]);
          }

        });
      },
//树过滤// 触发页面显示配置的筛选
      filterNode(value, data) {
        if (!value) return true;
        return data.dictName.indexOf(value) !== -1;
      },
      findTreeYS:function () {
        this.loadingTree=true;
        this.$api.dict.findTree().then(res => {
          if(res.data){
            this.loadingTree=false;
            for(let i=0;i<res.data.length;i++){
              if( res.data[i].displaying==="1"){
                res.data[i].swithToggle=true;
              }else{
                res.data[i].swithToggle=false;
              }
              res.data[i].ulStyle=true;
              res.data[i].iconStyleI=true;
            }
            this.listData=res.data;
          }
        });
        this.$api.parameter.findParaType({paraType:'isdefault'}).then(res => {
          if(res.data){
            this.queryFormDefaultOptions=[];
            this.dictDefaultList=[];
            for(let i=0;i<res.data.length;i++){
              let para={};
              para.value=res.data[i].parano;
              para.label=res.data[i].paraKey;
              this.queryFormDefaultOptions.push(para);
              this.dictDefaultList.push(para);
            }
          }
        });
        this.$api.parameter.findParaType({paraType:'displaying'}).then(res => {
          if(res.data){
            this.queryFormDisplayOptions=[];
            this.dictDisplayingList=[];
            for(let i=0;i<res.data.length;i++){
              let para={};
              para.value=res.data[i].parano;
              para.label=res.data[i].paraKey;
              this.queryFormDisplayOptions.push(para);
              this.dictDisplayingList.push(para);
            }
          }
        });
        this.$api.parameter.findParaType({paraType:'displaySort'}).then(res => {
          if(res.data){
            this.queryFormDisplaySortOptions=[];
            this.queryFormDisplaySortOptionsTwo=[];
            for(let i=0;i<res.data.length;i++){
              let para={};
              para.value=res.data[i].parano;
              para.label=res.data[i].paraKey;
              this.queryFormDisplaySortOptions.push(para);
              this.queryFormDisplaySortOptionsTwo.push(para);
            }
          }
        });
        this.filterColumns = JSON.parse(JSON.stringify(this.columns));
      },
      inputFocusTree(data, node) {
        this.findDeptTree();
        event.target.setAttribute("readonly", "readonly")
      },
      //获初始化取数据
      findDictDataTable:function () {
        this.$api.dict.findPage({page:this.pageRequest.pageNum,limit:this.pageRequest.PageSize}).then(res => {
          this.pageResult=res.data;
        });
      },
      findTreeDataPlusData:function(children,h){
        if( children.state==="1"){
          children.swithToggle=true;
        }else{
          children.swithToggle=false;
        }
        children.formState=true;
        children.ulStyle=true;
        children.iconStyleI=true;
        if(h<2){
          this.defaultExpandedKey.push(children.orgId);
        }
        if(children.children){
          h++;
          for(let k=0;k<children.children.length;k++){
            this.findTreeDataPlusData(children.children[k],h);
          }
        }else{
          return;
        }

      },
      findDeptTree:function () {
        this.$api.dept.findDeptTreeShow({type:1}).then(res => {
          if(res.data){
            this.defaultExpandedKey=[];
            for(let i=0;i<res.data.length;i++){
              let h=1;
              this.findTreeDataPlusData(res.data[i],h);
            }
            this.tableTreeDdataDept=res.data;

          }
        });
      },

    },
    mounted() {
      this.findTreeYS();
      this.getUploaderHeader();
    }
  }
</script>

<style scoped>
</style>
