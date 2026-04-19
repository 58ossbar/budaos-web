<template>

  <div>
    <el-container class="page-container scrollAllY">
      <el-aside width="180px" class="box_shadows bgcolor LeftPadding marginBottom">
        <el-input size="small" placeholder="输入参数名称查询" v-model="filterText"
                  class="marginBottom"  clearable  maxlength="10" type="text">
        </el-input>
        <el-tree :data="listData" :highlight-current="true" :props="dictTreeProps"
                 :node-key="listData.paraid" :filter-node-method="filterNode"
                 :element-loading-text="$t('action.loading')" v-loading="loadingTree"
                 ref="dictTree" @node-click="handleSelectDeptTree" >
        </el-tree>
      </el-aside>
      <el-container>
        <el-header  class="box_shadows bgcolor  scrollRightYDictMenu " style="height: auto;">
          <!--工具栏-->
          <el-form class="queryForm" label-width="100px" ref="queryForm" :inline="true" :model="filters" :size="size">
            <el-row class="elCollapseDict">
              <el-col :span="2">
                <el-form-item class="dictInputQueryLabelWidth">
                  <span>参数key</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item class="dictInputQueryWidth ">
                  <el-input   v-model="filters.paraKey"  maxlength="30" type="text" placeholder="参数key" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-form-item class="dictInputQueryLabelWidth">
                  <span>参数值</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item class="dictInputQueryWidth ">
                  <el-input  v-model="filters.parano"  maxlength="100" type="text" placeholder="参数值" clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="elDeptFormButton dictQueryCenterButton">
              <el-col :span="24">
                <cb-button icon="fa fa-search" :label="$t('action.search')"  type="primary" @click="findPages(null)" perms="sys:tsysparameter:query" />
                <cb-button icon="fa fa-plus" :label="$t('action.add')"  type="primary" @click="handleAdd" perms="sys:tsysparameter:add"  />
              </el-col>
            </el-row>

          </el-form>
        </el-header>
        <el-main class="box_shadows bgcolor  scrollRightYDictMenu tableDict marginBottom">
          <!--表格内容栏-->
          <cb-table permsEdit="sys:tsysparameter:edit" permsDelete="sys:tsysparameter:remove"
                    :isOpen="isOpen"
                    :data="pageResult" :columns="columns" @selectionChange="selectionChange"
                    @toggleRowSelection="toggleRowSelection"
                    @findPage="findPages" @handleEdit="handleEdit" @handleDeleteOther="handleDelete" >
          </cb-table>

          <!--<cb-table-dict permsEdit="sys:dict:edit" permsDelete="sys:dict:delete"
                         :data="pageResult" :columns="columns" :isOpen="isOpen"
                         @toggleRowSelection="toggleRowSelection"
                         @findPage="findPages" @selectionChange="selectionChange"> &lt;!&ndash;@handleEdit="handleEdit" @handleDelete="handleDelete"&ndash;&gt;
          </cb-table-dict>-->
        </el-main>
      </el-container>
    </el-container>
    <!--新增修改界面-->
    <el-dialog v-dialogDrag :title="operation?$t('action.add')+'参数':$t('action.edit')+'参数'" width="50%"
               :visible.sync="editDialogVisible" :close-on-click-modal="false">
      <el-form :model="dataForm" @keyup.enter.native="submitForm()" label-width="105px"
               :rules="dataFormRules" ref="dataForm" :size="size" class="dialogFormTop">
        <div class="displayFlex">
          <div class="parameterDiagoDiv">
            <el-form-item label="参数名称" prop="paraname" >
              <el-input v-model="dataForm.paraname" auto-complete="off" :disabled="!operation"
                        maxlength="10" type="text" placeholder="参数名称"  clearable ></el-input>
            </el-form-item>
            <el-form-item  label="参数key" prop="paraKey">
              <el-input v-model="dataForm.paraKey" auto-complete="off"  maxlength="30" type="text" placeholder="参数key" clearable ></el-input>
            </el-form-item>
            <el-form-item label="显示方式 " prop="displaysort">
              <el-select clearable  class="widthAll"  v-model="dataForm.displaysort" placeholder="请选择">
                <el-option class="dictQueryOptionPadding" v-for="item in queryFormDisplaySortOptionsTwo" :key="item.value" :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item   label="排序号" prop="paraorder">
              <el-input-number v-model="dataForm.paraorder" controls-position="right"
                               :min="1" label="排序号" :max="99999999999" class="widthAll">
              </el-input-number>
            </el-form-item>
          </div>
          <div class="parameterDiagoDiv parameterDiagoDivTwo" >
            <el-form-item label="参数标识符" prop="paraType">
              <el-input v-model="dataForm.paraType"  maxlength="20" type="text" :disabled="!operation" auto-complete="off" placeholder="参数标识符" clearable ></el-input>
            </el-form-item>
            <el-form-item  label="参数值" prop="parano">
              <el-input v-model="dataForm.parano"  maxlength="100" type="text" auto-complete="off" placeholder="参数值" clearable ></el-input>
            </el-form-item>
            <el-form-item  label="默认值" prop="isdefault">
              <el-radio-group class=" textAlign widthAll" v-model="dataForm.isdefault">
                <el-radio  v-for="data in dictDefaultList" class="elRadioMargin"
                           :label="data.value" :key="data.value">{{ data.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item   label="描述" prop="remark">
              <el-input v-model="dataForm.remark" auto-complete="off" :rows="1"  maxlength="50" type="textarea" placeholder="描述" clearable ></el-input>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="editDialogVisible = false">{{$t('action.cancel')}}</el-button>
        <el-button :size="size" type="primary" @click.native="submitForm({continue:'1'})" >{{$t('action.saveContinue')}}</el-button>
        <el-button :size="size" type="primary" @click.native="submitForm" >{{$t('action.preservation')}}</el-button>

      </div>
    </el-dialog>
  </div>

</template>

<script>
import CbTableDict from "@/views/Core/CbTableDict"
import CbTable from "@/views/Core/CbTable"
import CbButton from "@/views/Core/CbButton"
import PopupTreeInput from "@/components/PopupTreeInput"

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
          return callback(new Error('参数名称不能为空'));
        }else{
          callback();
        }
      };
      var validateName2=(rule, value, callback) => {
        value=$.trim(value);
        if (!value) {
          return callback(new Error('参数标识符不能为空'));
        }else{
          callback();
        }
      };
      var validateName3=(rule, value, callback) => {
        value=$.trim(value);
        if (!value) {
          return callback(new Error('参数key不能为空'));
        }else{
          callback();
        }
      };
      var validateName4=(rule, value, callback) => {
        value=$.trim(value);
        if (!value) {
          return callback(new Error('参数值不能为空'));
        }else{
          callback();
        }
      };
      return {
        dataFormRules: {
        paraname: [{ validator: validateName1,required: true, message: '参数名称不能为空', trigger: 'blur' }],
          paraType: [{ validator: validateName2,required: true, message: '参数标识符不能为空', trigger: 'blur' }],
          paraKey: [{validator: validateName3, required: true, message: '参数key不能为空', trigger: 'blur' }],
          parano: [{ validator: validateName4,required: true, message: '参数值不能为空', trigger: 'blur' }],
      },
        isOpen : true, // 是否开启点击表格行也选中
        loadingTree:false,  // 加载标识
        filterText: '',
        dictTreeProps: {
          label: 'paraname',
          children: 'list'
        },//树懒加载的props
        size: 'small',
        queryFormDisplaySortOptionsTwo:[
          {value: '1',label: '下拉列表' },
          {value: '2',label: '复选框' },
          {value: '3',label: '单选按钮' }
        ],
        filters: {
          paraKey: "",
          parano:"",
        },
        columns: [
          {prop:"paraname", label:"参数名称", minWidth:105},
          {prop:"paraType", label:"参数标识符", minWidth:110},
          {prop:"paraKey", label:"参数key", minWidth:105},
          {prop:"parano", label:"参数值", minWidth:85},
          {prop:"paraorder", label:"排序号", minWidth:85},
          {prop:"isdefault", label:"是否默认", minWidth:95},//0是默认
          {prop:"displaysort", label:"显示方式", minWidth:95},//0是显示
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

        dictDefaultList:[
          {value: '0',label: '否' },
          {value: '1',label: '是' }
        ],
        // 新增修改界面数据
        dataForm: {
          paraname:null,//参数名称
          paraType:null,//参数标识符
          paraKey:null,//参数key
          parano:null,//参数值
          paraid:null,//ID
          isdefault:"1",// 默认值1默认，0不默认displaysort
          paraorder:1,//排序号
          remark:null,//描述
          displaysort:"1",//显示方式：1 下拉(select)、2 复选(checkbox)、3 单选(radio)
          dictSort:"1",
        },
        dataFormOlder:{},
        selections: [], // 列表选中列
        deleteLength:[]
      }
    },
    methods: {
      toggleRowSelection(result) {
        this.selections=[];
        this.selections = result.list;
      },
      //树选中获取右侧表格数据
      handleSelectDeptTree: function(data){
        this.$api.parameter.findPage({page:this.pageRequest.pageNum,limit:this.pageRequest.PageSize,paraType:data.paraType}).then(res => {
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
          this.filters.paraType=currDatas.paraType;
        }
        this.$api.parameter.findPage(this.filters).then(res => {
          this.pageResult=res.data;
        }).then(data!=null?data.callback:'');
        /*this.pageRequest.columnFilters = {label: {name:'label', value:this.filters.label}}
              this.$api.dict.findPage(this.pageRequest).then((res) => {
                  this.pageResult = res.data
              }).then(data!=null?data.callback:'')*/
      },
      // 批量删除
      handleDelete: function (data) {
        let currDatas=this.$refs.dictTree.getCurrentNode();
        if(data.obj){
          let jj=[];
          jj.push(data.obj.paraid);
          this.delete(jj,currDatas);
        }else{
          if(data.params){
            let jj=[];
            for(let k=0;k<data.params.length;k++){
              jj.push(data.params[k].paraid);
            }
            this.delete(jj,currDatas);
          }
        }
      },
      delete:function(jj,currDatas){
        this.$confirm("确认删除选中记录吗？", "提示", {
          type: "warning",
          closeOnClickModal:false
        }).then(() => {
          this.$api.parameter.batchDelete(jj).then(res => {
            if(res.code!==0){//删除失败
              this.$message.error(res.msg);
              return;
            }else{
              this.$message({ message: "操作成功", type: "success" });
            }
              if(currDatas===null){
                this.findDictDataTable();
              }else{
                this.handleSelectDeptTree(currDatas);
                this.$api.parameter.findPage({page:this.pageRequest.pageNum,limit:this.pageRequest.PageSize,paraType:currDatas.paraType}).then(res => {
                  this.pageResult=res.data;
                  if(this.pageResult.list.length<1){
                    this.findTreeYS();
                    this.findDictDataTable();
                  }
                });

              }
            /*}*/
          }).then(currDatas!=null?currDatas.callback:'').catch(res => {
            this.$message.error("删除失败，请联系管理员!");
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      loadSX:function(params){
        if(!params.paraid){
          if(params.dictSort==="1"){
            this.findTreeYS();
          }
          this.handleSelectDeptTree(params);
        }else{
          if((this.dataFormOlder.paraname !== params.paraname)
            || (this.dataFormOlder.paraType !== params.paraType)  ){
            this.handleSelectDeptTree(params);
            this.findTreeYS();
          }else{
            this.handleSelectDeptTree(params);
          }
        }
      },
      // 保存
      submitForm: function (continues) {
        this.$refs.dataForm.validate((valid) => {
          if (valid) {
            let params = Object.assign({}, this.dataForm);
            this.$confirm('确认提交吗？', '提示', { closeOnClickModal:false,type: "warning" }).then(() => {
              this.$api.parameter.save(params).then((res) => {
                if(res.code === 0) {
                  this.$message({ message: '操作成功', type: 'success' });
                  this.loadSX(params);
                  if(continues.continue){  /* .continue*/
                    this.dataForm.paraid=null;
                    this.dataForm= Object.assign({}, this.dataForm);
                  }else{
                    this.editDialogVisible = false;

                    this.$refs['dataForm'].resetFields();
                  }
                } else {
                  this.$message({message: '操作失败, ' + res.msg, type: 'error'});
                  this.editDialogVisible = false;
                  //this.loadSX(params);
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
          paraname:null,//参数名称
          paraType:null,//参数标识符
          paraKey:null,//参数key
          parano:null,//参数值
          paraid:null,//ID
          isdefault:"1",// 默认值1默认，0不默认displaysort
          paraorder:1,//排序号
          remark:null,//描述
          displaysort:"1",//显示方式：1 下拉(select)、2 复选(checkbox)、3 单选(radio)
          dictSort:"1",
        };
        let currDatas=this.$refs.dictTree.getCurrentNode();
        this.editDialogVisible = true
        this.operation = true
        if(currDatas!==null){
          this.dataForm.paraname=currDatas.paraname;
          this.dataForm.paraType=currDatas.paraType;
          this.dataForm.dictSort="2";
          this.dataForm = Object.assign({}, this.dataForm);
        }
        this.dataForm = Object.assign({}, this.dataForm);
        this.dataFormOlder= Object.assign({}, this.dataForm);
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
        this.editDialogVisible = true;
        this.operation = false;
        this.dataForm=Object.assign({}, data.row);
        for(let i=0;i<this.queryFormDisplaySortOptionsTwo.length;i++){
          if(this.dataForm.displaysort===this.queryFormDisplaySortOptionsTwo[i].label){
            this.dataForm.displaysort=this.queryFormDisplaySortOptionsTwo[i].value;
          }
        }
        for(let i=0;i<this.dictDefaultList.length;i++){
          if(this.dataForm.isdefault===this.dictDefaultList[i].label){
            this.dataForm.isdefault=this.dictDefaultList[i].value;
          }
        }
        this.dataFormOlder= Object.assign({}, this.dataForm);
      },
//树过滤// 触发页面显示配置的筛选
      filterNode(value, data) {
        if (!value) return true;
        return data.paraname.indexOf(value) !== -1;
      },
      findTreeYS:function () {
        this.loadingTree=true;
        this.$api.parameter.findTree().then(res => {
          if(res.data){
            this.loadingTree=false;
            this.listData=res.data;
          }
        });
        this.$api.parameter.findParaType({paraType:'paradisplaysort'}).then(res => {
          if(res.data){
            this.queryFormDisplaySortOptionsTwo=[];
            for(let i=0;i<res.data.length;i++){
              let para={};
              para.value=res.data[i].parano;
              para.label=res.data[i].paraKey;
              this.queryFormDisplaySortOptionsTwo.push(para);
            }
          }
        });
        this.$api.parameter.findParaType({paraType:'isdefault'}).then(res => {
          if(res.data){
            this.dictDefaultList=[];
            for(let i=0;i<res.data.length;i++){
              let para={};
              para.value=res.data[i].parano;
              para.label=res.data[i].paraKey;
              this.dictDefaultList.push(para);
            }
          }
        });
      },
      //获初始化取数据
      findDictDataTable:function () {
        this.$api.parameter.findPage({page:this.pageRequest.pageNum,limit:this.pageRequest.PageSize}).then(res => {
          this.pageResult=res.data;
        });
      },

    },
    mounted() {
      this.findTreeYS();
    }
  }
</script>

<style scoped>


</style>
