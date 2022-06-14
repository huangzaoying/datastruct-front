/* eslint-disable indent */
/* eslint-disable eol-last */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Vuex from 'vuex'
import './plugins/element.js'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'
//引入store
import store from './store'


import axios from 'axios'
//请求根路径
axios.defaults.baseURL = 'http://localhost:8080/'
Vue.prototype.$http = axios
axios.interceptors.request.use(config => {
  // 登录授权 请求验证是否有token  需要授权的 API ，必须在请求头中使用 `Authorization` 字段提供 `token` 令牌
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config // 必须返回否则没有值
})
Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')