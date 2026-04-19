<template>
  <div
    :style="{'background':themeColor}"
    :class="$store.state.app.collapse?'position-collapse-left':'position-left'"
    class="headbar">
    <!-- 导航收缩 -->
    <span class="hamburg">
      <el-menu :background-color="themeColor" :active-text-color="themeColor" class="el-menu-demo" text-color="#fff" mode="horizontal">
        <el-menu-item index="1" @click="onCollapse"><hamburger :is-active="collapse"/></el-menu-item>
      </el-menu>
    </span>
    <!-- 导航菜单 -->
    <span class="navbar">
      <el-menu
        :default-active="activeIndex"
        :background-color="themeColor"
        class="el-menu-demo"
        text-color="#fff"
        active-text-color="#ffd04b"
        mode="horizontal"
        @select="selectNavBar">
        <!-- type.url-->
        <el-menu-item v-for="(type, item) in AllSetData" :label="item" :key="item" @click="$router.push('/')">
          <div style="height: 40%;margin-top: -10px">
            <i :class="type.icon"/>
          </div>
          <div style="height: 30%;font-size: 0.857rem">{{ type.name }}</div>
        </el-menu-item>
        <el-menu-item>
          <nx-subsystemset @changeAllSet="changeAllSet"/>
        </el-menu-item>
      </el-menu>
    </span>
    <!-- 工具栏 -->
    <span class="toolbar">
      <el-menu :background-color="themeColor" :text-color="themeColor" :active-text-color="themeColor" class="el-menu-demo" mode="horizontal">
        <el-menu-item v-popover:popover-color index="1">
          <!-- 主题切换 -->
          <theme-picker :font-size="14" :default="themeColor" title="切换主题" class="theme-picker" style="width:30px;" @onThemeChange="onThemeChange"/>
        </el-menu-item>
        <el-menu-item v-popover:popover-message index="4" title="全屏">
          <nx-full-screen />
        </el-menu-item>
        <el-menu-item v-popover:popover-personal index="6">
          <!-- 用户信息 -->
          <span class="user-info"><img :src="user.avatar" style="border-radius: 50%"><font size="2">欢迎，{{ user.userRealname }}</font></span>
          <el-popover ref="popover-personal" placement="bottom-end" trigger="click" >
            <personal-panel :user="user" @changeUserImg="changeUserImg"/>
          </el-popover>
        </el-menu-item>
      </el-menu>
    </span>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import Hamburger from '@/components/Hamburger'
import ThemePicker from '@/components/ThemePicker'
import LangSelector from '@/components/LangSelector'
import nxFullScreen from '@/components/nx-full-screen/index'
import nxSubsystemset from '@/components/nx-subsystemset/index'
import NoticePanel from '@/views/Core/NoticePanel'
import MessagePanel from '@/views/Core/MessagePanel'
import PersonalPanel from '@/views/Core/PersonalPanel'
import {baseUrl} from '../../utils/global'

export default {
  components: {
    Hamburger,
    ThemePicker,
    LangSelector,
    nxFullScreen,
    nxSubsystemset,
    NoticePanel,
    MessagePanel,
    PersonalPanel
  },
  data() {
    return {
      user: {
        name: '',
        avatar: '',
        role: '',
        registeInfo: '',
        userRealname: ''
      },
      activeIndex: '1',
      AllSetData: [
        { icon: 'fa fa-bar-chart fa-lg', name: '智能分析与评价', url: 'https://element.eleme.cn/#/zh-CN/component/checkbox' },
        { icon: 'fa  fa-phone fa-lg', name: '智能客服系统', url: 'https://www.baidu.com/' }
      ],
      langVisible: false
    }
  },
  mounted() {
    this.sysName = 'budaos Platform'
    var user = sessionStorage.getItem('user')
    var userimg = sessionStorage.getItem('userimg')
    if (user) {
      this.user.name = user
      this.user.userRealname = sessionStorage.getItem('userRealname')
      if (userimg == 'null' || userimg == null || userimg == '') {
        this.user.avatar = require('@/assets/user.png')
      } else {
        this.user.avatar = baseUrl + '/uploads/sys-user-img/' + userimg
      }
    }
    $('.headbar .el-menu-item.is-active > div > i').css('color', '#ffd04b')
  },
  methods: {
    colorPickerClick: function() {

    },
    openWindow(url) {
      window.open(url)
    },
    selectNavBar(key, keyPath) {
      $('.headbar .el-menu-item > div > i').css('color', '#fff')
      $('.headbar .el-menu-item:eq(' + key + ') > div > i').css('color', '#ffd04b')
    },
    // 选择所属子系统
    changeAllSet: function(data) {
      this.AllSetData = data
    },
    // 替换头像
    changeUserImg: function(data) {
      this.user.avatar = data
      sessionStorage.setItem('userimg', data)
    },
    // 折叠导航栏
    onCollapse: function() {
      this.$store.commit('onCollapse')
    },
    // 切换主题
    onThemeChange: function(themeColor) {
      this.$store.commit('setThemeColor', themeColor)
    },
    // 语言切换
    changeLanguage(lang) {
      lang === '' ? 'zh_cn' : lang
      this.$i18n.locale = lang
      this.langVisible = false
    }
  },
  computed: {
    ...mapState({
      themeColor: state => state.app.themeColor,
      collapse: state => state.app.collapse
    })
  }
}
</script>

<style scoped lang="scss">
.headbar {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1030;
  height: 60px;
  line-height: 60px;
  border-color: rgba(180, 190, 190, 0.8);
  border-left-width: 1px;
  border-left-style: solid;
}
.hamburg, .navbar {
  float: left;
}
.toolbar {
  float: right;

}
.lang-item {
  font-size: 1.143rem;
  padding-left: 8px;
  padding-top: 8px;
  padding-bottom: 8px;
  cursor: pointer;
}
.lang-item:hover {
  font-size: 18px;
  background: #b0d6ce4d;
}
.color-select{
  font-size: 1.143rem;
  color: #fff;
  cursor: pointer;
  i {
    color: #fff;
   font-size: 20px;
  }
}
.user-info {
  font-size: 1.429rem;
  color: #fff;
  cursor: pointer;
  img {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    margin: 10px 20px 10px 10px;
    float: left;
  }
}
.badge {
  line-height: 18px;
}
.position-left {
  left: 200px;
}
.position-collapse-left {
  left: 65px;
}
</style>
