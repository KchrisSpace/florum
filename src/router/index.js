import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue"; // 确保路径正确
import Custom from "../pages/Custom/Custom.vue";
import Community from "../pages/Community/Community.vue";
import Store from "../pages/Store/Store.vue";
import Contact from "../pages/Contact/Contact.vue";
import article from "../pages/Community/components/article.vue";
import User from "../pages/User/User.vue";
import ProductDetails from "../views/ProductDetails.vue";

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
    path: "/payment",
    name: "Payment",
    component: () => import("../views/Payment.vue"),
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
    children: [
      {
        path: "article",
        name: "Article",
        component: article,
      },
    ],
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
];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 导出路由实例
export default router;
