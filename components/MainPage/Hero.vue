<script setup>
import {ChevronLeftIcon, ChevronRightIcon} from "@heroicons/vue/24/outline";
import bg from "@/assets/img/hero/bg.jpg";
import bg1 from "@/assets/img/hero/bg1.jpg";

const localePath = useLocalePath();
const router = useRouter()

const {t} = useI18n();
const hero_carousel = ref(null);
const auth = useAuthStore();
const modals = useModalsStore();
const settings = {
  itemsToShow: 1,
  snapAlign: "center",
};

const artists = useArtistsStore();

const result = ref([
  {
    id: "1",
    img: bg1,
    title: `<h1>${t("mainPage.hero.slide.first.title.order")}</h1>`,
    content: t("mainPage.hero.slide.first.content"),
    button: {
      text: t("mainPage.hero.slide.buttons.browse"),
      link: localePath("/artworks"),
    },
    secButton: {
      text: t("mainPage.hero.slide.buttons.explore"),
      link: localePath("/artists"),
    },
  },
  {
    id: "1",
    img: bg,
    title: `<h1><span class='font-bold'>${t("mainPage.hero.slide.second.title.buy")}</span><br> <span class='italic'>${t("mainPage.hero.slide.second.title.reallyMade")}</span></h1>`,
    content: t("mainPage.hero.slide.second.content"),
    button: {
      text: t("mainPage.hero.slide.buttons.order"),
      link: localePath("/commission"),
    },
  },
]);

const logOrNo = (index) => {
  if (index === 1) {
    if (auth.token) {
      router.push(localePath(result.value[index].button.link));
    } else {
      modals.showModal('LoginModal')
    }
  }
};
</script>

<template>
  <div class="mb-20">
    <div v-if="artists.artistList" class="hero_carousel">
      <ClientOnly>
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
              v-for="(slide, index) in result"
              :key="index"
              class="flex items-center justify-center h-full"
          >
            <img
                :src="slide.img"
                alt=""
                class="w-full h-full absolute left-0 top-0 object-cover object-center"
                height="672"
                width="1000"
            />
            <div
                :class="{ 'mx-auto md:w-full -mt-60 font-semibold' : index === 0 }"
                class="relative z-10 w-full md:w-[50%] flex flex-col justify-center"
            >
              <div class="flex flex-col justify-center w-full text-center">
                <p
                    class="text-4xl md:text-7xl text-black mb-4 w-[80%] mx-auto "
                    v-html="slide.title"
                />
                <p
                    v-if="index !== 0"
                    class="text-black w-1/2 mx-auto mb-6"
                >
                  {{ slide.content }}
                </p>
                <div class="flex gap-4 justify-center">
                  <NuxtLink
                      v-if="index === 0"
                      :to="localePath(slide.button.link)"
                      class="w-max block mb-8 font-bold bg-black text-white py-4 px-6 rounded-full"
                  >
                    {{ slide.button.text }}
                  </NuxtLink>
                  <div
                      v-else
                      class="w-max block mb-8 font-bold bg-black text-white py-4 px-6 rounded-full"
                      @click="logOrNo(index)">
                    {{ slide.button.text }}
                  </div>
                  <NuxtLink
                      v-if="slide.secButton"
                      :to="localePath(slide.secButton.link)"
                      class="block mb-8 font-bold bg-white text-black w-max py-4 px-6 rounded-full"
                  >
                    {{ slide.secButton.text }}
                  </NuxtLink>
                </div>
              </div>
            </div>
          </my-carousel-slide>
          <template #addons="{ currentSlide, slidesCount }">
            <div class="flex justify-between items-center">
              <div class="flex items-center justify-between w-full">
                <div
                    v-for="(page, index) of result"
                    :key="index"
                    :class="{
                    '!bg-[#1A1A1A] ': currentSlide === index,
                  }"
                    class="w-full bg-[#CCCCCC] h-[1px] mr-4 cursor-pointer"
                    @click="hero_carousel.slideTo(index)"
                />
              </div>
              <div class="flex flex-row-reverse py-2">
                <button
                    :class="{
                    'text-[#CCCCCC]': currentSlide + 1 === slidesCount,
                  }"
                    class=""
                    @click="hero_carousel.next"
                >
                  <ChevronRightIcon class="w-5 h-5"/>
                </button>
                <p class="whitespace-nowrap ">
                  {{ currentSlide + 1 }}/{{ slidesCount }}
                </p>
                <button
                    :class="{ 'text-[#CCCCCC]': currentSlide + 1 === 1 }"
                    class=""
                    @click="hero_carousel.prev"
                >
                  <ChevronLeftIcon class="w-5 h-5"/>
                </button>
              </div>
            </div>
          </template>
        </my-carousel-carousel>
      </ClientOnly>
    </div>
    <div v-else>
      <div class="skeleton h-[572px] max-h-[572px] w-full mb-3"/>
      <div class="flex justify-between gap-2">
        <div class="skeleton w-1/2 h-2"/>
        <div class="skeleton w-1/2 h-2"/>
        <div class="skeleton w-5 h-2"/>
      </div>
    </div>
  </div>
</template>
