<template>
  <div>
    <el-container class="page-container scrollAllY ">
      <el-header class="box_shadows bgcolor  scrollRightYDictMenu " style="height: auto;">
        <!-- 工具栏 -->
        <el-form ref="queryForm" :inline="true" :model="filters" :size="size" class="queryForm" label-width="100px" label-position="right">
          <el-row class="elCollapseDict">
            <el-col :span="2">
              <el-form-item class="dictInputQueryLabelWidth">
                <span>Bean名称</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="dictInputQueryWidth ">
                <el-input v-model="filters.beanName" placeholder="Bean名称" clearable/>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-form-item class="dictInputQueryLabelWidth">
                <span> 方法名称</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="dictInputQueryWidth ">
                <el-input v-model="filters.methodName" placeholder="方法名称" clearable/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="elDeptFormButton dictQueryCenterButton">
            <el-col :span="24">
              <cb-button :loading="loadingQuery" :label="$t('action.search')" icon="fa fa-search" perms="sys:tsyspost:query" type="primary" @click="findPage()"/>
              <cb-button :label="$t('action.add')" icon="fa fa-search" perms="sys:tsysserialno:query" type="primary" @click="handleAdd()"/>
              <cb-button :loading="loadingPause" :label="$t('action.stop')" icon="fa fa-lemon-o" perms="sys:job:pause" type="primary" @click="handlePause" />
              <cb-button :loading="loadingResume" :label="$t('action.recovery')" icon="fa fa-shower" perms="sys:job:resume" type="primary" @click="handleResume" />
              <cb-button :loading="loadingExecute" :label="$t('action.execute')" icon="fa fa-flag-o" perms="sys:job:run" type="primary" @click="handleExecute" />
              <cb-button :label="$t('action.loglist')" icon="fa fa-flag-o" perms="sys:job:query" type="primary" @click="handleLogList" />
            </el-col>
          </el-row>
        </el-form>
      </el-header>
      <!--表格内容栏-->
      <el-main class="box_shadows bgcolor  scrollRightYDictMenu tableDict marginBottom">
        <cb-table
          :parent-vue="_self"
          :data="pageResult"
          :columns="columns"
          :btn-columns="btnColumns"
          perms-batch-delete="sys:job:remove"
          row-key="jobId"
          @findPage="findPage"
          @toggleRowSelection="toggleRowSelection"
          @selectionChange="handleSelectionChange"
          @handleEdit="handleEdit"
          @handleBatchDelete="handleBatchDelete"/>
      </el-main>
    </el-container>
    <save-form ref="saveForm" @ok="handleOk" />
    <log-list ref="logList" />
  </div>
</template>

<script>
import CbTable from '@/views/Core/CbTableV2'
import CbButton from '@/views/Core/CbButton'
import SaveForm from './SaveForm.vue'
import LogList from './LogList.vue'

export default {
  components: {
    CbTable,
    CbButton,
    SaveForm,
    LogList
  },
  data() {
    return {
      size: 'small',
      filters: {
        postType: '',
        postName: ''
      },
      loadingQuery: false,
      pageRequest: {},
      pageResult: {},
      columns: [
        { prop: 'beanName', label: 'Bean名称', minWidth: 100 },
        { prop: 'methodName', label: '方法名称', minWidth: 100 },
        { prop: 'cronExpression', label: 'cron表达式', minWidth: 120 },
        { prop: 'params', label: '参数', minWidth: 100 },
        { prop: 'remark', label: '备注', minWidth: 100 },
        { prop: 'status', label: '状态', minWidth: 80, dataType: 'switch', activeValue: 0, callback: 'switchClick' }
      ],
      btnColumns: [
        { icon: 'fa fa-edit', label: '修改', perms: 'sys:job:edit', callback: 'handleEdit' },
        { icon: 'fa fa-low-vision', label: '明细', perms: 'sys:job:log', callback: 'handleLogList', title: '日志列表' },
        { icon: 'fa fa-trash', label: '删除', perms: 'sys:job:remove', callback: 'handleDelete' }
      ],
      // 表格中被选中的列数据
      selections: [],
      loadingPause: false,
      loadingResume: false,
      loadingExecute: false
    }
  },
  methods: {
    findPage(data) {
      this.loadingQuery = true
      if (data && data !== null) {
        this.pageRequest = data.pageRequest
      } else {
        this.pageRequest.pageNum = 1
      }
      this.filters.page = this.pageRequest.pageNum
      this.filters.limit = this.pageRequest.pageSize
      this.$api.job.findPage(this.filters).then(res => {
        this.pageResult = res.data
        this.loadingQuery = false
      }).then(data != null ? data.callback : '')
    },
    handleAdd() {
      this.$refs.saveForm.handleAdd()
    },
    handleEdit(row) {
      this.$refs.saveForm.handleEdit(row)
    },
    handleOk(data) {
      this.findPage()
    },
    handleSelectionChange(rows) {
      this.selections = rows
    },
    toggleRowSelection() {},
    handleDelete(row) {
      this.handleBatchDelete([row.jobId])
    },
    handleBatchDelete(ids) {
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        this.$api.job.batchDelete(ids).then(res => {
          if (res.code !== 0) {
            this.$message.error(res.msg)
          } else {
            this.$message({ message: '操作成功', type: 'success' })
            this.findPage()
          }
        }).catch(() => {
          this.$message({ type: 'error', message: '删除失败,接口异常' })
        })
      }).catch(() => {
        this.$message({ type: 'info', message: '删除未成功' })
      })
    },
    // 暂停
    handlePause() {
      if (!this.selections || !this.selections.length) {
        this.$message({ message: '请先在表格中，至少选择一项', type: 'warning' })
        return false
      }
      this.loadingPause = true
      const ids = this.selections.map(item => item.jobId)
      this.$api.job.pause(ids).then((res) => {
        this.loadingPause = false
        if (res.code === 0) {
          this.$message({ message: res.msg || '暂停成功', type: 'success' })
          this.findPage()
        } else {
          this.$message({ message: res.msg || '暂停失败', type: 'error' })
        }
      }).catch(() => {
        this.loadingPause = false
      })
    },
    // 恢复
    handleResume() {
      if (!this.selections || !this.selections.length) {
        this.$message({ message: '请先在表格中，至少选择一项', type: 'warning' })
        return false
      }
      this.loadingResume = true
      const ids = this.selections.map(item => item.jobId)
      this.$api.job.resume(ids).then((res) => {
        this.loadingResume = false
        if (res.code === 0) {
          this.$message({ message: res.msg || '恢复成功', type: 'success' })
          this.findPage()
        } else {
          this.$message({ message: res.msg || '恢复失败', type: 'error' })
        }
      }).catch(() => {
        this.loadingResume = false
      })
    },
    // 立即执行
    handleExecute() {
      if (!this.selections || !this.selections.length) {
        this.$message({ message: '请先在表格中，至少选择一项', type: 'warning' })
        return false
      }
      this.loadingExecute = true
      const ids = this.selections.map(item => item.jobId)
      this.$api.job.runTask(ids).then((res) => {
        this.loadingExecute = false
        if (res.code === 0) {
          this.$message({ message: res.msg || '执行成功', type: 'success' })
        } else {
          this.$message({ message: res.msg || '执行失败', type: 'error' })
        }
      })
    },
    // 日志列表
    handleLogList(row) {
      this.$refs.logList.handleView(row)
    },
    /**
     * switch开关
     * @param {*} row
     */
    switchClick(row, index, event) {
      const jobId = row.jobId
      // 任务状态  0：正常  1：暂停
      const val = row.status
      // 去暂停
      if (val === 0) {
        this.$api.job.pause([jobId]).then((res) => {
          if (res.code === 0) {
            row.status = 1
            this.$message({ message: '暂停成功', type: 'success' })
          } else {
            row.status = 0
            this.$message({ message: '暂停失败', type: 'error' })
          }
        })
      } else if (val === 1) { // 去开启
        this.$api.job.resume([jobId]).then((res) => {
          if (res.code === 0) {
            row.status = 0
            this.$message({ message: '恢复成功', type: 'success' })
          } else {
            row.status = 1
            this.$message({ message: '恢复失败', type: 'error' })
          }
        })
      }
    }
  }
}
</script>

<style>

</style>
