import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  /**
   * 主页
   */
  {
    path: "/",
    redirect: "login",
    meta: {
      name: "主页"
    },
    hidden: true,
  },
  /**
   * 登录
   */
  {
    path: "/login",
    name: "Login",
    meta: {
      name: "登录"
    },
    hidden: true,
    component: () => import("../views/login/login.vue")
  },
  /**
   * 控制台
   */
  {
    path: "/console",
    name: "Console",
    redirect: 'index',
    meta: {
      name: "控制台"
    },
    component: () => import("../views/layout/index.vue"),
    children: [{
      path: "/index",
      name: "Index",
      meta: {
        name: "内容"
      },
      component: () => import("../views/console/index.vue")
    }]
  },
  /**
   * 信息管理
   */
  {
    path: "/info",
    name: "Info",
    meta: {
      name: "信息管理"
    },
    component: () => import("../views/layout/index.vue"),
    children: [{
        path: "/infoIndex",
        name: "InfoIndex",
        meta: {
          name: "信息列表"
        },
        component: () => import("../views/info/index.vue")
      },
      {
        path: "/infoCategory",
        name: "InfoCategory",
        meta: {
          name: "信息分类"
        },
        component: () => import("../views/info/category.vue")
      }
    ]
  },
  /**
   * 用户管理
   */
  {
    path: "/user",
    name: "User",
    meta: {
      name: "用户管理"
    },
    component: () => import("../views/layout/index.vue"),
    children: [{
      path: "/userIndex",
      name: "UserIndex",
      meta: {
        name: "用户列表"
      },
      component: () => import("../views/user/index.vue")
    }]
  }
];

const router = new VueRouter({
  routes
});

export default router;