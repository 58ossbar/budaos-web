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
                  <span>上传人</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item class="dictInputQueryWidth textAlign">
                  <el-input v-model="filters.uploadMan" maxlength="32" type="text" placeholder="上传人" clearable/>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-form-item class="dictInputQueryLabelWidth">
                  <span>附件分类</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item class="dictInputQueryWidth textAlign">
                  <cb-param
                    :parent-vue="_self"
                    :change="findPage"
                    :filters="filters"
                    placeholder="请选择"
                    name="fileType"
                    param="fileType"
                    type="select"
                    empty-label="全部"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-form-item class="dictInputQueryLabelWidth">
                  <span>文件名称</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item class="dictInputQueryWidth textAlign">
                  <el-input v-model="filters.fileName" maxlength="100" type="text" placeholder="文件名称" clearable/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-collapse-item class="elCollapseItemNoBoeder elCollapseItemMarginBottom">
              <el-row>
                <el-col :span="2">
                  <el-form-item class="dictInputQueryLabelWidth">
                    <span>文件备注</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item class="dictInputQueryWidth textAlign">
                    <el-input v-model="filters.remark" maxlength="100" type="text" placeholder="文件备注" clearable/>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item class="dictInputQueryLabelWidth">
                    <span>上传时间</span>
                  </el-form-item>
                </el-col>
                <el-col :span="14">
                  <el-form-item class="dictInputQueryWidth textAlign widthJiuBa ">
                    <el-date-picker
                      v-model="timeAll"
                      :picker-options="pickerOptions"
                      class="widthAll"
                      type="datetimerange"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      format="yyyy-MM-dd HH:mm:ss"
                      range-separator="至"
                      start-placeholder="上传开始时间"
                      end-placeholder="上传结束时间"
                      align="right" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-collapse-item>
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
          perms-batch-delete="sys:tsysattach:remove"
          row-key="attachId"
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
        { prop: 'createUserId', label: '上传人', minWidth: 80 },
        { prop: 'createTime', label: '上传时间', minWidth: 80 },
        { prop: 'ljUrl', label: '链接地址', minWidth: 95 },
        // 如果未提交则为空
        { prop: 'pkid', label: '关联ID', minWidth: 85 },
        { prop: 'remark', label: '文件备注', minWidth: 80 },
        { prop: 'fileType', label: '附件分类', minWidth: 80 },
        { prop: 'fileName', label: '文件名称', minWidth: 80 },
        { prop: 'fileUrl', label: '文件路径', minWidth: 95 },
        // 0是未提交,1是已提交
        { prop: 'fileState', label: '文件状态', minWidth: 80 }
      ],
      btnColumns: [
        { icon: 'fa fa-trash', label: '删除', perms: 'sys:tsysattach:remove', callback: 'handleDelete' }
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
      this.$api.attach.findPage(this.filters).then(res => {
        this.pageResult = res.data
        this.loadingQuery = false
      }).then(data != null ? data.callback : '')
    },
    selectionChange() {},
    toggleRowSelection() {},
    handleDelete(row) {
      this.handleBatchDelete([row.attachId])
    },
    handleBatchDelete(ids) {
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        this.$api.attach.batchDelete(ids).then(res => {
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
