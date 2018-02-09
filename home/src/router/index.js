import Vue from 'vue'
import Router from 'vue-router'
//import HelloWorld from '@/components/HelloWorld'
import Imgcheck from '../components/imgcheck'
import History from '../components/History'
import Login from '../components/Login'
import Registry from '../components/Registry'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'imgcheck',
      component: Imgcheck
    },
    {
      path:'/histories',
      name:'histories',
      component:History
    },
    {
      path:'/login',
      name:'login',
      component:Login
    },
    {
      path:'/registry',
      name:'registry',
      component:Registry
    }
  ]
})
