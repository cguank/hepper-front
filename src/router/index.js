import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

//这种写法，需要打开该页面才会加载资源
const test = resolve => require(['@/pages/test'], resolve);
let router = new Router({
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
            meta: {
                title: '异步调用图片瀑布流'
            },
            component: () =>
                import ('@/pages/asynwaterfall')
        },
        {
            path: '/lazywaterfall',
            name: 'lazywaterfall',
            meta: {
                title: '懒加载图片瀑布流'
            },
            component: () =>
                import ('@/pages/lazywaterfall')
        },
        {
            path: '/fang-dou-yu-jie-liu',
            name: 'fang-dou-yu-jie-liu',
            meta: {
                title: '防抖与节流'
            },
            component: () =>
                import ('@/pages/fang-dou-yu-jie-liu')
        },
        {
            path: '/zuoyongyu-diaoyongzhe',
            name: 'zuoyongyu-diaoyongzhe',
            meta: {
                title: '作用域与调用者'
            },
            component: () =>
                import ('@/pages/zuoyongyu-diaoyongzhe')
        },
        {
            path: '/tree',
            name: 'tree',
            meta: {
                title: '树展开'
            },
            component: () =>
                import ('@/pages/tree')
        },
        {
            path: '/axios',
            name: 'axios',
            meta: {
                title: 'axios'
            },
            component: () =>
                import ('@/pages/axios')
        },
        {
            path: '/fudong-juzhong',
            name: 'fudong-juzhong',
            meta: {
                title: 'fudong-juzhong'
            },
            component: () =>
                import ('@/pages/fudong-juzhong')
        },
        {
            path: '/test1',
            name: 'test1',
            meta: {
                title: 'fudong-juzhong'
            },
            component: () =>
                import ('@/pages/test1')
        },
        {
            path: '/shengbeibuju',
            name: 'shengbeibuju',
            meta: {
                title: 'shengbeibuju'
            },
            component: () =>
                import ('@/pages/shengbeibuju')
        },
        {
            path: '/shuangfeiyibuju',
            name: 'shuangfeiyibuju',
            meta: {
                title: 'shuangfeiyibuju'
            },
            component: () =>
                import ('@/pages/shuangfeiyibuju')
        },
        {
            path: '/xianglingyuansu',
            name: '相邻元素自适应',
            meta: {
                title: '相邻元素自适应'
            },
            component: () =>
                import ('@/pages/相邻元素自适应')
        },
        {
            path: '/shuiipingjuzhong',
            name: '水平居中',
            meta: {
                title: '水平居中'
            },
            component: () =>
                import ('@/pages/水平居中')
        },
        {
            path: '/keshihuajiazai',
            name: '可视化加载',
            meta: {
                title: '可视化加载'
            },
            component: () =>
                import ('@/pages/可视化加载')
        },
        {
            path: '/xuebitu',
            name: '雪碧图',
            meta: {
                title: '雪碧图'
            },
            component: () =>
                import ('@/pages/雪碧图')
        },
    ]
})
router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title
    }
    next();
})
export default router