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
	                <span>订单标识ID</span>
	              </el-form-item>
	            </el-col>
	            <el-col :span="6">
	              <el-form-item class="dictInputQueryWidth ">
	                <el-input  v-model="filters.orderId" placeholder="订单标识ID" clearable @clear="findPage"></el-input>
	              </el-form-item>
	            </el-col>
	            <el-col :span="2">
	              <el-form-item class="dictInputQueryLabelWidth">
	                <span>交易ID</span>
	              </el-form-item>
	            </el-col>
	            <el-col :span="6">
	              <el-form-item class="dictInputQueryWidth ">
	                <el-input  v-model="filters.tid" placeholder="交易ID" clearable @clear="findPage"></el-input>
	              </el-form-item>
	            </el-col>
	            <el-col :span="2">
	              <el-form-item class="dictInputQueryLabelWidth">
	                <span>退款申请时间</span>
	              </el-form-item>
	            </el-col>
	            <el-col :span="6">
	              <el-form-item class="dictInputQueryWidth ">
	                <el-input  v-model="filters.rbTime" placeholder="退款申请时间" clearable @clear="findPage"></el-input>
	              </el-form-item>
	            </el-col>
	        </el-row>
            <el-collapse-item class="elCollapseItemNoBoeder elCollapseItemMarginBottom">
              <el-row>
	            <el-col :span="2">
	              <el-form-item class="dictInputQueryLabelWidth">
	                <span>退款处理时间</span>
	              </el-form-item>
	            </el-col>
	            <el-col :span="6">
	              <el-form-item class="dictInputQueryWidth ">
	                <el-input  v-model="filters.rbDealtime" placeholder="退款处理时间" clearable @clear="findPage"></el-input>
	              </el-form-item>
	            </el-col>
	            <el-col :span="2">
	              <el-form-item class="dictInputQueryLabelWidth">
	                <span>退款处理人</span>
	              </el-form-item>
	            </el-col>
	            <el-col :span="6">
	              <el-form-item class="dictInputQueryWidth ">
	                <el-input  v-model="filters.rbDealman" placeholder="退款处理人" clearable @clear="findPage"></el-input>
	              </el-form-item>
	            </el-col>
	            <!--<el-col :span="2">
	              <el-form-item class="dictInputQueryLabelWidth">
	                <span>退款原因</span>
	              </el-form-item>
	            </el-col>
	            <el-col :span="6">
	              <el-form-item class="dictInputQueryWidth ">
	                <el-input  v-model="filters.rbReason" placeholder="退款原因" clearable @clear="findPage"></el-input>
	              </el-form-item>
	            </el-col>
	            <el-col :span="2">
	              <el-form-item class="dictInputQueryLabelWidth">
	                <span>处理说明</span>
	              </el-form-item>
	            </el-col>
	            <el-col :span="6">
	              <el-form-item class="dictInputQueryWidth ">
	                <el-input  v-model="filters.rbExplain" placeholder="处理说明" clearable @clear="findPage"></el-input>
	              </el-form-item>
	            </el-col>
	            <el-col :span="2">
	              <el-form-item class="dictInputQueryLabelWidth">
	                <span>退款金额</span>
	              </el-form-item>
	            </el-col>
	            <el-col :span="6">
	              <el-form-item class="dictInputQueryWidth ">
	                <el-input  v-model="filters.rbMoney" placeholder="退款金额" clearable @clear="findPage"></el-input>
	              </el-form-item>
	            </el-col>
	            <el-col :span="2">
	              <el-form-item class="dictInputQueryLabelWidth">
	                <span>处理结果 ,成功，打回等</span>
	              </el-form-item>
	            </el-col>
	            <el-col :span="6">
	              <el-form-item class="dictInputQueryWidth ">
	                <el-input  v-model="filters.rbResult" placeholder="处理结果 ,成功，打回等" clearable @clear="findPage"></el-input>
	              </el-form-item>
	            </el-col>
	            <el-col :span="2">
	              <el-form-item class="dictInputQueryLabelWidth">
	                <span>机构ID</span>
	              </el-form-item>
	            </el-col>
	            <el-col :span="6">
	              <el-form-item class="dictInputQueryWidth ">
	                <el-input  v-model="filters.orgId" placeholder="机构ID" clearable @clear="findPage"></el-input>
	              </el-form-item>
	            </el-col>
	            <el-col :span="2">
	              <el-form-item class="dictInputQueryLabelWidth">
	                <span>交易单号：格式yyyyMMdd0000000</span>
	              </el-form-item>
	            </el-col>
	            <el-col :span="6">
	              <el-form-item class="dictInputQueryWidth ">
	                <el-input  v-model="filters.tno" placeholder="交易单号：格式yyyyMMdd0000000" clearable @clear="findPage"></el-input>
	              </el-form-item>
	            </el-col>
	            <el-col :span="2">
	              <el-form-item class="dictInputQueryLabelWidth">
	                <span>微信流水号</span>
	              </el-form-item>
	            </el-col>
	            <el-col :span="6">
	              <el-form-item class="dictInputQueryWidth ">
	                <el-input  v-model="filters.twxno" placeholder="微信流水号" clearable @clear="findPage"></el-input>
	              </el-form-item>
	            </el-col>
	            <el-col :span="2">
	              <el-form-item class="dictInputQueryLabelWidth">
	                <span>交易时间</span>
	              </el-form-item>
	            </el-col>
	            <el-col :span="6">
	              <el-form-item class="dictInputQueryWidth ">
	                <el-input  v-model="filters.ttime" placeholder="交易时间" clearable @clear="findPage"></el-input>
	              </el-form-item>
	            </el-col>
	            <el-col :span="2">
	              <el-form-item class="dictInputQueryLabelWidth">
	                <span>交易类型：来源于字典：活动、服务、交账</span>
	              </el-form-item>
	            </el-col>
	            <el-col :span="6">
	              <el-form-item class="dictInputQueryWidth ">
	                <el-input  v-model="filters.ttype" placeholder="交易类型：来源于字典：活动、服务、交账" clearable @clear="findPage"></el-input>
	              </el-form-item>
	            </el-col>
	            <el-col :span="2">
	              <el-form-item class="dictInputQueryLabelWidth">
	                <span>退款申请来源：微信、线下</span>
	              </el-form-item>
	            </el-col>
	            <el-col :span="6">
	              <el-form-item class="dictInputQueryWidth ">
	                <el-input  v-model="filters.tchannel" placeholder="退款申请来源：微信、线下" clearable @clear="findPage"></el-input>
	              </el-form-item>
	            </el-col>
	            <el-col :span="2">
	              <el-form-item class="dictInputQueryLabelWidth">
	                <span>状态：收入、退款中、退款成功、已关闭</span>
	              </el-form-item>
	            </el-col>
	            <el-col :span="6">
	              <el-form-item class="dictInputQueryWidth ">
	                <el-input  v-model="filters.tstate" placeholder="状态：收入、退款中、退款成功、已关闭" clearable @clear="findPage"></el-input>
	              </el-form-item>
	            </el-col>
	            <el-col :span="2">
	              <el-form-item class="dictInputQueryLabelWidth">
	                <span>学员ID</span>
	              </el-form-item>
	            </el-col>
	            <el-col :span="6">
	              <el-form-item class="dictInputQueryWidth ">
	                <el-input  v-model="filters.ciId" placeholder="学员ID" clearable @clear="findPage"></el-input>
	              </el-form-item>
	            </el-col>
	            <el-col :span="2">
	              <el-form-item class="dictInputQueryLabelWidth">
	                <span>订单编号</span>
	              </el-form-item>
	            </el-col>
	            <el-col :span="6">
	              <el-form-item class="dictInputQueryWidth ">
	                <el-input  v-model="filters.ofSeriano" placeholder="订单编号" clearable @clear="findPage"></el-input>
	              </el-form-item>
	            </el-col>
	            <el-col :span="2">
	              <el-form-item class="dictInputQueryLabelWidth">
	                <span>退款编号</span>
	              </el-form-item>
	            </el-col>
	            <el-col :span="6">
	              <el-form-item class="dictInputQueryWidth ">
	                <el-input  v-model="filters.rbSeriano" placeholder="退款编号" clearable @clear="findPage"></el-input>
	              </el-form-item>
	            </el-col>-->
	          </el-row>
	        </el-collapse-item>
	      </el-collapse>
          <el-row class="elDeptFormButton dictQueryCenterButton">
            <el-col :span="24">
              <cb-button icon="fa fa-search" :label="$t('action.search')" perms="eao:teaofdrefusebill:query" type="primary" @click="findPage(null)"/>
              <cb-button icon="fa fa-plus" :label="$t('action.add')" perms="eao:teaofdrefusebill:add" type="primary" @click="handleAdd" />
            </el-col>
          </el-row>
        </el-form>
      </el-header>
      <el-main class="box_shadows bgcolor  scrollRightYDictMenu tableDict marginBottom">
        <!--表格内容栏-->
        <cb-tables :parentVue="this._self" permsBatchDelete="eao:teaofdrefusebill:remove"
          :tableData="pageResult" :columns="columns" :btnColumns="btnColumns">
        </cb-tables>
      </el-main>
    </el-container>
    <!--新增修改界面-->
    <el-dialog v-dialogDrag :title="operation?'新增':'修改'"  top="5vh" width="60%" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-form :model="dataForm" label-width="100px" ref="dataForm" :rules="dataTeaoFdRefusebill"
               :size="size" style="margin-top: 10px">
        <div style="width: 49%; float:left;">
          <el-form-item label="交易ID" prop="tid">
            <el-input v-model="dataForm.tid" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="退款处理时间" prop="rbDealtime">
            <el-input v-model="dataForm.rbDealtime" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="退款原因" prop="rbReason">
            <el-input v-model="dataForm.rbReason" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="退款金额" prop="rbMoney">
            <el-input v-model="dataForm.rbMoney" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="机构ID" prop="orgId">
            <el-input v-model="dataForm.orgId" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="微信流水号" prop="twxno">
            <el-input v-model="dataForm.twxno" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="交易类型：来源于字典：活动、服务、交账" prop="ttype">
            <el-input v-model="dataForm.ttype" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="状态：收入、退款中、退款成功、已关闭" prop="tstate">
            <el-input v-model="dataForm.tstate" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="订单编号" prop="ofSeriano">
            <el-input v-model="dataForm.ofSeriano" auto-complete="off"></el-input>
          </el-form-item>
        </div>
        <div style="width: 49%; float:left;">
          <el-form-item label="订单标识ID" prop="orderId">
            <el-input v-model="dataForm.orderId" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="退款申请时间" prop="rbTime">
            <el-input v-model="dataForm.rbTime" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="退款处理人" prop="rbDealman">
            <el-input v-model="dataForm.rbDealman" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="处理说明" prop="rbExplain">
            <el-input v-model="dataForm.rbExplain" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="处理结果 ,成功，打回等" prop="rbResult">
            <el-input v-model="dataForm.rbResult" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="交易单号：格式yyyyMMdd0000000" prop="tno">
            <el-input v-model="dataForm.tno" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="交易时间" prop="ttime">
            <el-input v-model="dataForm.ttime" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="退款申请来源：微信、线下" prop="tchannel">
            <el-input v-model="dataForm.tchannel" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="学员ID" prop="ciId">
            <el-input v-model="dataForm.ciId" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="退款编号" prop="rbSeriano">
            <el-input v-model="dataForm.rbSeriano" auto-complete="off"></el-input>
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
        dataTeaoFdRefusebill: {
          orderId: [{ required: true, message: "订单标识ID不能为空", trigger: "blur" }],
          tid: [{ required: true, message: "交易ID不能为空", trigger: "blur" }],
          rbTime: [{ required: true, message: "退款申请时间不能为空", trigger: "blur" }],
          rbDealtime: [{ required: true, message: "退款处理时间不能为空", trigger: "blur" }],
          rbDealman: [{ required: true, message: "退款处理人不能为空", trigger: "blur" }],
          rbReason: [{ required: true, message: "退款原因不能为空", trigger: "blur" }],
          rbExplain: [{ required: true, message: "处理说明不能为空", trigger: "blur" }],
          rbMoney: [{ required: true, message: "退款金额不能为空", trigger: "blur" }],
          rbResult: [{ required: true, message: "处理结果 ,成功，打回等不能为空", trigger: "blur" }],
          orgId: [{ required: true, message: "机构ID不能为空", trigger: "blur" }],
          tno: [{ required: true, message: "交易单号：格式yyyyMMdd0000000不能为空", trigger: "blur" }],
          twxno: [{ required: true, message: "微信流水号不能为空", trigger: "blur" }],
          ttime: [{ required: true, message: "交易时间不能为空", trigger: "blur" }],
          ttype: [{ required: true, message: "交易类型：来源于字典：活动、服务、交账不能为空", trigger: "blur" }],
          tchannel: [{ required: true, message: "退款申请来源：微信、线下不能为空", trigger: "blur" }],
          tstate: [{ required: true, message: "状态：收入、退款中、退款成功、已关闭不能为空", trigger: "blur" }],
          ciId: [{ required: true, message: "学员ID不能为空", trigger: "blur" }],
          ofSeriano: [{ required: true, message: "订单编号不能为空", trigger: "blur" }],
          rbSeriano: [{ required: true, message: "退款编号不能为空", trigger: "blur" }],
        },
        size: 'small',
        filters: {
        },
        dataForm:{
          rbId: '', //退款信息ID
          orderId: '', //订单标识ID
          tid: '', //交易ID
          rbTime: '', //退款申请时间
          rbDealtime: '', //退款处理时间
          rbDealman: '', //退款处理人
          rbReason: '', //退款原因
          rbExplain: '', //处理说明
          rbMoney: '', //退款金额
          rbResult: '', //处理结果 ,成功，打回等
          orgId: '', //机构ID
          tno: '', //交易单号：格式yyyyMMdd0000000
          twxno: '', //微信流水号
          ttime: '', //交易时间
          ttype: '', //交易类型：来源于字典：活动、服务、交账
          tchannel: '', //退款申请来源：微信、线下
          tstate: '', //状态：收入、退款中、退款成功、已关闭
          ciId: '', //学员ID
          ofSeriano: '', //订单编号
          rbSeriano: '', //退款编号
        },
        columns: [
          {prop:"org_name", label:"机构ID", minWidth:70},
          {prop:"of_seriano", label:"退款编号", minWidth:150},
          {prop:"of_seriano", label:"订单编号", minWidth:150},
          {prop:"of_refund_state", label:"退款状态", minWidth:70},
          {prop:"of_applyrefund_time", label:"退款申请时间", minWidth:70},
          {prop:"of_applyrefund_reason", label:"退款原因", minWidth:70},
          {prop:"order_proceeds", label:"退款金额", minWidth:70},
          {prop:"t_wxno", label:"微信流水号", minWidth:70},
          {prop:"t_time", label:"交易时间", minWidth:70},
          //{prop:"rbDealtime", label:"退款处理时间", minWidth:70},
          {prop:"of_applyrefund_dealman", label:"退款处理人", minWidth:70},
          {prop:"of_applyrefund_explain", label:"处理说明", minWidth:70},
          //{prop:"rbResult", label:"处理结果", minWidth:70},
          //{prop:"tno", label:"交易单号", minWidth:70},
          //{prop:"ttype", label:"交易类型", minWidth:70},
          //{prop:"tchannel", label:"退款申请来源", minWidth:70},
          //{prop:"ciId", label:"学员ID", minWidth:70},
        ],
        btnColumns: [
          //{icon: "fa fa-edit", label: "修改", perms: "eao:teaofdrefusebill:edit", callback: "handleEdit"},
          //{icon: "fa fa-trash", label: "删除", perms: "eao:teaofdrefusebill:remove", callback: "handleDelete"},
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
        this.$api.teaofdrefusebill.findPage(jj).then((res) => {
          this.pageResult = res.data
        }).then(data!=null?data.callback:'')

      },
      // 删除
      handleDelete: function (data) {
        let arr = [];
        arr.push(data.row.rbId);
        this.delete(arr, data)
      },
      // 批量删除
      handleBatchDelete: function (data) {
        let arr = [];
        for (let i=0; i<data.params.length; i++){
          arr.push(data.params[i].rbId);
        }
        this.delete(arr, data)
      },
      //执行删除
      delete:function(jj,darass){
        this.$confirm("确认删除选中记录吗？", "提示", {
          type: "warning",
          closeOnClickModal:false
        }).then(() => {
          this.$api.teaofdrefusebill.doDelete(jj).then(res => {
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
        this.$api.teaofdrefusebill.view(params.row.rbId).then((res) => {
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
              this.$api.teaofdrefusebill.save(params).then((res) => {
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
