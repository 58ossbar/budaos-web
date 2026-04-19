<template>
  <el-dialog
    v-dialogDrag
    :title="$t('action.assignRoles')"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="50%"
    top="7vh"
    @close="handleClose"
  >
    <div style="width: 100%;display: flex;flex-wrap: wrap">
      <el-tag
        v-for="tag in setUserName"
        :key="tag.key"
        :disable-transitions="false"
        :type="tag.label"
        style="margin-left: 5px;margin-top: 10px;"
        closable
        @close="handleClose(tag.key)">
        {{ tag.label }}
      </el-tag>
    </div>
    <el-transfer
      ref="elTransferForSetUserRole"
      v-model="valueCSK"
      :titles="['未分配', '已分配']"
      :data="setdataRole"
      style="height: 300px;margin-top: 10px;"/>
    <div slot="footer" class="dialog-footer">
      <el-button :size="size" @click="dialogVisible = false">{{ $t('action.cancel') }}</el-button>
      <el-button :size="size" :loading="loading" type="primary" @click="submitForm" >{{ $t('action.preservation') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      // 大小
      size: 'small',
      // true:新增, false:修改
      operation: true,
      // 是否显示弹窗
      dialogVisible: false,
      setUserName: [],
      setdataRole: [],
      valueCSK: []
    }
  },
  watch: {
  },
  mounted() {
  },
  methods: {
    handleAssignRole(selections, tableComponent) {
      this.operation = true
      this.dialogVisible = true
      this.tableComponent = tableComponent
      this.valueCSK = []
      this.setUserName = []
      this.setUserId = selections.map(item => item.userId)
      // 显示给哪些用户分配角色
      for (let i = 0; i < selections.length; i++) {
        var obj = {
          key: selections[i].userId,
          label: selections[i].userRealname
        }
        this.setUserName.push(obj)
      }
      this.queryAllRoles()
      // 回选出所选的角色
      this.$api.user.toGrantRole(this.setUserId).then((res) => {
        for (let i = 0; i < res.data.length; i++) {
          this.valueCSK.push(res.data[i].roleId)
        }
      })
    },
    submitForm() {
      const submitData = {
        roleIds: this.valueCSK,
        userIds: this.setUserId
      }
      this.$confirm('确认提交吗？', '提示', { closeOnClickModal: false, type: 'warning' }).then(() => {
        this.loading = true
        this.$api.user.grantRole(submitData).then((res) => {
          this.loading = false
          if (res.code === 0) {
            this.$message.success(res.msg)
            this.dialogVisible = false
            this.$emit('ok', submitData)
          } else {
            this.$message.error(res.msg)
          }
        }).catch((e) => {
          this.$message({ message: '接口调用失败', type: 'error' })
          this.loading = false
        })
      }).catch(() => {
        this.loading = false
      })
    },
    handleClose() {
      this.dialogVisible = false
      this.resetFormDatas()
    },
    resetFormDatas() {
      this.dataForm = {
        // 角色id集
        roleIdList: [],
        // 用户id集
        userIdList: []
      }
    },
    queryAllRoles() {
      // 渲染出所有角色
      this.$api.role.findAll().then((res) => {
        var arr = []
        if (res.data.length > 0) {
          for (let i = 0; i < res.data.length; i++) {
            const role = res.data[i]
            var obj = {
              key: role.roleId,
              label: role.roleName,
              roleId: role.roleId,
              id: role.roleId
            }
            arr.push(obj)
          }
        }
        this.dataRole = arr
        this.setdataRole = arr
      })
    }
  }
}
</script>

<style>

</style>
