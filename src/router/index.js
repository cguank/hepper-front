import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

//这种写法，需要打开该页面才会加载资源
const test = resolve => require(['@/pages/test'], resolve);

export default new Router({
    routes: [{
            path: '/',
            name: 'test',
            component: test
        },
        {
            path: '/waterfall',
            name: 'waterfall',
            component: () =>
                import ('@/pages/waterfall')
        },
        {
            path: '/asynwaterfall',
            name: 'asynwaterfall',
            component: () =>
                import ('@/pages/asynwaterfall')
        },
    ]
})