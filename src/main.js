import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'vue-awesome/icons'
import VueEvents from 'vue-events'
import Icon from 'vue-awesome/components/Icon'
import VueTheMask from 'vue-the-mask'
import VeeValidate from 'vee-validate'
import VueResource from 'vue-resource'


Vue.use(BootstrapVue)
Vue.use(VueEvents)
Vue.use(VueTheMask)
Vue.use(VueResource);

Vue.component('icon', Icon)

new Vue({
  el: '#app',
  render: h => h(App)
})
