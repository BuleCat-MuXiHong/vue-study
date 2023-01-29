import Vue from 'vue'
import App from './App.vue'
import router from './router'
//导入全局样式表
import './assets/css/global.css'

import axios from "axios"
Vue.prototype.$http=axios  //挂载
axios.defaults.baseURL='https://www.liulongbin.top:8888/api/private/v1/'  //配置请求的根路径

//手动配置ElementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
