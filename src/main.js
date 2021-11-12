import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import excel from 'vue-excel-export'

// STYLES
// Main Theme SCSS
import './assets/scss/theme.scss'

axios.defaults.baseURL = 'http://localhost:48196'

Vue.config.productionTip = false

Vue.config.devtools = true

Vue.use(excel)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
