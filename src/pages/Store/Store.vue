<template>
  <Header2 title="商店" subtext="flower store" />
  <div class="mt-10 mx-24 font-Alibaba">
    <div class="flex text-font-secondary text-left">
      <!-- left -->
      <div class="w-1/3 mr-10">
        <div class="sticky top-10">
          <!-- 搜索框 -->
          <div
            class="pl-4 pr-2 border-2 border-bg-primary flex items-center hover:border-font-primary transition-colors duration-300">
            <input
              type="text"
              class="h-10 w-full outline-none placeholder:text-font-thirth"
              placeholder="搜索商品名称、关键词或描述..."
              v-model="searchKeyword"
              @keyup.enter="handleSearch"
              @input="debouncedSearch" />
            <font-awesome-icon
              :icon="['fas', 'magnifying-glass']"
              size="lg"
              :class="[
                'cursor-pointer transition-colors duration-300',
                searchKeyword ? 'text-font-primary' : 'text-font-thirth',
              ]"
              @click="handleSearch" />
          </div>
          <div class="mt-6 border-b-2 border-bg-primary text-3xl">价格</div>
          <div class="my-6 text-2xl">
            <p>范围</p>
            <div class="block">
              <el-slider
                v-model="value"
                range
                show-stops
                :max="600"
                :format-tooltip="formatPrice">
              </el-slider>
              <div class="flex justify-between mt-2 text-font-thirth text-base">
                <span>¥{{ value[0] }}</span>
                <span>¥{{ value[1] }}</span>
              </div>
            </div>
          </div>
          <div class="text-xl mt-6 border-b-2 border-bg-primary">类别</div>
          <div class="flex flex-col items-start">
            <button
              v-for="category in categories"
              :key="category"
              :class="[
                'text-xl pt-4 text-font-thirth font-medium mb-0 cursor-pointer transition-colors duration-300',
                selectedCategory === category
                  ? 'text-red-500/60'
                  : 'hover:text-red-500/40',
              ]"
              @click="setCategory(category)">
              {{ category }}
            </button>
          </div>
        </div>
      </div>
      <div class="w-2/3 flex flex-wrap justify-evenly">
        <template v-if="isLoading">
          <div class="w-full text-center py-8 text-font-thirth">搜索中...</div>
        </template>
        <template v-else-if="filteredGoods.length === 0">
          <div class="w-full flex flex-col items-center justify-center py-12">
            <font-awesome-icon
              :icon="['fas', 'magnifying-glass']"
              class="text-6xl text-font-thirth mb-4" />
            <p class="text-2xl text-font-thirth mb-2">没有找到相关商品</p>
            <p class="text-lg text-font-thirth">尝试调整搜索关键词或筛选条件</p>
          </div>
        </template>
        <template v-else>
          <Goods :goods="filteredGoods" />
        </template>
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
      selectedCategory: '推荐',
      goods: [],
      value: [0, 600],
      searchKeyword: '',
      searchResult: [],
      isLoading: false,
      categories: ['推荐', '生日鲜花', '友情鲜花', '情人节鲜花'],
    };
  },
  computed: {
    filteredGoods() {
      if (this.isLoading) return [];

      const filtered = this.goods.filter((item) => {
        const categoryMatch =
          this.selectedCategory === '推荐' ||
          item.specification.category.includes(this.selectedCategory);

        const priceMatch =
          item.price_info.current_price >= this.value[0] &&
          item.price_info.current_price <= this.value[1];

        const keywordMatch =
          this.searchResult.length === 0 || this.searchResult.includes(item.id);

        return categoryMatch && priceMatch && keywordMatch;
      });

      return filtered.length === 0 ? [] : filtered;
    },
  },
  methods: {
    setCategory(category) {
      this.selectedCategory = category;
    },
    formatPrice(value) {
      return `¥${value}`;
    },
    debounce(fn, delay) {
      let timer = null;
      return function (...args) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          fn.apply(this, args);
        }, delay);
      };
    },
    handleSearch() {
      if (!this.searchKeyword.trim()) {
        this.searchResult = [];
        return;
      }

      this.isLoading = true;
      const keyword = this.searchKeyword.toLowerCase();

      setTimeout(() => {
        this.searchResult = this.goods
          .filter(
            (item) =>
              item.title.toLowerCase().includes(keyword) ||
              item.promotion.keywords.some((k) =>
                k.toLowerCase().includes(keyword)
              ) ||
              item.promotion.main_description.toLowerCase().includes(keyword)
          )
          .map((item) => item.id);
        this.isLoading = false;
      }, 300);
    },
    async getGoods() {
      try {
        const res = await axios.get(`${API_URL}/product_list`);
        this.goods = res.data.map((item) => ({ ...item, showCart: false }));
        // console.log('获取到的商品数据:', this.goods);
      } catch (error) {
        console.error('获取商品数据失败:', error);
      }
    },
  },
  created() {
    this.debouncedSearch = this.debounce(this.handleSearch, 500);
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

/* 使用 ::v-deep 或 :deep() */
::v-deep .el-slider__bar {
  background-color: #f26371;
  height: 12px;
  border-radius: 6px;
}
::v-deep .el-slider__button {
  border-color: #f26371;
  width: 16px;
  height: 16px;
  transition: all 0.3s;
}
::v-deep .el-slider__button:hover {
  transform: scale(1.2);
}
::v-deep .el-slider {
  --el-slider-main-bg-color: #f26371;
  height: 12px;
}
::v-deep .el-slider__stop {
  background-color: #808080;
  width: 4px;
  height: 12px;
  border-radius: 50%;
}
</style>
