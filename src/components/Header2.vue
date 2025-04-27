<template>
  <div class="header2">
    <div class="headertop">
      <div class="logo">
         <router-link to="/" class="logo-text">「FLORUM」</router-link>
      </div>
      <div class="search">
        <input type="text" placeholder="搜索" />
        <el-icon><Search /></el-icon>
      </div>
      <div class="cart">
        <router-link to="/cart" class="cart-link"
          ><div style="margin-right: 10px; display: inline-block">
            <font-awesome-icon
              :icon="['fas', 'cart-shopping']"
              size="xl"
              style="color: #f26371"
            />
          </div>
          你的购物车</router-link
        >
      </div>
    </div>

    <div class="headermenu">
      <router-link
        to="/"
        :class="{ active: activeLink === '/' }"
        @click="setActiveLink('/')"
        >首页</router-link
      >
      <router-link
        to="/store"
        :class="{ active: activeLink === '/store' }"
        @click="setActiveLink('/store')"
        >商店</router-link
      >
      <router-link
        to="/custom"
        :class="{ active: activeLink === '/custom' }"
        @click="setActiveLink('/custom')"
        >来图定制</router-link
      >
      <router-link
        to="/community"
        :class="{ active: activeLink === '/community' }"
        @click="setActiveLink('/community')"
        >社区</router-link
      >
      <router-link
        to="/about"
        :class="{ active: activeLink === '/about' }"
        @click="setActiveLink('/about')"
        >关于</router-link
      >
      <router-link
        to="/contact"
        :class="{ active: activeLink === '/contact' }"
        @click="setActiveLink('/contact')"
        >联系我们</router-link
      >
    </div>
  </div>
  <div class="title font-Alibaba flex flex-col justify-center items-center">
    <div style="font-size: 36px; line-height: normal; font-weight: 500">
      {{ title }}
    </div>
    <div
      style="
        font-size: 24px;
        line-height: normal;
        color: #424443;
        font-weight: 500;
      "
    >
      {{ subtext }}
    </div>
  </div>
</template>

<script>
export default {
  name: "Header2",
  props: {
    title: {
      type: String,
      required: true,
    },
    subtext: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      activeLink: this.$route.path,
    };
  },
  created() {
    this.activeLink = this.$route.path;
  },
  watch: {
    "$route.path"(newPath) {
      this.activeLink = newPath;
    },
  },
  methods: {
    setActiveLink(link) {
      this.activeLink = link;
    },
  },
};
</script>
<script setup></script>
<style scoped>
.header2 {
  padding: 0 60px;
  margin: 0 auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  /* position: fixed; */
  /* top: 0;
  left: 0;
  right: 0; */
  font-family: "Hanazono Mincho";
}
input {
  outline: none;
}
.title {
  width: 100%;
  height: 130px;
  background: #f0f0f0;
  color: #000000;
  padding: 10px 0;
}
.logo-text {
  font-family: "logo";
}
.headermenu {
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 20px;
  padding: 10px;

  /* box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1); */
}
.headertop {
  display: flex;
  align-items: center;
  height: 80px;
  border-bottom: 1px solid #e5e5e5;
  margin-bottom: 20px;
  padding: 30px 0 50px;
}

.logo {
  flex: 2;
  font-family: "Hanazono";
}

.search input {
  flex: 6;
  padding: 10px;
  width: 550px;
  height: 35px;
  border: none;
  /* border: 1px solid #000000; */
  border-radius: 30px;
}
.search {
  border: 1px solid #000000;
  border-radius: 30px;
  padding: 0 10px;
}
.cart {
  flex: 2;
  font-size: 16px;
  font-family: "Alibaba";
  transform: translateX(-50px);
}

.headermenu {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}

.headermenu a {
  margin-right: 20px;
  text-decoration: none;
  color: black;
}

.headermenu a.active {
  color: #f26371;
}

.headermenu a:hover {
  color: #f26371;
}

.logo a {
  font-size: 32px;
  text-decoration: none;
  color: #000;
}

.cart a {
  text-decoration: none;
  color: #000;
}

.menu a {
  margin: 0 10px;
  text-decoration: none;
  color: #000;
}

.cart-link {
  text-decoration: none;
  color: #000000;
  transition: color 0.1s ease;
}

.cart-link:hover {
  color: #f26371;
}

.cart-link:hover .fa-cart-shopping {
  color: #f26371 !important;
}
</style>
