<template>
  <div style="height: 135px;width:130px;">
    <el-upload
      :before-upload="beforeAvatarUpload"
      :action="action"
      :headers="uploadHeaders"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      style="height: 135px;width:130px;"
      class="avatar-uploader cb-upload"
      with-credentials >
      <img v-if="this.dataForm[this.name]" :src="src" class="avatar" style="height: 135px;width:130px;">
      <img
        v-else
        src="@/assets/my/upload.png"
        style="width: 40px;height: 30px;margin-top: 30px">
      <div style="width: 128px; height: 62px; text-align: center;">{{ placeholder || '图片上传' }}</div>
    </el-upload>
  </div>
</template>
<!--
  示例
        <cb-upload :parentVue="this._self" url= "上传服务接口地址" name="traineeStoryInfo" :dataForm="dataForm" placeholder="头像上传" type="1"></cb-upload>
  示例2
        <cb-upload :parentVue="this._self" type="5" name='avdPicurlPc' width="1920" height="400" :dataForm="dataForm" placeholder="上传PC端图片" title="点击上传PC端图片,尺寸大小 1920*400 最佳"></cb-upload>

        注意
        parentVue：[Object]，传固定值this._self，不能改变，表单校验时会用到，必传固定参数
        name：[String]，属性与JavaBean字段一致，必传
        url：[String]，上传服务接口地址(带http的完整路径)，可选参数
        type：[String]，url未传时，type代表通用上传服务中的附件类型，默认值为：0，上传到通用默认目录，取值参考全局参数表：附件类型
        dataForm：[Object]，固定写法，不要改变，必传
        placeholder：[String]，提示语，可选参数，默认为：图片上传
        width: [String], 限制图片上传的尺寸，宽
        height: [String],限制图片上传的尺寸，高
        errorRange: [String], 图片尺寸允许的误差范围
  默认支持新增、修改及表单校验，不需要额外做处理
 -->
<script>
import {baseUrl} from '@/utils/global'
import Cookies from 'js-cookie'

export default {
  name: 'CbUpload', // 继承父组件中的id，name属性，拓展功能请在此配置
  components: {
  },
  props: ['parentVue', 'url', 'placeholder', 'name', 'dataForm', 'type', 'width', 'height', 'errorRange'],
  data() {
    return {
      uploadHeaders: {},
      attachId: '',
      uploadImgIsOk: '',
      src: baseUrl + this.dataForm[this.name],
      action: this.url || (baseUrl + '/api/cbupload/uploadPic?type=' + (this.type || '0'))
    }
  },
  watch: {
    dataForm: function(n, o) {
      if (n[this.name] && (n[this.name].indexOf('https') != -1 || n[this.name].indexOf('http') != -1)) {
        this.src = n[this.name]
        return false
      }
      this.src = baseUrl + n[this.name]
    }
  },
  mounted() {
    this.getUploadHeaders()
  },
  methods: {
    getUploadHeaders: function() {
      var token = Cookies.get('token')
      if (token) {
        this.uploadHeaders.authorization = 'Bearer' + token
      }
    },
    // 文件上传
    handleAvatarSuccess(res, file) {
      this.uploadImgIsOk = false // 当点击了头像上传。
      if (res.code == 0) {
        this.dataForm[this.name] = res.data.imgNamePc
        this.dataForm[this.name + 'AttachId'] = res.data.attachId
        // 使用服务器返回的完整路径更新预览图，避免临时文件被清理导致预览失效
        this.src = baseUrl + res.data.imgNamePc
        this.uploadImgIsOk = true // 标识上传成功
        // 如果传递了父vue，则重新将表单进行一次校验
        if (this.parentVue && this.dataForm) {
          // 当页面存在多个表单时，需要遍历找到各自对应的表单进行校验重置
          for (const ref in this.parentVue.$refs) {
            if (this.parentVue.$refs[ref].model == this.dataForm) {
              this.parentVue.$refs[ref].validateField(this.name)
            }
          }
        }
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
      if (isJPG != 1) {
        this.$message.error('上传头像图片只能是 JPG/PNG/GIF/BMP 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>

<style scoped>

</style>
