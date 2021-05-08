import axios from 'axios'
import tool from '../util/tool'

//正则表达式
var CONTENT_SELECTOR = /\$\{\s*(.*?)\s*\}/g;
var PARAM_SELECTOR   = /\{\s*(.*?)\s*\}/g;

const HOST = 'https://supplier-api.tlgxkj.com' // 现网
// const HOST = 'http://115.238.51.194:2223' // 测试网

let apiUrl = {
  policies: '/v1/aliyun/oss/policies', // 获取OSS上传凭证

  supplierInfoAdd: '/v1/supplierInfo/add', // 提交一条供应商信息
  supplierInfoModify: '/v1/supplierInfo/modify', // 修改一条供应商信息
  getSupplierInfo: '/v1/supplierInfo/self', // 查询登录用户自己的供应商信息

  supplierUserLogin: '/v1/supplierUser/login', // 供应商用户登录系统
  modifyPassword:'/v1/supplierUser/password/modify', // 修改密码

  getGoodsInfoList:'/v1/goodsInfo', // 获取商品信息接口列表
  postGoodsInfo: '/v1/goodsInfo', // 提交一条商品信息接口
  getGoodsById: '/v1/goodsInfo/{id}', // 获取单条商品信息接口
  deleteGoodsById: '/v1/goodsInfo/{id}', // 删除一条商品信息接口
  onSaleFlag: '/v1/goodsInfo/onSaleFlag/{flag}?goodsId={goodsId}', // 上下架操作

  getGoodsCategory: '/v1/goodsCategory/children', // 根据parentId获取子分类信息

  getSpecificationInfoList: '/v1/specificationInfo', // 获取规格维度列表

  getGoodsSpecificationList: '/v1/goodsSpecification', // 获取商品规格值列表
  goodsSpecification: '/v1/goodsSpecification', // 提交一条商品规格值
  getGoodsSpecificationById: '/v1/goodsSpecification/{id}', // 获取单条商品规格值
  deleteGoodsSpecById: '/v1/goodsSpecification/{id}', // 删除一条商品规格值

  productInfo: '/v1/productInfo', // 提交一条产品信息
  productInfoById: '/v1/productInfo/{id}', // 删除一条产品信息

  // 商品参数介绍操作接口
  goodsParam: '/v1/goodsParam', // 提交一条商品参数介绍
  goodsParamById: '/v1/goodsParam/{id}?goodsId={goodsId}', // 删除一条商品参数介绍

  orderGoods: '/v1/orderGoods', // 获取订单的商品信息列表
  getOrderGoodsById: '/v1/orderGoods/{id}', // 获取单条订单的商品信息
  getCouriers:'/v1/orderGoods/{id}/couriers', // 查询订单商品物流信息

  getOrderInfoBySn: '/v1/orderInfo/{sn}', // 获取单条订单信息

  getOrderInvoiceBySn:'/v1/orderInvoice/{orderSn}', // 获取单条订单发票

  shippingCompany:'/v1/shippingCompany', // 获取物流公司信息列表

  supplierService: '/v1/supplierService', // 获取供应商售后服务列表
  supplierServiceById: '/v1/supplierService/{id}', // 获取单条供应商售后服务
}

let type = {
  enterpriseType: [
    {id: '1', text: '零售型企业'},
    {id: '2', text: '品牌型企业'}
  ],
  markType:[ // 赋码类型 1:一物一码、2:一批一码、3:一品一码、4:企业内部通用码、5：虚拟码
    {id: '1', text: '一物一码'},
    {id: '2', text: '一批一码'},
    {id: '3', text: '一品一码'},
    {id: '4', text: '企业内部通用码'},
    // {id: '5', text: '虚拟码'}
  ],
  tradeType: [ // 贸易类别 1:普通产品、2:进口产品、3:出口产品
    {text: '普通产品', id: 1},
    {text: '进口产品', id: 2},
    {text: '出口产品', id: 3}
  ],
  articleType:[ // 文章类型 1：内容微页 2:营销微页 3:互动微话题
    {id: '1', text: '内容微页'},
    {id: '2', text: '营销微页'},
    {id: '3', text: '互动微话题'},
  ],
  giftCardType:[ // 1:节日类,2:生日类,3:普通类
    {id: '1', text: '节日类'},
    {id: '2', text: '生日类'},
    {id: '3', text: '普通类'},
  ]
}


// 初始化方法，循环遍历接口列表，并定义成Api对象
let init = function (apiUrl) {
  for (let item in apiUrl) {
    apiUrl[item] = new Api(apiUrl[item])
  }
}
let makeUrl = function(url, params){
  return url.replace(PARAM_SELECTOR,function(content){
    var contents = content.substring(1,content.length-1).split(".");
    var result = params;
    for(var i in contents){
      result = result[contents[i]];
    }
    return result;
  });
}

// Api对象，用于发起请求
let Api = function (item) {
  return {
    get: function (params) {
      let url = makeUrl(item, params);
      return apiBase(url, 'GET', params)
    },
    put: function (params) {
      let url = makeUrl(item, params);
      return apiBase(url, 'PUT', params)
    },
    post: function (params) {
      let url = makeUrl(item, params);
      return apiBase(url, 'POST', params)
    },
    patch: function (params) {
      let url = makeUrl(item, params);
      return apiBase(url, 'PATCH', params)
    },
    delete: function (params) {
      let url = makeUrl(item, params);
      return apiBase(url, 'DELETE', params)
    }
  }
}

let apiBase = function (url, method = 'GET', params) {
  let axiosRequest = axios.create();
  axiosRequest.interceptors.response.use(function (response) {
    if(response && response.data){
      if(response.data.errorCode){
        tool.toast(response.data.errors[0].defaultMessage,2000);
      }
      if(response.data.errorCode == 601){
        sessionStorage.removeItem("userInfo");
        location.href = "/login"
      }
      return response;
    }
  }, function (error) {
    return Promise.reject(error);
  });
  if(method == 'GET'){
    return axiosRequest({
      method: method,
      url: HOST + url,
      params: params,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'token': sessionStorage.getItem('token')
      }
      // withCredentials: true,
      // crossDomain: true
    })
  }
  return axiosRequest({
    method: method,
    url: HOST + url,
    data: params,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'token': sessionStorage.getItem('token')
    }
    // withCredentials: true,
    // crossDomain: true
  })
}

// 调用初始化
init(apiUrl)

export default {
  api: apiUrl,
  type:type,
  all:function(list){
    return axios.all(list)
  },
  api_path () {
    return HOST
  }
}
