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
                  <span>订单编号</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item class="dictInputQueryWidth ">
                  <el-input  v-model="filters.ofSeriano" placeholder="" clearable @clear="findPage"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-form-item class="dictInputQueryLabelWidth">
                  <span>交易单号</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item class="dictInputQueryWidth ">
                  <el-input  v-model="filters.tno" placeholder="" clearable @clear="findPage"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-form-item class="dictInputQueryLabelWidth">
                  <span>微信流水号</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item class="dictInputQueryWidth ">
                  <el-input  v-model="filters.twxno" placeholder="" clearable @clear="findPage"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-collapse-item class="elCollapseItemNoBoeder elCollapseItemMarginBottom">
              <el-row>
                <el-col :span="2">
                  <el-form-item class="dictInputQueryLabelWidth">
                    <span>支付方式</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item class="dictInputQueryWidth ">
                    <cb-dict placeholder="支付方式" name="spayment" dict="tpayment" type="select" :filters="filters" :change="findPage" empty-label="全部"></cb-dict>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item class="dictInputQueryLabelWidth">
                    <span>交易时间</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item class="dictInputQueryWidth ">
                    <el-date-picker
                      v-model="dateList"
                      type="daterange"
                      value-format="yyyy-MM-dd"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-collapse-item>
          </el-collapse>
          <el-row class="elDeptFormButton dictQueryCenterButton">
            <el-col :span="24">
              <cb-button icon="fa fa-search" :label="$t('action.search')" perms="eao:teaofdtrade:query" type="primary" @click="findPage(null)"/>
              <cb-button icon="fa fa-plus" :label="$t('action.add')" perms="eao:teaofdtrade:add" type="primary" @click="handleAdd" />
            </el-col>
          </el-row>
        </el-form>
      </el-header>
      <el-main class="box_shadows bgcolor  scrollRightYDictMenu tableDict marginBottom">
        <!--表格内容栏-->
        <cb-tables :parentVue="this._self" permsBatchDelete="eao:teaofdtrade:remove"
          :tableData="pageResult" :columns="columns" :btnColumns="btnColumns">
        </cb-tables>
      </el-main>
    </el-container>


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
        dateList: [],
        dataTeaoFdTrade: {},
        size: 'small',
        filters: {
          sttime: '',
          ettime: ''
        },
        dataForm:{
        },
        columns: [
          {prop:"orgId", label:"所属机构", minWidth:70},
          {prop:"ofSeriano", label:"订单编号", minWidth:70},
          {prop:"tno", label:"交易单号", minWidth:100},
          {prop:"twxno", label:"微信流水号", minWidth:100},
          {prop:"ttime", label:"交易时间", minWidth:70},
          {prop:"ttype", label:"交易类型", minWidth:70},
          {prop:"tmoney", label:"收入金额", minWidth:70},
          {prop:"tpayment", label:"支付方式", minWidth:70},
        ],
        btnColumns: [
          // {icon: "fa fa-trash", label: "删除", perms: "eao:teaofdtrade:remove", callback: "handleDelete"},
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
        if (this.dateList.length) {
          jj.sttime = this.dateList[0]
          jj.ettime = this.dateList[1]
        }
        jj.pageNum=this.pageRequest.pageNum;
        jj.pageSize=this.pageRequest.PageSize;
        this.$api.teaofdtrade.findPage(jj).then((res) => {
          this.pageResult = res.data
        }).then(data!=null?data.callback:'')

      },
      // 删除
      handleDelete: function (data) {
        let arr = [];
        arr.push(data.row.tid);
        this.delete(arr, data)
      },
      // 批量删除
      handleBatchDelete: function (data) {
        let arr = [];
        for (let i=0; i<data.params.length; i++){
          arr.push(data.params[i].tid);
        }
        this.delete(arr, data)
      },
      //执行删除
      delete:function(jj,darass){
        this.$confirm("确认删除选中记录吗？", "提示", {
          type: "warning",
          closeOnClickModal:false
        }).then(() => {
          this.$api.teaofdtrade.doDelete(jj).then(res => {
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
        this.dataForm = {}
        this.dialogVisible = true;
        this.operation = true;
      },
      // 显示修改界面
      handleEdit: function (params) {
		if(this.$refs['dataForm']){
          this.$refs['dataForm'].clearValidate();
        }
        this.dialogVisible = true;
        this.operation = false; // 标识为修改
        this.$api.teaofdtrade.view(params.row.tid).then((res) => {
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
              this.$api.teaofdtrade.save(params).then((res) => {
                  if(res.code == 0) {
                    this.$message({ message: '操作成功', type: 'success' })
                    if(type == "saveContinue"){
                      this.dataForm = {}
                    }
                  } else {
                    this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                  }
                  this.editLoading = false
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
