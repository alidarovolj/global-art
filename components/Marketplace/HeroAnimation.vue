<script setup>
import anime from "animejs";

const pending = ref(true);
let bgPositionCenter = 0;
const bgPosition = ref(null);
const widthSet = ref(0);
const svgImage = ref(null);

const currentTheme = ref(null);

const handleScroll = () => {
  const scrollY = window.scrollY + window.innerHeight / 2;
  widthSet.value = scrollY;

  if (scrollY < 1800) {
    widthSet.value = scrollY / 2;
  } else {
    widthSet.value = 1800 / 2;
  }

  if (scrollY >= bgPositionCenter) {
    changeBg(bgPosition.value, `rgba(0, 0, 0, 1)`);
    invertFrame(1);
  } else {
    changeBg(bgPosition.value, `rgba(255, 255, 255, 1)`);
    invertFrame(0);
  }
};

const changeBg = (target, color) => {
  anime({
    targets: bgPosition.value,
    backgroundColor: color,
    endDelay: 1500,
    direction: "alternate",
  });
};

const invertFrame = (val) => {
  anime({
    targets: svgImage.value,
    filter: `invert(${val})`,
  });
};

const dynamicStyle = computed(() => ({
  width: `calc(100% - ${widthSet.value / 5}px)`,
}));

onMounted(() => {
  const bgPositionHeight = bgPosition.value.offsetHeight;
  bgPositionCenter = bgPosition.value.offsetTop + bgPositionHeight / 2;
  window.addEventListener("scroll", handleScroll);
  currentTheme.value = document.documentElement.getAttribute("class");
  pending.value = false;
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <div>
    <div ref="bgPosition" class="relative pt-10">
      <div class="mb-28 text-center sticky top-1/4 z-10 px-4 md:px-0">
        <img
            id="svgImage"
            ref="svgImage"
            :style="dynamicStyle"
            alt=""
            class="mx-auto"
            src="@/assets/img/landing/ga.svg"
        />
        <p class="text-lg md:text-3xl font-semibold text-black">
          {{ $t("landing.heroAnimation.title.main") }}
          <span class="italic">{{
              $t("landing.heroAnimation.title.span")
            }}</span>
          {{ $t("landing.heroAnimation.title.text") }}
        </p>
        <p class="text-lg md:text-3xl font-semibold text-white">
          {{ $t("landing.heroAnimation.description") }}
        </p>
      </div>
      <div
          class="flex justify-between items-center relative z-20 pt-20 gap-2 md:gap-6 pb-[500px]"
      >
        <div class="flex flex-col gap-6 w-1/6">
          <img
              alt=""
              class="w-full h-auto rounded-2xl"
              src="@/assets/img/landing/photos/1.jpg"
          />
          <img
              alt=""
              class="w-full h-auto rounded-2xl"
              src="@/assets/img/landing/photos/2.jpg"
          />
          <img
              alt=""
              class="w-full h-auto rounded-2xl"
              src="@/assets/img/landing/photos/3.jpg"
          />
          <img
              alt=""
              class="w-full h-auto rounded-2xl"
              src="@/assets/img/landing/photos/4.jpg"
          />
        </div>
        <div class="flex flex-col gap-6 w-1/6">
          <img
              alt=""
              class="w-full h-auto rounded-2xl"
              src="@/assets/img/landing/photos/5.jpg"
          />
          <img
              alt=""
              class="w-full h-auto rounded-2xl"
              src="@/assets/img/landing/photos/6.jpg"
          />
          <img
              alt=""
              class="w-full h-auto rounded-2xl"
              src="@/assets/img/landing/photos/7.jpg"
          />
          <img
              alt=""
              class="w-full h-auto rounded-2xl"
              src="@/assets/img/landing/photos/8.jpg"
          />
        </div>
        <div class="flex flex-col gap-6 w-1/6">
          <video
              autoplay
              class="w-full h-[200px] object-cover rounded-2xl"
              loop
              muted
              playsinline
          >
            <source src="@/assets/img/landing/photos/19.mp4" type="video/mp4"/>
            {{ $t("landing.heroAnimation.video") }}
          </video>
          <img
              alt=""
              class="w-full h-auto rounded-2xl"
              src="@/assets/img/landing/photos/20.jpg"
          />
          <img
              alt=""
              class="w-full h-auto rounded-2xl"
              src="@/assets/img/landing/photos/10.jpg"
          />
          <img
              alt=""
              class="w-full h-auto rounded-2xl"
              src="@/assets/img/landing/photos/11.jpg"
          />
        </div>
        <div class="flex flex-col gap-6 w-1/6">
          <img
              alt=""
              class="w-full h-auto rounded-2xl"
              src="@/assets/img/landing/photos/12.jpg"
          />
          <img
              alt=""
              class="w-full h-auto rounded-2xl"
              src="@/assets/img/landing/photos/13.jpg"
          />
          <img
              alt=""
              class="w-full h-auto rounded-2xl"
              src="@/assets/img/landing/photos/14.jpg"
          />
          <img
              alt=""
              class="w-full h-auto rounded-2xl"
              src="@/assets/img/landing/photos/15.jpg"
          />
        </div>
        <div class="flex flex-col gap-6 w-1/6">
          <img
              alt=""
              class="w-full h-auto rounded-2xl"
              src="@/assets/img/landing/photos/16.jpg"
          />
          <img
              alt=""
              class="w-full h-auto rounded-2xl"
              src="@/assets/img/landing/photos/17.jpg"
          />
          <img
              alt=""
              class="w-full h-auto rounded-2xl"
              src="@/assets/img/landing/photos/18.jpg"
          />
        </div>
        <div class="flex flex-col gap-6 w-1/6">
          <img
              alt=""
              class="w-full h-auto rounded-2xl"
              src="@/assets/img/landing/photos/19.jpg"
          />
          <img
              alt=""
              class="w-full h-auto rounded-2xl"
              src="@/assets/img/landing/photos/20.jpg"
          />
          <video
              autoplay
              class="w-full h-[200px] object-cover rounded-2xl"
              loop
              muted
              playsinline
          >
            <source src="@/assets/img/landing/photos/16.mp4" type="video/mp4"/>
            {{ $t("landing.heroAnimation.video") }}
          </video>
          <img
              alt=""
              class="w-full h-auto rounded-2xl"
              src="@/assets/img/landing/photos/21.jpg"
          />
        </div>
      </div>
    </div>
  </div>
</template>
