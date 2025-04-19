<template>
  <div @click="$emit('close')" class="join-cart-modal">
    <div class="modal-content relative">
      <!-- 内容 -->
      <div class="flex justify-start items-center">
        <!-- left -->
        <div class="mx-4 w-40 h-46 bg-bg-thirth"></div>
        <!-- right -->
        <div class="">
          <h4>粉红花束</h4>
          <div class="flex justify-start items-center">
            <span
              ><svg
                class="size-4"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none">
                <circle cx="16" cy="16" r="16" fill="#20B759"></circle>
                <path
                  stroke="rgba(255, 255, 255, 1)"
                  stroke-width="2"
                  d="M5.5 16L15 21L25 8.5"></path>
              </svg> </span
            ><span class="mx-2">成功添加到您的购物车</span>
          </div>
          <button
            class="bg-font-primary w-30 text-white py-1 mt-5"
            @click="goToCart">
            查看购物车
          </button>
          <!-- 关闭按钮 -->
          <div
            class="absolute top-0 right-0 w-7 h-7 bg-font-primary flex justify-center items-center">
            <el-icon
              size="24"
              color="#fff"
              class="cursor-pointer font-bold"
              @click="$emit('close')"
              ><Close
            /></el-icon>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'JoinCart',
  methods: {
    goToCart() {
      this.$router.push('/cart'); // 假设购物车的路由是 '/cart'
    },
  },
};
</script>

<style scoped>
.join-cart-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
.modal-content {
  background: white;
  padding: 20px;
  width: 500px;
  height: 250px;
}
</style>
