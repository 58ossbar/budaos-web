<template>
  <div class="page-container">
    <el-container class="page-container scrollAllY">
      <el-header  class="box_shadows bgcolor  scrollRightYDictMenu " style="height: auto;">
        <!--工具栏-->
        <el-form class="queryForm" label-width="100px" ref="queryForm" :inline="true" :model="filters" :size="size">
          <el-collapse class="elCollapseItemNoBoeder elCollapseDict">
	        <el-row class="elCollapseDict">
            <el-col :span="2">
              <el-form-item class="dictInputQueryLabelWidth">
                <span>公司名称</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="dictInputQueryWidth ">
                <el-input  v-model="filters.companyName" placeholder="公司名称" clearable @clear="findPage"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-form-item class="dictInputQueryLabelWidth">
                <span>联系方式</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="dictInputQueryWidth ">
                <el-input  v-model="filters.mobile" placeholder="联系方式" clearable @clear="findPage"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-form-item class="dictInputQueryLabelWidth">
                <span>合作模式</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="dictInputQueryWidth ">
                <cb-dict placeholder="请选择类型" name="type" dict="cooperation_model" type="select" :filters="filters" emptyLabel="全部" :change="findPage" clearable></cb-dict>
              </el-form-item>
            </el-col>
	        </el-row>
          <el-collapse-item class="elCollapseItemNoBoeder elCollapseItemMarginBottom">
            <el-row>
              <el-col :span="2">
                <el-form-item class="dictInputQueryLabelWidth">
                  <span>邮箱</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item class="dictInputQueryWidth ">
                  <el-input  v-model="filters.email" placeholder="邮箱" clearable @clear="findPage"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-form-item class="dictInputQueryLabelWidth">
                  <span>职位名称</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item class="dictInputQueryWidth ">
                  <el-input  v-model="filters.postName" placeholder="职位名称" clearable @clear="findPage"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-form-item class="dictInputQueryLabelWidth">
                  <span>姓名</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item class="dictInputQueryWidth ">
                  <el-input  v-model="filters.userName" placeholder="姓名" clearable @clear="findPage"></el-input>
                </el-form-item>
              </el-col>
          </el-row>
          </el-collapse-item>
	      </el-collapse>
          <el-row class="elDeptFormButton dictQueryCenterButton">
            <el-col :span="24">
              <cb-button icon="fa fa-search" :label="$t('action.search')" perms="site:tevglsitejoinus:query" type="primary" @click="findPage(null)"/>
              <cb-button icon="fa fa-plus" :label="$t('action.add')" perms="site:tevglsitejoinus:add" type="primary" @click="handleAdd" />
            </el-col>
          </el-row>
        </el-form>
      </el-header>
      <el-main class="box_shadows bgcolor  scrollRightYDictMenu tableDict marginBottom">
        <!--表格内容栏-->
        <cb-tables :parentVue="this._self" permsBatchDelete="site:tevglsitejoinus:delete"
          :tableData="pageResult" :columns="columns" :btnColumns="btnColumns">
        </cb-tables>
      </el-main>
    </el-container>
    <!--新增修改界面-->
    <el-dialog v-dialogDrag :title="operation?'新增':'修改'"  top="5vh" width="60%" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-form :model="dataForm" label-width="100px" ref="dataForm" :rules="dataTevglSiteJoinUs"
               :size="size" style="margin-top: 10px">
        <div style="width: 49%; float:left;">
          <el-form-item label="公司名称" prop="companyName">
            <el-input v-model="dataForm.companyName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="dataForm.email" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="模式(1产品代理合作2解决方案合作3实施服务合作4战略生态合作)" prop="type">
            <el-input v-model="dataForm.type" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="创建人" prop="createUserId">
            <el-input v-model="dataForm.createUserId" auto-complete="off"></el-input>
          </el-form-item>
        </div>
        <div style="width: 49%; float:left;">
          <el-form-item label="姓名" prop="userName">
            <el-input v-model="dataForm.userName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="职位名称" prop="postName">
            <el-input v-model="dataForm.postName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="mobile">
            <el-input v-model="dataForm.mobile" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="创建时间" prop="createTime">
            <el-input v-model="dataForm.createTime" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="是否联系过(Y/N)" prop="hasTouch">
            <el-input v-model="dataForm.hasTouch" auto-complete="off"></el-input>
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
import CbButton from "@/views/Core/CbButton"

export default {
    components:{
      CbButton
    },
    data() {
      return {
        dataTevglSiteJoinUs: {
          userName: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
          companyName: [{ required: true, message: "公司名称不能为空", trigger: "blur" }],
          postName: [{ required: true, message: "职位名称不能为空", trigger: "blur" }],
          email: [{ required: true, message: "邮箱不能为空", trigger: "blur" }],
          mobile: [{ required: true, message: "电话不能为空", trigger: "blur" }],
          type: [{ required: true, message: "模式(1产品代理合作2解决方案合作3实施服务合作4战略生态合作)不能为空", trigger: "blur" }],
          createTime: [{ required: true, message: "创建时间不能为空", trigger: "blur" }],
          createUserId: [{ required: true, message: "创建人不能为空", trigger: "blur" }],
          hasTouch: [{ required: true, message: "是否联系过(Y/N)不能为空", trigger: "blur" }],
        },
        size: 'small',
        filters: {
        },
        dataForm:{
          id: '', //主键id
          userName: '', //姓名
          companyName: '', //公司名称
          postName: '', //职位名称
          email: '', //邮箱
          mobile: '', //电话
          type: '', //模式(1产品代理合作2解决方案合作3实施服务合作4战略生态合作)
          createTime: '', //创建时间
          createUserId: '', //创建人
          hasTouch: '', //是否联系过(Y/N)
        },
        columns: [
          {prop:"userName", label:"姓名", minWidth:70},
          {prop:"companyName", label:"公司名称", minWidth:70},
          {prop:"postName", label:"职位名称", minWidth:70},
          {prop:"email", label:"邮箱", minWidth:70},
          {prop:"mobile", label:"联系方式", minWidth:70},
          {prop:"type", label:"合作模式", minWidth:70},
          {prop:"createTime", label:"创建时间", minWidth:70},
          //{prop:"hasTouch", label:"是否联系过(Y/N)", minWidth:100},
        ],
        btnColumns: [
          {icon: "fa fa-edit", label: "修改", perms: "site:tevglsitejoinus:edit", callback: "handleEdit"},
          {icon: "fa fa-trash", label: "删除", perms: "site:tevglsitejoinus:delete", callback: "handleDelete"},
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
      // 获取分页数据
      findPage: function (data) {
        if(data) {
          this.pageRequest = data.pageRequest
        }
        let jj = Object.assign({}, this.filters)
        jj.pageNum=this.pageRequest.pageNum;
        jj.pageSize=this.pageRequest.PageSize;
        this.$api.tevglsitejoinus.findPage(jj).then((res) => {
          this.pageResult = res.data
        }).then(data!=null?data.callback:'')

      },
      // 删除
      handleDelete: function (data) {
        let arr = [];
        arr.push(data.row.id);
        this.delete(arr, data)
      },
      // 批量删除
      handleBatchDelete: function (data) {
        let arr = [];
        for (let i=0; i<data.params.length; i++){
          arr.push(data.params[i].id);
        }
        this.delete(arr, data)
      },
      //执行删除
      delete:function(jj,darass){
        this.$confirm("确认删除选中记录吗？", "提示", {
          type: "warning",
          closeOnClickModal:false
        }).then(() => {
          this.$api.tevglsitejoinus.doDelete(jj).then(res => {
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
		if(this.$refs['dataForm']){
          this.$refs['dataForm'].clearValidate();
        }
        this.dialogVisible = true;
        this.operation = true;
        this.$refs['dataForm'].resetFields()
      },
      // 显示修改界面
      handleEdit: function (params) {
		if(this.$refs['dataForm']){
          this.$refs['dataForm'].clearValidate();
        }
        this.dialogVisible = true;
        this.operation = false; // 标识为修改
        this.$api.tevglsitejoinus.view(params.row.id).then((res) => {
          if (res.code == 0){
            this.dataForm = Object.assign({}, res.data);
          }
        });
      },
      // 修改
      submitForm: function (type) {
        this.$refs.dataForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true;
              this.dialogVisible = type == "saveContinue";
              let params = Object.assign({}, this.dataForm);
              this.$api.tevglsitejoinus.save(params).then((res) => {
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
    },
    mounted() {
    }
  }
</script>

<style scoped>

</style>
