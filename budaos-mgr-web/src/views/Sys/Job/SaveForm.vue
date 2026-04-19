<template>
  <el-dialog
    v-dialogDrag
    :title="operation ? $t('action.add') + '任务' : $t('action.edit') + '任务'"
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
      <div class="floating-half">
        <el-form-item label="Bean名称" prop="beanName">
          <el-input v-model="dataForm.beanName" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="参数" prop="params">
          <el-input v-model="dataForm.params" auto-complete="off"/>
        </el-form-item>
      </div>
      <div class="floating-half">
        <el-form-item label="方法名称" prop="methodName">
          <el-input v-model="dataForm.methodName" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="cron表达式" prop="cronExpression">
          <el-input v-model="dataForm.cronExpression" auto-complete="off"/>
        </el-form-item>
      </div>
      <div class="floating-all">
        <el-form-item label="备注说明" prop="remark">
          <el-input v-model="dataForm.remark" :rows="3" type="textarea" maxlength="100" clearable auto-complete="off"/>
        </el-form-item>
      </div>
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
      },
      // 表单校验规则
      dataRule: {
        beanName: [{ required: true, message: 'Bean名称不能为空', trigger: 'blur' }],
        methodName: [{ required: true, message: '方法名称不能为空', trigger: 'blur' }],
        cronExpression: [{ required: true, message: 'cron表达式不能为空', trigger: 'blur' }]
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
      this.dataForm = Object.assign({}, row)
      // this.$api.job.view(row.jobId).then(res => {
      //   if (res.code === 0) {
      //     this.dataForm = Object.assign({}, res.data)
      //   }
      // })
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
      this.$api.job.save(submitData).then((res) => {
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
      this.$api.job.update(submitData).then((res) => {
        this.loading = false
        if (res.code === 0) {
          this.$message.success(res.msg)
          this.resetFormDatas()
          this.dialogVisible = false
          this.$emit('ok', submitData)
        } else {
          this.$message.error(res.msg)
        }
      }).catch((e) => {
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

</style>
