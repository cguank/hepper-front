import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

//这种写法，需要打开该页面才会加载资源
const project_trade = resolve => require(['@/pages/project_trade'], resolve);

export default new Router({
    routes: [{
        path: '/',
        name: 'inviteBidList',
        component: project_trade
    }, ]
})