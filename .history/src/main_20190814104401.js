// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// 入口文件，定义在了webpack.base.conf
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from '@/api/axios' //执行下该文件，main.js中会首先执行
//全局引用elementui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false
Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
})