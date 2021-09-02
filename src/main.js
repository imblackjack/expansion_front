import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import JsonViewer from 'vue-json-viewer'

Vue.config.productionTip = false

Vue.use(JsonViewer)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

// post传参方式
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';