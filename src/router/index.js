import Vue from "vue";
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'  //重定向
        },
        {
            path: '/login',
            meta: '登录界面',
            component: () => import('../components/Login')  //懒加载方式
        },
        {
            path: '/home',
            meta: '主页',
            component: () => import('../components/Home'),
            redirect: '/welcome',
            children: [
                {
                    path: '/welcome',
                    component: () => import('../components/Welcome')
                },
                {
                    path:'/users',
                    component:()=>import('../components/user/Users')
                },
                {
                    path:"/rights",
                    component:()=>import('../components/power/Rights')
                },
                {
                    path:"/roles",
                    component:()=>import('../components/power/Roles')
                }
            ]
        }
    ]
})
//挂在路由导航守卫
router.beforeEach((to, from, next) => {
    //to 将要访问的路径
    //from 代表从哪个路劲跳转过来的
    //next 是一个函数，表示放行    next() 放行  next('/login') 强制跳转
    if (to.path === '/login') return next()
    //获取token
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) return next('/login')
    next()
})

export default router