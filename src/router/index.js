import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import { usePermissStore } from '@/store/permiss'

const routes = [
  {
    path: '/release',
    meta: {
      title: "欢迎页",
    },
    component: () => import('@/views/index.vue'),
  },
  {
    path: '/',
    meta: {
      title: "活体检测",
    },
    component: () => import('@/views/release.vue'),
  },
  {
    path: '/authentication',
    name: 'authentication',
    meta: {
      title: "上传身份证",
    },
    component: () => import('@/views/authentication.vue'),
  }
]
const router = createRouter({
  history: createWebHashHistory(),
  routes,
  mode: 'history'
})

// router.beforeEach((to,from,next) => {
// if(to.path == '/'){
//   next('/release');
// }
// document.title = `${to.meta.title} | ictrek`;
// const role = localStorage.getItem('ms-username');
// const permiss = usePermissStore();
// if(!role && to.path !== '/'){
//     next('/');
//   }else if(to.meta.permiss && !permiss.key.includes(to.meta.permiss)){
//     // 没有权限，则进入403
//     next('/403');
//   }else{
//     next();
//   }
// })

export default router
