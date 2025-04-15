<!-- 轮播图组件 -->
<template>
  <div class="carousel">
    <el-carousel indicator-position="" height="700px" width="1600px">
      >
      <el-carousel-item v-for="item in carouselList" :key="item.id">
        <h3 text="2xl" justify="center">
          <img :src="item.img" alt="出现问题啦" />
        </h3>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>
<script setup>
import axios from "axios";
import { ref } from "vue";
const activeIndex = ref(0);
const carouselList = ref([
  {
    id: 1,
    img: "https://picsum.photos/1600?random=1",
  },
  {
    id: 2,
    img: "https://picsum.photos/1600?random=2",
  },
  {
    id: 3,
    img: "https://picsum.photos/1600?random=3",
  },
  {
    id: 4,
    img: "https://picsum.photos/1600?random=4",
  },
]);
</script>
<style scoped>
.el-carousel__item h3 {
  display: flex;
  color: #475669;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #847373;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
