<!--  -->
<template>
  <header2></header2>
  <div class="wishlist">
    <div class="title">
      <br />
      <h1>心愿单</h1>
      <h2>wishlist</h2>
      <br />
    </div>
    <div class="wishlist-container">
      <hr>
      <Wishcar></Wishcar>
      <Wishcar></Wishcar>
    </div>
  </div>
 
</template>

<script setup>
import header2 from "../components/header2.vue";
import Wishcar from "../components/Wishcar.vue";
</script>

<style scoped>
* {
  box-sizing: border-box; /* 确保padding和border包含在宽度内 */
  
}

.wishlist {
  width: 100vw;
  background-color: #ffffff;
  position: relative;
  min-height: 100vh;
  overflow-x: hidden; /* 防止水平滚动 */
}
.wishlist-container {
  /* margin-top: 50px; */
  /* margin-bottom: 50px; */
  width: 80%;
  margin-left: auto;
  margin-right: auto;
  padding: 20px;
  border-radius: 10px;
  /* box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); */
}
</style>
