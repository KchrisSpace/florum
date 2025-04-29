<template>
   <Header2 title="关于我们" subtext="about us" />
  <div class="about">
    <!-- 主标语 -->
    <div class="hero-section">
      <h1>为这个世界多一分颜色，为你的生活多一些温馨</h1>
    </div>

    <!-- 公司简介 -->
    <div class="company-intro">
      <p>
        花礼网Hua.com，中国领先的鲜花礼品网，鲜花行业品牌服务商，隶属于深圳市百易信息技术有限公司。2005年8月正式上线，以"花心思，只为你"为品牌理念，已为千万用户提供优鲜花礼品配送服务。全国连锁2000多个城市（直辖市、省会、地级市及县级）1-3小时送花上门，并可提前日期和时间范围配送，让心意准时到达。
      </p>
    </div>

    <!-- 服务特点 -->
    <div class="features">
      <div class="feature-item">
        <img src="/public/about/single-delivery.png" alt="单件配送" />
        <p>单件配送</p>
        <span>无起送价</span>
      </div>
      <div class="feature-item">
        <img src="/public/about/buy-safe.png" alt="购物无忧" />
        <p>购物无忧</p>
        <span>确保品质</span>
      </div>
      <div class="feature-item">
        <img src="/public/about/fast-delivery.png" alt="闪电发货" />
        <p>闪电发货</p>
        <span>极速送达</span>
      </div>
      <div class="feature-item">
        <img src="/public/about/service.png" alt="贴心服务" />
        <p>顾客至上</p>
        <span>贴心服务</span>
      </div>
    </div>
    <div class="guarantee-section">
      <div class="guarantee">
        <h2>品质保证承诺</h2>
        <p>
          我们郑重承诺：所有鲜花均采用最新鲜的花材，由专业花艺师精心制作。如收到花束有任何质量问题，24小时内可申请退换。我们提供全程跟踪服务，确保配送准时到达。所有花束均采用环保包装，保证运输过程中花材完好无损。如遇特殊情况，我们将第一时间与您沟通，提供最优解决方案。您的满意是我们最大的追求。
        </p>
      </div>
    </div>
    <!-- 页脚 -->
    <footer class="footer">
      <hr />
      <p class="copyright">copyright/florum</p>
    </footer>
  </div>
</template>

<script setup>
import Header2 from "../components/Header2.vue";
</script>

<style scoped>
.about {
  width: 100vw;
  min-height: 100vh;
  background-color: #fefdfd;
  overflow-x: hidden;
}

/* 主标语样式 */
.hero-section {
  background-color: #fef0f0;
  padding: 40px 20px;
  text-align: center;
  margin: 20px 0;
}

.hero-section h1 {
  font-size: 24px;
  color: #333;
  font-weight: normal;
  line-height: 1.5;
}

/* 公司简介样式 */
.company-intro {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
}

.company-intro p {
  line-height: 1.8;
  color: #666;
  font-size: 16px;
  text-align: justify;
}

/* 服务特点样式 */
.features {
  display: flex;
  justify-content: center;
  gap: 60px;
  padding: 40px 20px;
  background-color: #fff;
  max-width: 1200px;
  margin: 40px auto;
}

.feature-item {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.feature-item img {
  width: 50px;
  height: 50px;
  margin-bottom: 5px;
  opacity: 0.5;
}

.feature-item p {
  font-size: 16px;
  color: #333;
  margin: 0;
}

.feature-item span {
  font-size: 14px;
  color: #999;
}
.guarantee-section {
  background-color: #fef0f0;
  padding: 40px 20px;
  text-align: center;
  margin: 20px 0;
}
.guarantee {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}
.guarantee p {
  line-height: 1.8;
  color: #666;
  font-size: 16px;
  text-align: justify;
}
/* 页脚样式 */
hr {
  width: 100%;
  height: 2px;
  background-color: #000000;
}
.copyright {
  font-size: 14px;
  color: #000000;
}
</style>
