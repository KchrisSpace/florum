<template>
  <div class="home">
    <Header />
    <img src="../assets/home-flower.png" alt="" />

    <Activity />
    <SalesList />


  </div>
</template>

<script setup>
import Header from "../components/Header.vue";
import SalesList from "../views/Sales-list.vue";
import Activity from "../components/Activity.vue";
</script>

<style scoped>
* {
  margin: 0;
 
  box-sizing: border-box;
  overflow-x: hidden;
}
img {
  width: 100%;
  height: 100%;
}

.home {
  padding: 15px;
  width: 100vw;
  height: 100vh;
  background-color: #fefdfd;
}
</style>
