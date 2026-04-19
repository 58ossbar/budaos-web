<template>
  <div class="page-container">
    <el-container class="page-container scrollAllY">
      <el-aside width="250px" class="box_shadows bgcolor LeftPadding marginBottom">
        <cb-tree-panel :parentVue="this._self" url="/api/site/tevglsiteresourceext/querySite" :btnColumns="treeBtnColumns"
                       perms="site:tevglsiteresourceext:add" :btn="true" :currentNodeKey="currentNodeKey"
                       name="siteTree" prop='{"id": "menuId", "name": "name"}' :nodeClick="changeMenu"></cb-tree-panel>
      </el-aside>
      <el-container>
        <el-main class="box_shadows bgcolor  scrollRightYDictMenu tableDict marginBottom">
          <span style="display: block; left: 1px;text-align: left;">{{msg}}</span>
          <!--折叠面板begin-->
          <el-collapse v-model="activeName">
            <el-collapse-item name="1">
              <template slot="title">
                <el-button type="primary" class="collapseItemHr"></el-button>基本信息
              </template>
              <!--表单基本信息begin-->
              <el-form :model="dataForm" label-width="100px" ref="dataForm" :rules="dataTevglSiteResourcee"
                       :size="size" style="margin-top: 0px;" :disabled="formState">

                <el-form-item label="类型" prop="type" style="text-align: left;">
                  <cb-dict placeholder="请选择状态" name="type" dict="siteType" type="radio" :dataForm="dataForm"></cb-dict>
                </el-form-item>

                <div style="float: left; width: 49%;">
                  <el-form-item label="名称" prop="name">
                    <el-input v-model="dataForm.name" auto-complete="off" autofocus @input="inputForName" ></el-input>
                  </el-form-item>
                  <el-form-item label="图标" prop="icon">
                    <el-row>
                      <el-col :span="24">
                        <icon-select @currentChangeHandle="currentChangeHandle" elPopoverWidth="600"
                                     :disabledSelected="dataForm.formState"   @changeProp="changeProp3"
                                     :prop="iconProp">
                        </icon-select>
                      </el-col>
                    </el-row>
                  </el-form-item>
                  <el-form-item label="访问地址" prop="perms">
                    <el-input v-model="dataForm.url" auto-complete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="授权标识" prop="perms">
                    <el-input v-model="dataForm.perms" auto-complete="off"></el-input>
                  </el-form-item>
                </div>
                <div style="float: left; width: 49%;">
                  <el-form-item label="排序号码" prop="orderNum">
                    <el-input-number v-model="dataForm.orderNum" class="widthAll"
                                     controls-position="right" :min="1" :max="99999">
                    </el-input-number>
                  </el-form-item>
                  <el-form-item label="是否显示" prop="display">
                    <cb-dict placeholder="请选择状态" name="display" dict="showIndex" type="select" :dataForm="dataForm"></cb-dict>
                  </el-form-item>
                  <el-form-item label="父级节点" prop="parentId">
                    <cb-tree url='/api/site/tevglsiteresourceext/querySite' :disabled="disabled" :parentVue="this._self" placeholder="" name="parentId" prop='{"id":"menuId", "name":"name"}' :dataForm="dataForm"></cb-tree>
                  </el-form-item>
                  <el-form-item label="所属机构" prop="orgId">
                    <cb-tree url='/api/sys/role/orgTree' :disabled="disabled" :parentVue="this._self" placeholder="" name="orgId" prop='{"id":"orgId", "name":"orgName"}' :dataForm="dataForm"></cb-tree>
                  </el-form-item>
                </div>
              </el-form>
              <!--表单基本信息end-->
            </el-collapse-item>
            <el-collapse-item name="2">
              <template slot="title">
                <el-button type="primary" class="collapseItemHr"></el-button>SEO设置
              </template>
              <el-form :model="dataFormSeo" label-width="100px" ref="dataFormSeo" :rules="dataFormSeoRules"
                       :size="size" style="" :disabled="formState">
                <div style="float: left;width: 49%;">
                  <el-form-item label="SEO标题" prop="seoTitle">
                    <el-input v-model="dataFormSeo.seoTitle" auto-complete="off" autofocus @input="inputForName"></el-input>
                  </el-form-item>
                </div>
                <div style="float: left;width: 49%;">
                  <el-form-item label="SEO描述" prop="seoDesc">
                    <el-input v-model="dataFormSeo.seoDesc" auto-complete="off" autofocus @input="inputForName" ></el-input>
                  </el-form-item>
                </div>
                <div style="float: left;width: 98%">
                  <el-form-item label="SEO关键字" prop="seoWord" title="注意：多个SEO关键字以逗号隔开">
                    <el-input v-model="dataFormSeo.seoWord" type="textarea" placeholder="注意：多个SEO关键字以逗号隔开" :rows="2" auto-complete="off" autofocus @input="inputForName" class="handle-font"></el-input>
                  </el-form-item>
                </div>
              </el-form>
            </el-collapse-item>
          </el-collapse>
          <el-row  class="elDeptFormButton" v-if="!formState">
            <!-- 操作按钮-->
            <el-col :span="24">
              <el-button :size="size" @click.native="cancel">{{$t('action.cancel')}}</el-button>
              <el-button v-if="operation == true" :size="size" type="primary" @click.native="submitForm('saveContinue')"  :loading="editLoading">{{$t('action.saveContinue')}}</el-button>
              <el-button :size="size" type="primary" @click.native="submitForm"  :loading="editLoading">{{$t('action.preservation')}}</el-button>
            </el-col>
          </el-row>
          <!--折叠面板end-->
        </el-main>
      </el-container>
    </el-container>

  </div>
</template>

<script>
import CbTable from "@/views/Core/CbTable"
import CbButton from "@/views/Core/CbButton"
import Cbeditor from "../../components/cbeditor/index";
import IconSelect from "@/components/IconSelect";

export default {
    components:{
      Cbeditor,
      CbTable,
      CbButton,
      IconSelect
    },
    data() {

      /**
       * 验证名称
       * @param rule
       * @param value
       * @param callback
       */
      let validateName = (rule, value, callback) => {
        if (value != null && value != ""){
          value = value.trim();
        }
        if (value == null || value == "" || value == undefined){
          callback(new Error('名称不能为空'));
        } else if (value.length > 50){
          callback(new Error('名称不能超过50个字符'));
        } else {
          callback();
        }
      };

      /**
       * 验证SEO标题
       * @param rule
       * @param value
       * @param callback
       */
      let validateSeoTitle = (rule, value, callback) => {
        if (value != null && value != ""){
          value = value.trim();
        }
        if (value == null || value == "" || value == undefined){
          callback(new Error('SEO标题不能为空'));
        } else if (value.length > 50){
          callback(new Error('SEO标题不能超过300个字符'));
        } else {
          callback();
        }
      };

      /**
       * 验证seo描述
       * @param rule
       * @param value
       * @param callback
       */
      let validateSeoDesc = (rule, value, callback) => {
        if (value != null && value != ""){
          value = value.trim();
        }
        if (value == null || value == "" || value == undefined){
          callback(new Error('SEO描述不能为空'));
        } else if (value.length > 50){
          callback(new Error('SEO标题不能超过500个字符'));
        } else {
          callback();
        }
      };

      /**
       * 验证seo关键字
       * @param rule
       * @param value
       * @param callback
       */
      let validateSeoWord = (rule, value, callback) => {
        if (value != null && value != ""){
          value = value.trim();
        }
        if (value == null || value == "" || value == undefined){
          callback(new Error('SEO关键字不能为空'));
        } else if (value.length > 50){
          callback(new Error('SEO标题不能超过1000个字符'));
        } else {
          callback();
        }
      };

      return {

        currentNodeKey : '5bb687aa97dd4084871bdc700789b5c4',
        parentId:'',

        disabled:true, // 用于控制树形组件是否点击出现
        msg : '查看', // 新增修改查看
        formState : true, // 是否禁用表单
        activeName : ['1','2'], // 折叠面板
        flag : false, // 用于标识网络请求是否成功
        extend : false, // 是否在tab标签页中显示拓展信息
        iconProp : '',
        size: 'small',
        filters: {},

        // TODO 基本信息
        dataForm:{
          menuId: '', // 主键ID
          type: '4', // 类型
          name: '', // 名称
          parentId: "0", // 父级节点
          icon: '', // 图标
          orderNum: '', // 排序号
          orgId: '', // 所属机构
          display: '1', // 是否显示,Y是N否
          url: '', // 访问地址
          perms: '', // 授权标识
        },
        // 表单验证
        dataTevglSiteResourcee: {
          name: [{ required: true, validator: validateName, trigger: 'blur' } ],
        },
        dialogVisible: false, // 是否显示新增或修改界面
        operation: false, // 显示文本，true:新增, false:修改
        editLoading: false,

        // TODO SEO表单
        dataFormSeo : {
          seoId : "",
          seoRelation : "", // 关联ID
          seoType : "", // SEO分类:1、站点 2、栏目 3、内容
          tokenForm : "",
          seoTitle : "", // 标题
          seoDesc : "", // 描述
          seoWord : "", // 关键字
        },
        menuId:'',
        saveContinue:false,
        dataFormSeoRules : {
          //seoTitle: [{ required: true, validator: validateSeoTitle, trigger: 'blur' } ],
          //seoDesc: [{ required: true, validator: validateSeoDesc, trigger: 'blur' } ],
          //seoWord: [{ required: true, validator: validateSeoWord, trigger: 'blur' } ],
        },
        dialogVisibleSeo : false, // 是否显示SEO界面
        treeBtnColumns: [
          {icon: "fa fa-plus", label: "新增", perms: "site:tevglsiteresourceext:add", callback: "handleAdd"},
          {icon: "fa fa-edit", label: "修改", perms: "site:tevglsiteresourceext:edit", callback: "handleEdit"},
          {icon: "fa fa-trash", label: "删除", perms: "site:tevglsiteresourceext:remove", callback: "handleDeleteOther"},
        ],
      }
    },

    watch: {
      filterText(val) {
        this.$refs.leftTree.filter(val);
      }
    },

    methods: {

      changeMenu(params){
        this.msg = "查看"
        this.dataFormSeo.seoRelation = params.menuId;
        this.clearFormValue()
        this.handleEdit(params, {type:'readonly'});
        if (this.dataForm){
          this.$refs['dataForm'].resetFields()
        }
      },
      clearFormValue(type){
        this.dataForm = {
          menuId: '', // 主键ID
          type: '4', // 类型
          name: '', // 名称
          parentId: "0", // 父级节点
          icon: '', // 图标
          orderNum: '', // 排序号
          orgId: '', // 所属机构
          display: '1', // 是否显示,Y是N否
          url: '', // 访问地址
          perms: '', // 授权标识
        },
        this.dataFormSeo = {
          seoId : "",
          seoRelation : "", // 关联ID
          seoType : "", // SEO分类:1、站点 2、栏目 3、内容
          tokenForm : "",
          seoTitle : "", // 标题
          seoDesc : "", // 描述
          seoWord : "", // 关键字
        }
        if (type == "saveContinue"){

        }
      },
      // TODO 新增修改相关事件 begin
      // 显示新增界面
      handleAdd: function (params) {
        this.msg = "新增"
        this.disabled = false;
        this.formState = false; // 使表单能编辑
        this.operation = true; // 文本显示为新增
        this.clearFormValue()
        this.parentId = params.menuId
        this.dataForm.parentId = this.parentId;
        this.dataForm = Object.assign({}, this.dataForm)
        this.dataFormSeo = Object.assign({}, this.dataFormSeo)
        this.dataFormSeo.seoRelation = params.menuId;
        this.changeCursorToPointer();
        // 清除表单验证
        if(this.$refs['dataForm']){
          this.$refs['dataForm'].clearValidate();
        }
      },
      // 显示修改界面
      handleEdit: function (params, obj) {
        // 清除表单验证
        if(this.$refs['dataForm']){
          this.$refs['dataForm'].clearValidate();
        }
        this.msg = "修改"
        this.disabled = false;
        this.formState = false; // 不禁用表单
        if (obj && obj.type == "readonly"){
          this.msg = "查看"
          this.formState = true; // 禁用表单
          this.disabled = true; // 禁用树形组件
          this.saveContinue = false
        }
        this.operation = false; // 标识为修改
        // TODO 基本信息
        this.clearFormValue()
        this.$api.tevglsiteresourceext.editSite(params.menuId).then((res) => {
          if (res.code == 0){
            this.dataForm = Object.assign({}, res.data)
            this.dataForm.type = this.dataForm.type.toString();
            this.iconProp = res.data.icon;
            // TODO SEO设置
            this.$api.tevglsiteresourceext.viewSeo(params.menuId).then((res) => {
              if (res.code == 0 && res.data != null){
                this.dataFormSeo = Object.assign({}, res.data)
                this.dataFormSeo.seoRelation = this.dataForm.menuId;
              }
            });
          }
        });
        if (this.saveContinue){
          this.msg = "新增"
          this.formState = false; // 禁用表单
          this.disabled = false; // 禁用树形组件
        }
      },
      // 保存
      submitForm: function (type) {
        this.$refs.dataForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              if (type == 'saveContinue' && this.parentId){
                this.dataForm.parentId = this.parentId
              }
              let params = Object.assign({}, this.dataForm);
              // TODO 保存基本信息
              this.$api.tevglsiteresourceext.saveOrUpdate(params).then((res) => {
                if(res.code == 0) {
                  // 重新加载左侧树
                  this.$refs.siteTree.reload()
                  // 重新加载父节点树
                  this.$refs.parentId.reload()
                  this.currentNodeKey = res.row.menuId;
                  // TODO 基本信息保存成功之后，接着保存SEO
                  if (this.dataForm.type == 3 || this.dataForm.type == "3"){
                    this.dataFormSeo.seoType = "1"; // SEO分类:1、站点 2、栏目 3、内容不能为空
                  } else if (this.dataForm.type == 4 || this.dataForm.type == "4"){
                    this.dataFormSeo.seoType = "2"; // SEO分类:1、站点 2、栏目 3、内容不能为空
                  }
                  let paramsSeo = Object.assign({}, this.dataFormSeo);
                  paramsSeo.seoRelation = res.menuId
                  this.$api.tevglsiteresourceext.saveOrUpdateSeo(paramsSeo).then((res) => {
                    if (res.code != 0){ this.$message({message: 'SEO信息保存失败', type: 'error'}) }
                  });
                  this.$message({ message: '操作成功', type: 'success' });
                } else {
                  this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                }
                this.editLoading = false
                this.$refs['dataForm'].resetFields();
                this.clearFormValue(type);
                this.disabled = true
                this.formState = true
                this.msg = '查看'
                if (type == 'saveContinue'){
                  this.dataForm.parentId = res.row.menuId
                  this.parentId = res.row.menuId
                  this.dataFormSeo = {
                    seoId : "",
                    seoRelation : "", // 关联ID
                    seoType : "", // SEO分类:1、站点 2、栏目 3、内容
                    tokenForm : "",
                    seoTitle : "", // 标题
                    seoDesc : "", // 描述
                    seoWord : "", // 关键字
                  }
                  this.formState = false;
                  this.disabled = false
                }
              })
            })
          }
        })
      },
      cancel(){
        this.msg = "查看"
        this.formState = true;
        this.disabled = true; // 禁用树形组件
        if(this.$refs['dataForm']){
          this.$refs['dataForm'].clearValidate();
        }

      },
      // TODO 名称
      inputForName(val){
        if (val.length > 0){
          this.clearFormRule();
        } else {

        }
      },

      // TODO 图标相关事件
      /**
       * 图标选中
       * @param params
       */
      currentChangeHandle(params) {
        this.dataForm.icon = params.data;
        this.iconProp=this.dataForm.icon;
      },
      changeProp3:function(val){
        this.iconProp = val;//④外层调用组件方注册变更方法，将组件内的数据变更，同步到组件外的数据状态中
      },

      // 控制所属机构输入框不可输入
      focusForQuery(event){
        event.target.setAttribute("readonly", "readonly")
      },

      // 删除
      handleDeleteOther: function (params) {
        this.$confirm("确认删除选中记录吗？", "提示", {
          type: "warning",
          closeOnClickModal:false
        }).then(() => {
          /*if (params.parentId == 0 || params.type == 3){
            this.$message({message: '站点暂时无法删除', type: 'warning'});
            return false
          }*/
          // TODO 删除基本信息
          this.$api.tevglsiteresourceext.doDelete(params.menuId).then(res => {
            if (res.code == 0){
              this.$message({ message: "删除成功", type: "success" });
              this.$refs.siteTree.reload()
              // TODO 删除SEO
              this.$api.tevglsiteresourceext.viewSeo(params.menuId).then((res) => {
                if (res.code == 0 && res.data != null){
                  this.$api.tevglsiteresourceext.removeSiteSeo(res.data.seoId).then((res) => {
                    if (res.code == 0){

                    } else {
                      this.$message({message: 'SEO信息删除失败', type: 'error'});
                    }
                  });
                }
              });
            } else {
              this.$message({message: res.msg, type: 'warning'});
            }
            this.clearFormValue('');
            this.disabled = true
            this.formState = true
            this.msg = '查看'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },

      // 清除表单验证
      clearFormRule(){
        // 清除表单验证
        if(this.$refs['dataForm']){
          this.$refs['dataForm'].clearValidate();
        }
      },

      removeSeo(){
        // 清除表单验证
        if(this.$refs['dataForm']){
          this.$refs['dataForm'].clearValidate();
        }
        if (this.dataFormSeo.seoId == "" || this.dataFormSeo.seoId == null){
          this.$message({message: '无待删除的数据', type: 'warning'});
          return false;
        }
        this.$confirm('确认删除吗？', '提示', {}).then(() => {
          this.$api.tevglsiteresourceext.removeSiteSeo(this.dataFormSeo.seoId).then((res) => {
            if (res.code == 0){
              this.$message({message: '删除成功', type: 'success'});
              this.tab.seoWord = "";
              this.tab.seoTitle = "";
              this.tab.seoDesc = "";
              this.dataFormSeo.seoId = "";
            }
          });
        });
      },

      // 清除SEO表单验证
      clearDataFormSeoRule(){
        this.$refs.dataFormSeo.clearValidate();
      },

      changeCursorToPointer(){
        this.$nextTick(function(){
          let parentId = document.getElementsByName("parentId")[0];
          if (parentId != null){
            parentId.style.cursor = "pointer";
          }
          let orgName = document.getElementsByName("orgName")[0];
          if (orgName != null){
            orgName.style.cursor = "pointer";
          }
        });
      },

    },
    mounted() {

    }
  }
</script>

<style scoped>

</style>

<style>
  .el-col {
    border-radius: 4px;
  }
  /*左*/
  .cb-label {
    background: #F5F5F5;
    text-align: left;
    padding-left: 8px;
    min-height: 30px;
    line-height: 30px;
    border-radius: 4px;
  }
  /*右*/
  .cb-value {
    background-color: #F2F2F2;
    /*background-color: #DCDFE6;*/
    border-radius: 4px;
    min-height: 30px;
    line-height: 30px;
  }

  /*悬浮树控件的滚动条*/
  .cb-el-tree-scroll{
    overflow:scroll;
    height:250px;
    overflow-x:hidden;
    width:100%;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

</style>
