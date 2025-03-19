<!--  -->
<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-title">
        <p>注册账号</p>
      </div>
      <div class="login-form">
        <input type="text" placeholder="请输入用户名" />
        <input type="text" placeholder="请输入邮箱" />
        <input type="password" placeholder="请输入密码" />
        <input type="password" placeholder="请确认密码" />
      </div>
      <button> <router-link to="/Home">注册 </router-link></button>
    </div>
  </div>
</template>

<script setup></script>

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
  font-weight: bold;
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
</style>
