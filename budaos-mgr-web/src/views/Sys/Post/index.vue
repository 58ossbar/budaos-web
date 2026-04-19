<template>
  <div>
    <el-container class="page-container scrollAllY ">
      <el-header class="box_shadows bgcolor  scrollRightYDictMenu " style="height: auto;">
        <!-- 工具栏 -->
        <el-form ref="queryForm" :inline="true" :model="filters" :size="size" class="queryForm" label-width="100px" label-position="right">
          <el-row class="elCollapseDict">
            <el-col :span="2">
              <el-form-item class="dictInputQueryLabelWidth">
                <span>岗位类型</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="dictInputQueryWidth textAlign">
                <cb-param
                  :parent-vue="_self"
                  :change="findPage"
                  :filters="filters"
                  placeholder="请选择"
                  name="postType"
                  param="postType"
                  type="select"
                  empty-label="全部"
                />
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-form-item class="dictInputQueryLabelWidth">
                <span>岗位名称</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="dictInputQueryWidth textAlign">
                <el-input v-model="filters.postName" maxlength="50" type="text" placeholder="岗位名称" clearable/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="elDeptFormButton dictQueryCenterButton">
            <el-col :span="24">
              <cb-button :loading="loadingQuery" :label="$t('action.search')" icon="fa fa-search" perms="sys:tsyspost:query" type="primary" @click="findPage()"/>
              <cb-button :label="$t('action.add')" icon="fa fa-plus" type="primary" perms="sys:tsyspost:add" @click="handleAdd" />
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
          perms-batch-delete="sys:tsyspost:remove"
          row-key="postId"
          @findPage="findPage"
          @toggleRowSelection="toggleRowSelection"
          @selectionChange="handleSelectionChange"
          @handleEdit="handleEdit"
          @handleBatchDelete="handleBatchDelete"/>
      </el-main>
    </el-container>
    <save-form ref="saveForm" @ok="handleOk" />
  </div>
</template>

<script>
import CbTable from '@/views/Core/CbTableV2'
import CbButton from '@/views/Core/CbButton'
import SaveForm from './SaveForm.vue'

export default {
  components: {
    CbTable,
    CbButton,
    SaveForm
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
        { prop: 'postType', label: '岗位类型', minWidth: 60 },
        { prop: 'postName', label: '岗位名称', minWidth: 60 },
        { prop: 'sort', label: '排序号', minWidth: 60 },
        { prop: 'remark', label: '岗位描述', minWidth: 80 },
        { prop: 'createUserId', label: '创建人', minWidth: 70 },
        { prop: 'createTime', label: '创建时间', minWidth: 90 },
        { prop: 'updateUserId', label: '修改人', minWidth: 70 },
        { prop: 'updateTime', label: '修改时间', minWidth: 90 }
      ],
      btnColumns: [
        { icon: 'fa fa-edit', label: '修改', perms: 'sys:tsyspost:edit', callback: 'handleEdit' },
        { icon: 'fa fa-long-arrow-up', label: '上移', perms: 'sys:tsyspost:move', callback: 'handleMoveUp', moveType: 'moveUp', title: '修改排序号' },
        { icon: 'fa fa-long-arrow-down', label: '下移', perms: 'sys:tsyspost:move', callback: 'handleMoveDown', moveType: 'moveDown', title: '修改排序号' },
        { icon: 'fa fa-trash', label: '删除', perms: 'sys:tsyspost:remove', callback: 'handleDelete' }
      ],
      // 表格中被选中的列数据
      selections: []
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
      this.$api.post.findPage(this.filters).then(res => {
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
      this.handleBatchDelete([row.postId])
    },
    handleBatchDelete(ids) {
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        this.$api.post.batchDelete(ids).then(res => {
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
    handleMoveUp(row, index) {
      const commitData = {
        currPostId: row.postId,
        targetPostId: this.pageResult.list[index - 1].postId
      }
      this.$confirm('确认上移选中记录吗？', '提示', {
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        this.$api.post.postMove(commitData).then(res => {
          if (res.code === 0) {
            this.$message({ message: '上移成功', type: 'success' })
            this.findPage()
          } else {
            this.$message.error(res.msg)
          }
        }).catch(() => {
          // this.$message({ type: 'info', message: this.global.interfaceFailMessage })
          this.$message({ type: 'info', message: '接口调用失败' })
        })
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消上移' })
      })
    },
    handleMoveDown(row, index) {
      const commitData = {
        currPostId: row.postId,
        targetPostId: this.pageResult.list[index + 1].postId
      }
      this.$confirm('确认下移选中记录吗？', '提示', {
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        this.$api.post.postMove(commitData).then(res => {
          if (res.code === 0) {
            this.$message({ message: '下移成功', type: 'success' })
            this.findPage()
          } else {
            this.$message.error(res.msg)
          }
        }).catch(() => {
          // this.$message({ type: 'info', message: this.global.interfaceFailMessage })
          this.$message({ type: 'info', message: '接口调用失败' })
        })
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消下移' })
      })
    }
  }
}
</script>

<style>

</style>
