<template >
  <el-container class="page-container scrollAllY">
    <el-aside width="250px" class="box_shadows bgcolor LeftPadding marginBottom">
      <div class="displayFlex marginBottom">
        <!--过滤输入框-->
        <el-input class="buttomMargin"  size="small" placeholder="输入资源名称查询" v-model="filterText"
                  suffix-icon="el-icon-search" clearable  maxlength="25" type="text" >
        </el-input>
        <cb-button class="queryButtonPlus" icon="el-icon-plus"  perms="sys:menu:add"
                   type="primary"  @click="handleAdd"/>
      </div>
      <!--机构树-->
      <el-tree v-if="tableTreeDdata.length>0"  class="filter-tree" node-key="menuId" :data="tableTreeDdata"   ref="deptTree"
               :props="treeProps" highlight-current :expand-on-click-node="false"  :filter-node-method="filterNode"
               :default-expanded-keys="defaultExpandedKeys"  :current-node-key="tableTreeDdata[0].menuId"
               :element-loading-text="$t('action.loading')" v-loading="loadingTree"
               :load="loadNode1"   lazy>
        <!--  @node-click="handleSelectDeptTree" :render-content="renderContent"  draggable  @node-drop="nodeDrop"   -->
        <div  class="fontSizeComm widthAll"  :class="{displayColor:!data.swithToggle}"
              @click="() => handleSelectDeptTree(data)"
              @mouseleave="() => mouseleaves(data)" @mouseenter="() => mouseenters(data)"
              slot-scope="{ node, data }">
          <div >
            <span>
                 <i   :class="data.icon" class="buttomMargin" ></i>{{ node.label }}
            </span>
            <span  class="treeIconHover"
                   @mouseleave="() => mouseleave(data)" @mouseenter="() => mouseenter(data)"
                   :style="data.iconStyleI ?'display:none' : 'display:inline-block'">
              <i   class="el-icon-more buttomMargin "></i>
            </span>
            <ul class="treeHoverUl" :style="data.ulStyle ?'display:none' : 'display:inline-block'"
                @mouseenter="() => mouseenter(data)" @mouseleave="() => mouseleave(data)" >
              <li><cb-button  icon="fa fa-plus"   perms="sys:menu:add" :label="$t('action.add')"
                              class="treeHoverUlButtom" @click="() => handleAdd(data)" />
              </li>
              <li><cb-button  icon="fa fa-edit"   perms="sys:menu:edit" :label="$t('action.edit')"
                              class="treeHoverUlButtom" @click="() => handleEdit(data)" />
              </li>
              <li>
                <cb-button icon="fa fa-trash-o" perms="sys:menu:remove" :label="$t('action.delete')"
                           class="treeHoverUlButtom" @click="() => handleDelete(data)"  />
              </li>
              <li>
                <cb-button icon="fa fa-plus" perms="sys:menu:add" :label="$t('action.copy')"
                           class="treeHoverUlButtom" @click="() => handleCopy(data)"  />
              </li>
              <li v-if="data.type===1">
                <cb-button icon="fa fa-plus" perms="sys:menu:init" :label="$t('action.generate')"
                           class="treeHoverUlButtom" @click="() => handleGenerate(data)"  />
              </li>
              <li v-if="node.previousSibling">
                <cb-button icon="fa fa-long-arrow-up" perms="sys:menu:move" :label="$t('action.moveUp')"
                           class="treeHoverUlButtom" @click="() => move(data,node.previousSibling.data,{moveUp:'0'})"  />
              </li>
              <li  v-if="node.nextSibling">
                <cb-button icon="fa fa-long-arrow-down" perms="sys:menu:move" :label="$t('action.moveDown')"
                           class="treeHoverUlButtom" @click="() => move(data,node.nextSibling.data,{moveDown:'0'})"  />
              </li>
            </ul>
          </div>
        </div>
      </el-tree>
    </el-aside>
    <el-main class="box_shadows bgcolor  scrollRightYDictMenu marginBottom">
      <el-form class="dataFormSelect textAlign menuFormWidth"  :model="dataForm" ref="dataForm" :rules="dataRule"
               label-width="100px" :size="size"  :disabled="dataForm.formState"
                @keyup.enter.native="submitForm()" > <!-- label-position="left"    -->
        <el-row class="menuChaKanXuaXian">
          <el-col :span="24">
            <span class="deptInfoSpan">
              {{!dataForm.menuId ? $t('action.add')+'资源' : (!dataForm.formState?$t('action.edit')+'资源':$t('action.readOnly')+'资源')}}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col  :span="24">
            <el-form-item label="资源类型" prop="type">
              <el-radio-group v-model="dataForm.type">
                <el-radio v-for="(type, index) in menuTypeList" :label="index-1" :key="index-1">{{ type }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col  :span="12" >
            <el-form-item  label="资源名称" prop="name" >
              <el-input v-model="dataForm.name" placeholder="资源名称"  maxlength="25" type="text" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col  :span="12">
            <el-form-item  label="排序编号" prop="orderNum" >
              <el-input-number v-model="dataForm.orderNum"
                               controls-position="right" :min="1" :max="99999999999" label="排序编号" class="widthAll">
              </el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col  :span="12">
            <el-form-item label="上级菜单" prop="parentName">
             <!-- <el-popover placement="bottom-start"  trigger="click" :disabled="dataForm.formState" >
                <el-tree  class="elTreeDeptScroll" :data="tableTreeChilrenDdata" :props="treeProps" ref="popupTreeForSave"
                         @current-change="handleTreeSelectChange" lazy :load="loadNode2"
                         :default-expanded-keys="defaultExpandedKeysChilren"  node-key="menuId"
                ></el-tree>
                <el-input v-model="dataForm.parentName==null||dataForm.parentName==''?'':dataForm.parentName"
                          slot="reference" style="cursor:pointer;" placeholder="点击选择所属上级菜单"
                          :clearable="true" @clear="clearMenu" @focus="inputFocusTree"
                ></el-input>
              </el-popover>-->
              <popup-tree-input  :clear="clearMenu"  :disabled="dataForm.formState" width="200"
                                 :data="tableTreeChilrenDdata" :props="treeProps" :inputFocus="inputFocusTree"
                                 placement="bottom-start" :defaultExpandedKeys="defaultExpandedKeysChilren"
                                 :prop="propMenu" @changeProp="changeProp"
                                 nodeKey="menuId"   :clearable="true" :lazy="true" :loadNode1="loadNode2"
                                 :currentChangeHandle="handleTreeSelectChange">
                <!--  :readonly="true"  dataForm.parentName==null||dataForm.parentName==''?'':dataForm.parentName  -->
              </popup-tree-input>
            </el-form-item>
          </el-col>
          <el-col  :span="12">
            <el-form-item  label="所属机构" prop="orgName" >
             <!-- <el-popover placement="bottom-start"  trigger="click" :disabled="dataForm.formState" >
                <el-tree  class="elTreeDeptScroll" :data="tableTreeDdataDept" :props="treePropsDept" ref="popupTreeForSave"
                         @current-change="handleTreeSelectChangeDept"
                         :default-expanded-keys="defaultExpandedKey" node-key="orgId"
                ></el-tree>
                <el-input v-model="dataForm.orgName==null||dataForm.orgName==''?'':dataForm.orgName"
                          slot="reference" style="cursor:pointer;" placeholder="点击选择所属机构"
                          :clearable="true" @clear="clearDept" @focus="inputFocusTreeDept"
                ></el-input>
              </el-popover>-->
              <popup-tree-input  :clear="clearDept"  :disabled="dataForm.formState" width="200"
                                 :data="tableTreeDdataDept" :props="treePropsDept" :inputFocus="inputFocusTreeDept"
                                 placement="bottom-start" :defaultExpandedKeys="defaultExpandedKey"
                                 :prop="propDept"  @changeProp="changeProp2"
                                 nodeKey="orgId"   :clearable="true"
                                 :currentChangeHandle="handleTreeSelectChangeDept">
                <!--  :readonly="true"   dataForm.orgName==null||dataForm.orgName==''?'':dataForm.orgName -->
              </popup-tree-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="24">
            <el-form-item v-if="dataForm.type === 1" label="菜单路由" prop="url">
              <el-row>
                <el-col :span="22">
                  <el-input v-model="dataForm.url" placeholder="菜单路由"  maxlength="200" type="text" clearable></el-input>
                </el-col>
                <el-col :span="2" class="icon-list__tips">
                  <el-tooltip placement="top" effect="light" class="menuPadding">
                    <div slot="content">
                      <p>URL格式：</p>
                      <p>1.常规业务开发的功能URL，如用户管理，Views目录下页面路径为 /Sys/User, 此处填写 /sys/user。</p>
                      <p>2.嵌套外部网页，如通过菜单打开百度网页，此处填写 http://www.baidu.com，http:// 不可省略。</p>
                      <p>示例：用户管理：/sys/user 嵌套百度：http://www.baidu.com 嵌套网页：http://127.0.0.1:8000</p></div>
                    <i class="el-icon-warning"></i>
                  </el-tooltip>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="24">
            <el-form-item  label="授权标识" prop="perms" v-if="dataForm.type === 2"
                           :rules="[ { required: true, message: '授权标识不能为空', trigger: 'blur' }]">
              <el-input v-model="dataForm.perms"  maxlength="500" type="text" clearable placeholder="如: sys:user:add, sys:user:edit, sys:user:delete"></el-input>
            </el-form-item>
            <el-form-item  label="授权标识" prop="perms" v-else>
              <el-input v-model="dataForm.perms" clearable  maxlength="500" type="text"  placeholder="如: sys:user:add, sys:user:edit, sys:user:delete"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col  :span="12">
            <el-form-item v-if="dataForm.type !== 2" label="菜单图标" prop="icon">
              <el-row>
                <el-col :span="24">
                  <icon-select @currentChangeHandle="currentChangeHandle"
                               :disabledSelected="dataForm.formState"   @changeProp="changeProp3"
                               :prop="iconProp">
                  </icon-select>
                 <!-- dataForm.icon==null||dataForm.icon==''?'':dataForm.icon-->

                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item  label="是否显示" prop="swithToggle" >
              <el-switch  v-model="dataForm.swithToggle" >
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row  class="elDeptFormButton" v-if="!dataForm.formState">
          <!-- 操作按钮-->
          <el-col :span="24">
            <el-button size="mini" type="primary" icon="el-icon-circle-close" @click="handleCancel" >
              {{ $t('action.cancel') }}
            </el-button>
            <el-button size="mini" type="primary" icon="el-icon-circle-plus-outline" @click="submitForm({continue:'1'})" >
              {{ $t('action.saveContinue') }}
            </el-button>
            <el-button size="mini" type="primary" icon="el-icon-circle-check" @click="submitForm()" >
              {{ $t('action.preservation') }}
            </el-button>

          </el-col>
        </el-row>
      </el-form>
    </el-main>
  </el-container>
</template>

<script>
import CbButton from "@/views/Core/CbButton";
import PopupTreeInput from "@/components/PopupTreeInput";
import IconSelect from "@/components/IconSelect";

export default {
    components: {
      PopupTreeInput,
      IconSelect,
      CbButton
    },
    watch: {
      filterText(val) {
        this.$refs.deptTree.filter(val);
      }
    },
    data() {
      var validateName=(rule, value, callback) => {
        value=$.trim(value);
        if (!value) {
          return callback(new Error('菜单名称不能为空'));
        }else{
          callback();
        }
      };
      var validateUrl=(rule, value, callback) => {
        value=$.trim(value);
        if (!value) {
          return callback(new Error('菜单路由不能为空'));
        }else{
          callback();
        }
      };
      return {
        iconProp:'',
        propDept:'',
        propMenu:'',
        dataRule: {
          /* type:[{ required: true, message: '请选择类;型', trigger: ['blur', 'change'] }],*/
          name: [{validator: validateName, required: true, message: "菜单名称不能为空", trigger: "blur" }],
          /*parentName: [{ required: true, message: "上级菜单不能为空", trigger: "blur" }],*/
          url: [{ validator:validateUrl,required: true, message: '菜单路由不能为空', trigger: 'blur' }]
        },
        defaultExpandedKey:[],
        loadingTree:false,  // 加载标识
        defaultExpandedKeys:[],
        defaultExpandedKeysOrgin:[],
        defaultExpandedKeysChilren:[],
        filterText: '',
        treeProps: {
          label: 'name',
          children: 'list',
          isLeaf:'leaf'
        },//树懒加载的props
        treePropsDept: {
          label: 'orgName',
          children: 'children'
         /* ,isLeaf:'leaf'*/
        },//树懒加载的props
        selectedOptions:[],
        tableTreeDdata: [],//树父数据
        tableTreeDdataDept: [],//树父数据
        tableTreeChilrenDdata: [],//树子数据
        size: "small",//表单大小
        menuTypeList: ["子系统","目录", "菜单", "按钮"],  //
        dataFormOlder:{},//表单旧数据
        dataForm: {
          display:"1",//是否可见
          icon:null,
          menuId:null,
          name :null,
          orderNum:1,
          orgId: null,
          orgName:null,
          parentId:null,
          parentName:null,
          perms:null,
          remark:null,//资源描述
          resourceClass:0,//层级
          type:1,//类型   0：目录   1：菜单   2：按钮
          url:null,
          swithToggle:true,
          formState:false,
          ulStyle:true,
          iconStyleI:true
        }//表单数据

      };
    },
    methods: {// 树上下移
      changeProp3:function(val){
        this.iconProp = val;//④外层调用组件方注册变更方法，将组件内的数据变更，同步到组件外的数据状态中

      },
      changeProp:function(val){
        this.propMenu = val;//④外层调用组件方注册变更方法，将组件内的数据变更，同步到组件外的数据状态中

      },
      changeProp2:function(val){
        this.propDept = val;//④外层调用组件方注册变更方法，将组件内的数据变更，同步到组件外的数据状态中
      },
      move:function(data,preNeData,moves){
        if(moves.moveUp){
          this.$confirm("确认上移选中记录吗？", "提示", {
            type: "warning",
            closeOnClickModal:false
          }).then(() => {
            this.$api.menu.move({moveId:data.menuId,targetId:preNeData.menuId}).then(res => {
              if(res.code!==0){
                this.$message.error(res.msg);
                return;
              }else{
                this.$message({ message: "操作成功", type: "success" });
                this.$refs.deptTree.remove(this.$refs.deptTree.getNode(data.menuId));
                this.$refs.deptTree.insertBefore( data, preNeData);
                this.$refs.deptTree.setCurrentKey(data.menuId);
              }
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消上移'
            });
          });
        }
        if(moves.moveDown){
          this.$confirm("确认下移选中记录吗？", "提示", {
            type: "warning",
            closeOnClickModal:false
          }).then(() => {
            this.$api.menu.move({moveId:data.menuId,targetId:preNeData.menuId}).then(res => {
              if(res.code!==0){
                this.$message.error(res.msg);
                return;
              }else{
                this.$message({ message: "操作成功", type: "success" });
                this.$refs.deptTree.remove(this.$refs.deptTree.getNode(data.menuId));
                this.$refs.deptTree.insertAfter( data, preNeData);
                this.$refs.deptTree.setCurrentKey(data.menuId);
              }
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消下移'
            });
          });
        }

      },
      // 图标选中
      currentChangeHandle(params) {
        this.dataForm.icon = params.data;
        this.iconProp=this.dataForm.icon;
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
      //树拖拽成功完成时触发的事件
      nodeDrop:function(draggingNode,dropNode,type,event){
        this.$api.menu.updateDrag({moveId:draggingNode.data.menuId,targetId:dropNode.data.menuId,moveType:type}).then(res => {
          if(res.data){
            /* if(res.data.parentId==="-1"){
               this.$refs.deptTree.append( res.data);
             }else{
               this.$refs.deptTree.append( res.data, this.$refs.deptTree.getNode(res.data.parentId).data);
             }*/
            this.dataForm= Object.assign({}, res.data);
            this.propMenu=this.dataForm.parentName;
            this.propDept=this.dataForm.orgName;
            this.iconProp=this.dataForm.icon;
            this.defaultExpandedKeys=[];
            for(let k=0;k<this.tableTreeDdata.length;k++){
              this.defaultExpandedKeys.push(this.tableTreeDdata[k].menuId);
              this.$api.menu.findMenuTree({parentId:this.tableTreeDdata[k].menuId,type:1}).then(res => {
                if(res.data){
                  for(let r=0;r<res.data.length;r++){
                    this.defaultExpandedKeys.push(res.data[r].menuId);
                  }
                }
              });
            }
            this.defaultExpandedKeys.push(res.data.parentId);
            this.$refs.deptTree.setCurrentKey(res.data.menuId);
          }
        });
      },
      //树过滤// 触发页面显示配置的筛选
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      // 菜单树选中
      handleTreeSelectChange(data, node) {
        this.dataForm.parentId = data.menuId;
        this.dataForm.parentName = data.name;
        this.propMenu=this.dataForm.parentName;
      },
      clearMenu(){
        this.dataForm.parentId='';
        this.dataForm.parentName=null;
        this.dataForm=Object.assign({}, this.dataForm);
        this.propMenu=this.dataForm.parentName;
      },
      inputFocusTree(data, node) {
        this.findTreeDataChilren();
        event.target.setAttribute("readonly", "readonly");
      },
      inputFocusTreeDept(data, node) {
        this.findTreeDataDept();
        event.target.setAttribute("readonly", "readonly");
      },
      // 菜单树选中
      handleTreeSelectChangeDept(data, node) {
        this.dataForm.orgId = data.orgId;
        this.dataForm.orgName = data.orgName;
        this.propDept=this.dataForm.orgName;
      },
      clearDept(){
        this.dataForm.orgId='';
        this.dataForm.orgName='';
        this.dataForm=Object.assign({}, this.dataForm);
        this.propDept=this.dataForm.orgName;
      },
      //表单取消
      handleCancel: function(){
        if(this.$refs['dataForm']){
          this.$refs['dataForm'].clearValidate();
        }
       /* $(".el-form-item__error").css("display","none");*/
        if(this.dataForm.menuId){
          this.dataForm=Object.assign({}, this.dataFormOlder);
        }else{
          let datas=this.$refs.deptTree.getCurrentNode();
          if(datas===null){
            this.dataForm=Object.assign({}, this.tableTreeDdata[0]);
          }else{
            this.dataForm=Object.assign({}, datas);
          }
        }
        this.dataForm.formState=true;
        this.propMenu=this.dataForm.parentName;
        this.propDept=this.dataForm.orgName;
        this.iconProp=this.dataForm.icon;
      },
      // 修改
      handleEdit: function(data){
        if(this.$refs['dataForm']){
          this.$refs['dataForm'].clearValidate();
        }
        /*$(".el-form-item__error").css("display","inline-block");*/
        if(data.menuId){
          this.dataForm=Object.assign({}, data);
          this.dataForm.formState= false;
          this.dataForm=Object.assign({}, this.dataForm);
          this.dataFormOlder=Object.assign({}, this.dataForm);
          this.propMenu=this.dataForm.parentName;
          this.propDept=this.dataForm.orgName;
          this.iconProp=this.dataForm.icon;
        }else{
          let datas=this.$refs.deptTree.getCurrentNode();
          if(datas===null){
            this.$message({message: "请先选择一条记录", type: 'warning'});
            return;
          }else{
            this.dataForm.formState= false;
            this.dataForm=Object.assign({}, this.dataForm);
            this.dataFormOlder=Object.assign({}, this.dataForm);
            this.propMenu=this.dataForm.parentName;
            this.propDept=this.dataForm.orgName;
            this.iconProp=this.dataForm.icon;
          }
        }

      },
      //复制
      handleCopy: function(data){
        if(data.menuId){
          this.dataForm.formState= false;
          this.dataForm.menuId=null;
          this.dataForm= Object.assign({}, this.dataForm);
          this.dataFormOlder=Object.assign({}, this.dataForm);
          this.propMenu=this.dataForm.parentName;
          this.propDept=this.dataForm.orgName;
          this.iconProp=this.dataForm.icon;
        }else{
          let datas=this.$refs.deptTree.getCurrentNode();
          if(datas===null){
            this.$message({message: "请先选择一条记录", type: 'warning'});
            return;
          }else{
            this.dataForm.formState= false;
            this.dataForm.menuId=null;
            this.dataForm= Object.assign({}, this.dataForm);
            this.dataFormOlder=Object.assign({}, this.dataForm);
            this.propMenu=this.dataForm.parentName;
            this.propDept=this.dataForm.orgName;
            this.iconProp=this.dataForm.icon;
          }
        }
      },
      //生成
      handleGenerate:function(data){
        if(data.menuId){
          this.$confirm("确认一键生成增删改查按钮吗？", "提示", {
            type: "warning",
            closeOnClickModal:false
          }).then(() => {
            this.$api.menu.init(data.menuId).then(res => {
              if(res.code!==0){//删除失败
                this.$message.error(res.msg);
                return;
              }else{
                if(res.data){
                  if(res.data.length<1){
                    this.$message({ message: "增删改查四个按钮已存在", type: "success" });
                  }else{
                    this.$message({ message: "操作成功", type: "success" });
                    for(let s=0;s<res.data.length;s++){
                      if( res.data[s].display==="1"){
                        res.data[s].swithToggle=true;
                      }else{
                        res.data[s].swithToggle=false;
                      }
                      res.data[s].formState=true;
                      this.$refs.deptTree.append( res.data[s], this.$refs.deptTree.getNode(res.data[s].parentId).data);

                      this.dataForm= Object.assign({}, res.data[s]);
                      this.propMenu=this.dataForm.parentName;
                      this.propDept=this.dataForm.orgName;
                      this.iconProp=this.dataForm.icon;
                      this.defaultExpandedKeys=[];
                      for(let k=0;k<this.tableTreeDdata.length;k++){
                        this.defaultExpandedKeys.push(this.tableTreeDdata[k].menuId);
                        this.$api.menu.findMenuTree({parentId:this.tableTreeDdata[k].menuId,type:1}).then(res => {
                          if(res.data){
                            for(let r=0;r<res.data.length;r++){
                              this.defaultExpandedKeys.push(res.data[r].menuId);
                            }
                          }
                        });
                      }
                      this.defaultExpandedKeys.push(res.data[s].parentId);
                      this.$refs.deptTree.setCurrentKey(res.data[s].parentId);
                    }
                  }

                }
              }
              /*this.findTreeData();*/
            }).catch(res => {
              this.$message.error("一键生成增删改查按钮失败，请联系管理员!");
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消一键生成增删改查按钮'
            });
          });
        }else{
          let datas=this.$refs.deptTree.getCurrentNode();
          if(datas===null){
            this.$message({message: "请先选择一条记录", type: 'warning'});
            return;
          }else{
            if(datas.type!==1){
              this.$message({message: "只有菜单才可以一键生成增删改查按钮", type: 'warning'});
              return;
            }else{
              this.$confirm("确认一键生成增删改查按钮吗？", "提示", {
                type: "warning",
                closeOnClickModal:false
              }).then(() => {
                this.$api.menu.init(datas.menuId).then(res => {
                  if(res.code!==0){//删除失败
                    this.$message.error(res.msg);
                    return;
                  }else{
                    this.$message({ message: "操作成功", type: "success" });
                  }
                  this.findTreeData();
                }).catch(res => {
                  this.$message.error("一键生成增删改查按钮失败，请联系管理员!");
                });
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消一键生成增删改查按钮'
                });
              });
            }
          }
        }
      },
      //树懒加载时触发，进行初始化
      loadNode1: function(node, resolve) {
        if (node.level  === 0) {
          return resolve(this.tableTreeDdata);
        }else{
          this.getLoadTreeTwo(node,resolve);
        }
      },
      loadNode2: function(node, resolve) {
        if (node.level  === 0) {
          return resolve(this.tableTreeChilrenDdata);
        }else{
          this.getLoadTreeTwo2(node,resolve);
        }
      },
      //获取第二级及其以上级的数据
      getLoadTreeTwo: function(node,resolve){
        this.$api.menu.findMenuTree({parentId:node.data.menuId,type:1}).then(res => {
          if(res.data.length){
            for(let i=0;i<res.data.length;i++){
              if(node.level  === 1){
                this.defaultExpandedKeys.push( res.data[i].menuId);
              }
              if( res.data[i].display==="1"){
                res.data[i].swithToggle=true;
              }else{
                res.data[i].swithToggle=false;
              }
              res.data[i].formState=true;
              res.data[i].ulStyle=true;
              res.data[i].iconStyleI=true;
            }
            this.defaultExpandedKeysOrgin=this.defaultExpandedKeys;
            if(res.data.length>0){
              node.data.list=[];
              node.data.list=res.data;
            }
            resolve( node.data.list);
          }else{
            resolve( []);
          }
        });
      },
      getLoadTreeTwo2: function(node,resolve){
        this.$api.menu.findMenuTreeShow({parentId:node.data.menuId,type:1}).then(res => {
          if(res.data.length){
            for(let i=0;i<res.data.length;i++){
              if(node.level  === 1){
                this.defaultExpandedKeys.push( res.data[i].menuId);
              }
              if( res.data[i].display==="1"){
                res.data[i].swithToggle=true;
              }else{
                res.data[i].swithToggle=false;
              }
              res.data[i].formState=true;
              res.data[i].ulStyle=true;
              res.data[i].iconStyleI=true;
            }
            this.defaultExpandedKeysChilren=this.defaultExpandedKeys;
            if(res.data.length>0){
              node.data.list=[];
              node.data.list=res.data;
            }
            resolve( node.data.list);
          }else{
            resolve( []);
          }
        });
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
      //当前树的节点被选中
      handleSelectDeptTree: function(data){
        if(this.$refs['dataForm']){
          this.$refs['dataForm'].clearValidate();
        }
        /*$(".el-form-item__error").css("display","none");*/
        this.dataForm={};
        this.dataForm=Object.assign({}, data);
        this.propMenu=this.dataForm.parentName;
        this.propDept=this.dataForm.orgName;
        this.iconProp=this.dataForm.icon;
      },
      // 删除
      handleDelete: function(data){
        if(data.menuId){
          if(data.type===-1){
            this.$message({message: "该数据是根节点，不可删除！", type: 'warning'});
            return;
          }else{
            this.$api.menu.findMenuTree({parentId:data.menuId,type:1}).then(res => {
              if(res.data.length>0){
                this.$message({message: "该数据下面存在子数据，请先删除子数据！", type: 'warning'});
                return;
              }else{

                this.$confirm("确认删除选中记录吗？", "提示", {
                  type: "warning",
                  closeOnClickModal:false
                }).then(() => {
                  let jj=[];
                  jj.push(data.menuId);
                  this.$api.menu.batchDelete(data.menuId).then(res => {
                    if(res.code!==0){//删除失败
                      this.$message.error(res.msg);
                      return;
                    }else{
                      this.$message({ message: "操作成功", type: "success" });
                      this.dataForm=Object.assign({}, this.$refs.deptTree.getNode(data.parentId).data);
                      this.propMenu=this.dataForm.parentName;
                      this.propDept=this.dataForm.orgName;
                      this.iconProp=this.dataForm.icon;
                      this.$refs.deptTree.setCurrentKey(data.parentId);
                      this.$refs.deptTree.remove(this.$refs.deptTree.getNode(data.menuId));
                    }
                    /* this.findTreeData();*/
                  }).catch(res => {
                    this.$message.error("删除失败，请联系管理员!");
                  });
                }).catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消删除'
                  });
                });
              }
            });
          }
        }else{
          let datas=this.$refs.deptTree.getCurrentNode();
          if(datas===null){
            this.$message({message: "请先选择一条记录", type: 'warning'});
            return;
          }else{
            if(datas.type===-1){
              this.$message({message: "该数据是根节点，不可删除！", type: 'warning'});
              return;
            }else{
              this.$api.menu.findMenuTree({parentId:datas.menuId,type:1}).then(res => {
                if(res.data.length>0){
                  this.$message({message: "该数据下面存在子数据，请先删除子数据！", type: 'warning'});
                  return;
                }else{
                  this.$confirm("确认删除选中记录吗？", "提示", {
                    type: "warning",
                    closeOnClickModal:false
                  }).then(() => {
                    let jj=[];
                    jj.push(datas.menuId);
                    this.$api.menu.batchDelete(datas.menuId).then(res => {
                      if(res.code!==0){//删除失败
                        this.$message.error(res.msg);
                        return;
                      }else{
                        this.$message({ message: "操作成功", type: "success" });
                        this.dataForm=Object.assign({}, this.$refs.deptTree.getNode(datas.parentId).data);
                        this.propMenu=this.dataForm.parentName;
                        this.propDept=this.dataForm.orgName;
                        this.iconProp=this.dataForm.icon;
                        this.$refs.deptTree.setCurrentKey(datas.parentId);
                        this.$refs.deptTree.remove(this.$refs.deptTree.getNode(datas.menuId));
                      }
                      /* this.findTreeData();*/
                    }).catch(res => {
                      this.$message.error("删除失败，请联系管理员!");
                    });
                  }).catch(() => {
                    this.$message({
                      type: 'info',
                      message: '已取消删除'
                    });
                  });
                }
              });
            }
          }
        }

      },
      // 表单提交
      submitForm(continues) {
        this.$refs["dataForm"].validate(valid => {
          if (valid) {

            if(this.dataForm.swithToggle){
              this.dataForm.display="1";
            }else{
              this.dataForm.display="0";
            }
            if(!this.dataForm.parentId){
              this.dataForm.parentId="-1";
            }
            this.dataFormOlder= Object.assign({}, this.dataForm);
            delete this.dataForm.swithToggle;
            delete  this.dataForm.formState;
            delete this.dataForm.ulStyle;
            delete this.dataForm.iconStyleI;
            let params = Object.assign({}, this.dataForm);
            let menuId="新增";
            if(params.menuId){
              menuId="修改";
            }
            this.$confirm("确认提交吗？", "提示", { closeOnClickModal:false, type: "warning"  }).then(() => {
              this.$api.menu.save(params).then(res => {
                if (res.code === 0) {
                  this.$message({ message: menuId+"成功", type: "success" });

                  if( res.data.display==="1"){
                    res.data.swithToggle=true;
                  }else{
                    res.data.swithToggle=false;
                  }
                  res.data.formState=true;
                  res.data.ulStyle=true;
                  res.data.iconStyleI=true;

                  if(params.menuId){
                    let previousSibling=this.$refs.deptTree.getNode(res.data.menuId).previousSibling;
                    let nextSibling=this.$refs.deptTree.getNode(res.data.menuId).nextSibling;
                    this.$refs.deptTree.remove(this.$refs.deptTree.getNode(res.data.menuId));
                    if(previousSibling){
                      this.$refs.deptTree.insertAfter( res.data, previousSibling.data);
                    }else  if(nextSibling){
                      this.$refs.deptTree.insertBefore( res.data, nextSibling.data);
                    }

                  }else{
                    if(res.data.parentId==="-1"){
                      this.$refs.deptTree.append( res.data);
                    }else{
                      this.$refs.deptTree.append( res.data, this.$refs.deptTree.getNode(res.data.parentId).data);
                    }
                  }

                  this.dataForm= Object.assign({}, res.data);
                  this.propMenu=this.dataForm.parentName;
                  this.propDept=this.dataForm.orgName;
                  this.iconProp=this.dataForm.icon;
                  this.defaultExpandedKeys=[];
                  for(let k=0;k<this.tableTreeDdata.length;k++){
                    this.defaultExpandedKeys.push(this.tableTreeDdata[k].menuId);
                    this.$api.menu.findMenuTree({parentId:this.tableTreeDdata[k].menuId,type:1}).then(res => {
                      if(res.data){
                        for(let r=0;r<res.data.length;r++){
                          this.defaultExpandedKeys.push(res.data[r].menuId);
                        }
                      }
                    });
                  }
                  this.defaultExpandedKeys.push(res.data.parentId);
                  this.$refs.deptTree.setCurrentKey(res.data.menuId);

                  if(continues){ //保存并继续

                    this.dataForm.formState= false;
                    this.dataForm.menuId=null;
                    this.dataForm=Object.assign({}, this.dataForm);
                    this.propMenu=this.dataForm.parentName;
                    this.propDept=this.dataForm.orgName;
                    this.iconProp=this.dataForm.icon;
                  }
                  this.$refs["dataForm"].resetFields();
                } else {
                  this.$message.error(res.msg);
                  this.dataForm.swithToggle=this.dataFormOlder.swithToggle;
                  return;
                }
              }).catch(res => {
                this.$message.error(menuId+"失败，请联系管理员!");
              });
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消提交'
              });
            });
          }
        });
      },

      // 新增
      handleAdd: function(data){
        if(this.$refs['dataForm']){
          this.$refs['dataForm'].clearValidate();
        }
        /*$(".el-form-item__error").css("display","inline-block");*/
        this.dataForm ={
          display:"1",//是否可见
          icon:null,
          menuId:null,
          name :null,
          orderNum:1,
          orgId: null,
          orgName:null,
          parentId:null,
          parentName:null,
          perms:null,
          remark:null,//资源描述
          resourceClass:0,//层级
          type:1,//类型   0：目录   1：菜单   2：按钮
          url:null,
          swithToggle:true,
          formState:false,
          ulStyle:true,
        iconStyleI:true
        };
        if(data.menuId){
          this.dataForm.parentId=data.menuId;
          this.dataForm.parentName=data.name;
        }else{
          let datas=this.$refs.deptTree.getCurrentNode();
          if(datas!==null){
            this.dataForm.parentId=datas.menuId;
            this.dataForm.parentName=datas.name;
            this.dataForm.orgId=datas.orgId;
            this.dataForm.orgName=datas.orgName;
          }
        }
        this.dataForm= Object.assign({}, this.dataForm);
        this.propMenu=this.dataForm.parentName;
        this.propDept=this.dataForm.orgName;
        this.iconProp=this.dataForm.icon;
        this.dataFormOlder=Object.assign({}, this.dataForm);
      },
      // 获取父数据
      findTreeData: function() {
        this.loadingTree=true;
        this.$api.menu.findMenuTree({type:1}).then(res => {
          if(res.data){
            this.loadingTree=false;
            for(let i=0;i<res.data.length;i++){
              if( res.data[i].display ==="1"){
                res.data[i].swithToggle=true;
              }else{
                res.data[i].swithToggle=false;
              }
              res.data[i].formState=true;
              res.data[i].ulStyle=true;
              res.data[i].iconStyleI=true;
              this.defaultExpandedKeys.push( res.data[i].menuId);
            }
            this.tableTreeDdata=res.data;
            this.dataForm=Object.assign({}, this.tableTreeDdata[0]);
            this.propMenu=this.dataForm.parentName;
            this.propDept=this.dataForm.orgName;
            this.iconProp=this.dataForm.icon;
            this.defaultExpandedKeysOrgin=this.defaultExpandedKeys;
          }
        });
        /*this.$api.dept.findDeptTree({type:1}).then(res => {
          this.tableTreeDdataDept=res.data;
        });*/
      },

      findTreeDataDept:function(){
        this.$api.dept.findDeptTreeShow({type:1}).then(res => {
          if(res.data){
            this.defaultExpandedKey=[];
            for(let i=0;i<res.data.length;i++){
              let h=1;
              this.findTreeDataPlusData(res.data[i],h);
            }
            console.log("this.defaultExpandedKey");
            console.log(this.defaultExpandedKey);
            this.tableTreeDdataDept=res.data;

          }
        });
        /*this.$api.dept.findDeptTree({type:1}).then(res => {
          this.tableTreeDdataDept=res.data;
        });*/
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
      // 获取父数据
      findTreeDataChilren: function() {
        this.$api.menu.findMenuTreeShow().then(res => {
          for(let i=0;i<res.data.length;i++){
            if( res.data[i].display ==="1"){
              res.data[i].swithToggle=true;
            }else{
              res.data[i].swithToggle=false;
            }
            res.data[i].formState=true;
            this.defaultExpandedKeys.push( res.data[i].menuId);
          }
          this.tableTreeChilrenDdata=res.data;
          this.defaultExpandedKeysChilren=this.defaultExpandedKeys;
        });
      },
    },
    mounted() {//页面初始化
      this.findTreeData();
    }
  };
</script>

<style scoped>

</style>
