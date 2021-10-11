import Vue from 'vue'
import App from './App.vue'
import ElementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import store from './store'
import api from './api'
import _ from 'loadsh/lang'

// import fetchTable from './index';
// import 'fetch-table/dist/fetch-table.css'
// Vue.use(fetchTable)

Vue.config.productionTip = false
Vue.use(ElementUi)

Vue.prototype.$api = api
Vue.prototype.$_ = _
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
