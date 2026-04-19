<template>
  <!--日志列表界面 begin-->
  <el-dialog
    v-dialogDrag
    ref="dialogForJobLog"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    title="日志列表"
    top="7vh"
    width="60%"
    @close="handleClose">
    <el-row style="">
      <el-col :span="3" class="cb-el-col-label">bean名称</el-col>
      <el-col :span="9" class="cb-el-col-input">
        <el-input v-model="filters.beanName" placeholder="请输入bean名称" size="small" clearable @clear="findPage"/>
      </el-col>
      <el-col :span="3" class="cb-el-col-label">方法名称</el-col>
      <el-col :span="9" class="cb-el-col-input">
        <el-input v-model="filters.methodName" placeholder="请输入方法名称" size="small" clearable @clear="findPage"/>
      </el-col>
    </el-row>

    <el-row>
      <cb-button :loading="loadingQuery" :label="$t('action.search')" icon="fa fa-search" perms="sys:job:query" type="primary" @click="findPage()"/>
    </el-row>

    <cb-table
      :parent-vue="_self"
      :data="pageResult"
      :columns="columns"
      :btn-columns="btnColumns"
      perms-batch-delete="sys:job:remove"
      row-key="jobId"
      @findPage="findPage"
    />
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="dialogVisible = false">{{ $t('action.cancel') }}</el-button>
    </div>
  </el-dialog>
  <!--日志列表界面 end-->
</template>

<script>
import CbTable from '@/views/Core/CbTableV2'
import CbButton from '@/views/Core/CbButton'

export default {
  components: {
    CbTable,
    CbButton
  },
  data() {
    return {
      loadingQuery: false,
      // 大小
      size: 'small',
      // true:新增, false:修改
      operation: true,
      // 是否显示弹窗
      dialogVisible: false,
      filters: {
        beanName: '',
        methodName: '',
        jobId: ''
      },
      pageRequest: {},
      pageResult: {},
      columns: [
        { prop: 'beanName', label: 'Bean名称', minWidth: 50 },
        { prop: 'methodName', label: '方法名称', minWidth: 50 },
        { prop: 'params', label: '参数', minWidth: 50 },
        { prop: 'status', label: '状态', minWidth: 50 },
        { prop: 'times', label: '耗时(单位:毫秒)', minWidth: 50 }
      ],
      btnColumns: []
    }
  },
  methods: {
    handleView(row) {
      this.operation = true
      this.dialogVisible = true
      this.filters.jobId = row && row.jobId ? row.jobId : null
      this.findPage()
    },
    findPage(data) {
      this.loadingQuery = true
      if (data && data !== null) {
        this.pageRequest = data.pageRequest
      } else {
        this.pageRequest.pageNum = 1
      }
      this.filters.page = this.pageRequest.pageNum
      this.filters.limit = this.pageRequest.pageSize
      this.$api.job.queryJobLog(this.filters).then(res => {
        this.pageResult = res.data
        this.loadingQuery = false
      }).then(data != null ? data.callback : '')
    },
    handleClose() {
      this.dialogVisible = false
      this.resetFormDatas()
    },
    resetFormDatas() {
      this.dataForm = {
        // 定时任务id
        jobId: null,
        // beand名称
        beanName: '',
        // 方法名称
        methodName: '',
        // cron表达式
        cronExpression: '',
        // 参数
        params: '',
        // 备注
        remark: ''
      }
    }
  }
}
</script>
<style>
  .cb-el-col-label {
    margin-left: 0px;
    padding-left: 10px;
    text-align: left;
    line-height: 50px;
  }
  .cb-el-col-input {
    margin-top: 5px;
  }
</style>
