<script setup>
import img1 from "@/assets/img/landing/scroll/1.jpg";
import img2 from "@/assets/img/landing/scroll/2.jpg";
import img3 from "@/assets/img/landing/scroll/3.jpg";
import img4 from "@/assets/img/landing/scroll/4.jpg";
import img5 from "@/assets/img/landing/scroll/5.jpg";

const images = ref([img1, img2, img3, img4, img5]);

const settings = computed(() => {
  return {
    0: {itemsToShow: 1, snapAlign: "start"},
    700: {itemsToShow: 5, snapAlign: "start"},
  };
});
</script>

<template>
  <div class="mb-20">
    <div class="text-center ">
      <h2 class="text-2xl md:text-7xl font-semibold mb-6">
        {{ $t("landing.infiniteScroll.title.main") }} <br/><span
          class="italic"
      >{{ $t("landing.infiniteScroll.title.span") }}</span
      >
      </h2>
      <p class="text-lg md:text-3xl font-semibold mb-10">
        {{ $t("landing.infiniteScroll.description") }}
      </p>
    </div>
    <client-only>
      <my-carousel-carousel
          ref="hero_carousel"
          :autoplay="500"
          :breakpoints="settings"
          :loop="true"
          :mouse-drag="false"
          :wrap-around="true"
          class="flex flex-col justify-between h-max relative"
      >
        <my-carousel-slide
            v-for="(item, index) of images"
            :key="index"
            class="flex items-center justify-center h-full px-3"
        >
          <img :src="item" alt="" class="w-full"/>
        </my-carousel-slide>
      </my-carousel-carousel>
    </client-only>
  </div>
</template>

