<template>
  <el-dialog
    v-dialogDrag
    :title="operation ? $t('action.add') + '角色' : $t('action.edit') + '角色'"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="50%"
    top="7vh"
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
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            ref="dataFormRoleName"
            v-model="dataForm.roleName"
            auto-complete="off"
            clearable
            @clear="toValidateField('roleName')"/>
        </el-form-item>
        <el-form-item label="所属机构" prop="orgId" >
          <cb-tree
            :parent-vue="_self"
            :data-form="dataForm"
            :prop="{id: 'orgId', name: 'orgName'}"
            url="/api/sys/org/getOrgTree"
            placeholder="请选择所属机构"
            name="orgId"
            default-expanded-level="1"
          />
        </el-form-item>
        <el-form-item ref="myForm" prop="menuIdList" style="overflow:auto; height:400px;overflow-x:hidden;">
          <!--过滤输入框-->
          <el-input v-model="filterTextForMenu" placeholder="请输入关键字进行过滤" style="margin: 0px 0px;"/>
          <!--新增或修改界面左侧资源菜单树-->
          <el-tree
            ref="menuTree"
            :filter-node-method="filterNodeForMenuTree"
            :data="menuIdListData"
            :props="{id: 'menuId', label: 'name'}"
            :default-expanded-keys="defaultExpandedKeysForMenuTree"
            node-key="menuId"
            show-checkbox
            highlight-current
            @check-change="getCheckedKeysForMenuTree"
          />
        </el-form-item>
      </div>
      <div class="floating-half">
        <el-form-item label="数据范围" prop="dataScope" >
          <el-select v-model="dataForm.dataScope" placeholder="请选择数据范围，必选" style="width: 100%;" clearable @clear="toValidateField('dataScope')" @change="queryScope">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="角色描述" prop="remark">
          <el-input v-model="dataForm.remark" auto-complete="off" placeholder=""/>
        </el-form-item>
        <el-form-item ref="myMenuIdList" prop="menuIdList" style="overflow:auto; height:400px;overflow-x:hidden;">
          <el-input v-if="dataForm.dataScope === '5'" v-model="filterTextForOrg" style="margin: 0px 0px;" placeholder="输入关键字进行过滤" />
          <el-tree
            ref="orgTree"
            :props="{id: 'orgId', label: 'orgName'}"
            :data="orgTreeData"
            :default-expanded-keys="defaultExpandedkeysForOrgTree"
            :filter-node-method="filterNodeOrg"
            class="filter-tree"
            show-checkbox
            check-strictly
            accordion
            node-key="orgId"
            @check="checkForSaveOrgTree"/>
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
import {convertTreeData} from '@/utils/util'

export default {
  data() {
    // 验证角色名称
    var validateRoleName = (rule, value, callback) => {
      // value = value.trim()
      if (value == null || value === '' || value === undefined) {
        callback(new Error('角色名称不能为空'))
      } else if (value.length > 100) {
        callback(new Error('角色名称不能超过100个字符'))
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
        // 角色id
        roleId: null,
        // 角色名称
        roleName: '',
        // 所属机构
        orgId: '',
        // 数据范围
        dataScope: '',
        // 备注
        remark: '',
        // 角色状态：1启用、0禁用
        status: '1',
        // 角色类型：公有、私有
        roleType: '',
        // 所属机构集
        orgIdList: [],
        // 菜单ID集
        menuIdList: [],
        // 用户id集
        userIdList: []
      },
      // 表单校验规则
      dataRule: {
        roleName: [{ required: true, validator: validateRoleName, trigger: 'blur' }],
        dataScope: [{ required: true, message: '数据范围不能为空', trigger: 'blur' }],
        orgId: [{ required: true, message: '所属机构不能为空', trigger: 'change' }]
      },
      filterTextForMenu: '',
      menuIdListData: [],
      defaultExpandedKeysForMenuTree: [],
      options: [
        { value: '1', label: '所有数据' },
        { value: '2', label: '所在部门及以下数据' },
        { value: '3', label: '所在部门数据' },
        { value: '4', label: '仅本人数据' },
        { value: '5', label: '按明细设置' }
      ],
      filterTextForOrg: '',
      orgTreeData: [],
      defaultExpandedkeysForOrgTree: []
    }
  },
  watch: {
    // 新增或修改中右侧菜单树的过滤
    filterTextForMenu(val) {
      this.$refs.menuTree.filter(val)
    },
    // 新增修改中数据范围按明细设置的机构树
    filterTextForOrg(val) {
      this.$refs.orgTree.filter(val)
    }
  },
  mounted() {
    // 渲染菜单树
    this.findPerms()
    // 渲染机构树
    this.queryAddOrgTree()
  },
  methods: {
    handleAdd() {
      this.operation = true
      this.dialogVisible = true
      // 重置表单数据
      this.resetFormDatas()
      // 清空验证
      if (this.$refs['dataForm']) {
        this.$refs['dataForm'].clearValidate()
      }
      if (this.dataForm.dataScope === '5') {
        this.queryAddOrgTree()
      } else {
        this.orgTreeData = []
      }
      // 若先修改，在新增，则需要清空被选中的节点
      if (this.$refs.menuTree) {
        this.$refs.menuTree.setCheckedNodes([])
      }
      // 光标聚焦
      this.$nextTick(() => {
        this.$refs.dataFormRoleName.focus()
      })
    },
    handleEdit(row) {
      // 标识为修改
      this.operation = false
      // 打开界面
      this.dialogVisible = true
      // 清空验证
      if (this.$refs['dataForm']) {
        this.$refs['dataForm'].clearValidate()
      }
      // 其它业务操作
      if (row.dataScope === '5') {
        this.queryAddOrgTree()
      } else {
        this.orgTreeData = []
      }
      this.$api.role.view(row.roleId).then(res => {
        if (res.code === 0) {
          // 赋值
          this.dataForm = Object.assign({}, res.data)
          // 处理菜单树
          if (res.data.menuIdList != null && res.data.menuIdList.length > 0) {
            // 默认先赋值菜单ID集和机构ID集
            this.dataForm.menuIdList = res.data.menuIdList
            this.dataForm.orgIdList = res.data.orgIdList
            for (var i = 0; i < res.data.menuIdList.length; i++) {
              // 通过setChecked设置节点选中
              this.$refs.menuTree.setChecked(res.data.menuIdList[i], true, false)
            }
          }
          // 回显机构树数据，设置节点选中
          if (res.data.dataScope === '5') {
            this.$refs.orgTree.setCheckedKeys(res.data.orgIdList)
          }
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
      this.$api.role.save(submitData).then((res) => {
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
      this.$api.role.update(submitData).then((res) => {
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
      if (this.$refs.menuTree) {
        this.$refs.menuTree.setCheckedKeys([])
      }
      if (this.$refs.orgTree) {
        this.$refs.orgTree.setCheckedKeys([])
      }
      this.dataForm = {
        // 角色id
        roleId: null,
        // 角色名称
        roleName: '',
        // 所属机构
        orgId: '',
        // 数据范围
        dataScope: '',
        // 备注
        remark: '',
        // 角色状态：1启用、0禁用
        status: '1',
        // 角色类型：公有、私有
        roleType: '',
        // 所属机构集
        orgIdList: [],
        // 菜单ID集
        menuIdList: [],
        // 用户id集
        userIdList: []
      }
    },
    toValidateField(fieldName) {
      if (this.$refs['dataForm']) {
        this.$refs['dataForm'].validateField(fieldName)
      }
    },
    findPerms() {
      this.$api.menu.queryPerms().then((res) => {
        const treeData = convertTreeData(res.data, 'menuId')
        this.menuIdListData = treeData
      })
    },
    // 左侧菜单树的过滤
    filterNodeForMenuTree(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    getCheckedKeysForMenuTree(data, isChecked) {
      // 返回当前选中节点得key(包含子节点的)
      var a = this.$refs.menuTree.getCheckedKeys()
      // 返回目前半选中的节点的 key 所组成的数组（即父节点的key）
      var b = this.$refs.menuTree.getHalfCheckedKeys()
      var c = a.concat(b)
      this.dataForm.menuIdList = c
    },
    // 数据范围的事件，当选中【按明细设置】出现机构树
    queryScope: function() {
      if (this.dataForm.dataScope === '5') {
        this.queryAddOrgTree()
      } else {
        this.orgTreeData = []
        this.$refs.orgTree.setCheckedKeys([])
        // 新增的时候，清空下
        if (this.operation) {
          this.dataForm.orgIdList = []
        }
      }
      // 清除验证
      if (this.$refs['dataForm']) {
        this.$refs['dataForm'].clearValidate('dataScope')
      }
    },
    // 数据范围所用到的机构树
    queryAddOrgTree: function() {
      this.$api.dept.getOrgTree().then(res => {
        const treeData = convertTreeData(res.data, 'orgId')
        this.orgTreeData = treeData
        if (this.dataForm.orgIdList != null && this.dataForm.orgIdList.length > 0) {
          this.$refs.orgTree.setCheckedKeys(this.dataForm.orgIdList)
        }
      })
    },
    filterNodeOrg(value, data) {
      if (!value) return true
      return data.orgName.indexOf(value) !== -1
    },
    // 新增或修改界面中左侧机构树，当复选框被点击的时候触发 args返回四个参数
    checkForSaveOrgTree: function(data, args) {
      this.dataForm.orgIdList = args.checkedKeys // 赋值机构ID集
    }
  }
}
</script>

<style>

</style>
