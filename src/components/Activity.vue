<!-- 活动展示组件 -->
<template>
  <div class="activity-container">
    <div class="activity" v-for="item in activityList" :key="item.id">
      <div class="activity-item">
        <img :src="item.img" :alt="item.title || '活动图片'" />
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref } from "vue";

const activityList = ref([]);

axios.get("http://localhost:3001/carousel").then((res) => {
  activityList.value = res.data;
  console.log(activityList.value);
});
</script>

<style scoped>
.activity-container {
  display: flex;
  justify-content: space-between;
  margin: 40px 90px;
  /* gap: 10px; */
}

.activity {
  flex: 1;
}

.activity img {
  width: 80%;
  height: 15vh;
  object-fit: cover;
}
</style>
