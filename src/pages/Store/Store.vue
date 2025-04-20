<template>
  <Header2 title="商店" subtext="flower store" />
  <div class="mt-10 mx-24 font-Alibaba">
    <div class="flex text-font-secondary text-left">
      <!-- left -->
      <div class="w-1/3 mr-10">
        <div class="sticky top-10">
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
            <!-- 价格范围滑条 -->
            <div class="h-1.5 bg-font-secondary">
              <div class="h-1.5 w-1/2 bg-font-primary"></div>
            </div>
          </div>
          <div class="text-xl mt-6 border-b-2 border-bg-primary">类别</div>
          <div class="flex flex-col items-start">
            <button
              :class="{
                'text-red-500/60': selectedCategory === '推荐',
                'text-xl pt-4 text-font-thirth font-medium mb-0 cursor-pointer': true,
              }"
              @click="setCategory('推荐')">
              推荐
            </button>
            <button
              :class="{
                'text-red-500/60': selectedCategory === '生日鲜花',
                'text-xl pt-4 text-font-thirth font-medium mb-0 cursor-pointer': true,
              }"
              @click="setCategory('生日鲜花')">
              生日鲜花
            </button>
            <button
              :class="{
                'text-red-500/60': selectedCategory === '友情鲜花',
                'text-xl pt-4 text-font-thirth font-medium mb-0 cursor-pointer': true,
              }"
              @click="setCategory('友情鲜花')">
              友情鲜花
            </button>
            <button
              :class="{
                'text-red-500/60': selectedCategory === '情人节鲜花',
                'text-xl pt-4 text-font-thirth font-medium mb-0 cursor-pointer': true,
              }"
              @click="setCategory('情人节鲜花')">
              情人节鲜花
            </button>
          </div>
        </div>
      </div>
      <div class="w-2/3 flex flex-wrap justify-evenly">
        <Goods :goods="filteredGoods" />
      </div>
    </div>
  </div>
</template>
<script>
import Goods from './components/goods.vue';
import axios from 'axios';
import { API_URL } from '/src/pages/const/index';

export default {
  name: 'Store',
  components: {
    Goods,
  },
  data() {
    return {
      selectedCategory: '推荐', // 默认类别
      goods: [], // 商品数据
    };
  },
  computed: {
    filteredGoods() {
      return this.goods.filter((item) =>
        item.specification.category.includes(this.selectedCategory)
      );
    },
  },
  methods: {
    setCategory(category) {
      this.selectedCategory = category;
    },
    async getGoods() {
      const res = await axios.get(`${API_URL}/product_list`);
      this.goods = res.data.map((item) => ({ ...item, showCart: false }));
      console.log(this.goods);
    },
  },
  mounted() {
    this.getGoods();
  },
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
