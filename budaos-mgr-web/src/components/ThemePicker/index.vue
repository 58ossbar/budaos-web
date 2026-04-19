<template>
  <div style="width: 200px;" >
    <!--  <el-row id="fontSizeChange">
       <el-col :span="4">
         <span>字体大小</span>
       </el-col>
      <el-col :span="24">
         <el-row>
           <el-col :span="20">
             <el-slider  v-model="Asize" :min="10" :max="25" @change="changeFont"  show-input input-size="mini" >
             </el-slider>
           </el-col>
           <el-col :span="4" style="margin-top: 2px;">
             <el-button size="mini"  @click="fontSizeReset">{{$t('action.reset')}}</el-button>
           </el-col>
         </el-row>
       </el-col>
     </el-row>
     <el-row>
       <el-col :span="24">-->
        <el-color-picker  class="theme-picker"  popper-class="theme-picker-dropdown"  v-model="theme" :size="size">
        </el-color-picker>
        <el-slider id="fontSizeChange" v-model="Asize" :min="10" :max="18" @change="changeFont"  show-input input-size="mini" >
        </el-slider>
        <el-button id="fontSizeResetBtn" size="mini"  @click="fontSizeReset">{{$t('action.reset')}}</el-button>
      <!--</el-col>
    </el-row>-->
  </div>
</template>
<script>

const version = require('element-ui/package.json').version // element-ui version from node_modules
const ORIGINAL_THEME = '#409EFF' // default color

export default {
  name: 'ThemePicker',
  props: {
    default: { // 初始化主题，可由外部传入
      type: String,
      default: null
    },
    size: { // 初始化主题，可由外部传入
      type: String,
      default: 'small'
    },
    fontSize: { // 初始化主题，可由外部传入
      type: Number,
      default: 14
    }
  },
  data() {
    return {
      chalk: '', // content of theme-chalk css
      theme: ORIGINAL_THEME,
      Asize:14,
      showSuccess: true // 是否弹出换肤成功消息
    }
  },
  mounted() {
    if(this.default != null) {
      this.theme = this.default
      this.$emit('onThemeChange', this.theme)
      this.showSuccess = false
    }
    if(this.fontSize != null) {
      this.Asize = this.fontSize
    }
    $(".el-color-dropdown__main-wrapper").after($("#fontSizeChange"));
    $(".el-color-dropdown__value").after($("#fontSizeResetBtn"));

   /* let jj='<el-row><el-col :span="4"><span>字体大小</span></el-col>' +
      '<el-col :span="20"><el-row><el-col :span="20">' +
      '<el-slider  v-model="Asize" :min="10" :max="25" @change="changeFont"  show-input input-size="mini" > </el-slider>' +
      '</el-col><el-col :span="4" style="margin-top: 2px;">' +
      '<button size="mini" type="primary" @click="fontSizeReset">重置</button>' +
      '</el-col></el-row></el-col></el-row>';
    $(".el-color-dropdown__btns").append($(jj));*/
  },
  watch: {
    theme(val, oldVal) {
      if (typeof val !== 'string') return
      const themeCluster = this.getThemeCluster(val.replace('#', ''))
      const originalCluster = this.getThemeCluster(oldVal.replace('#', ''))
      const getHandler = (variable, id) => {
        return () => {
          const originalCluster = this.getThemeCluster(ORIGINAL_THEME.replace('#', ''))
          const newStyle = this.updateStyle(this[variable], originalCluster, themeCluster)

          let styleTag = document.getElementById(id)
          if (!styleTag) {
            styleTag = document.createElement('style')
            styleTag.setAttribute('id', id)
            document.head.appendChild(styleTag)
          }
          styleTag.innerText = newStyle

          if(id == "chalk-style"){
            const commHandler = getHandler('commChalk', 'comm-style')
            const commUrl = `static/budaos/comm.css`
            this.getCSSString(commUrl, commHandler, 'commChalk')
          }
        }
      }

      const chalkHandler = getHandler('chalk', 'chalk-style')

      if (!this.chalk) {
        const chalkUrl = `static/budaos/theme-chalk-index.css`
        this.getCSSString(chalkUrl, chalkHandler, 'chalk')
      } else {
        chalkHandler()
      }

      const styles = [].slice.call(document.querySelectorAll('style'))
        .filter(style => {
          const text = style.innerText
          return new RegExp(oldVal, 'i').test(text) && !/Chalk Variables/.test(text)
        })
      styles.forEach(style => {
        const { innerText } = style
        if (typeof innerText !== 'string') return
        style.innerText = this.updateStyle(innerText, originalCluster, themeCluster)
      })

      // 响应外部操作
      this.$emit('onThemeChange', val)
      if(this.showSuccess) {
        this.$message({
          message: '换肤成功',
          type: 'success'
        })
      } else {
        this.showSuccess = true
      }
    }
  },
  methods: {

    fontSizeReset:function(){
      this.Asize=14;
      this.changeFont(14);
    },
    changeFont:function(fontSize){
      let fontStyleTag = document.getElementById("fontStyle")
      if (!fontStyleTag) {
        fontStyleTag = document.createElement('style')
        fontStyleTag.setAttribute('id', "fontStyle")
        document.body.appendChild(fontStyleTag)
      }
      fontStyleTag.innerText = "html {font-size: "+fontSize+"px;}";
    },
    updateStyle(style, oldCluster, newCluster) {
      let newStyle = style
      oldCluster.forEach((color, index) => {
        newStyle = newStyle.replace(new RegExp(color, 'ig'), newCluster[index])
      })
      return newStyle
    },

    getCSSString(url, callback, variable) {
      const xhr = new XMLHttpRequest()
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          this[variable] = xhr.responseText.replace(/@font-face{[^}]+}/, '')
          callback()
        }
      }
      xhr.open('GET', url)
      xhr.send()
    },

    getThemeCluster(theme) {
      const tintColor = (color, tint) => {
        let red = parseInt(color.slice(0, 2), 16)
        let green = parseInt(color.slice(2, 4), 16)
        let blue = parseInt(color.slice(4, 6), 16)

        if (tint === 0) { // when primary color is in its rgb space
          return [red, green, blue].join(',')
        } else {
          red += Math.round(tint * (255 - red))
          green += Math.round(tint * (255 - green))
          blue += Math.round(tint * (255 - blue))

          red = red.toString(16)
          green = green.toString(16)
          blue = blue.toString(16)

          return `#${red}${green}${blue}`
        }
      }

      const shadeColor = (color, shade) => {
        let red = parseInt(color.slice(0, 2), 16)
        let green = parseInt(color.slice(2, 4), 16)
        let blue = parseInt(color.slice(4, 6), 16)

        red = Math.round((1 - shade) * red)
        green = Math.round((1 - shade) * green)
        blue = Math.round((1 - shade) * blue)

        red = red.toString(16)
        green = green.toString(16)
        blue = blue.toString(16)

        return `#${red}${green}${blue}`
      }

      const clusters = [theme]
      for (let i = 0; i <= 9; i++) {
        clusters.push(tintColor(theme, Number((i / 10).toFixed(2))))
      }
      clusters.push(shadeColor(theme, 0.1))
      return clusters
    }
  }
}
</script>

<style>
.theme-picker .el-color-picker__trigger {
  vertical-align: middle;
}
.theme-picker-dropdown .el-color-dropdown__link-btn {
  display: none;
}
.theme-picker .el-slider__input {
  width: 90px;
}
.theme-picker .el-color-dropdown__value,
.theme-picker .el-input--mini,
.theme-picker  .el-input__inner
{
  width: 80px;
  display: inline-block;
}
.theme-picker .el-slider__input.el-input-number--mini {
  width: 90px;
}
</style>
