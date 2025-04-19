<template>
  <div class="mx-40 mt-20 font-Alibaba">
    <!-- 文章 -->
    <div class="mb-20 px-4 py-8 border-1 border-[#BFBFBF]/45">
      <!-- 标题 -->
      <div class="mb-10">
        <div
          class="text-2xl text-[#BFBFBF] flex justify-start my-2 font-Harmony">
          <span>2025年03月16日</span
          ><span class="flex ml-8"
            ><MessageCircleMore size="24" color="#BFBFBF" />2</span
          >
        </div>
        <div class="font-Alibaba text-4xl font-medium text-left">
          鲜花的魔力：点亮生活的色彩
        </div>
        <div class="mt-6 h-1 w-30 bg-font-primary"></div>
      </div>
      <!-- 正文 -->
      <div class="">
        <img src="/src/assets/home-flower.png" alt="" class="my-4" />
        <p class="text-xl text-font-secondary text-left">
          在我们生活的这个快节奏世界里，鲜花宛如一抹灵动的亮色，悄然拥有着改变生活氛围、慰藉心灵的神奇魔力。
          鲜花：家居氛围的调色师
          走进家门，当视线触及那插满鲜花的花瓶时，整个空间仿佛瞬间被注入了生机。在北欧简约风格的客厅中，几支白色百合插在透明玻璃花瓶里，纯净的白色花瓣与简洁的家具相得益彰，为空间增添了一份雅致与清新，让原本略显冷峻的环境变得柔和且温馨。而在充满田园气息的卧室一角，一个古朴的陶罐中随意地插着几枝粉色芍药，绽放的花朵与碎花床品相互呼应，营造出浪漫且惬意的氛围。清晨，第一缕阳光洒在摆放着几支向日葵的餐桌上，金黄色的花瓣仿佛在欢快地跳跃，那明亮的色彩瞬间点亮了整个餐厅，传递着活力与希望，让你一整天都拥有好心情。
        </p>
        <img src="/src/assets/flower-product.png" alt="" />
        <p class="text-xl text-font-secondary text-left">
          鲜花：情感传递的使者
          鲜花，是无需言语却能传达深厚情感的使者。在情人节，红玫瑰热烈地诉说着恋人之间的爱意。还记得那个情人节，他手捧一束娇艳欲滴的红玫瑰，在街角静静等待，当我出现的那一刻，他眼中的爱意与手中玫瑰的艳丽相互交融，那一刻，无需任何言语，爱情的炽热在心底蔓延。母亲节时，一束康乃馨饱含着对母亲的感恩与敬爱。母亲接过花的瞬间，眼中闪烁着感动的泪花，康乃馨的芬芳仿佛化作了对母亲辛勤付出的无声敬意。而在朋友生日时，色彩缤纷的雏菊则传递着纯真的友谊和美好的祝福。曾经，在朋友生日派对上，我送上一束雏菊，朋友脸上绽放出的惊喜笑容，至今仍印在我的脑海中，那一束雏菊，成为了我们友谊长存的见证。
        </p>
        <p class="text-xl text-font-secondary text-left">
          鲜花：心灵的治愈良方
          在忙碌和压力如影随形的现代生活中，鲜花成为了治愈心灵的良方。当你结束了一天的疲惫工作，回到家中，静静观赏那些娇艳欲滴的花朵，嗅着淡淡的花香，内心的焦虑和烦躁仿佛被慢慢抚平。插花艺术更是一种绝佳的减压方式。在一个静谧的周末午后，准备好花枝、剪刀和花瓶，从修剪花枝开始，仔细斟酌每一枝花的长度，再将不同种类、色彩的花朵进行搭配，精心布置在花瓶中。在这个过程中，你能忘却外界的纷扰，专注于当下的美好，看着原本零散的花枝在自己手中逐渐变成一件美丽的花艺作品，那种成就感和内心的宁静，是难以言喻的。
          [插入一张一个人在安静插花的图片]
          鲜花，以其独特的魅力，点亮了我们生活的每一处角落。它们不仅仅是美丽的植物，更是情感的寄托、生活的点缀和心灵的慰藉。让我们在忙碌的生活中，别忘了停下脚步，为自己和身边的人挑选一束鲜花，让这一抹绚丽的色彩，永远绽放在我们的生活里。
        </p>
      </div>
    </div>
    <!-- 切换 -->
    <div class="flex justify-between my-10 mb-20">
      <!-- 上一篇 -->
      <div class="flex text-left">
        <div class="w-36 h-36 bg-amber-100"></div>
        <div class="mx-2 flex flex-col justify-center">
          <p class="text-xl text-[#545656] cursor-pointer">上一篇</p>
          <h4 class="text-black">爱是一种幸福，鲜花只是她的信</h4>
        </div>
      </div>
      <!-- 下一篇 -->
      <div class="flex text-right">
        <div class="mx-2 flex flex-col justify-center">
          <p class="text-xl text-[#545656] cursor-pointer">下一篇</p>
          <h4 class="text-black">爱是一种幸福，鲜花只是她的信</h4>
        </div>
        <div class="w-36 h-36 bg-amber-100"></div>
      </div>
    </div>
    <!-- 评论区 -->
    <Comments />
  </div>
</template>
<script>
export default {
  name: 'Article',
};
</script>
<script setup>
import { MessageCircleMore } from 'lucide-vue-next';
import Comments from '/src/components/comments/comments.vue';
</script>
