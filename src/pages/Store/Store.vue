<template>
  <Header2 title="商店" subtext="flower store" />
  <div class="mt-10 mx-24 font-Alibaba">
    <div class="flex text-font-secondary text-left">
      <!-- left -->
      <div class="mr-10 w-1/3">
        <!-- 搜索框 -->
        <div class="pl-4 pr-2 border-2 border-bg-primary flex items-center">
          <input
            type="text"
            class="h-10 w-full outline-none"
            placeholder="请输入关键字" />
          <font-awesome-icon
            :icon="['fas', 'magnifying-glass']"
            size="lg"
            style="color: #808080" />
        </div>
        <div class="mt-6 border-b-2 border-bg-primary text-3xl">价格</div>
        <div class="my-6 text-2xl">
          <p>范围</p>
          <!-- 范围滑条 -->
          <div class="h-1.5 bg-font-secondary">
            <div class="h-1.5 w-1/2 bg-font-primary"></div>
          </div>
        </div>
        <div class="text-xl mt-6 border-b-2 border-bg-primary">类别</div>
        <div>
          <p
            class="text-xl pt-4 text-font-thirth font-medium mb-0 cursor-pointer">
            推荐
          </p>
          <p
            class="text-xl pt-4 text-font-thirth font-medium mb-0 cursor-pointer">
            生日鲜花
          </p>
          <p
            class="text-xl pt-4 text-font-thirth font-medium mb-0 cursor-pointer">
            草莓花束
          </p>
          <p
            class="text-xl pt-4 text-font-thirth font-medium mb-0 cursor-pointer">
            高端花束
          </p>
        </div>
      </div>
      <div class="w-2/3 flex flex-wrap justify-evenly">
        <Goods />
        <Goods />
        <Goods />
        <Goods />
        <Goods />
        <Goods />
        <Goods />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Store',
};
</script>
<script setup>
import Header2 from '/src/components/Header2.vue';
import Goods from './components/goods.vue';
</script>
<style scoped>
input::placeholder {
  color: #808080;
}
</style>
