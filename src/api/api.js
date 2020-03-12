let baseUrl = 'https://www.hepper.cn/hepper'; //部署后的地址
let localUrl = 'http://localhost:8088';
//let url = 'http://localhost:8080';
let url = '/api';
let dltech = '/dltech';
dltech = url;
let proxy = baseUrl;
export default {
    login: dltech + '/loginController/mobileLogin',
    loginLocal: baseUrl + '/loginController/mobileLogin',
    getMemberInfo: baseUrl + '/m/getMemberInfo',
    getMemberInfoProxy: dltech + '/m/getMemberInfo',
    getImgList: proxy + '/display/getPictureList',
}