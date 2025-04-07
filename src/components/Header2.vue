<template>
  <div class="header2">
    <div class="headertop">
      <div class="logo">
        <a href="#/">「FLORUM」</a>
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
              style="color: #808080" />
          </div>
          你的购物车</router-link
        >
      </div>
    </div>

    <div class="headermenu">
      <router-link to="/">首页</router-link>
      <router-link to="/store">商店</router-link>
      <router-link to="/custom">来图定制</router-link>
      <router-link to="/community">社区</router-link>
      <router-link to="/about">关于</router-link>
      <router-link to="/contact">联系我们</router-link>
    </div>
  </div>
  <div class="title">
    <div style="font-size: 50px; line-height:normal;">{{ title }}</div>
    <div style="font-size: 30px; line-height:normal; color: #424443;">{{ subtext }}</div>
  </div>
</template>

<script>
export default {
  name: 'Header2',
  props: {
    title: {
      type: String,
      required: true,
    },
    subtext: {
      type: String,
      default: '',
    },
  },
};
</script>

<style scoped>
.header2 {
  width: 100vw;
  background-color: white;
  padding: 0 60px;
  margin: 0 auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  /* position: fixed; */
  /* top: 0;
  left: 0;
  right: 0; */
  font-family: 'Hanazono Mincho';
}
.title {
  font-family:'Alibaba';
  font-weight: 500;
  width: 100%;
  height: 130px;
  background: #f0f0f0;
  color: #000000;
  padding: 10px 0;
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
  padding: 10px;
  margin-bottom: 20px;
  padding: 30px 0 50px;
}

.logo {
  flex: 2;
  font-family: 'Hanazono';
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
  font-family: 'Alibaba';
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
  color:black;
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
