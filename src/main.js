import { createApp } from "vue";
import "./index.css";
import App from "./App.vue";

// 导入 Element Plus
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

// 导入 Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";


// 导入路由
import router from "./router";

// fontawesome导入图标
/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faMagnifyingGlass,faCartShopping} from '@fortawesome/free-solid-svg-icons'
import { faUser,faHeart } from '@fortawesome/free-regular-svg-icons' // Regular 样式

/* add icons to the library */
library.add(faMagnifyingGlass,faUser,faHeart,faCartShopping)

const app = createApp(App);

// 注册 Element Plus
app.use(ElementPlus);
// 注册路由
app.use(router);

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app .component('font-awesome-icon', FontAwesomeIcon).mount("#app");
