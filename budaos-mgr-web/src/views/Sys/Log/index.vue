<template>
  <div>
    <el-container class="page-container scrollAllY ">
      <el-header class="box_shadows bgcolor  scrollRightYDictMenu " style="height: auto;">
        <!-- 工具栏 -->
        <el-form ref="queryForm" :inline="true" :model="filters" :size="size" class="queryForm" label-width="100px" label-position="right">
          <el-collapse class="elCollapseItemNoBoeder elCollapseDict" >
            <el-row class="elCollapseDict">
              <el-col :span="2">
                <el-form-item class="dictInputQueryLabelWidth">
                  <span>用户名</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item class="dictInputQueryWidth ">
                  <el-input v-model="filters.name" placeholder="用户名" clearable/>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-form-item class="dictInputQueryLabelWidth">
                  <span>用户操作</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item class="dictInputQueryWidth ">
                  <el-input v-model="filters.operation" placeholder="用户操作" clearable/>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-form-item class="dictInputQueryLabelWidth">
                  <span>请求耗时(ms)</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item class="dictInputQueryWidth ">
                  <el-input v-model="filters.timeConsuming" placeholder="请求耗时(ms)" clearable/>
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse>
          <el-row class="elDeptFormButton dictQueryCenterButton">
            <el-col :span="24">
              <cb-button :loading="loadingQuery" :label="$t('action.search')" icon="fa fa-search" perms="sys:tsysattach:query" type="primary" @click="findPage()"/>
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
          perms-batch-delete="sys:tsyslog:remove"
          row-key="id"
          @findPage="findPage"
          @toggleRowSelection="toggleRowSelection"
          @selectionChange="selectionChange"
          @handleBatchDelete="handleBatchDelete"/>
      </el-main>
    </el-container>
  </div>
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
      size: 'small',
      filters: {
        uploadMan: '',
        fileType: '',
        fileName: ''
      },
      loadingQuery: false,
      pageRequest: {},
      pageResult: {},
      columns: [
        { prop: 'username', label: '用户名', minWidth: 80 },
        { prop: 'operation', label: '用户操作', minWidth: 130 },
        { prop: 'params', label: '请求参数', minWidth: 200 },
        { prop: 'timeConsuming', label: '请求耗时(ms)', minWidth: 120 },
        { prop: 'returns', label: '响应参数', minWidth: 200 },
        { prop: 'createDate', label: '记录时间', minWidth: 120 },
        { prop: 'exceptionDetail', label: '异常信息', minWidth: 200 }
      ],
      btnColumns: [
        { icon: 'fa fa-trash', label: '删除', perms: 'sys:tsyslog:remove', callback: 'handleDelete' }
      ],
      // 时间查询条件
      timeAll: [],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
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
      this.filters.pageNum = this.pageRequest.pageNum
      this.filters.pageSize = this.pageRequest.pageSize
      this.$api.log.findPage(this.filters).then(res => {
        this.pageResult = res.data
        this.loadingQuery = false
      }).then(data != null ? data.callback : '')
    },
    selectionChange() {},
    toggleRowSelection() {},
    handleDelete(row) {
      this.handleBatchDelete([row.id])
    },
    handleBatchDelete(ids) {
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        this.$api.log.batchDelete(ids).then(res => {
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
    }
  }
}
</script>

<style>

</style>
