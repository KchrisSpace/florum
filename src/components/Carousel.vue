<!-- 轮播图组件 -->
<template>
  <div class="carousel">
    <el-carousel
      indicator-position=""
      height="400px"
      width="800px"
      :autoplay="true"
      :interval="2000"
    >
      <el-carousel-item v-for="item in carouselList" :key="item.id">
        <div class="carousel-item">
          <img :src="item.img" :alt="item.title || '轮播图'"/>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>
<script setup>
import axios from "axios";
import { ref } from "vue";
const activeIndex = ref(0);
const carouselList = ref([]);
axios.get("http://localhost:3000/carousel").then((res) => {
  carouselList.value = res.data;
  console.log(carouselList.value);
});
</script>
<style scoped>
.carousel {
  margin: 20px auto;
  width: 1200px;
  margin-top: 50px;
}

.carousel-item {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.carousel-item img {
  width: 100%;
  height: 100%;
  object-fit: fill;
  object-position: center;
}

.el-carousel__item {
  background-color: #f5f5f5;
}
 ::v-deep .el-carousel__button {
  background-color: #6c4141 !important;
  height: 3px;
  border-radius: 3px;
}
</style>
