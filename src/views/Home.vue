<template>
  <Header />
  <div class="home">
    <hr style="width: 100%; height: 1px; background-color: #000000" />
    <Carousel />
    <Activity />
    <SalesList />
  </div>
</template>

<script setup>
import Header from "../components/Header.vue";
import SalesList from "../views/Sales-list.vue";
import Activity from "../components/Activity.vue";
import Carousel from "../components/Carousel.vue";
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
  padding: 0 20px;
  background-color: #fefdfd;
}
</style>
