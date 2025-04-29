import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue"; // 确保路径正确
import Custom from "../pages/Custom/Custom.vue";
import Community from "../pages/Community/Community.vue";
import Store from "../pages/Store/Store.vue";
import Contact from "../pages/Contact/Contact.vue";
import Article from "../pages/Community/components/article.vue";
import User from "../pages/User/User.vue";
import ProductDetails from "../views/ProductDetails.vue";
import Admin from "../admin/admin.vue";
import Dashboard from "../admin/views/Dashboard.vue";
import Users from "../admin/views/Users.vue";
import Products from "../admin/views/Products.vue";
import Orders from "../admin/views/Orders.vue";
import Categories from "../admin/views/Categories.vue";
import Suggestion from "../admin/views/Suggestion.vue";

// 路由配置
const routes = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/Register.vue"),
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    component: () => import("../views/About.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/wishlist",
    name: "Wishlist",
    component: () => import("../views/Wishlist.vue"),
  },
  {
    path: "/cart",
    name: "Cart",
    component: () => import("../views/Cart.vue"),
  },
  {
    path: "/create-order",
    name: "CreateOrder",
    component: () => import("../views/CreateOrder.vue"),
  },
  {
    path: "/custom",
    name: "Custom",
    component: Custom,
  },
  {
    path: "/community",
    name: "Community",
    component: Community,
  },
  {
    path: "/article/:id",
    name: "Article",
    component: Article,
    props: true,
  },
  {
    path: "/store",
    name: "Store",
    component: Store,
  },
  {
    path: "/contact",
    name: "Contact",
    component: Contact,
  },
  {
    path: "/user",
    name: "User",
    component: User,
  },
  {
    path: "/productdetails/:id",
    name: "ProductDetails",
    component: ProductDetails,
    props: true,
  },
  {
    path: "/admin",
    name: "Admin",
    component: Admin,
    children: [
      {
        path: "",
        redirect: "/admin/dashboard",
      },
      {
        path: "dashboard",
        component: Dashboard,
        meta: {
          title: "数据概览",
        },
      },
      {
        path: "dashboard",
        component: Dashboard,
        meta: {
          title: "数据概览",
        },
      },
      {
        path: "users",
        component: Users,
        meta: {
          title: "用户管理",
        },
      },
      {
        path: "products",
        component: Products,
        meta: {
          title: "商品管理",
        },
      },
      {
        path: "orders",
        component: Orders,
        meta: {
          title: "订单管理",
        },
      },
      {
        path: "categories",
        component: Categories,
        meta: {
          title: "分类管理",
        },
      },
      {
        path: "suggestion",
        component: Suggestion,
        meta: {
          title: "建议和反馈",
        },
      },
    ],
  },
];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 获取用户信息
  const userJson = localStorage.getItem("currentUser");
  const user = userJson ? JSON.parse(userJson) : null;

  // 检查是否是需要管理员权限的路由
  const requiresAdmin = to.path.startsWith("/admin");

  if (requiresAdmin) {
    // 需要管理员权限
    if (user && (user.role === "admin" || user.username === "admin")) {
      // 是管理员，允许访问
      next();
    } else {
      // 不是管理员，重定向到登录页
      next("/login");
    }
  } else {
    // 不需要管理员权限，直接放行
    next();
  }
});

// 添加默认的 /admin 路径重定向
const adminRoute = routes.find((r) => r.path === "/admin");
if (adminRoute && adminRoute.children) {
  // 确保有一个默认的子路由重定向
  if (!adminRoute.children.some((child) => child.path === "")) {
    adminRoute.children.unshift({
      path: "",
      redirect: "dashboard",
    });
  }
}

// 导出路由实例
export default router;
