import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:19965'

Vue.config.productionTip = false

Vue.config.devtools = true


new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
