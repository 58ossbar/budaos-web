<template >
  <el-container class="page-container scrollAllY">
    <el-aside width="250px" class="box_shadows bgcolor LeftPadding marginBottom">
      <div class="displayFlex marginBottom">
        <!--过滤输入框-->
        <el-input class="buttomMargin"  size="small" placeholder="输入机构名称查询" v-model="filterText"
                  suffix-icon="el-icon-search" clearable  maxlength="50" type="text" ><!-- @focus="inputFocus" @blur="inputBlur"-->
        </el-input>
        <cb-button class="queryButtonPlus" icon="el-icon-plus"  perms="sys:tsysorg:add"
                   type="primary"  @click="handleAdd"/>
      </div>
      <!--机构树-->
      <el-tree  v-if="tableTreeDdata.length>0" class="deptTree"  node-key="orgId" :data="tableTreeDdata"   ref="deptTree"
                :element-loading-text="$t('action.loading')" v-loading="loadingTree"
                :props="treeProps" highlight-current :expand-on-click-node="false"  :filter-node-method="filterNode"
                :default-expanded-keys="defaultExpandedKeys"  :current-node-key="tableTreeDdata[0].orgId"
               >   <!--draggable    @node-drop="nodeDrop"   -->
        <div class="fontSizeComm widthAll"   :class="{displayColor:!data.swithToggle}"
              @click="() => handleSelectDeptTree(data)"
              @mouseleave="() => mouseleaves(data)" @mouseenter="() => mouseenters(data)"
              slot-scope="{ node, data }">
          <div >
            <span>
                <i   :class="data.coverPic" class="buttomMargin" ></i>{{ node.label }}
            </span>
            <span  class="treeIconHover"
                   @mouseleave="() => mouseleave(data)" @mouseenter="() => mouseenter(data)"
                   :style="data.iconStyleI ?'display:none' : 'display:inline-block'">
              <i   class="el-icon-more buttomMargin "></i>
            </span>
            <ul class="treeHoverUl" :style="data.ulStyle ?'display:none' : 'display:inline-block'"
                @mouseenter="() => mouseenter(data)" @mouseleave="() => mouseleave(data)" >
              <li><cb-button  icon="fa fa-plus"   perms="sys:tsysorg:add" :label="$t('action.add')"
                              class="treeHoverUlButtom" @click="() => handleAdd(data)" />
              </li>
              <li><cb-button  icon="fa fa-edit"   perms="sys:tsysorg:edit" :label="$t('action.edit')"
                              class="treeHoverUlButtom" @click="() => handleEdit(data)" />
              </li>
              <li>
                <cb-button icon="fa fa-trash-o" perms="sys:tsysorg:remove" :label="$t('action.delete')"
                           class="treeHoverUlButtom"  @click="() => handleDelete(data)"  />
              </li>
              <li v-if="node.previousSibling">
                <cb-button icon="fa fa-long-arrow-up" perms="sys:tsysorg:move" :label="$t('action.moveUp')"
                           class="treeHoverUlButtom" @click="() => move(data,node.previousSibling.data,{moveUp:'0'})"  />
              </li>
              <li  v-if="node.nextSibling">
                <cb-button icon="fa fa-long-arrow-down" perms="sys:tsysorg:move" :label="$t('action.moveDown')"
                           class="treeHoverUlButtom" @click="() => move(data,node.nextSibling.data,{moveDown:'0'})"  />
              </li>
            </ul>
          </div>
        </div>
      </el-tree>
    </el-aside>
    <el-main class="box_shadows bgcolor  scrollRightYDictMenu marginBottom">
      <el-form  :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="submitForm"
                 label-width="120px" :size="size"  :disabled="dataForm.formState"
                 class="textAlign"> <!-- label-position="left"  status-icon  -->
        <el-row>
          <el-col :span="24">
            <span class="deptInfoSpan">
              {{!dataForm.orgId ? $t('action.add')+'机构' : (!dataForm.formState?$t('action.edit')+'机构':$t('action.readOnly')+'机构')}}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-collapse v-model="activeName" >  <!---->
            <el-collapse-item   name="one">  <!-- title="基本信息"-->
              <template slot="title">
                <el-button type="primary" class="collapseItemHr" ></el-button>基本信息
              </template>
              <el-row class="el_row_width">
                <el-col  :span="24">
                  <el-form-item label="机构类型" prop="orgType" >
                    <el-radio-group v-model="dataForm.orgType">
                      <el-radio class="elRadioMargin" v-for="data in menuTypeList"
                                :label="data.value" :key="data.value" >{{ data.label}}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>

              </el-row>
              <el-row class="el_row_width" >
                <el-col  :span="12">
                  <el-form-item label="机构名称" prop="orgName" >
                    <el-input v-model="dataForm.orgName" placeholder="机构名称"  maxlength="50" type="text"
                              clearable  @blur="blurInputName">
                    </el-input><!--@focus="focusInputName"-->
                  </el-form-item>
                </el-col>
                <el-col  :span="12">
                  <el-form-item label="机构简称" prop="orgShowname" >
                    <el-input v-model="dataForm.orgShowname" placeholder="机构简称" maxlength="50" type="text"
                              clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="el_row_width">
                <el-col  :span="12">
                  <el-form-item  label="全拼" prop="qp" >
                    <el-input v-model="dataForm.qp" placeholder="机构名称全拼" readonly clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col  :span="12">
                  <el-form-item  label="简拼" prop="jp" >
                    <el-input v-model="dataForm.jp" placeholder="机构名称简拼" readonly clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row  class="el_row_width">
                <el-col  :span="12">
                  <el-form-item  label="行政区码" prop="orgXzqm" >
                    <el-input  v-model="dataForm.orgXzqm" placeholder="行政区码" maxlength="19" type="text" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col  :span="12">
                  <el-form-item v-if="dataForm.parentId!=='-1' || !dataForm.formState"  label="所属机构" prop="parentName">
                    <!--<el-popover  placement="bottom-start"   trigger="click" :disabled="dataForm.formState" > &lt;!&ndash; hover &ndash;&gt;
                      <el-tree class="elTreeDeptScroll" :data="tableTreeChilrenDdata" :props="treeProps" ref="popupTreeForSave" node-key="orgId"
                               @current-change="handleTreeSelectChange" :default-expanded-keys="defaultExpandedKeysOrgin"
                      ></el-tree>
                      <el-input v-model="dataForm.parentName==null||dataForm.parentName==''?'':dataForm.parentName"
                                slot="reference" style="cursor:pointer;" placeholder="点击选择所属机构"
                                :clearable="true" @clear="clear" @focus="inputFocusTree"
                      ></el-input>  &lt;!&ndash; &ndash;&gt;
                    </el-popover>-->

                    <popup-tree-input  :clear="clear"  :disabled="dataForm.formState" width="200"
                                       :data="tableTreeChilrenDdata" :props="treeProps" :inputFocus="inputFocusTree"
                                       placement="bottom-start" :defaultExpandedKeys="defaultExpandedKeysOrgin"
                                       :prop="prop"
                                       nodeKey="orgId"   :clearable="true"  @changeProp="changeProp"
                                       :currentChangeHandle="handleTreeSelectChange">
                      <!--  :readonly="true"   dataForm.parentName==null||dataForm.parentName==''?'':dataForm.parentName  -->
                    </popup-tree-input>
                  </el-form-item>
                </el-col>
                <el-col  :span="12">
                  <el-form-item  label="是否启用" prop="swithToggle" >
                    <el-switch   v-model="dataForm.swithToggle" >
                    </el-switch>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-collapse-item>
            <el-collapse-item  name="two">
              <template slot="title">
                <el-button type="primary" class="collapseItemHr" ></el-button>更多信息
              </template>
              <el-row  class="el_row_width">
                <el-col  :span="12">
                  <el-form-item  label="通讯地址" prop="addr" >
                    <el-input v-model="dataForm.addr" placeholder="通讯地址" maxlength="100" type="text" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col  :span="12">
                  <el-form-item  label="邮政编码" prop="zip" >
                    <!--<el-input-number v-model="dataForm.zip" controls-position="right"
                                     :min="0" label="邮政编码" style="width:100%;">
                    </el-input-number>-->
                    <el-input v-model="dataForm.zip" placeholder="邮政编码" maxlength="10" type="text" clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row  class="el_row_width">
                <el-col  :span="12">
                  <el-form-item  label="机构负责人" prop="leader" >
                    <el-input v-model="dataForm.leader" placeholder="机构负责人" maxlength="16" type="text" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col  :span="12">
                  <el-form-item  label="负责人手机号码" prop="mobile" >
                    <el-input v-model="dataForm.mobile" placeholder="负责人手机号码" maxlength="14" type="text" clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row  class="el_row_width">
                <el-col  :span="12">
                  <el-form-item  label="办公电话" prop="phone" >
                    <el-input v-model="dataForm.phone" placeholder="办公电话" maxlength="30" type="text" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col  :span="12">
                  <el-form-item  label="电子邮箱" prop="email" >
                    <el-input v-model="dataForm.email" placeholder="电子邮箱" maxlength="100" type="text" clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-collapse-item>
          </el-collapse>
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
            <el-button size="mini" type="primary" icon="el-icon-circle-check" @click="submitForm" >
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
import vPinyin from '@/pingying/vue-py.js';

export default {
    components: {
      CbButton,
      PopupTreeInput,
      vPinyin
    },
    watch: {
      filterText(val) {
        this.$refs.deptTree.filter(val);
      }
    },
    data() {
      var validateOrgName=(rule, value, callback) => {
       value=$.trim(value);
        if (!value) {
          return callback(new Error('机构名称不能为空'));
        }else{
          callback();
        }
      };
      var validateOrgShowname=(rule, value, callback) => {
        value=$.trim(value);
        if (!value) {
          return callback(new Error('机构机构简称不能为空'));
        }else{
          callback();
        }
      };
     var  validateOrgXzqm=(rule, value, callback) => {
       value=$.trim(value);
      /* value=value.replace(/(^\s*)|(\s*$)/g,"");*/
       if (!value) {
         return callback(new Error('行政区码不能为空'));
       }else{
         if(isNaN(value)){
           callback(new Error('请输入数字'));
         }else{
           if ( !/^[1-9][0-9](\d){4}$/.test(value)) {
             callback(new Error('行政区码格式不正确'));
           } else {
             callback();
           }
         }
       }

     };
      var validateZip=(rule, value, callback) => {
        if (value) {
          if ( !/^[1-9]{1}(\d){5}$/.test(value)) {
            callback(new Error('邮政编码格式不正确'));
          } else {
            callback();
          }
        }else{
          callback();
        }
      };
      var validateEmail= (rule, value, callback) => {
        if (value) {
          if ( !/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value)) {
            callback(new Error('邮箱格式不正确'));
          } else {
            callback();
          }
        } else {
          callback();
        }
      };
      var validatePhone = (rule, value, callback) => {
        if (value) {
            if ( !/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test(value)) {
              callback(new Error('办公电话格式不正确'));
            } else {
              callback();
            }
        } else {
          callback();
        }
      };
      var validateMobile = (rule, value, callback) => {
        if (value) {
          if(isNaN(value)){
            callback(new Error('请输入数字'));
          }else{
            if ( !(/^1(3|4|5|7|8|6)\d{9}$/.test(value))) {
              callback(new Error('手机号码格式不正确'));
            } else {
              callback();
            }
          }
        } else {
          callback();
        }
      };
      return {
        prop:'',
        loadingTree:false,  // 加载标识
        defaultExpandedKeys:[],
        defaultExpandedKeysOrgin:[],
        filterText: '',
        treeProps: {
          label: 'orgName',
          children: 'children'
        },//树懒加载的props
        selectedOptions:[],
        tableTreeDdata: [],//树父数据
        tableTreeChilrenDdata: [],//树子数据
        activeName: 'one',//折叠面板初始化：初识显示哪个面板
        size: "small",//表单大小
        menuTypeList: [
          {value:"0",label:"公司"},
          {value:"1",label:"部门"}
          ],
        dataFormOlder:{},//表单旧数据
        dataForm: {
          orgId:null,//机构ID
          orgSn:null,//	机构排序ID
          orgName:null,//机构名称
          orgCode:null,//机构编号
          orgXzqm:null,//行政区码
          orgShowname:null,//机构显示名称
          parentId:null,//父机构ID
          parentName:null,//父机构名称
          layer:null,//层（阶次）
          remark:null,//单位简介
          orgType:"0",//机构类型:0、部门 1、公司
          addr:null,//通讯地址
          zip:null,//邮政编码
          email:null,//电子邮箱
          leader:null,//机构负责人
          phone:null,//办公电话
          fax:null,//传真号码
          state:"1",//	状态:1有效 2、停用
          mobile:null,//负责人手机号码
          jp:null,//简拼
          qp:null,//全拼
          ancestry:null,//排序
          createUserId:null,
          createTime:null,
          updateUerId:null,
          updateTime:null,
          coverPic:null,//封面图
          description:null,//机构描述
          collegeCode:null,//学院代码
          majorCode:null,//专业代码
          swithToggle:true,
          formState:false,
          ulStyle:true,
          iconStyleI:true
        },//表单数据
        dataRule: {
          orgName: [{ validator: validateOrgName,required: true, message: "机构名称不能为空", trigger: "blur" }],
          orgShowname: [{ validator: validateOrgShowname,required: true, message: "机构简称不能为空", trigger: "blur" }],
          orgXzqm: [{ validator: validateOrgXzqm,required: true, trigger: 'blur' }],
          mobile:[{ validator: validateMobile,  trigger: 'blur' }],
          phone:[{ validator: validatePhone, trigger: 'blur' }],
          email:[{ validator: validateEmail, trigger: 'blur' }],
          zip:[{ validator: validateZip, trigger: 'blur' }]
          /*,jp: [{ required: true, message: "简拼不能为空", trigger: "blur" }],
          qp: [{ required: true, message: '全拼不能为空', trigger: 'blur' }]*/
        }//表单提交规则
      };
    },
    methods:{
      changeProp:function(val){
        this.prop = val;//④外层调用组件方注册变更方法，将组件内的数据变更，同步到组件外的数据状态中

      },
      // 树上下移
      move:function(data,preNeData,moves){
        if(moves.moveUp){
          this.$confirm("确认上移选中记录吗？", "提示", {
            type: "warning",
            closeOnClickModal:false
          }).then(() => {
            this.$api.dept.move({moveId:data.orgId,targetId:preNeData.orgId}).then(res => {
              if(res.code!==0){
                this.$message.error(res.msg);
                return;
              }else{
                this.$message({ message: "上移成功", type: "success" });
                this.$refs.deptTree.remove(this.$refs.deptTree.getNode(data.orgId));
                this.$refs.deptTree.insertBefore( data, preNeData);
                this.$refs.deptTree.setCurrentKey(data.orgId);
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
            this.$api.dept.move({moveId:data.orgId,targetId:preNeData.orgId}).then(res => {
              if(res.code!==0){
                this.$message.error(res.msg);
                return;
              }else{
                this.$message({ message: "下移成功", type: "success" });
                this.$refs.deptTree.remove(this.$refs.deptTree.getNode(data.orgId));
                this.$refs.deptTree.insertAfter( data, preNeData);
                this.$refs.deptTree.setCurrentKey(data.orgId);
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
      //树拖拽时判定目标节点能否被放置时触发的事件
      /*nodeDrop:function(draggingNode, dropNode, type,event){
        this.$api.dept.updateDrag({moveId:draggingNode.data.orgId,targetId:dropNode.data.orgId,moveType:type}).then(res => {
          if(res.data){
            this.dataForm= Object.assign({}, res.data);
            this.defaultExpandedKeys=[];
            this.defaultExpandedKeys=this.defaultExpandedKeysOrgin;
            this.defaultExpandedKeys.push(res.data.parentId);
            this.$refs.deptTree.setCurrentKey(res.data.orgId);
          }
        });
      },*/
      //输入名称获取全拼和简拼
      blurInputName:function(){
        this.$api.dept.findDeptPingYing({hz:this.dataForm.orgName}).then(res => {
          if(res.data){
            this.dataForm.qp=res.data.qp;
            this.dataForm.jp = res.data.jp;
          }
        });
      },
      //树过滤// 触发页面显示配置的筛选
      filterNode(value, data, node) {
        if (!value){
          return true;
        }
        return data.orgName.indexOf(value) !== -1;
      },
      clear(){
        this.dataForm.parentId='';
        this.dataForm.parentName=null;
        this.prop =this.dataForm.parentName;
        this.dataForm=Object.assign({}, this.dataForm);
      },
      // 菜单树选中
      handleTreeSelectChange(data, node) {
        this.dataForm.parentId = data.orgId;
        this.dataForm.parentName = data.orgName;
        this.prop =this.dataForm.parentName;
      },
      inputFocusTree(data, node) {
        this.findTreeDataChilren();
        event.target.setAttribute("readonly", "readonly")
      },
      //表单取消
      handleCancel: function(){
        /*$(".el-form-item__error").css("display","none");*/
        if(this.$refs['dataForm']){
          this.$refs['dataForm'].clearValidate();
        }
        if(this.dataForm.orgId){
          this.dataForm=Object.assign({}, this.dataFormOlder);
        }else{
          let datas=this.$refs.deptTree.getCurrentNode();
          if(datas===null){
            this.dataForm=Object.assign({}, this.tableTreeDdata[0]);
          }else{
            this.dataForm=Object.assign({}, datas);
          }
        }
        this.prop =this.dataForm.parentName;
        this.dataForm.formState=true;
        if(this.dataForm.formState){
          this.activeName=['one','two'];
        }else{
          this.activeName=['one'];
        }
      },
      // 修改
      handleEdit: function(data){
        if(this.$refs['dataForm']){
          this.$refs['dataForm'].clearValidate();
        }
        /*$(".el-form-item__error").css("display","inline-block");*/
        if(data.orgId){
          if(!this.dataForm.formState){
            this.activeName=['one','two'];
          }else{
            this.activeName=['one'];
          }
          this.dataForm= Object.assign({}, data);
          this.dataForm.formState= false;
          this.dataForm= Object.assign({},  this.dataForm);
          this.dataFormOlder=Object.assign({}, this.dataForm);
          this.prop =this.dataForm.parentName;
        }else{
          let datas=this.$refs.deptTree.getCurrentNode();
          if(datas===null){
            this.$message({message: "请先选择一条记录", type: 'warning'});
            return;
          }else{
            if(!this.dataForm.formState){
              this.activeName=['one','two'];
            }else{
              this.activeName=['one'];
            }
            this.dataForm= Object.assign({},datas);
            this.dataForm.formState= false;
            this.dataForm= Object.assign({}, this.dataForm);
            this.dataFormOlder=Object.assign({}, this.dataForm);
            this.prop =this.dataForm.parentName;
          }
        }


      },
      //当前树的节点被选中
      handleSelectDeptTree: function(data){
        if(this.$refs['dataForm']){
          this.$refs['dataForm'].clearValidate();
        }
        /*$(".el-form-item__error").css("display","none");*/
        this.dataForm={};
        this.dataForm=Object.assign({}, data);
        this.prop =this.dataForm.parentName;
      },
      // 删除
      handleDelete: function(data){
        if(data.orgId){
          this.delete(data);
        }else{
          let datas=this.$refs.deptTree.getCurrentNode();
          if(datas===null){
            this.$message({message: "请先选择一条记录", type: 'warning'});
            return;
          }else{
            this.delete(datas);
          }
        }
      },
      delete:function(data){
       /* if(data.parentId==="-1"){
          this.$message({message: "该数据是根节点，不可删除！", type: 'warning'});
          return;
        }else{*/

          this.$confirm("确认删除选中记录吗？", "提示", {
            type: "warning",
            closeOnClickModal:false
          }).then(() => {
            let jj=[];
            jj.push(data.orgId);
            this.$api.dept.batchDelete(jj).then(res => {
              if(res.code!==0){//删除失败
                this.$message.error(res.msg);
                return;
              }else{
                this.$message({ message: "操作成功", type: "success" });
                if(data.parentId !== "-1"){
                  this.dataForm=Object.assign({}, this.$refs.deptTree.getNode(data.parentId).data);
                  this.$refs.deptTree.setCurrentKey(data.parentId);
                }else{
                  this.dataForm=Object.assign({},this.$refs.deptTree.getNode(this.tableTreeDdata[0].orgId).data );
                  this.$refs.deptTree.setCurrentKey(this.tableTreeDdata[0].orgId);
                }
                this.prop =this.dataForm.parentName;
                this.$refs.deptTree.remove(this.$refs.deptTree.getNode(data.orgId));
              }
              /*this.findTreeData();*/
            });

          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        /*}*/
      },
      // 表单提交
      submitForm(continues) {
        this.$refs["dataForm"].validate( (valid) => {
          if (valid) {
            if(this.dataForm.swithToggle){
              this.dataForm.state="1";
            }else{
              this.dataForm.state="2";
            }
            if(!this.dataForm.parentId){
              this.dataForm.parentId="-1";
            }
            this.dataFormOlder= Object.assign({}, this.dataForm);
            delete this.dataForm.swithToggle;
            delete  this.dataForm.formState;
            delete  this.dataForm.ulStyle;
            delete  this.dataForm.iconStyleI;
            let params = Object.assign({}, this.dataForm);
            let orgId="新增";
            if(params.orgId){
             orgId="修改";
            }
            this.$confirm("确认提交吗？", "提示", { closeOnClickModal:false, type: "warning" }).then(() => {
              this.$api.dept.save(params).then(res => {
                if (res.code === 0) {
                  this.$message({ message: orgId+"成功", type: "success" });
                  //成功后刷新
                  this.findTreeDataPlusData(res.data,1);

                  /*if( res.data.state==="1"){
                    res.data.swithToggle=true;
                  }else{
                    res.data.swithToggle=false;
                  }
                  res.data.formState=true;
                  res.data.ulStyle=true;
                  res.data.iconStyleI=true;*/

                  if(params.orgId){
                    let previousSibling=this.$refs.deptTree.getNode(res.data.orgId).previousSibling;
                    let nextSibling=this.$refs.deptTree.getNode(res.data.orgId).nextSibling;
                    this.$refs.deptTree.remove(this.$refs.deptTree.getNode(res.data.orgId));
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
                  this.prop =this.dataForm.parentName;

                  this.defaultExpandedKeys=[];
                  this.defaultExpandedKeys=this.defaultExpandedKeysOrgin;
                  this.defaultExpandedKeys.push(res.data.parentId);
                  this.$refs.deptTree.setCurrentKey(res.data.orgId);
                  //保存并继续
                  if(continues.continue){  /* .continue*/
                    this.dataForm.formState= false;
                    this.dataForm.orgId=null;
                    this.dataForm= Object.assign({}, this.dataForm);
                    this.prop =this.dataForm.parentName;
                  }
                  this.$refs["dataForm"].resetFields();
                } else {
                  this.$message.error(res.msg);
                  this.dataForm.swithToggle=this.dataFormOlder.swithToggle;
                  return;
                  /*this.findTreeData();*/
                }
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
       /* $(".el-form-item__error").css("display","inline-block");*/
        if(!this.dataForm.formState){
          this.activeName=['one','two'];
        }else{
          this.activeName=['one'];
        }
        this.dataForm ={
          orgId:null,//机构ID
          orgSn:null,//	机构排序ID
          orgName:null,//机构名称
          orgCode:null,//机构编号
          orgXzqm:null,//行政区码
          orgShowname:null,//机构显示名称
          parentId:null,//父机构ID
          parentName:null,//父机构名称
          layer:null,//层（阶次）
          remark:null,//单位简介
          orgType:"0",//机构类型:0、部门 1、公司
          addr:null,//通讯地址
          zip:null,//邮政编码
          email:null,//电子邮箱
          leader:null,//机构负责人
          phone:null,//办公电话
          fax:null,//传真号码
          state:"1",//	状态:1有效 2、停用
          mobile:null,//负责人手机号码
          jp:null,//简拼
          qp:null,//全拼
          ancestry:null,//排序
          createUserId:null,
          createTime:null,
          updateUerId:null,
          updateTime:null,
          coverPic:null,//封面图
          description:null,//机构描述
          collegeCode:null,//学院代码
          majorCode:null,//专业代码
          swithToggle:true,
          formState:false,
          ulStyle:true,
          iconStyleI:true
        };
        if(data.orgId){
          this.dataForm.parentId=data.orgId;
          this.dataForm.parentName=data.orgName;
        }else{
          let datas=this.$refs.deptTree.getCurrentNode();
          if(datas!==null){
            this.dataForm.parentId=datas.orgId;
            this.dataForm.parentName=datas.orgName;
          }
        }
        this.prop =this.dataForm.parentName;
        this.dataForm= Object.assign({}, this.dataForm);
        this.dataFormOlder=Object.assign({}, this.dataForm);
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
          this.defaultExpandedKeysOrgin.push(children.orgId);
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
      findTreeData: function() {
        this.loadingTree=true;
        this.$api.dept.findDeptTree({type:1}).then(res => {
          if(res.data){
            this.loadingTree=false;
            for(let i=0;i<res.data.length;i++){
              let h=1;
              this.findTreeDataPlusData(res.data[i],h);
            }
            this.defaultExpandedKeys=this.defaultExpandedKeysOrgin;

            this.tableTreeDdata=res.data;
            this.dataForm=Object.assign({}, this.tableTreeDdata[0]);
            this.prop =this.dataForm.parentName;
          }
        });
        this.$api.parameter.findParaType({paraType:'orgType'}).then(res => {
          if(res.data){
            this.menuTypeList=[];
            for(let i=0;i<res.data.length;i++){
              let para={};
              para.value=res.data[i].parano;
              para.label=res.data[i].paraKey;
              this.menuTypeList.push(para);
            }
          }
        });
      },
      findTreeDataChilren: function() {
        this.$api.dept.findDeptTreeShow({type:1}).then(res => {
          if(res.data){
            for(let i=0;i<res.data.length;i++){
              let h=1;
              this.findTreeDataPlusData(res.data[i],h);
            }
            this.tableTreeChilrenDdata=res.data;

          }
        });
      },
    },
    mounted() {
      this.findTreeData();
      this.$nextTick(function(){
        setTimeout(() => {
          this.checkSubmitFlg = true;
        }, 1000);
        if(!this.dataForm.formState){
          this.activeName=['one','two'];
        }else{
          this.activeName=['one'];
        }
      })
    }//页面初始化
  };
</script>

<style scoped>
</style>
<style>

</style>
