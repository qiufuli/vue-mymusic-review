// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'
import  vueLazyLoad from 'vue-lazyload'
import store from './store'
import '@/common/stylus/index.styl'
//解决移动端300ms延时的问题 固定写法
fastclick.attach(document.body)
Vue.config.productionTip = false
//第三方插件都需要用Vue.use（）来调用 require也是webpack支持的 webpack会帮我们解析里面的地址
Vue.use(vueLazyLoad,{
	loading:require('common/image/default.png')
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
