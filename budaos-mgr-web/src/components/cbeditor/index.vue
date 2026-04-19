<!--
  示例
      <cb-editor :parentVue="this._self" name="traineeStoryInfo" :dataForm="dataForm" height='200'></cb-editor>
      注意
      parentVue：[Object]，传固定值this._self，不能改变，表单校验时会用到，必传固定参数
      dataForm: [Object]新增表单时必传，固定写法
      id: [String]全局唯一，必填参数
      name：[String]与JavaBean字段一致，dataForm固定写法，不要改变。
      height：[Int]编辑器内容区的高度，可选参数，默认值为：300,值为0时表示随内容自适应高度
      readonly: [Boolean]是否只读，默认为false
      toolbar：[Boolean]是否显示工具栏，默认为true
  默认支持新增、修改及表单校验，不需要额外做处理，如需特殊处理参考以下方法(name为标签上的name属性值保持一致)
      获取内容：tinyMCE.editors['id'].getContent();
      填充内容：tinyMCE.editors['id'].setContent();
 -->
<script>
import tinymce from 'tinymce/tinymce'
import 'tinymce/themes/silver/theme' // tinymce 5.x 主题改为 silver
import 'tinymce/icons/default/icons' // tinymce 5.x 需要显式引入图标
import editor from '@tinymce/tinymce-vue'
import 'tinymce/plugins/image'
import 'tinymce/plugins/link'
import 'tinymce/plugins/table'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/hr'
// contextmenu 已在 tinymce 5.x 中内置，无需单独引入
import 'tinymce/plugins/wordcount'
// colorpicker 和 textcolor 已在 tinymce 5.x 中内置，无需单独引入
import 'tinymce/plugins/media'
import 'tinymce/plugins/paste'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/toc'
import 'tinymce/plugins/preview'
import 'tinymce/plugins/codesample'
import 'tinymce/plugins/searchreplace'
import 'tinymce/plugins/autoresize'
import {baseUrl} from "../../utils/global";

export default {
    name: 'cb-editor',
    props: {
      parentVue: {},
      name:{},
      id:{
        type: String,
        default: 'cbEditor',
      },
      dataForm: {},
      height:{},
      readonly:{
        type: String,
        default: 'false',
      },
      toolbar:{
        type: String,
        default: 'true',
      }
    },//继承父组件中的name, dataForm属性，拓展功能请在此配置
    components:{
      editor
    },
    data() {
      return {
        editorData: this.dataForm[this.name] || '',
        errerMsg: ''
      }
    },
    methods: {
      setContent(value) {
        // window.tinymce.get(this.tinymceId).setContent(value)
        tinyMCE.editors[this.name].setContent(value)
      },
      getContent() {
        // window.tinymce.get(this.tinymceId).getContent()
        return tinyMCE.editors[this.name].getContent()
      },
      editorUploadFile: function(cb, url, file) {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        xhr.withCredentials = true;
        xhr.upload.onprogress = function (e) {
          // 进度(e.loaded / e.total * 100)
          let percent=e.loaded / e.total * 100;

        };
        xhr.onerror = function () {
          //上传失败
          console.log(xhr.status);
          return;
        };
        xhr.onload = function () {
          let json;
          if (xhr.status < 200 || xhr.status >= 300) {
            console.log('HTTP 错误: ' + xhr.status);
            return;
          }
          json = JSON.parse(xhr.responseText);
          if(json.code == 0){
            //接口返回的文件保存地址
            let mediaLocation=json.location;
            //cb()回调函数，将mediaLocation显示在弹框输入框中
            cb(baseUrl + mediaLocation, { title: file.name });
          }else{
            alert(json.msg)
            console.log(json.msg);
            return;
          }

        };
        let formData = new FormData();
        //假设接口接收参数为file,值为选中的文件
        formData.append('file', file);
        //正式使用将下面被注释的内容恢复
        xhr.send(formData);
      }
    },
    watch: {
      dataForm: function(n, o) {
      if(n[this.name])
        tinyMCE.editors[this.id].setContent(n[this.name]);
      }
    },
    template: '<div><textarea :id="id" :name="name" v-model="editorData"></textarea></div>',
    mounted() {
      //如果该ID的编辑器存在，则先销毁
      if(tinyMCE.editors[this.id]){
        tinyMCE.execCommand("mceRemoveEditor", true, this.id);
      }
      let comp = this;
      //初始化富文本编辑器
      tinymce.init({
        target: document.getElementById(this.id),
        language: 'zh_CN',//中文语言
        language_url: 'static/budaos/tinymce/zh_CN.js',//语言路径
        skin_url: 'static/budaos/tinymce/skins/ui/oxide',//皮肤路径（tinymce 5.x 默认皮肤为 oxide）
        content_css: [
          'static/budaos/tinymce/prism.css',
        ],
        plugins: //加载插件（已移除 tinymce 5.x 中内置的 colorpicker/textcolor/contextmenu）
        'link lists image table wordcount preview toc searchreplace media paste fullscreen codesample autoresize hr',
        menubar:false,//菜单栏
        statusbar: false,//状态栏
        readonly: this.readonly == 'true',
        autoresize_min_height: this.height || '300px',//默认高度设置为300
        autoresize_max_height: this.height || '300px', //默认高度设置为300
        autoresize_bottom_margin: 1,
        branding: false, // 去水印
        toolbar: //工具栏中的项目（tinymce 5.x toolbar 语法保持兼容）
        this.toolbar == 'true' ? 'undo redo | styleselect formatselect fontsizeselect | bold italic | forecolor backcolor | hr alignleft aligncenter alignright alignjustify '+
        '| numlist | table | wordcount | searchreplace removeformat | image media link codesample | preview fullscreen'
        : false,
        fontsize_formats: '11px 12px 14px 16px 18px 24px 36px 48px',//字体大小
        style_formats: [
          {
            title: '首行缩进',
            block: 'p',
            styles: { 'text-indent': '2em' }
          },
          {
            title: '行高',
            items: [
              { title: '1', styles: { 'line-height': '1' }, inline: 'span' },
              { title: '1.5', styles: { 'line-height': '1.5' }, inline: 'span' },
              { title: '2', styles: { 'line-height': '2' }, inline: 'span' },
              { title: '2.5', styles: { 'line-height': '2.5' }, inline: 'span' },
              { title: '3', styles: { 'line-height': '3' }, inline: 'span' }
            ]
          }
        ],
        paste_data_images: true,//支持直接粘贴图片
        images_upload_url: baseUrl + '/cbeditor/uploadImg',//图片粘贴拖拽的上传服务地址
        images_upload_handler: function(blobInfo, success, failure) {
          comp.editorUploadFile(success, baseUrl + '/cbeditor/uploadImg', blobInfo.blob())
        },
        images_upload_credentials: true,//跨域
        file_picker_types: 'file image media',//普通附件，图片，视频
        convert_urls: false, //这个参数加上去就可以了，路径就带域名了
        file_picker_callback: function(cb, value, meta) {
          //创建一个隐藏的type=file的文件选择input
          let input = document.createElement('input');
          let url = "";
          input.setAttribute('type', 'file');
          if (meta.filetype == 'image'){
            url = baseUrl + '/cbeditor/uploadImg'
            input.setAttribute('accept', 'image/jpeg,image/gif,image/jpg,image/png')
          }else if (meta.filetype == 'media'){
            url = baseUrl + '/cbeditor/uploadMedia'
            input.setAttribute('accept', 'video/*')
          }else if (meta.filetype == 'file'){
            url = baseUrl + '/cbeditor/uploadFile'
            //input.setAttribute('accept', 'aplication/zip, aplication/rar, application/vnd.ms-excel, text/plain, application/vnd.ms-powerpoint, application/msword')
          }
          input.onchange = function(){
            let file = this.files[0];//只选取第一个文件。如果要选取全部，后面注意做修改
            comp.editorUploadFile(cb, url, file)
          }
          //触发点击
          input.click();
        },
        setup: function(editor) {
          editor.on('input change undo redo execCommand KeyUp', function(e) {
            comp.dataForm[comp.name] = editor.getContent();
          })
          editor.on('blur', function(e){
            if(comp.parentVue){
              //当页面存在多个表单时，需要遍历找到各自对应的表单进行校验重置
              for(let ref in comp.parentVue.$refs){
                if(comp.parentVue.$refs[ref].model == comp.dataForm){
                  comp.parentVue.$refs[ref].validateField(comp.name)
                }
              }
            }
          })
        }
      })
    }
  }

</script>

<style scoped>

</style>
