<!--  -->
<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-title">
        <p>注册账号</p>
      </div>
      <div class="login-form">
        <input type="text" placeholder="请输入用户名" v-model="username" />
        <!-- 可无邮箱 -->
        <input type="text" placeholder="请输入邮箱" />
        <input type="password" placeholder="请输入密码" v-model="password" />
        <input type="password" placeholder="请确认密码" />
      </div>
      <button @click="handleRejister">register</button>
      <p class="login-link">
        已有账户? <a href="#" @click.prevent="goToLogin">去登陆</a>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
const router = useRouter();
onMounted(async () => {
  try {
    const response = await axios.get("http://localhost:3001/users");
    validCredentials.value = response.data; // 直接提取数据
    console.log("获取的用户数据:", validCredentials.value); // 打
  } catch (err) {
    console.error(err);
  }
});
const goToLogin = () => {
  router.push("/login");
};
</script>

<style scoped>
.login-container {
  margin-top: 100px;
  width: 100%;
  height: 100%;
  background-color: #f0f0f0;
}
.login-box {
  width: 400px;
  height: 500px;
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
}
.login-title {
  font-size: 32px;
  font-weight: 500;
  text-align: center;
  margin-bottom: 20px;
}
.login-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  input {
    width: 100%;
    height: 50px;
    font-weight: 400;
    border: none;
    background-color: #f0f0f0;
    opacity: 0.6;
    padding: 0 10px;
    color: #a6a6a6;
    transition: all 0.3s ease;
    outline: 2px solid transparent;
    &:focus {
      outline: 2px solid #f26371;
      /* background-color: #fff; */
      color: #333;
    }
  }
}
button {
  margin-top: 20px;
  width: 100%;
  height: 50px;
  border: none;
  outline: none;
  background-color: #f26371;
  color: #fff;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    background-color: #9c7c80;
  }
}
.login-link {
  margin-top: 20px;
  font-size: 12px;
  color: #666;
}

.login-link a {
  color: #f76c6c;
  text-decoration: none;
}
</style>
