import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/Merchant/login.vue'
import My from '../components/Merchant/My/My.vue'
import signUp from '../components/Merchant/signUp.vue'
import Commodity from  '../components/Merchant/My/Commodity.vue'
import orders from '../components/Merchant/My/orders.vue'
import information from '../components/Merchant/My/merchant-info.vue'

Vue.use(VueRouter)

const router = new VueRouter( {
  routes: [
  { path: '/login', component: login },
  { path: '/', redirect: '/login' },
  { path: '/my',component: My,
  children: [{path: '/orders',component:orders},
  { path: '/Commodity',component:Commodity},
  {path: '/5',component: information}]
},
  { path: '/signUp',component: signUp},
]})

//挂载路由导航守卫之后再暴露路由
router.beforeEach((to, from, next) => {
  // to:将要访问的路径
  // from: 从哪个路径跳转而来
  // next: 放行函数
  // next() 放行； next('/login') 强制跳转（没有token的时候）
  if(to.path === '/login' || to.path === '/signUp') return next();
  //拿出token
  const tokenString = localStorage.getItem('token')
  if (!tokenString) return next('/login');
  //如果token存在，可以放行
  next();
})

export default router