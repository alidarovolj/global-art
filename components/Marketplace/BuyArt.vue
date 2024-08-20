<script lang="ts" setup>
import anime from "animejs/lib/anime.es";

const localePath = useLocalePath();

const firstImg = ref(null);
const secondImg = ref(null);
const thirdImg = ref(null);
const fourthImg = ref(null);
const fifthImg = ref(null);
const sixthImg = ref(null);

let imgPosition = 0;
const setBlocks = ref(false);
const pending = ref(true);

const handleScroll = () => {
  const scrollY = window.scrollY + window.innerHeight / 2;

  if (scrollY >= imgPosition) {
    translateToFrame("#firstImg", 0, 0);
    translateToFrame("#secondImg", 0, 0);
    translateToFrame("#thirdImg", 0, 0);
    translateToFrame("#fourthImg", 0, 0);
    translateToFrame("#fifthImg", 0, 0);
    translateToFrame("#sixthImg", 0, 0);
    setBlocks.value = true;
  } else {
    translateToFrame("#firstImg", -700, -700);
    translateToFrame("#secondImg", -800, -800);
    translateToFrame("#thirdImg", -900, -900);
    translateToFrame("#fourthImg", -1000, -1000);
    translateToFrame("#fifthImg", -1100, -1100);
    translateToFrame("#sixthImg", -1200, -1200);
    setBlocks.value = false;
  }
};

const translateToFrame = (target, x, y) => {
  anime({
    targets: target,
    translateX: x,
    translateY: y,
    endDelay: 100,
    direction: "reverse",
  });
};

onMounted(() => {
  imgPosition = firstImg.value.getBoundingClientRect().top + window.pageYOffset;
  window.addEventListener("scroll", handleScroll);
  pending.value = false;
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <div>
    <div class="container mx-auto px-4 md:px-0 py-[100px] md:py-[200px] !pb-0">
      <div class="block md:flex items-center gap-10 mb-5 md:mb-0">
        <div class="relative w-full md:w-2/5">
          <p
              :class="{ 'opacity-100': setBlocks }"
              class="absolute left-10 top-1/4 z-30 bg-white bg-opacity-80 rounded-3xl py-2 px-4 text-black opacity-0 transition-all"
              style="backdrop-filter: blur(2px)"
          >
            {{ $t("landing.buyArt.tags.contemporary") }}
          </p>
          <p
              :class="{ 'opacity-100': setBlocks }"
              class="absolute right-5 top-1/2 z-30 bg-white bg-opacity-80 rounded-3xl py-2 px-4 text-black opacity-0 transition-all"
              style="backdrop-filter: blur(2px)"
          >
            {{ $t("landing.buyArt.tags.abstract") }}
          </p>
          <p
              :class="{ 'opacity-100': setBlocks }"
              class="absolute left-5 bottom-1/4 z-30 bg-white bg-opacity-80 rounded-3xl py-2 px-4 text-black opacity-0 transition-all"
              style="backdrop-filter: blur(2px)"
          >
            {{ $t("landing.buyArt.tags.modern") }}
          </p>
          <div
              :class="{ 'opacity-100': setBlocks }"
              class="absolute right-5 bottom-5 z-30 bg-white bg-opacity-80 rounded-3xl py-2 px-4 text-black opacity-0 transition-all"
              style="backdrop-filter: blur(2px)"
          >
            <div class="flex items-center gap-2">
              <p>{{ $t("landing.buyArt.tags.colors") }}:</p>
              <div class="bg-[#B13F06] w-8 h-8 rounded-full"/>
              <div class="bg-[#FF8849] w-8 h-8 rounded-full"/>
              <div class="bg-[#DEA901] w-8 h-8 rounded-full"/>
              <div class="bg-[#1D450D] w-8 h-8 rounded-full"/>
            </div>
          </div>
          <img
              alt=""
              class="w-full h-auto shadow-2xl"
              src="@/assets/img/landing/second/frame.png"
          />
          <img
              id="firstImg"
              ref="firstImg"
              alt=""
              class="absolute left-0 top-0 w-full h-full object-cover p-4"
              src="@/assets/img/landing/second/1.jpg"
          />
          <img
              id="secondImg"
              ref="secondImg"
              alt=""
              class="absolute left-0 top-0 w-full h-full object-cover p-4"
              src="@/assets/img/landing/second/2.jpg"
          />
          <img
              id="thirdImg"
              ref="thirdImg"
              alt=""
              class="absolute left-0 top-0 w-full h-full object-cover p-4"
              src="@/assets/img/landing/second/3.jpg"
          />
          <img
              id="fourthImg"
              ref="fourthImg"
              alt=""
              class="absolute left-0 top-0 w-full h-full object-cover p-4"
              src="@/assets/img/landing/second/4.jpg"
          />
          <img
              id="fifthImg"
              ref="fifthImg"
              alt=""
              class="absolute left-0 top-0 w-full h-full object-cover p-4"
              src="@/assets/img/landing/second/5.jpg"
          />
          <img
              id="sixthImg"
              ref="sixthImg"
              alt=""
              class="absolute left-0 top-0 w-full h-full object-cover p-4"
              src="@/assets/img/landing/second/6.jpg"
          />
        </div>
        <div class="w-full md:w-3/5 mt-5 md:mt-0 ">
          <p class="text-2xl md:text-7xl font-semibold mb-6">
            {{ $t("landing.buyArt.title.main") }} <br/><span class="italic">{{
              $t("landing.buyArt.title.span")
            }}</span>
          </p>
          <p class="text-lg md:text-2xl font-semibold mb-10">
            {{ $t("landing.buyArt.description") }}
          </p>
          <Base-button class="py-3 px-6 w-max" to="/artists">
            {{ $t("landing.buyArt.link") }}
          </Base-button>
        </div>
      </div>
    </div>
  </div>
</template>
