<template>
  <div class="personal-panel">
    <el-dropdown-item class="personal-footer" @click.native="showDiglog">
      <li class="fa fa-male" >&nbsp;&nbsp;账户设置</li>
    </el-dropdown-item>
    <el-dropdown-item class="personal-footer" @click.native="changeUserPass">
      <li class="fa fa-key">&nbsp;&nbsp;修改密码</li>
    </el-dropdown-item>
    <el-dropdown-item class="personal-footer" @click.native="logout">
      <li class="fa fa-sign-out">&nbsp;&nbsp;退出登录</li>
    </el-dropdown-item>
    <!--账户管理界面-->
    <el-dialog v-dialogDrag :visible.sync="dialogVisible" :modal-append-to-body="false" :close-on-click-modal="false" title="账户设置" width="50%" @close="dialogCloseForSave">
      <el-tabs :tab-position="tabPosition">
        <el-tab-pane class="showtabs" label="基本设置" >
          <div style="clear: both"/>
          <el-form ref="dataForm" :model="dataForm" :rules="dataUser" :size="size" label-width="100px">
            <div style="width: 49%;float:left;margin-top: 25px">
              <el-form-item v-if="false" label="ID" prop="userId">
                <el-input v-model="dataForm.userId" :disabled="true" auto-complete="off"/>
              </el-form-item>
              <el-form-item label="手机号" prop="mobile">
                <el-input v-model="dataForm.mobile" auto-complete="off"/>
              </el-form-item>
              <el-form-item label="身份证号码" prop="userCard">
                <el-input v-model="dataForm.userCard" auto-complete="off"/>
              </el-form-item>
              <el-form-item label="家庭住址" prop="nativePlace">
                <el-input v-model="dataForm.nativePlace" auto-complete="off"/>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="dataForm.email" auto-complete="off"/>
              </el-form-item>
              <el-form-item label="出生日期" prop="birthday">
                <el-date-picker
                  v-model="dataForm.birthday"
                  style="width: 100%"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder="选择日期"/>
              </el-form-item>
            </div>
            <div style="width: 49%;float:left;margin-top: 25px">
              <el-form-item style="display: flex" prop="userimg">
                <el-upload
                  :action="actionUrl"
                  :headers="uploadHeaders"
                  :show-file-list="false"
                  :on-progress="onProgressForImg"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                  style="height: 125px;width:130px;"
                  class="avatar-uploader">
                  <img v-if="imageUrl" :src="imageUrl" class="avatar" style="height: 125px;width:130px;">
                  <img
                    v-else
                    src="../../assets/my/upload.png"
                    style="width: 40px;height: 30px;margin-top: 30px">
                  <div style="width: 130px;text-align: center;">头像上传</div>
                </el-upload>
              </el-form-item>
              <el-form-item label="邮政编码" prop="zip">
                <el-input v-model="dataForm.zip" auto-complete="off"/>
              </el-form-item>
              <el-form-item label="民族" prop="nation">
                <el-input v-model="dataForm.nation" auto-complete="off"/>
              </el-form-item>

            </div>
          </el-form>
        </el-tab-pane>
        <el-tab-pane class="showtabs" label="安全设置">
        <div style="clear: both"/></el-tab-pane>
        <el-tab-pane class="showtabs" label="个性化">
          <div style="clear: both">
            <el-form ref="form" :model="form" :size="size" class="widthJiuBa">
              <el-row style="margin-top: 20px">
                <el-col :span="4">
                  <el-form-item>
                    <span>字体大小</span>
                  </el-form-item>
                </el-col>
                <el-col :span="20">
                  <el-row>
                    <el-col :span="20">
                      <el-form-item prop="Asize">
                        <el-slider v-model="form.Asize" :min="10" :max="18" show-input input-size="mini" @change="changeFont" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="4" style="margin-top: 2px;">
                      <el-form-item>
                        <el-button size="mini" type="primary" @click="fontSizeReset">{{ $t('action.reset') }}</el-button>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
              <div v-if="hasPerms('sys:settings:edit')">
                <el-row >
                  <el-col :span="4">
                    <el-form-item>
                      <span>平台logo</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item prop="imageUrl">
                      <span class="colorPersonlLogo">（只能上传JPG/PNG/GIF/BMP格式图片）</span>
                      <el-upload
                        ref="uploader"
                        :action="uploadAddrLogo"
                        :show-file-list="false"
                        :headers="uploadHeaders"
                        :on-success="handleUploaderLogo"
                        :before-upload="beforeAvatarUpload"
                        class="avatar-uploader dictUPloadWidth"
                        name="icon"
                        with-credentials>
                        <img v-if="form.imageUrl" :src="form.imageUrl" class="avatar"> <!-- -->
                        <!--<i v-else class="el-icon-upload avatar-uploader-icon"></i>-->
                        <img
                          v-else
                          src="../../assets/my/upload.png"
                          class="dictUPloadImgs">
                      </el-upload>
                    </el-form-item>

                  </el-col>
                  <el-col :span="4">
                    <el-form-item>
                      <span>登录背景图</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">

                    <el-form-item prop="imageUrlBack">
                      <span class="colorPersonl">（只能上传JPG/PNG/GIF/BMP格式图片</span>
                      <span class="colorPersonl">最好上传1920 * 550px的图片）</span>
                      <el-upload
                        ref="uploader"
                        :action="uploadAddrBackImg"
                        :show-file-list="false"
                        :headers="uploadHeaders"
                        :on-success="handleUploaderBack"
                        :before-upload="beforeAvatarUpload"
                        class="avatar-uploader dictUPloadWidth"
                        name="icon"
                        with-credentials>
                        <img v-if="form.imageUrlBack" :src="form.imageUrlBack" class="avatar">
                        <img
                          v-else
                          src="../../assets/my/upload.png"
                          class="dictUPloadImgs">
                      </el-upload>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row >
                  <el-col :span="4">
                    <el-form-item>
                      <span>平台名称</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item prop="sxName">
                      <el-input
                        v-model="form.sxName"
                        auto-complete="off"
                        clearable
                        maxlength="30"
                        type="text"
                        placeholder="平台名称"
                        @blur="changeSxName"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item>
                      <span>公司电话</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item prop="phone" >
                      <el-input v-model="form.phone" placeholder="公司电话" maxlength="30" type="text" clearable @blur="changePhone"/>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="4">
                    <el-form-item>
                      <span>公司信息</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="20">
                    <el-form-item prop="info" >
                      <el-input v-model="form.info" placeholder="公司信息" maxlength="30" type="text" clearable @blur="changeInfo"/>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane class="showtabs" label="账户绑定">
          <div style="clear: both"/>
        </el-tab-pane>
        <el-tab-pane class="showtabs" label="新消息通知">
          <div style="clear: both"/>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer" >
        <el-button :size="size" @click.native="dialogVisible = false">{{ $t('action.cancel') }}</el-button>
        <el-button :size="size" type="primary" @click.native="saveShowDialog" >{{ $t('action.submit') }}</el-button>
      </div>
    </el-dialog>
    <!--修改密码界面-->
    <el-dialog v-dialogDrag :visible.sync="dialogVisibleUserPass" :modal-append-to-body="false" :close-on-click-modal="false" title="修改密码" width="30%">
      <el-form
        ref="dataForm"
        :model="dataFormPass"
        :rules="dataUserPass"
        :size="size"
        label-width="100px"
        style="margin-top: 10px">
        <el-form-item label="旧密码" prop="password" >
          <el-input v-model="dataFormPass.password" type="password" auto-complete="off" style="width: 95%"/>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="dataFormPass.newPassword" type="password" auto-complete="off" style="width: 95%"/>
        </el-form-item>
        <el-form-item label="确认密码" prop="reallyPassWord">
          <el-input v-model="dataFormPass.reallyPassWord" type="password" auto-complete="off" style="width: 95%"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" >
        <el-button :size="size" @click.native="dialogVisibleUserPass = false">{{ $t('action.cancel') }}</el-button>
        <el-button :size="size" type="primary" @click.native="saveChangeUserPass" >{{ $t('action.submit') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Backup from '@/views/Backup/Backup'
import {hasPermission} from '@/permission/index.js'
import {baseUrl} from '../../utils/global'
import TableColumnFilterDialog from './TableColumnFilterDialog'
import Cookies from 'js-cookie'
import {handleImagePath} from '@/utils/util'

export default {
  name: 'PersonalPanel',
  components: {
    TableColumnFilterDialog,
    Backup
  },
  data() {
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
        /*    0731-89913439*/
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
        callback(new Error('手机号码不为空'))
      }
    }
    var validatereallyPassWord = (rule, value, callback) => {
      if (this.dataFormPass.newPassword !== this.dataFormPass.reallyPassWord) {
        callback(new Error('新密码和确认密码不一致'))
      } else {
        callback()
      }
    }
    return {
      uploadImgIsOk: true,
      actionUrl: baseUrl + '/api/cbupload/uploadPic?type=2',
      uploadAddrLogo: '',
      uploadAddrBackImg: '',
      dataUser: {
        mobile: [{ required: true, validator: validateMobile, trigger: 'blur' }],
        userCard: [{ validator: validateUserCard, trigger: 'blur' }],
        email: [{ validator: validateEmail, trigger: 'blur' }],
        zip: [{ validator: validateZip, trigger: 'blur' }]
      },
      dataUserPass: {
        password: [{ required: true, message: '旧密码不能为空', trigger: 'blur' }],
        newPassword: [{ required: true, message: '新密码不能为空', trigger: 'blur' }],
        reallyPassWord: [{ validator: validatereallyPassWord, trigger: 'blur' }]
      },
      imageUrl: '', // 头像上传成功后，用该值回显
      uploadHeaders: {},
      attachId: '',
      Asize: [
        {
          value: 'default',
          label: '默认'
        }, {
          value: 'small',
          label: '小'
        }, {
          value: 'center',
          label: '中'
        }, {
          value: 'big',
          label: '大'
        }
      ],
      Skin: [
        {
          value: 'default',
          label: '默认'
        }, {
          value: 'green',
          label: '典雅绿'
        }, {
          value: 'red',
          label: '樱桃红'
        }, {
          value: 'purple',
          label: '贵族紫'
        }, {
          value: 'blue',
          label: '天空蓝'
        }
      ],
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',

        Asize: 14,
        imageUrl: null,
        imageUrlBack: null,
        imageUrlId: null,
        imageUrlBackId: null,
        sxName: null,
        sxNameId: null,
        phone: null,
        phoneId: null,
        info: null,
        infoId: null,

        delivery: true,
        type: ['中文'],
        resource: '中文',
        desc: '',
        options: []
      },
      zhch: ['中文', 'English'],
      full: ['Yes', 'No'],
      allset: ['字体大小', '界面皮肤', '中英文互译', '是否全屏'],
      size: 'small',
      dataForm: {
        mobile: '',
        userCard: '',
        nativePlace: '',
        email: '',
        birthday: '',
        userId: '',
        userimg: '',
        zip: '',
        nation: ''
      },
      dataFormPass: {
        password: '',
        newPassword: '',
        reallyPassWord: ''
      },
      tabPosition: 'left',
      dialogVisible: false, // 账户设置界面是否显示
      dialogVisibleUserPass: false // 修改密码界面是否显示
    }
  },
  mounted() {
    this.getUploadHeaders()
    this.findSettingData()
  },
  methods: {
    hasPerms: function(perms) {
      // 根据权限标识和外部指示状态进行权限判断
      return hasPermission(perms) & !this.disabled
    },
    changeInfo: function() {
      if (this.form.phone) {
        const submitData = {
          settingId: this.form.infoId,
          settingValue: this.form.info
        }
        this.$api.settings.update(submitData).then((res) => {
          if (res.code === 0) {
            this.$message({ message: '操作成功', type: 'success' })
          } else {
            this.$message.error(res.msg)
          }
        })
      }
    },
    changePhone: function() {
      if (this.form.phone) {
        const submitData = {
          settingId: this.form.phoneId,
          settingValue: this.form.phone
        }
        this.$api.settings.update(submitData).then((res) => {
          if (res.code === 0) {
            this.$message({ message: '操作成功', type: 'success' })
          } else {
            this.$message.error(res.msg)
          }
        })
      }
    },
    changeSxName: function() {
      if (this.form.sxName) {
        const submitData = {
          settingId: this.form.sxNameId,
          settingValue: this.form.sxName
        }
        this.$api.settings.update(submitData).then((res) => {
          if (res.code === 0) {
            this.$message({ message: '操作成功', type: 'success' })
          } else {
            this.$message.error(res.msg)
          }
        })
      }
    },
    // 字体重置
    fontSizeReset: function() {
      this.form.Asize = 14
      this.changeFont(14)
    },
    // 字体设置
    changeFont: function(fontSize) {
      let fontStyleTag = document.getElementById('fontStyle')
      if (!fontStyleTag) {
        fontStyleTag = document.createElement('style')
        fontStyleTag.setAttribute('id', 'fontStyle')
        document.body.appendChild(fontStyleTag)
      }
      fontStyleTag.innerText = 'html {font-size: ' + fontSize + 'px;}'
    },
    saveShowDialog: function() {
      this.dialogVisible = true
      this.$refs.dataForm.validate((valid) => {
        /* if (!this.uploadImgIsOk){
          this.$message({message: '正在上传图片中,请稍作等待...', type: 'warning'});
          return false;
        }*/
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            const params = Object.assign({}, this.dataForm)
            params.userimgAttachId = this.attachId
            params.username = sessionStorage.getItem('user')
            this.$api.user.update(params).then((res) => {
              if (res.code === 0) {
                this.$message({ message: '操作成功', type: 'success' })
                this.dialogVisible = false
                if (res.data.userimg) {
                  this.$emit('changeUserImg', handleImagePath(res.data.userimg))
                }
                this.$refs['dataForm'].resetFields()
              } else {
                this.$message({ message: '操作失败, ' + res.msg, type: 'error' })
              }
              this.dialogVisible = false
            })
          }).catch(() => { this.dialogVisible = false })
        }
      })
    },
    saveChangeUserPass: function() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.dialogVisibleUserPass = false
            const params = Object.assign({}, this.dataFormPass)
            this.$api.user.changePassword(params).then((res) => {
              if (res.code === 0) {
                this.$message({ message: '操作成功', type: 'success' })
                this.$api.login.logout().then((res) => {
                  this.$store.state.tab.mainTabs = []
                  this.$store.state.menu.navTree = []
                  this.$store.state.app.menuRouteLoaded = false
                  sessionStorage.removeItem('user')
                  this.$router.push('/login')
                })
                this.$refs['dataForm'].resetFields()
              } else {
                this.$message({ message: '操作失败, ' + res.msg, type: 'error' })
              }
            })
          }).catch(() => { this.dialogVisibleUserPass = false })
        }
      })
    },
    // 显示账户管理界面
    showDiglog: function() {
      this.dialogVisible = true
      this.$api.user.view(sessionStorage.getItem('userId')).then((res) => {
        if (res.code !== 0) {
          this.$message.warning(res.msg)
          return false
        }
        res.data.userimg = handleImagePath(res.data.userimg, true)
        this.imageUrl = res.data.userimg
        this.dataForm.nation = res.data.nation
        this.dataForm.zip = res.data.zip
        this.dataForm.userId = res.data.userId
        this.dataForm.userCard = res.data.userCard
        this.dataForm.nativePlace = res.data.nativePlace
        this.dataForm.mobile = res.data.mobile
        this.dataForm.userimg = res.data.userimg
        this.dataForm.birthday = res.data.birthday
        this.dataForm.email = res.data.email
      })
    },
    // 头像上传
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      this.dataForm.userimg = res.data.imgNamePc
      this.attachId = res.data.attachId
    },
    /**
     * 文件上传时的钩子
     * @param event
     * @param file
     * @param fileList
     */
    onProgressForImg(event, file, fileList) {
      this.uploadImgIsOk = false
    },
    // logo上传
    handleUploaderLogo(res, file) {
      if (res.code === 0) {
        this.uploadImgIsOk = true
        this.$message({ message: '图片上传成功', type: 'success' })
        this.form.imageUrl = URL.createObjectURL(file.raw)
      } else {
        this.$message.error(res.msg)
        return
      }
      /* this.imageUrl =baseDictUrl+res.data.imgNamePc ;*/
    },
    // 背景图片上传
    handleUploaderBack(res, file) {
      if (res.code === 0) {
        this.$message({ message: '图片上传成功', type: 'success' })
        this.form.imageUrlBack = URL.createObjectURL(file.raw)
      } else {
        this.$message.error(res.msg)
        return
      }
      /* this.imageUrl =baseDictUrl+res.data.imgNamePc ;*/
    },
    getUploadHeaders: function() {
      var token = Cookies.get('token')
      if (token) {
        this.uploadHeaders.authorization = 'Bearer' + token
      }
    },
    beforeAvatarUpload(file) {
      const imgType = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp']
      let isJPG = 0
      for (let j = 0; j < imgType.length; j++) {
        if (file.type === imgType[j]) {
          isJPG = 1
        }
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (isJPG !== 1) {
        this.$message.error('上传头像图片只能是 JPG/PNG/GIF/BMP 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 退出登录
    logout: function() {
      this.$confirm('确认退出吗?', '提示', {
        type: 'warning'
      })
        .then(() => {
          this.$api.login.logout().then((res) => {
            this.$store.state.tab.mainTabs = []
            this.$store.state.menu.navTree = []
            this.$store.state.app.menuRouteLoaded = false
            sessionStorage.removeItem('user')
            this.$router.push('/login')
          }).catch(function(res) {
          })
        })
        .catch(() => {})
    },
    // 显示修改密码界面
    changeUserPass: function() {
      this.dialogVisibleUserPass = true
      this.dataFormPass.password = ''
      this.dataFormPass.reallyPassWord = ''
      this.dataFormPass.newPassword = ''
    },
    // 个性化获取初识数据
    findSettingData: function() {
      this.$api.settings.findData().then((res) => {
        if (res.data) {
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].settingCode === 'logoTitle') {
              if (res.data[i].settingValue) {
                this.form.sxName = res.data[i].settingValue
              }
              this.form.sxNameId = res.data[i].settingId
            }
            if (res.data[i].settingCode === 'companyInfo') {
              if (res.data[i].settingValue) {
                this.form.info = res.data[i].settingValue
              }
              this.form.infoId = res.data[i].settingId
            }
            if (res.data[i].settingCode === 'cbLogo') {
              if (res.data[i].settingValue) {
                this.form.imageUrl = baseUrl + '/uploads/settings/' + res.data[i].settingValue
              }
              this.form.imageUrlId = res.data[i].settingId
              this.uploadAddrLogo = baseUrl + '/api/sys/settings/uploadIcon/' + this.form.imageUrlId + '/70/70'
            }
            if (res.data[i].settingCode === 'contactInfo') {
              if (res.data[i].settingValue) {
                this.form.phone = res.data[i].settingValue
              }
              this.form.phoneId = res.data[i].settingId
            }
            if (res.data[i].settingCode === 'loginBgImg') {
              if (res.data[i].settingValue) {
                this.form.imageUrlBack = baseUrl + '/uploads/settings/' + res.data[i].settingValue
              }
              this.form.imageUrlBackId = res.data[i].settingId
              this.uploadAddrBackImg = baseUrl + '/api/sys/settings/uploadIcon/' + this.form.imageUrlBackId + '/' + window.screen.width + '/' + (window.screen.availHeight - 150)
            }
          }
        }
      })
    },
    /**
     * 账户设置界面的关闭事件
     */
    dialogCloseForSave() {
      this.uploadImgIsOk = true
      this.imageUrl = ''
    }
  }
}
</script>

<style scoped>
.personal-panel {
  font-size: 14px;
  text-align: center;
  border-color: rgba(180, 190, 190, 0.2);
  border-width: 1px;
  border-style: solid;
  margin: -14px;
}
.personal-footer {
  margin-right: 1px;
  font-size: 14px;
  text-align: center;
  border-color: rgba(180, 190, 190, 0.2);
  border-top-width: 1px;
  border-top-style: solid;
}
.personal-footer:hover {
  cursor: pointer;
  background: #b1a6a61e;
}
</style>
