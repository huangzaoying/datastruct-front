import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import homepage from '../components/homepage/homepage.vue'
import course from '../components/course/course.vue'
import active from '../components/active/active.vue'
import coursedetail from '../components/course/coursedetail.vue'
import page1 from '../components/page/page1.vue'
Vue.use(VueRouter)

const routes = [
    {
        path: '/',        
        redirect: '/login'//重定向到home页面
    },
    {
        name: 'login',
        path: '/login',
        component: Login
    },
    {
        name: 'home',
        path: '/home',
        component: Home,
        redirect: '/homepage',
        children: 
        [            
            {name: 'course', path: '/course', component: course }, 
            {name: 'homepage', path: '/homepage', component: homepage },
            {name: 'active', path: '/active' ,component: active},
            {name: 'page1',path: '/page1',component: page1}
        ]
    },
    { 
        name: 'coursedetail',
        path: '/coursedetail',
        component: coursedetail
    },
]
const router = new VueRouter({
    routes
})

router.beforeEach((to, from, next) => {
    // to 将访问哪一个路径
    // from 代表从哪个路径跳转而来
    // next 是一个函数,表示放行
    //   next() 放行 next('/login') 强制跳转
    if (to.path === '/login') return next()
    // 获取token
    const token = window.sessionStorage.getItem('token')
    if (!token) return next('/login')
    next()
})

export default router    