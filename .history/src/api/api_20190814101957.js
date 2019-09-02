let baseUrl = 'http://localhost:8080/dltrade'; //部署后的地址
let localUrl = 'http://localhost:8088';
//let url = 'http://localhost:8080';
let url = '/api';
let dltech = '/dltech';
dltech = url;
export default {
    login: dltech + '/loginController/mobileLogin',
    loginLocal: baseUrl + '/loginController/mobileLogin',
    getMemberInfo: baseUrl + '/m/getMemberInfo'

}