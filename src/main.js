// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import moment from 'moment'

// 引用API文件
import api from './api/index'
import tool from './util/tool'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import verify from 'vue-verify-plugin'

Vue.use(verify, {
  blur: true
});

Vue.use(Vuex);
Vue.use(ElementUI);

// 将API方法绑定到全局
Vue.prototype.$api = api;
Vue.prototype.$tool = tool;

Vue.config.productionTip = false;

// let url = location.href;
// if (!url.startsWith('https://') && !url.startsWith('http://localhost')) {
//   url = url.replace('http://', 'https://');
//   location.href = url
// }

const store = new Vuex.Store({
  state: {
    userInfo: null
  },
  getters: {
    userInfo: state => {
      let userInfo = state.userInfo;
      if (!userInfo) {
        userInfo = JSON.parse(sessionStorage.getItem('userInfo') || '{}')
      }
      return userInfo
    }
  },
  mutations: {
    setUserInfo (state, userInfo) {
      state.userInfo = userInfo
    }
  }
})

Vue.filter('moment', function (value, formatString) {
  formatString = formatString || 'YYYY-MM-DD'
  return moment(value).format(formatString)
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})
