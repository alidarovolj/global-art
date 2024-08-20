<script setup>
import anime from "animejs";
import {onMounted, ref} from "vue";
import img1 from "@/assets/img/landing/ar/1.jpg";
import img2 from "@/assets/img/landing/ar/2.jpeg";
import img3 from "@/assets/img/landing/ar/3.jpeg";
import img4 from "@/assets/img/landing/ar/4.jpg";

const animatedElements = ref([]);
const images = ref([img1, img2, img3, img4]);

const settings = {
  itemsToShow: 1,
  snapAlign: "center",
};

const backgroundAnimation = (el) => {
  anime({
    targets: el,
    duration: 3000,
    easing: "easeOutQuad",
    complete: () => el.classList.add("animation-done"),
  });
};

const headerAnimation = (el) => {
  anime({
    targets: el,
    opacity: [0, 1],
    translateY: [0, -60],
    duration: 500,
    easing: "easeOutQuad",
    delay: 500,
    complete: () => el.classList.add("animation-done"),
  });
};

const textAnimation = (el) => {
  anime({
    targets: el,
    opacity: [0, 1],
    translateY: [0, -60],
    duration: 500,
    easing: "easeOutQuad",
    delay: 1000,
    complete: () => el.classList.add("animation-done"),
  });
};

const iPhoneAnimation = (el) => {
  anime({
    targets: el,
    opacity: [0, 1],
    translateY: [0, -30],
    duration: 500,
    easing: "easeOutQuad",
    delay: 1500,
    complete: () => el.classList.add("animation-done"),
  });
};

const slideAnimation = (el) => {
  anime({
    targets: el,
    translateX: [
      {value: 80, duration: 0},
      {value: 40, duration: 1000},
      {value: -202, duration: 2000},
      {value: -428, duration: 3000},
      {value: -660, duration: 4000},
    ],
    easing: "linear",
    loop: false,
    complete: () => el.classList.add("animation-done"),
  });
};

const isElementInViewport = (el) => {
  const rect = el.getBoundingClientRect();
  return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.left <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

const handleScroll = () => {
  animatedElements.value.forEach((el) => {
    if (isElementInViewport(el) && !el.classList.contains("animation-done")) {
      if (el.classList.contains("animated-background")) {
        backgroundAnimation(el);
      } else if (el.classList.contains("animated-header")) {
        headerAnimation(el);
      } else if (el.classList.contains("animated-text")) {
        textAnimation(el);
      } else if (el.classList.contains("animated-iPhone")) {
        iPhoneAnimation(el);
      } else if (el.classList.contains("animated-slide")) {
        slideAnimation(el);
      }
    }
  });
};

onMounted(() => {
  // Собираем все элементы, которые нужно анимировать
  animatedElements.value = document.querySelectorAll(
      ".animated-background, .animated-header, .animated-text, .animated-iPhone, .animated-slide",
  );

  window.addEventListener("scroll", handleScroll);
});
</script>

<template>
  <div class="relative mb-[50px] md:mb-[200px]">
    <img
        alt="picture"
        class="animated-background mx-auto md:w-full object-cover h-[791px] md:h-full"
        src="@/assets/img/landing/ar/background-pic.jpg"
    />
    <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center md:items-start flex-col md:flex-row gap-10 md:gap-20 w-full animated-background"
    >
      <div class="mt-10">
        <h1
            ref="animatedHeader"
            class="text-4xl text-center md:text-7xl animated-header"
        >
          {{ $t("landing.ar.title") }}
        </h1>
        <p class="text-base w-full md:text-2xl mt-6 animated-text">
          {{ $t("landing.ar.description") }}
        </p>
      </div>
      <div
          class="w-[161px] h-[325px] md:w-[321px] md:h-[649px] bg-cover mt-0 p-8 pt-20 animated-iPhone bg-[url('@/assets/img/landing/ar/iPhone.png')]"
      >
        <client-only>
          <my-carousel-carousel
              ref="hero_carousel"
              :autoplay="6000"
              :items-to-show="settings.itemsToShow"
              :loop="true"
              :mouse-drag="false"
              :wrap-around="true"
              class="flex flex-col justify-between h-[672px] max-h-[672px] relative"
          >
            <my-carousel-slide
                v-for="(item, index) of images"
                :key="index"
                class="flex items-center justify-center h-full"
            >
              <img
                  :src="item"
                  alt=""
                  class="w-[92px] h-[128px] md:w-[202px] md:h-[271px] object-cover"
              />
            </my-carousel-slide>
          </my-carousel-carousel>
        </client-only>
      </div>
    </div>
  </div>
</template>

