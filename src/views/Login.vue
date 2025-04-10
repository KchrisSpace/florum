<template>
  <div class="login-container">
    <h1>登录你的账户</h1>
    <p>登录账户之后，将带您走进鲜花的浪漫世界</p>
    <form @submit.prevent="login">
      <div class="input-group">
        <input
          type="text"
          placeholder="用户名"
          id="username"
          v-model="username"
        />
      </div>
      <div class="input-group">
        <input
          type="password"
          placeholder="密码"
          id="password"
          v-model="password"
        />
      </div>
      <button type="submit" class="login-button" @click="handleLogin">
        登录
      </button>
    </form>
    <p class="forgot-password">忘记密码?</p>
    <p class="register-link">
      没有账户? <a href="#" @click.prevent="goToRegister">去创建</a>
    </p>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import axios from "axios";
const router = useRouter();
const username = ref("");
const email = ref("");
const password = ref("");
const errorMessage = ref("");
const validCredentials = ref([]);

onMounted(async () => {
  try {
    const response = await axios.get("http://localhost:3001/users");
    validCredentials.value = response.data; // 直接提取数据
    console.log("获取的用户数据:", validCredentials.value); // 打
  } catch (err) {
    console.error(err);
  }
});
const handleLogin = () => {
  // 使用some方法遍历有效凭证数组，检查是否存在匹配的用户名和密码
  const isValid = validCredentials.value.some((cred) => {
    console.log(cred.username, cred.password); // 移动到回调函数内部
    return cred.username === username.value && cred.password === password.value;
  });

  // 根据凭证验证结果，执行相应的操作
  if (isValid) {
    // 清空错误消息并导航到RouteA

    router.push({ name: "Home" });
    console.log("登录成功");
  } else {
    // 显示错误消息提示用户名或密码错误
    alert("用户名或密码错误");
    // 并清空输入框
    username.value = "";
  }
};

const goToRegister = () => {
  router.push("/register");
};
</script>

<style scoped>
.login-container {
  width: 100vw;
  text-align: center;
  margin-top: 150px;
}

h1 {
  font-size: 32px;
  letter-spacing: 4px;
  font-weight: 1200;
  margin-bottom: 10px;
}

p {
  font-size: 14px;
  color: #4d4a4a;
}

.input-group {
  margin: 10px 0;
  width: 30%;
  margin: 20px auto;
}

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
    color: #333;
  }
}

.login-button {
  width: 30%;
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

.forgot-password {
  margin-top: 10px;
  font-size: 12px;
  color: #666;
}

.register-link {
  margin-top: 20px;
  font-size: 12px;
  color: #666;
}

.register-link a {
  color: #f76c6c;
  text-decoration: none;
}
</style>
