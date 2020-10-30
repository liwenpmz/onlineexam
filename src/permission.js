import store from './vuex/permission'
import router from './router'

function updateRoles() {
           //var parm = store.getters.myroles; 
             var parm = localStorage.getItem('userRoleInfo')
             store.dispatch('GenerateRoutes',parm).then(() => {
                 router.options.routes = store.getters.addRouters;
                 router.addRoutes(store.getters.addRouters);
             });  
    }   
    router.beforeEach((to, from, next) => {
        console.log("1111111111")
        if (to.path=='/login') {   
          next()  //登录页死循环放行
        }else if(to.path=='/404'){//404
          next()
        }else if(from.path=='/login'){//首次登录加载
            if((localStorage.getItem('userRoleInfo'))){
                updateRoles(); 
                next();
            }else{
                next()     
            }
        } else { 
          if (localStorage.getItem('userRoleInfo')) {     //判断是否登录
            if (to.matched.some((route) => route.meta.Auth)) {   //判断是否需要权限，动态路由通不过权限
              if (store.getters.addRouters.length <= 0) {  //判断是否刷新了页面
                updateRoles();
                next();
              }
              next()
            } else {//没权限的加载
                updateRoles();
                next();   
            }
          } else {
            next('/login')  // 没有登录 返回登录页面
          }
        }
      })