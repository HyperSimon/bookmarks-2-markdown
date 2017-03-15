import Vue from 'vue'
import Router from 'vue-router'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'

import GeneratorPage from '../page/GeneratorPage.vue'

Vue.use(Router)
Vue.use(ElementUI)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'GeneratorPage',
      component: GeneratorPage
    }
  ]
})
