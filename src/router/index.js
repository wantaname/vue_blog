import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入组件
import Home from '../components/home/home.vue'
import login from '../components/account/login'
import blogs from '../components/blogs/blogs'
import write from '../components/blogs/write'

import timeline from '../components/blogs/timeline'
import read from '../components/blogs/read'
import category from '../components/blogs/category'


/**
 * 重写路由的push方法
 */
const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
}

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    redirect: '/write',
    children: [
      {
        path: '/blogs', name: 'blogs', component: blogs,
        meta: {
          keepAlive: false 
        }
      },
      {
        path: '/write', name: 'write', component: write, meta: {
          keepAlive: true // 需要缓存
        }
      },

      {
        path: '/timeline', component: timeline,name:'timeline',
        meta: {
          keepAlive: false // 不需要缓存
        }
      },
      {
        path: '/category', component: category,name:'category',
        meta: {
          keepAlive: false // 不需要缓存
        }
      },
      {
        path: '/read', name: 'read', component: read,
        meta: {
          keepAlive: true // 需要缓存
        }
      },

    ]
  },
  {
    path: '/login',
    name: 'login',
    component: login,
  },


]

const router = new VueRouter({
  // mode: 'history',
  routes
})




// 挂载路由导航守卫
// router.beforeEach((to, from, next) => {
//   if (to.path === '/login') {
//     window.localStorage.clear()
//     return next()
//   } else {
//     return next()
//   }
// })
export default router
