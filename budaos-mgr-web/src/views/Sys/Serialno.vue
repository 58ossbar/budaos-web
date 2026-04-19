<template>
  <div class="page-container">
    <el-container class="page-container scrollAllY">
      <el-header class="box_shadows bgcolor  scrollRightYDictMenu " style="height: auto;">
        <!--工具栏-->
        <el-form ref="queryForm" :inline="true" :model="filters" :size="size" class="queryForm" label-width="100px">
          <el-row class="elCollapseDict">
            <el-col :span="2">
              <el-form-item class="dictInputQueryLabelWidth">
                <span>名称</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="dictInputQueryWidth ">
                <el-input v-model="filters.serialName" placeholder="名称" clearable/>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-form-item class="dictInputQueryLabelWidth">
                <span>字段名</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="dictInputQueryWidth ">
                <el-input v-model="filters.secoundName" placeholder="字段名" clearable/>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-form-item class="dictInputQueryLabelWidth">
                <span>表名</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="dictInputQueryWidth ">
                <el-input v-model="filters.tabName" placeholder="表名" clearable/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="elDeptFormButton dictQueryCenterButton">
            <el-col :span="24">
              <cb-button :label="$t('action.search')" icon="fa fa-search" perms="sys:tsysserialno:query" type="primary" @click="findPage(null)"/>
              <cb-button :label="$t('action.add')" icon="fa fa-plus" perms="sys:tsysserialno:add" type="primary" @click="handleAdd" />
            </el-col>
          </el-row>
        </el-form>
      </el-header>
      <el-main class="box_shadows bgcolor  scrollRightYDictMenu tableDict marginBottom">
        <!--表格内容栏-->
        <cb-table
          :is-open="isOpen"
          :data="pageResult"
          :columns="columns"
          perms-edit="sys:tsysserialno:edit"
          perms-delete="sys:tsysserialno:remove"
          @findPage="findPage"
          @handleEdit="handleEdit"
          @handleDelete="handleDelete"/>
      </el-main>
    </el-container>
    <!--新增修改界面-->
    <el-dialog v-dialogDrag :title="operation?'新增流水号':'修改流水号'" :visible.sync="dialogVisible" :close-on-click-modal="false" width="50%">
      <el-form
        ref="dataForm"
        :model="dataForm"
        :rules="dataSerialno"
        :size="size"
        label-width="100px"
        style="display: flex;height: 250px;margin-top: 10px">
        <div style="width: 50%;">
          <el-form-item v-if="false" label="ID" prop="roleId">
            <el-input v-model="dataForm.roleId" :disabled="true" auto-complete="off"/>
          </el-form-item>
          <el-form-item label="名称" prop="serialName">
            <el-input v-model="dataForm.serialName" auto-complete="off"/>
          </el-form-item>
          <el-form-item label="生成规则" prop="formularRegx">
            <el-input v-model="dataForm.formularRegx" auto-complete="off"/>
          </el-form-item>
          <el-form-item label="流水号长度" prop="serialLength">
            <el-input-number v-model="dataForm.serialLength" :min="1" controls-position="right" label="排序编号" style="width:100%;"/>
          </el-form-item>
          <el-form-item label="初始值" prop="initValue">
            <el-input v-model="dataForm.initValue" auto-complete="off"/>
          </el-form-item>
          <el-form-item label="表名" prop="tabName">
            <el-input v-model="dataForm.tabName" auto-complete="off"/>
          </el-form-item>
        </div>
        <div style="width: 50%;margin-right: 40px">
          <el-form-item label="字段名" prop="secoundName">
            <el-input v-model="dataForm.secoundName" auto-complete="off"/>
          </el-form-item>
          <el-form-item label="生成方式" prop="createType">
            <el-select v-model="dataForm.createType" placeholder="请选择生成方式" style="width: 100%">
              <el-option
                v-for="data in datacreateType"
                :key="data.value"
                :label="data.label"
                :value="data.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="步长" prop="step">
            <el-input-number v-model="dataForm.step" :min="1" controls-position="right" label="排序编号" style="width:100%;"/>
          </el-form-item>
          <el-form-item label="当前值" prop="currentValue">
            <el-input v-model="dataForm.currentValue" auto-complete="off"/>
          </el-form-item>
          <el-form-item label="是否补零" prop="sfbl">
            <el-select v-model="dataForm.sfbl" placeholder="请选择是否补零" style="width: 100%">
              <el-option
                v-for="data in datasfbl"
                :key="data.value"
                :label="data.label"
                :value="data.value"/>
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <el-form :model="dataForm" :size="size" label-width="100px">
        <el-form-item label="备注说明" prop="remark">
          <el-input v-model="dataForm.remark" type="textarea" auto-complete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="dialogVisible = false">{{ $t('action.cancel') }}</el-button>
        <el-button :size="size" :loading="editLoading" type="primary" @click.native="submitForm">{{ $t('action.preservation') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CbTable from '@/views/Core/CbTable'
import CbButton from '@/views/Core/CbButton'
import {format} from '@/utils/datetime'

export default {
  components: {
    CbTable,
    CbButton
  },
  data() {
    return {
      dataSerialno: {
        serialName: [{ required: true, message: '角色名不能为空', trigger: 'blur' }],
        formularRegx: [{ required: true, message: '生成规则不能为空', trigger: 'blur' }],
        serialLength: [{ required: true, message: '流水号长度不能为空', trigger: 'blur' }],
        initValue: [{ required: true, message: '初始值不能为空', trigger: 'blur' }],
        tabName: [{ required: true, message: '表名不能为空', trigger: 'blur' }],
        secoundName: [{ required: true, message: '字段名不能为空', trigger: 'blur' }],
        currentValue: [{ required: true, message: '当前值不能为空', trigger: 'blur' }]
      },
      size: 'small',
      filters: {
        label: ''
      },
      isOpen: true, // 是否开启点击表格行也选中
      dataForm: {
        serialName: '',
        formularRegx: '',
        serialLength: '',
        initValue: '',
        tabName: '',
        secoundName: '',
        createType: '',
        currentValue: '',
        sfbl: '',
        step: '',
        remark: ''
      },
      columns: [
        { prop: 'serialName', label: '名称', minWidth: 70 },
        { prop: 'formularRegx', label: '规则', minWidth: 70 },
        { prop: 'serialLength', label: '流水号长度', minWidth: 70 },
        { prop: 'initValue', label: '初始值', minWidth: 70 },
        { prop: 'tabName', label: '表名', minWidth: 70 },
        { prop: 'secoundName', label: '字段名', minWidth: 70 },
        { prop: 'currentValue', label: '当前值', minWidth: 70 },
        { prop: 'remark', label: '备注说明', minWidth: 70 },
        { prop: 'step', label: '步长', minWidth: 70 }
      ],
      pageResult: {},
      datasfbl: [{ value: '1', label: '是' }, { value: '0', label: '否' }],
      datacreateType: [{ value: '1', label: '递增' }, { value: '2', label: '每日递增' },
        { value: '3', label: '每月递增' }, { value: '4', label: '每年递增' }, { value: '5', label: '序列递增' }],
      value: '',
      dialogVisible: false,
      operation: false, // true:新增, false:修改
      editDialogVisible: false, // 新增修改界面是否显示
      editLoading: false
    }
  },
  mounted() {
  },
  methods: {
    // 获取分页数据
    findPage: function(data) {
      if (data && data !== null) {
        this.pageRequest = data.pageRequest
      } else {
        this.pageRequest.pageNum = 1
      }
      const jj = {}
      jj.pageNum = this.pageRequest.pageNum
      jj.pageSize = this.pageRequest.PageSize
      jj.serialName = this.filters.serialName
      jj.secoundName = this.filters.secoundName
      jj.tabName = this.filters.tabName
      this.$api.serialno.findPage(jj).then((res) => {
        this.pageResult = res.data
      }).then(data != null ? data.callback : '')
    },
    // 批量删除
    handleDelete: function(data) {
      const arr = []
      for (let i = 0; i < data.params.length; i++) {
        arr.push(data.params[i].id)
      }
      this.$api.serialno.doDelete(arr).then(data != null ? data.callback : '')
    },
    // 显示新增界面
    handleAdd: function() {
      this.dialogVisible = true
      this.operation = true
      this.dataForm = {
        serialName: '',
        formularRegx: '',
        serialLength: '',
        initValue: '',
        tabName: '',
        secoundName: '',
        createType: '',
        currentValue: '',
        sfbl: '',
        step: '',
        remark: ''
      }
    },
    // 显示修改界面
    handleEdit: function(params) {
      this.dialogVisible = true
      this.operation = false // 标识为修改
      this.dataForm = Object.assign({}, params.row)
    },
    // 修改
    submitForm: function() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.editLoading = true
            this.dialogVisible = false
            const params = Object.assign({}, this.dataForm)
            this.$api.serialno.save(params).then((res) => {
              if (res.code == 0) {
                this.$message({ message: '操作成功', type: 'success' })
              } else {
                this.$message({ message: '操作失败, ' + res.msg, type: 'error' })
              }
              this.editLoading = false
              this.$refs['dataForm'].resetFields()
              this.editDialogVisible = false
              this.findPage(null)
            })
          })
        }
      })
    },
    // 时间格式化
    dateFormat: function(row, column, cellValue, index) {
      return format(row[column.property])
    }
  }
}
</script>

<style scoped>

</style>

