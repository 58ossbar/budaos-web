<template>
  <div class="page-container" >
    <el-container class="page-container scrollAllY">
      <el-header class="box_shadows bgcolor  scrollRightYDictMenu " style="height: auto;">
        <el-form ref="queryForm" :inline="true" :model="filters" :size="size" class="queryForm" label-width="100px">
          <el-row class="elCollapseDict">
            <el-col :span="2">
              <el-form-item class="dictInputQueryLabelWidth">
                <span>角色名称</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="dictInputQueryWidth ">
                <el-input
                  v-model="filters.roleName"
                  placeholder="请输入角色名称"
                  name="roleName"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-form-item class="dictInputQueryLabelWidth">
                <span>所属机构</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="dictInputQueryWidth ">
                <cb-tree
                  :parent-vue="_self"
                  :filters="filters"
                  :change="findPage"
                  :prop="{id: 'orgId', name: 'orgName'}"
                  url="/api/sys/org/getOrgTree"
                  placeholder="请选择所属机构"
                  name="orgId"
                  default-expanded-level="1"
                />
                <!-- prop="{&quot;id&quot;:&quot;orgId&quot;, &quot;name&quot;:&quot;orgName&quot;}" -->
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-form-item class="dictInputQueryLabelWidth">
                <span>角色状态</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="dictInputQueryWidth ">
                <el-select v-model="filters.status" clearable placeholder="请选择角色状态" style="width: 100%" @clear="findPage()" @change="findPage()">
                  <el-option
                    v-for="item in optionsForStatus"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="elDeptFormButton dictQueryCenterButton">
            <el-col :span="24">
              <cb-button :loading="loadingQuery" :label="$t('action.search')" icon="fa fa-search" perms="sys:role:query" type="primary" @click="findPage()"/>
              <cb-button :label="$t('action.add')" icon="fa fa-plus" perms="sys:role:add" type="primary" @click="handleAdd" />
              <cb-button :label="$t('action.assignUsers')" icon="fa fa-user-o" perms="sys:role:setUser" type="primary" @click="handleAssignUsers" />
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
          perms-batch-delete="sys:role:remove"
          row-key="roleId"
          @findPage="findPage"
          @selectionChange="handleSelectionChange"
          @handleBatchDelete="handleBatchDelete"/>
      </el-main>
    </el-container>
    <!-- 新增/修改页面 -->
    <save-form ref="saveForm" @ok="handleOk" />
    <AssignUser ref="assignUser" />
  </div>
</template>
<script>
import CbTable from '@/views/Core/CbTableV2'
import CbButton from '@/views/Core/CbButton'
import SaveForm from './SaveForm.vue'
import AssignUser from './AssignUser.vue'

export default {
  components: {
    CbTable,
    CbButton,
    SaveForm,
    AssignUser
  },
  data() {
    return {
      size: 'small',
      filters: {
        // 角色名称
        roleName: '',
        // 角色状态
        status: null
      },
      loadingQuery: false,
      pageRequest: {},
      // 表格数据
      pageResult: {},
      columns: [
        { prop: 'roleName', label: '角色名称', minWidth: 120 },
        { prop: 'orgId', label: '所属机构', minWidth: 120 },
        { prop: 'createTime', label: '创建时间', minWidth: 90 },
        { prop: 'remark', label: '描述', minWidth: 80 },
        { prop: 'status', label: '状态', minWidth: 80, dataType: 'switch', activeValue: '1', callback: 'switchClick' }
      ],
      btnColumns: [
        { icon: 'fa fa-edit', label: '修改', perms: 'sys:role:edit', callback: 'handleEdit' },
        { icon: 'fa fa-trash', label: '删除', perms: 'sys:role:remove', callback: 'handleDelete' }
      ],
      // 表格中被选中的列数据
      selections: [],
      optionsForStatus: [{ value: '1', label: '正常' }, { value: '0', label: '禁用' }]
    }
  },
  methods: {
    findPage: function(data) {
      if (data && data !== null) {
        this.pageRequest = data.pageRequest
      } else {
        this.pageRequest.pageNum = 1
      }
      if (!this.filters.status) {
        delete this.filters.status
      }
      // 当前页
      this.filters.page = this.pageRequest.pageNum
      // 每页显示数
      this.filters.limit = this.pageRequest.pageSize
      this.loadingQuery = true
      this.$api.role.findPage(this.filters).then(res => {
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
    handleDelete(row) {
      this.handleBatchDelete([row.roleId])
    },
    handleBatchDelete(ids) {
      if (!ids || !ids.length) {
        return false
      }
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        this.$api.role.batchDelete(ids).then(res => {
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
    },
    /**
     * switch开关
     * @param {*} row
     */
    switchClick(row, index, event) {
      const val = row.status
      // console.log(val, val === '0')
      // return false
      const commitStatus = row.status === '1' ? '0' : '1'
      // 0:关闭状态，1开启状态
      var obj = { roleId: row.roleId, status: commitStatus }
      this.$api.role.updateStatus(obj).then((res) => {
        if (res.code === 0) {
          if (val === '1') {
            this.$message({ message: '禁用成功', type: 'warning' })
            row.status = '0'
          } else {
            this.$message({ message: '启用成功', type: 'success' })
            row.status = '1'
          }
        } else {
          if (val === '1') {
            this.$message({ message: '禁用失败', type: 'warning' })
            row.status = '1'
          } else {
            this.$message({ message: '启用失败', type: 'success' })
            row.status = '0'
          }
        }
      })
    },
    /**
     * 分配用户
     */
    handleAssignUsers() {
      if (!this.selections || !this.selections.length) {
        this.$message({ message: '请先在表格中，至少选择一个角色', type: 'warning' })
        return false
      }
      if (this.selections.length > 8) {
        this.$message({ message: '至多同时选择八条记录', type: 'warning' })
        return false
      }
      // 去打开界面
      this.$refs.assignUser.handleAssignUser(this.selections, this.$refs.table)
    }
  }
}
</script>
