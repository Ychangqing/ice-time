import Vue from 'vue'

import App from './App'
import router from './router'
import store from './store'

import './icons'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))


import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
Vue.use(Antd);


import zenUI from '../packages/zen-ui'
Vue.use(zenUI)

Vue.config.productionTip = false
/* eslint-disable no-new */
const vue = new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')

export default vue
