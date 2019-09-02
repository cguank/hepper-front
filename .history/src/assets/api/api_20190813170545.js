let baseUrl = 'http://localhost:8080';
let localUrl = 'http://localhost:8088';
//let url = 'http://localhost:8080';
let url = '/api';
let dltech = '/dltech';
dltech = url;
export default {
    selectPictureList: baseUrl + '/dltrade/m/selectPictureList',
    mock: 'http://localhost:8088/testmymock',
    sabcd: localUrl + '/sabcd',
    testBackEnd: url + '/tc/testmysql',
    searchLikeCase: url + '/dltrade/pc/searchLikeCase',
    selectCaseCollect: dltech + '/m/getMemberInfo',
    selectPictureList: dltech + '/m/selectPictureList',
    login: dltech + '/loginController/mobileLogin'
}