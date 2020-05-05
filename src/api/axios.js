import axios from 'axios';
import Vue from 'vue'
import api from "./api"
import router from '../router/index'
//import { Loading, Message } from 'element-ui'
//axios.defaults.baseURL = "http://nannyapi.xiaoyujia.com";
// axios.defaults.headers.common['Authorization'] = '111';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
//axios.defaults.baseURL = 'http://localhost:8088'
axios.defaults.timeout = 20000;
axios.defaults.crossDomain = true;
axios.defaults.withCredentials = true;


// 添加请求拦截器(axios请求前)
axios.interceptors.request.use(config => {
    let token = localStorage.getItem('token');
    if (token) {
        config.headers.token = token;
    }
    //config.headers.value = 'woshinibaba'
    //Loading.service({ fullscreen: true })
    //console.log(config)
    return config;
    // if (utils.getLocalStorage("userInfo") && JSON.parse(utils.getLocalStorage("userInfo")).token) {
    //     let token = JSON.parse(utils.getLocalStorage("userInfo")).token;
    //     config.headers['token'] = token;
    // }

    // let token = JSON.parse(utils.getLocalStorage("userInfo")).token;
    // config.headers['token'] = "979d340f4ae04cd59bd0679443242d0f" //测试
    // return config;
}, error => {
    // 对请求错误做些什么
    return Promise.reject(error);
});


// http response 拦截器
axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // 返回 401 清除token信息并跳转到登录页面
                    localStorage.removeItem('token');
                    router.replace({
                        path: '/',
                        query: { redirect: router.currentRoute.fullPath }
                    })
            }
        }
        return Promise.reject(error.response.data) // 返回接口返回的错误信息
    });

// 添加响应拦截器(axios请求后)
// axios.interceptors.response.use(response => {
//   // 对响应数据做点什么
//   // if(response.data.code == 500){
//
//   // }
//   //   console.log(response)
//   return response.data;
// }, error => {
//
//   console.log(error)
//   // 对响应错误做点什么
//   return Promise.reject(error);
// });
//
// axios.interceptors.request.use(function (config) {
//   var freeUrl = api.mock;
//   if(config.url != freeUrl){
//     alert('no')
//     return;
//   }
//   console.log(config);
//   return config;
// })


const postData = (url, data, config = {}) => {
    // return axios.post(api[url], qs.stringify(data));
    return axios.post(api[url], data, config);
}

const getData = (url, params) => {
    return axios.get(api[url], {
        params,
    });
}

Vue.prototype.$postData = postData;
Vue.prototype.$getData = getData;

export default {
    postData,
    getData
};