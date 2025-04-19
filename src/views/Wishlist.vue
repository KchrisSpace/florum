<!--  -->
<template>
  <div>
    <Header2 title="心愿单" subtext="wish list " />
    <div class="wishlist-container">
      <hr />
      <Wishcar />
      <Wishcar />
      <Wishcar />
    </div>
  </div>
</template>

<script setup>
import Header2 from '../components/Header2.vue';
import Wishcar from '../components/Wishcar.vue';
</script>

<style scoped>
* {
  box-sizing: border-box; /* 确保padding和border包含在宽度内 */
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
