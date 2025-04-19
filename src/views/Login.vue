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
    // 获取登录数据
    const response = await axios.get("http://localhost:3001/login");
    validCredentials.value = response.data;
    console.log("获取的登录数据:", validCredentials.value);
  } catch (err) {
    console.error("获取登录数据失败:", err);
    // 使用本地硬编码的测试数据作为后备
    validCredentials.value = [
      {
        admin: [
          {
            username: "admin",
            password: "000000",
          },
        ],
        user: [
          {
            username: "user",
            password: "000000",
          },
        ],
      },
    ];
  }
});

const handleLogin = () => {
  // 检查是否为有效数据
  if (!validCredentials.value || !validCredentials.value[0]) {
    alert("登录数据无效，请重试");
    return;
  }

  const loginData = validCredentials.value[0];

  // 检查是否是管理员账号
  const isAdmin =
    loginData.admin &&
    loginData.admin.some(
      (cred) =>
        cred.username === username.value && cred.password === password.value
    );

  // 检查是否是普通用户账号
  const isUser =
    loginData.user &&
    loginData.user.some(
      (cred) =>
        cred.username === username.value && cred.password === password.value
    );

  if (isAdmin) {
    // 管理员账号登录成功
    localStorage.setItem(
      "currentUser",
      JSON.stringify({
        username: username.value,
        role: "admin",
      })
    );

    // 跳转到管理员界面
    router.push("/admin");
    console.log("管理员登录成功");
  } else if (isUser) {
    // 普通用户登录成功
    localStorage.setItem(
      "currentUser",
      JSON.stringify({
        username: username.value,
        role: "user",
      })
    );

    // 跳转到首页
    router.push({ name: "Home" });
    console.log("用户登录成功");
  } else {
    // 登录失败
    alert("用户名或密码错误");
    // 清空密码输入框
    password.value = "";
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
