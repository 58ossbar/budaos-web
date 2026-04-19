<template>
  <div class="page-container" >
    <el-container class="page-container scrollAllY">
      <el-header class="box_shadows bgcolor  scrollRightYDictMenu " style="height: auto;">
        <el-form ref="queryForm" :inline="true" :model="filters" :size="size" class="queryForm" label-width="100px">
          <el-collapse class="elCollapseItemNoBoeder elCollapseDict">
            <el-row class="elCollapseDict">
              <el-col :span="2">
                <el-form-item class="dictInputQueryLabelWidth">
                  <span>登录时间</span>
                </el-form-item>
              </el-col>
              <el-col :span="14">
                <el-form-item class="dictInputQueryWidth textAlign">
                  <el-date-picker
                    v-model="timeAll"
                    :picker-options="pickerOptions"
                    class="widthAll"
                    type="datetimerange"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd HH:mm:ss"
                    range-separator="至"
                    start-placeholder="登录开始时间"
                    end-placeholder="登录结束时间"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-form-item class="dictInputQueryLabelWidth">
                  <span>日志名称</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item class="dictInputQueryWidth textAlign">
                  <el-input v-model="filters.logname" placeholder="日志名称" clearable/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-collapse-item class="elCollapseItemNoBoeder elCollapseItemMarginBottom">
              <el-row>
                <el-col :span="2">
                  <el-form-item class="dictInputQueryLabelWidth">
                    <span>是否执行成功</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item class="dictInputQueryWidth textAlign">
                    <el-input v-model="filters.succeed" placeholder="是否执行成功" clearable/>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item class="dictInputQueryLabelWidth">
                    <span>登录ip</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item class="dictInputQueryWidth textAlign">
                    <el-input v-model="filters.ip" placeholder="登录ip" clearable/>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item class="dictInputQueryLabelWidth">
                    <span>操作员名称</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item class="dictInputQueryWidth textAlign">
                    <el-input v-model="filters.userid" placeholder="操作员名称" clearable/>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-collapse-item>
          </el-collapse>
          <el-row class="elDeptFormButton dictQueryCenterButton">
            <el-col :span="24">
              <cb-button :label="$t('action.search')" :loading="loadingQuery" icon="fa fa-search" perms="sys:tsysloginlog:query" type="primary" @click="findPage()"/>
            </el-col>
          </el-row>
        </el-form>
      </el-header>
      <!--表格内容栏-->
      <el-main class="box_shadows bgcolor  scrollRightYDictMenu tableDict marginBottom">
        <cb-table
          ref="table"
          :parent-vue="_self"
          :data="pageResult"
          :columns="columns"
          :btn-columns="btnColumns"
          perms-batch-delete="sys:tsysloginlog:remove"
          row-key="loginlogid"
          @findPage="findPage"
          @selectionChange="handleSelectionChange"
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
        // 开始时间
        beginTime: '',
        // 结束时间
        endTime: '',
        // 日志名称
        logname: '',
        // 是否成功
        succeed: '',
        // io
        ip: '',
        // 操作人
        userid: ''
      },
      loadingQuery: false,
      pageRequest: {},
      // 表格数据
      pageResult: {},
      columns: [
        { prop: 'logname', label: '日志名称', minWidth: 100 },
        { prop: 'userid', label: '操作人名称', minWidth: 100 },
        { prop: 'createTime', label: '登录时间', minWidth: 100 },
        { prop: 'succeed', label: '是否执行成功', minWidth: 100 },
        { prop: 'message', label: '具体消息', minWidth: 100 },
        { prop: 'ip', label: '登录Ip', minWidth: 100 }
      ],
      btnColumns: [
        { icon: 'fa fa-trash', label: '删除', perms: 'sys:tsysloginlog:remove', callback: 'handleDelete' }
      ],
      // 表格中被选中的列数据
      selections: [],
      // 日期选择
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
    findPage: function(data) {
      if (data && data !== null) {
        this.pageRequest = data.pageRequest
      } else {
        this.pageRequest.pageNum = 1
      }
      // 处理时间
      if (this.timeAll) {
        this.filters.beginTime = this.timeAll[0]
        this.filters.endTime = this.timeAll[1]
      }
      // 当前页
      this.filters.page = this.pageRequest.pageNum
      // 每页显示数
      this.filters.limit = this.pageRequest.pageSize
      this.loadingQuery = true
      this.$api.loginLog.findPage(this.filters).then(res => {
        this.pageResult = res.data
        this.loadingQuery = false
        if (res.code !== 0) {
          this.$message.error(res.msg)
        }
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
    handleDelete(row) {
      this.handleBatchDelete([row.loginlogid])
    },
    handleBatchDelete(ids) {
      if (!ids || !ids.length) {
        return false
      }
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        this.$api.loginLog.batchDelete(ids).then(res => {
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
    handleSelectionChange(rows) {
      this.selections = rows
    }
  }
}
</script>
