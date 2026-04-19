import Vue from 'vue'
import App from './App'
import router from './router'
import api from './http'
import i18n from './i18n'
import store from './store'
import global from '@/utils/global'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.min.css'
import '@/assets/iconfont/iconfont.css'

//import contentmenu from 'v-contextmenu'
//import 'v-contextmenu/dist/index.css'
import '../static/budaos/directives.js'
import '../static/budaos/comm.css';

/* 加载创蓝全局组件start */
import CbDict from "@/components/cbdict"
import CbParam from "@/components/cbparam"
import CbUpload from "@/components/cbupload"
import CbEditor from "@/components/cbeditor"
import CbTree from "@/components/cbtree"
import CbTreePanel from "@/components/cbtreepanel"
import CbTabels from "@/components/cbtables"
import CbAutoComplete from "@/components/cbautocomplete"

const components = [
  CbDict,
  CbParam,
  CbUpload,
  CbEditor,
  CbTreePanel,
  CbTree,
  CbTabels,
  CbAutoComplete,
]
components.forEach(component => {
  Vue.component(component.name, component);
});
/* 加载创蓝全局组件end */

Vue.use(ElementUI)
Vue.use(api)
//Vue.use(contentmenu)
Vue.prototype.global = global


new Vue({
  el: '#app',
  i18n,
  router,
  store,

  render: h => h(App)
});
