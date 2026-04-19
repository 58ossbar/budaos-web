<template>
  <div >
    <div style="display: flex;padding-left: 15%;height: 75px;">
      <div >
        <img src="../assets/my/logo.png" class="loginLogoStyle" alt="logo" style="display: none">
      </div>
      <div class="appNames" style="height:75px;line-height: 75px;color: black;font-size: 20px;margin-left: 1%; display: none">
        {{ appNames }}
      </div>
    </div>
    <div class="center">
      <div class="xixi" style="display: table; margin-top: calc(50vh - 225px);">
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="fieldRules"
          label-position="left"
          label-width="0px"
          class="demo-ruleForm login-container"
          @load="refreshCaptcha">
          <h2 class="title" style="padding-left: 22px" >系统登录</h2>
          <el-tabs v-model="activeName">
            <el-tab-pane label="用户密码" name="user" >
              <div class="userPass">
                <el-form-item prop="account">
                  <el-input
                    ref="account"
                    v-model="loginForm.account"
                    type="text"
                    style="margin-top: 10px"
                    auto-complete="off"
                    placeholder="请输入账号">
                    <i slot="prefix" class="el-icon-s-custom" style="margin-left: 5px;"/>
                  </el-input>
                </el-form-item>
                <el-form-item prop="password" @keyup.enter.native="login">
                  <el-input v-model="loginForm.password" type="password" auto-complete="off" placeholder="请输入密码">
                    <i slot="prefix" class="el-icon-lock" style="margin-left: 5px"/>
                  </el-input>
                </el-form-item>
                <el-form-item >
                  <el-col :span="12">
                    <el-form-item prop="captcha">
                      <el-input
                        v-model="loginForm.captcha"
                        type="test"
                        auto-complete="off"
                        placeholder="单击图片刷新"
                        style="width: 100%;"
                        @keyup.enter.native="login">
                        <i slot="prefix" class="el-icon-picture-outline" style="margin-left: 5px"/>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="1" class="line">&nbsp;</el-col>
                  <el-col :span="11">
                    <el-form-item>
                      <img
                        :src="loginForm.src"
                        style="width: 100%;"
                        class="pointer"
                        @click="refreshCaptcha"
                        @error="handleCaptchaError"
                        @load="handleCaptchaLoad"
                        title="单击刷新验证码">
                      <div v-if="captchaLoadError" style="color: #f56c6c; font-size: 12px; text-align: center; margin-top: 5px;">
                        验证码加载失败<br>
                        <el-button type="text" size="mini" @click="refreshCaptcha">点击重试</el-button>
                      </div>
                    </el-form-item>
                  </el-col>
                </el-form-item>
                <el-form-item style="width:100%; height: 35px;margin-top: -30px; text-align: center">
                  <el-checkbox class="remember" >记住账号</el-checkbox>
                </el-form-item>
                <el-form-item style="width:100%;">
                  <el-button type="primary" style="width:48%;" @click.native.prevent="reset">重 置</el-button>
                  <el-button
                    :loading="loading"
                    type="primary"
                    style="width:48%;"
                    @click.native.prevent="login">登 录</el-button>
                </el-form-item>
              </div>
            </el-tab-pane>
            <el-tab-pane label="短信验证码" name="code">
              <div class="phonePass">
                <el-form-item prop="phone">
                  <el-input v-model="phoneForm.phone" type="text" style="margin-top: 20px" auto-complete="off" placeholder="请输入手机号">
                    <i slot="prefix" class="fa fa-phone" style="margin-left: 5px;"/>
                  </el-input>
                </el-form-item>
                <el-form-item>
                  <el-col :span="12">
                    <el-form-item prop="captcha">
                      <el-input
                        v-model="loginForm.captcha"
                        type="test"
                        auto-complete="off"
                        placeholder="单击发送短信"
                        style="width: 100%;margin-top: 20px">
                        <i slot="prefix" class="fa fa-commenting-o" style="margin-left: 5px;"/>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="1" class="line">&nbsp;</el-col>
                  <el-col :span="11">
                    <el-form-item>
                      <el-button style="width: 100%;margin-top: 20px;background: #b9b9b9;height: 40px">点击发送短信</el-button>
                    </el-form-item>
                  </el-col>
                </el-form-item>
                <el-form-item style="width:100%;">
                  <el-button
                    :loading="loading"
                    type="primary"
                    style="width:90%;margin-top: 20px"
                    @click.native.prevent="login">登 录</el-button>
                </el-form-item>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-form>
      </div>
    </div>
    <div class="footer" style="display: none">
      <p style="margin-top:0">{{ info }}</p>
      <p>联系电话：<a>{{ phoneCom }}</a></p>
    </div>
  </div>
</template>

<script>

import {mapState} from 'vuex'
import {baseUrl, tokenKeyName} from '@/utils/global'
import Cookies from 'js-cookie'
import ThemePicker from '@/components/ThemePicker'
import LangSelector from '@/components/LangSelector'

export default {
  name: 'Login',
  components: {
    ThemePicker,
    LangSelector
  },
  data() {
    return {
      phoneCom: '0731-89913439',
      info: 'Copyright © 开源吧 2021-2031 湘ICP备12010267号',
      appNames: '开源吧业务基础平台',
      imageUrlBack: '',
      logo: '',
      loading: false,
      activeName: 'user',
      captchaLoadError: false,
      loginForm: {
        account: process.env.NODE_ENV === 'production' ? '' : 'admin',
        password: process.env.NODE_ENV === 'production' ? '' : 'admin',
        captcha: '',
        captchaUser: '',
        captchaKey: '',
        src: ''
      },
      phoneForm: {
        account: '15673144166'
      },
      fieldRules: {
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        captcha: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      },
      checked: true
    }
  },
  computed: {
    ...mapState({
      themeColor: state => state.app.themeColor
    })
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.account.focus()
    })
    this.refreshCaptcha()
    // 注释：登录页不需要调用 querySettings，避免被后端 Security 拦截导致 CORS 错误
    // 使用默认配置即可，登录后再加载设置
    // this.findSettingData()
    console.log('[Login] 登录页使用默认配置，避免未登录时调用需要权限的接口')
  },
  methods: {
    findSettingData: function() {
      this.$api.settings.findData().then((res) => {
        if (res.data) {
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].settingValue) {
              if (res.data[i].settingCode === 'logoTitle') {
                this.appNames = res.data[i].settingValue
              }
              if (res.data[i].settingCode === 'companyInfo') {
                this.info = res.data[i].settingValue
              }
              if (res.data[i].settingCode === 'cbLogo') {
                // eslint-disable-next-line no-undef
                $('.loginLogoStyle').attr('src', baseUrl + '/uploads/settings/' + res.data[i].settingValue)
              }
              if (res.data[i].settingCode === 'contactInfo') {
                this.phoneCom = res.data[i].settingValue
              }
              if (res.data[i].settingCode === 'loginBgImg') {
                // 背景图片访问路径
                this.imageUrlBack = baseUrl + '/uploads/settings/' + res.data[i].settingValue
              }
            }
          }
        }
        if (this.imageUrlBack) {
          // 设置动态背景（来自数据库配置）
          // eslint-disable-next-line no-undef
          $('.center').css({ 'background': "url('" + this.imageUrlBack + "') no-repeat center center", 'background-size': 'cover' })
        } else {
          // 使用默认背景（CSS 中定义的 bjt.jpg）
          // eslint-disable-next-line no-undef
          $('.center').css({ 'background-size': 'cover' })
        }
        // eslint-disable-next-line no-undef
        $('.loginLogoStyle, .footer, .appNames').css({ 'display': 'block' })
      })
    },
    login() {
      if (this.activeName === 'code') {
        this.$message.warning('暂不支持手机+短信登录')
        return false
      }
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          const userInfo = {
            username: this.loginForm.account,
            password: this.loginForm.password,
            captcha: this.loginForm.captcha,
            captchaKey: this.loginForm.captchaKey
          }
          this.loading = true
          this.$api.login.login(userInfo).then((res) => {
            this.loading = false
            console.log('登录响应数据:', res)
            if (res.code !== 0) {
              this.$message({ message: res.msg, type: 'error' })
              this.refreshCaptcha()
            } else {
              // 放置token到Cookie
              const token = res.token || (res.data && res.data.token)
              console.log('获取到的token:', token)
              if (!token) {
                this.$message({ message: '登录失败：未获取到token', type: 'error' })
                this.refreshCaptcha()
                return
              }
              Cookies.set(tokenKeyName, token)
              // 保存用户到本地会话
              sessionStorage.setItem('user', userInfo.username)
              const userData = res.data || {}
              sessionStorage.setItem('userRealname', userData.userRealname || '')
              sessionStorage.setItem('userimg', userData.userimg || '')
              sessionStorage.setItem('userId', userData.userId || '')
              console.log('保存的用户数据:', { username: userInfo.username, ...userData })
              // 要求重新加载导航菜单
              this.$store.commit('menuRouteLoaded', false)
              // 登录成功，跳转到主页
              console.log('登录成功，跳转到首页')
              this.$router.push('/')
            }
          }).catch((res) => {
            this.loading = false
            console.error('登录请求异常:', res)
            this.$message({ message: res.message || '登录失败', type: 'error' })
          })
        }
      })
    },
    refreshCaptcha: function() {
      // 生成随机 key，与验证码图片绑定，存入 Redis（解决网关转发时跨域 Session 不一致问题）
      var key = 'captcha_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      this.loginForm.captchaKey = key

      // 统一使用代理路径，确保 Session 一致
      // 开发环境：通过 webpack-dev-server 代理到 http://localhost:9080
      // 生产环境：使用 baseUrl
      var base = baseUrl || ''
      var captchaUrl = base + '/user/captcha.jpg?key=' + key + '&t=' + Date.now()
      this.loginForm.src = captchaUrl

      console.log('[Login] 验证码URL:', captchaUrl)
      console.log('[Login] baseUrl:', baseUrl)
      console.log('[Login] process.env.NODE_ENV:', process.env.NODE_ENV)

      // 重置错误状态
      this.captchaLoadError = false
    },
    handleCaptchaError: function(event) {
      console.error('[Login] 验证码图片加载失败:', this.loginForm.src)
      console.error('[Login] 错误事件:', event)
      console.error('[Login] 请检查:')
      console.error('[Login] 1. 后端服务是否运行在 http://localhost:9080')
      console.error('[Login] 2. 访问 http://localhost:9080/user/captcha.jpg?key=test&t=123 是否能显示图片')
      console.error('[Login] 3. 前端代理配置是否正确（config/index.js proxyTable）')

      this.captchaLoadError = true
      this.$message.error('验证码加载失败，请检查后端服务是否启动')
    },
    handleCaptchaLoad: function() {
      console.log('[Login] 验证码图片加载成功')
      this.captchaLoadError = false
    },
    reset() {
      this.$refs.loginForm.resetFields()
    },
    // 切换主题
    onThemeChange: function(themeColor) {
      this.$store.commit('setThemeColor', themeColor)
    }
  }
}
</script>

<style lang="scss" scoped>
  .center{
    background: url("../assets/my/bjt.jpg") no-repeat;
    width: 100%;
    height: calc(100vh - 150px);
    background-size: 100% 100%;
  }
  .xixi{
    padding-left: 60%;
    position: fixed;
    top: 0;
    bottom: 0;
    margin: auto;
  }
  .footer {
    font-size: 14px;
    text-align: center;
    height: 75px;
  }
  .footer a:hover {
    color: royalblue;
    cursor: pointer;
  }
  .footer p span{
    margin: 0 10px;
  }
  .login-container {
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    /* margin: 100px auto;*/
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 15px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      /*margin: 0 40px 25px 40px;*/
    }
  }
</style>
