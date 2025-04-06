<!--  -->
<template>
  <div class="wishlist">
    <Header2></Header2>
    <br>
    <h1>心愿单</h1>
    <h2>wishlist</h2>
    <br>
    <div class="wishlist-container">
      <hr>
    <Wishcar></Wishcar>
    <hr>
    <Wishcar></Wishcar>
    </div>
  </div>
</template>

<script setup>
import Header2 from "../components/Header2.vue";
import Wishcar from "../components/Wishcar.vue";
</script>

<style scoped>
.wishlist {
  background-color: #ffffff;
  height: 100vh;
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
