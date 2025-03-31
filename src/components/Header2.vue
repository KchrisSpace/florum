<template>
  <div class="header2">
    <div class="headertop">
      <div class="logo">
        <a href="#/">FLORUM</a>
      </div>
      <div class="search">
        <div class="search-input">
          <div class="search-input-icon">
            <input type="text" placeholder="搜索" />
            <span class="search-icon">🔍</span>
          </div>
        </div>
      </div>
      <div class="cart">
        <a href="#/cart">购物车</a>
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
</template>

<script setup>

</script>

<style scoped>
.header2 {
  width: 100vw;
  background-color: #faf8f8;
  padding: 0 60px;
  margin: 0 auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  /* position: fixed; */
  /* top: 0;
  left: 0;
  right: 0; */
}

.headermenu {
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 10px;
  padding: 10px;

  /* box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1); */
}
.headertop {
  display: flex;

  align-items: center;
  height: 80px;
  /* border-bottom: 1px solid #ccc; */
  padding: 10px;
  margin-bottom: 20px;
}

.logo {
  flex: 2;
  font-size: 24px;
  font-weight: bold;
}

.search input {
  flex: 6;
  padding: 10px;
  width: 550px;
  height: 35px;
  border: 2px solid #ddd;
  border-radius: 30px;
}

.cart {
  flex: 2;
  font-size: 16px;
  font-weight: bold;
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
  color: #000;
}

.headermenu a:hover {
  color: #ff6f61;
}

.logo a {
  font-size: 24px;
  font-weight: bold;
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
</style>
