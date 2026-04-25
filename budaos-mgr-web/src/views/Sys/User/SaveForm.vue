<template>
  <el-dialog
    v-dialogDrag
    :title="operation ? $t('action.add') + '用户' : $t('action.edit') + '用户'"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="60%"
    @close="handleClose"
  >
    <el-form
      ref="dataForm"
      :model="dataForm"
      :rules="dataRule"
      :size="size"
      class="formInfo"
      label-width="100px"
      style="text-align:left;"
      @keyup.enter.native="submitForm()"
    >
      <el-row>
        <el-collapse v-model="activeNames" accordion>
          <el-collapse-item name="1" style="width:99%;">
            <template slot="title">
              <el-button type="primary" class="collapseItemHr" />基本信息
            </template>
            <div class="floating-half">
              <el-form-item label="登录名称" prop="username">
                <el-input v-model="dataForm.username" auto-complete="off" type="text" maxlength="50"/>
              </el-form-item>
              <el-form-item label="真实姓名" prop="userRealname">
                <el-input v-model="dataForm.userRealname" auto-complete="off" type="text" maxlength="50"/>
              </el-form-item>
              <el-form-item label="手机号码" prop="mobile">
                <el-input v-model="dataForm.mobile" auto-complete="off" type="text" maxlength="11" oninput="this.value=this.value.match(/^[1-9][0-9]*$/)"/>
              </el-form-item>
              <el-form-item label="所属机构" prop="orgId">
                <cb-tree
                  :parent-vue="_self"
                  :data-form="dataForm"
                  :prop="{id: 'orgId', name: 'orgName'}"
                  url="/api/sys/org/getOrgTree"
                  placeholder=""
                  name="orgId"
                  default-expanded-level="1"
                />
              </el-form-item>
              <el-form-item v-if="!operation" label="排序号码" prop="sortNum">
                <el-input-number
                  v-model="dataForm.sortNum"
                  :min="1"
                  :max="99999"
                  controls-position="right"
                  label="排序编号"
                  class="widthAll"/>
              </el-form-item>
              <el-form-item label="用户类型" prop="userType">
                <cb-param
                  :parent-vue="_self"
                  :data-form="dataForm"
                  placeholder=""
                  name="userType"
                  param="userType"
                  type="radio"
                />
              </el-form-item>
            </div>
            <div class="floating-half">
              <el-form-item style="display: flex" prop="userImg">
                <cb-upload
                  :parent-vue="_self"
                  :data-form="dataForm"
                  type="2"
                  name="userimg"
                  placeholder="头像上传"
                  title="点击上传用户头像"
                />
              </el-form-item>
              <el-form-item label="性别" prop="sex">
                <cb-param
                  :parent-vue="_self"
                  :data-form="dataForm"
                  placeholder="请选择"
                  name="sex"
                  param="sex"
                  type="select"
                />
              </el-form-item>
              <el-form-item label="状态" prop="status">
                <cb-param
                  :parent-vue="_self"
                  :data-form="dataForm"
                  placeholder=""
                  name="status"
                  param="status"
                  type="radio"
                />
              </el-form-item>
            </div>
          </el-collapse-item>
          <el-collapse-item name="2" style="width:99%;">
            <template slot="title">
              <el-button type="primary" class="collapseItemHr" />更多信息
            </template>
            <div class="floating-half">
              <el-form-item label="身份证号" prop="userCard">
                <el-input v-model="dataForm.userCard" auto-complete="off" maxlength="18"/>
              </el-form-item>
              <el-form-item label="邮政编码" prop="zip">
                <el-input v-model="dataForm.zip" auto-complete="off" maxlength="10"/>
              </el-form-item>
              <el-form-item label="电子邮箱" prop="email">
                <el-input v-model="dataForm.email" auto-complete="off" maxlength="100"/>
              </el-form-item>
            </div>
            <div class="floating-half">
              <el-form-item label="出生日期" prop="birthday">
                <el-date-picker
                  v-model="dataForm.birthday"
                  style="width: 100%"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder="选择日期"/>
              </el-form-item>
              <el-form-item label="所属民族" prop="nation">
                <el-input v-model="dataForm.nation" auto-complete="off" maxlength="20"/>
              </el-form-item>
              <el-form-item label="所属岗位" prop="postIdList">
                <el-select v-model="dataForm.postId" placeholder="请选择" style="width: 100%;" clearable>
                  <el-option
                    v-for="item in postList"
                    :key="item.postId"
                    :label="item.postName"
                    :value="item.postId"/>
                </el-select>
              </el-form-item>
            </div>
            <div style="width: 100%;float:left;">
              <el-form-item label="所属副机构" prop="orgIdList" >
                <el-cascader
                  :options="orgTreeData"
                  v-model="popupTreeOrgIdList"
                  :props="{ multiple: true, checkStrictly: true, value: 'orgId', label: 'orgName'}"
                  :show-all-levels="false"
                  style="width: 97.8%"
                  clearable
                  @change="getOrgIdList"/>
              </el-form-item>
            </div>
            <div style="width: 100%;float:left;">
              <el-form-item label="家庭住址" prop="nativePlace">
                <el-input v-model="dataForm.nativePlace" style="width: 97.8%" auto-complete="off" maxlength="255"/>
              </el-form-item>
            </div>
          </el-collapse-item>
          <el-collapse-item name="3" style="width:99%;">
            <template slot="title">
              <el-button type="primary" class="collapseItemHr" />角色信息
            </template>
            <el-form-item label="" prop="roleIdList" >
              <el-checkbox-group v-model="dataForm.roleIdList">
                <el-checkbox v-for="item in roleList" :label="item.roleId" :key="item.roleId">{{ item.roleName }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>

          </el-collapse-item>

        </el-collapse>
      </el-row>
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
    var validateUserName = (rule, value, callback) => {
      if (value) {
        if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(value)) {
          callback(new Error('必须是字母开头，字母数字下划线组成'))
        } else {
          callback()
        }
      } else {
        callback(new Error('登录名称不能为空'))
      }
    }
    var validateZip = (rule, value, callback) => {
      if (value) {
        if (!/^[1-9][0-9]{5}$/.test(value)) {
          callback(new Error('邮政编码不正确'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    var validateEmail = (rule, value, callback) => {
      if (value) {
        if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value)) {
          callback(new Error('邮箱格式不正确'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    var validateUserCard = (rule, value, callback) => {
      if (value) {
        if (!/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(value)) {
          callback(new Error('身份证格式不正确'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    var validateMobile = (rule, value, callback) => {
      if (value) {
        if (isNaN(value)) {
          callback(new Error('请输入数字'))
        } else {
          if (!(/^1(3|4|5|7|8|6)\d{9}$/.test(value))) {
            callback(new Error('手机号码格式不正确'))
          } else {
            callback()
          }
        }
      } else {
        callback(new Error('手机号码不能为空'))
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
        // 用户ID
        userId: null,
        // 登录账号，用户名
        username: '',
        // 用户真实姓名
        userRealname: '',
        // 手机号码
        mobile: '',
        // 所属机构
        orgId: '',
        // 所属副机构
        orgIdList: [],
        // 岗位
        postIdList: [],
        // 角色
        roleIdList: [],
        // 性别
        sex: '0',
        // 头像
        userimg: '',
        // 用户类型
        userType: '0',
        // 状态
        status: '1',
        // 身份证号
        userCard: '',
        // 家庭住址
        nativePlace: '',
        // 邮箱
        email: '',
        // 邮政编码
        zip: '',
        // 出生日期
        birthday: '',
        // 民族
        nation: ''
      },
      // 表单校验规则
      dataRule: {
        username: [{ required: true, validator: validateUserName, trigger: 'blur' }],
        userRealname: [{ required: true, message: '真实姓名不能为空', trigger: 'blur' }],
        mobile: [{ required: true, validator: validateMobile, trigger: 'blur' }],
        userCard: [{ validator: validateUserCard, trigger: 'blur' }],
        email: [{ validator: validateEmail, trigger: 'blur' }],
        zip: [{ validator: validateZip, trigger: 'blur' }],
        orgId: [{ required: true, message: '所属机构不能为空', trigger: 'change' }],
        sortNum: [{ required: true, message: '排序号码不能为空', trigger: 'blur' }]
      },
      // 折叠面板初始化：初识显示哪个面板
      activeNames: ['1'],
      // 所属副机构
      orgTreeData: [],
      popupTreeOrgIdList: [],
      // 所属岗位
      postList: [],
      // 角色
      roleList: []
    }
  },
  mounted() {
    this.queryPost()
    this.findAllRoles()
  },
  methods: {
    handleAdd(orgTreeData) {
      this.operation = true
      this.dialogVisible = true
      if (this.$refs['dataForm']) {
        this.$refs['dataForm'].clearValidate()
      }
      // 不重复调接口
      this.orgTreeData = orgTreeData
    },
    handleEdit(row, orgTreeData) {
      this.operation = false
      this.dialogVisible = true
      this.orgTreeData = orgTreeData
      this.$api.user.view(row.userId).then(res => {
        if (res.code === 0) {
          // 回显所属岗位
          res.data.postId = (res.data.postIdList && res.data.postIdList.length) ? res.data.postIdList[0] : ''
          // 回显副机构
          this.popupTreeOrgIdList = res.data.orgIdList
          // 回显数据
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
      this.$api.user.save(submitData).then((res) => {
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
      this.$api.user.update(submitData).then((res) => {
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
      this.activeNames = ['1']
      // 清空表单验证
      if (this.$refs['dataForm']) {
        this.$refs['dataForm'].clearValidate()
      }
    },
    resetFormDatas() {
      this.dataForm = {
        // 用户ID
        userId: null,
        // 登录账号，用户名
        username: '',
        // 用户真实姓名
        userRealname: '',
        // 手机号码
        mobile: '',
        // 所属机构
        orgId: '',
        // 所属副机构
        orgIdList: [],
        // 岗位
        postIdList: [],
        // 角色
        roleIdList: [],
        // 性别
        sex: '0',
        // 头像
        userimg: '',
        // 用户类型
        userType: '0',
        // 状态
        status: '1',
        // 身份证号
        userCard: '',
        // 家庭住址
        nativePlace: '',
        // 邮箱
        email: '',
        // 邮政编码
        zip: '',
        // 出生日期
        birthday: '',
        // 民族
        nation: ''
      }
      this.popupTreeOrgIdList = []
    },
    queryPost() {
      this.$api.post.findPost().then((res) => {
        if (res.code === 0) {
          this.postList = res.data
        }
      })
    },
    findAllRoles() {
      this.$api.role.findAll().then((res) => {
        if (res.code === 0) {
          this.roleList = res.data
        }
      })
    },
    getOrgIdList: function(data) {
      this.dataForm.orgIdList = []
      for (let i = 0; i < data.length; i++) {
        this.dataForm.orgIdList.push(data[i][data[i].length - 1])
      }
    }
  }
}
</script>

<style>

</style>
