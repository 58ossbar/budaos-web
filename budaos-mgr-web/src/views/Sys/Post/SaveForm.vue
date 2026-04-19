<template>
  <el-dialog
    v-dialogDrag
    :title="operation ? $t('action.add') + '岗位' : $t('action.edit') + '岗位'"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="30%"
    @close="handleClose"
  >
    <el-form
      ref="dataForm"
      :model="dataForm"
      :rules="dataRule"
      :size="size"
      class="formInfo dialogFormTop"
      label-width="100px"
      @keyup.enter.native="submitForm()"
    >
      <el-form-item label="岗位类型" prop="postType">
        <cb-param
          :parent-vue="_self"
          :data-form="dataForm"
          placeholder="请选择岗位类型"
          name="postType"
          param="postType"
          type="select"
        />
      </el-form-item>
      <el-form-item label="岗位名称" prop="postName">
        <el-input v-model="dataForm.postName" maxlength="50" type="text" clearable auto-complete="off"/>
      </el-form-item>
      <el-form-item label="排序编号" prop="sort" >
        <el-input-number v-model="dataForm.sort" :min="1" :max="99999" class="widthAll" placeholder="排序编号" controls-position="right"/>
      </el-form-item>
      <el-form-item label="岗位描述" prop="remark">
        <el-input v-model="dataForm.remark" :rows="1" type="textarea" maxlength="100" clearable auto-complete="off"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button :size="size" @click="dialogVisible = false">{{ $t('action.cancel') }}</el-button>
      <el-button v-if="operation" :size="size" :loading="loading" type="primary" @click="submitForm(true)" >{{ $t('action.saveContinue') }}</el-button>
      <el-button :size="size" :loading="loading" type="primary" @click="submitForm" >{{ $t('action.preservation') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    var validateName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('岗位名称不能为空'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      // 大小
      size: 'small',
      // true:新增, false:修改
      operation: true,
      // 是否显示弹窗
      dialogVisible: false,
      // 表单数据
      dataForm: {
        // 岗位id
        postId: null,
        // 岗位类型
        postType: '',
        // 岗位名称
        postName: '',
        // 排序号
        sort: '',
        // 备注
        remark: ''
      },
      // 表单校验规则
      dataRule: {
        postName: [{ validator: validateName, required: true, message: '岗位名称不能为空', trigger: 'blur' }],
        postType: [{ required: true, message: '岗位类型不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    handleAdd() {
      this.operation = true
      this.dialogVisible = true
      if (this.$refs['dataForm']) {
        this.$refs['dataForm'].clearValidate()
      }
      this.$api.post.getMaxSortNum().then(res => {
        this.dataForm.sort = res.data
      })
    },
    handleEdit(row) {
      this.operation = false
      this.dialogVisible = true
      this.$api.post.view(row.postId).then(res => {
        if (res.code === 0) {
          this.dataForm = Object.assign({}, res.data)
        }
      })
    },
    submitForm(continueFlag) {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', { closeOnClickModal: false, type: 'warning' }).then(() => {
            this.loading = true
            if (this.operation) {
              this.save(continueFlag)
            } else {
              this.update()
            }
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    save(continueFlag) {
      const submitData = Object.assign({}, this.dataForm)
      this.$api.post.save(submitData).then((res) => {
        this.loading = false
        if (res.code === 0) {
          this.$message.success(res.msg)
          if (typeof continueFlag === 'boolean') {
            this.resetFormDatas()
          } else {
            this.dialogVisible = false
          }
          this.$emit('ok', submitData)
        } else {
          this.$message.error(res.msg)
        }
      }).catch(() => {
        this.loading = false
      })
    },
    update() {
      const submitData = Object.assign({}, this.dataForm)
      this.$api.post.update(submitData).then((res) => {
        this.loading = false
        if (res.code === 0) {
          this.$message.success(res.msg)
          this.resetFormDatas()
          this.dialogVisible = false
          this.$emit('ok', submitData)
        } else {
          this.$message.error(res.msg)
        }
      }).catch(() => {
        this.$message.error('接口调用失败')
        this.loading = false
      })
    },
    handleClose() {
      this.dialogVisible = false
      this.resetFormDatas()
    },
    resetFormDatas() {
      this.dataForm = {
        // 岗位id
        postId: null,
        // 岗位类型
        postType: '',
        // 岗位名称
        postName: '',
        // 排序号
        sort: '',
        // 备注
        remark: ''
      }
    }
  }
}
</script>

<style>

</style>
