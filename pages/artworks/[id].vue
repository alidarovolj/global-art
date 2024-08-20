<script setup>
import {useArtworksStore} from "~/store/artworks.js";
import {useAuthStore} from "~/store/auth.js";
import {storeToRefs} from "pinia";
import {convertCmToInch} from "~/utils/convertCmToInch.js";
import {
  ArrowLongRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HeartIcon,
  MapPinIcon,
  ShoppingBagIcon
} from '@heroicons/vue/24/outline'
import ArtworkDetailPreloader from "~/components/Artworks/ArtworkDetail/ArtworkDetailPreloader.vue";
import {useArtistsStore} from "~/store/artists.js";
import {useLanguagesStore} from "~/store/languages.js";
import {getTranslate} from "~/utils/getTranslate.js";

const translatedBaseInfo = computed(() =>
    getTranslate(result.value.data.translations, cur_lang.value),
);

const modals = useModalsStore();

const localePath = useLocalePath();

const route = useRoute();
const {t} = useI18n();

const isLoading = ref(false);
const loading = ref(false);
const subscribeLoading = ref(false);

const languages = useLanguagesStore();
const {cur_lang} = storeToRefs(languages);

const auth = useAuthStore();
auth.initCookieToken();
const {token} = storeToRefs(auth);

const user = useUserStore();

const runtimeConfig = useRuntimeConfig();

const artist = useArtistsStore();
artist.result = null;

const artworksStore = useArtworksStore();
const {result} = storeToRefs(artworksStore);
artworksStore.result = null;

const cart = useCartStore();

const favourites = useFavouritesStore();

const myCarousel = ref(null);

const artworkMainCarousel = ref(null);
const artworkArtistCarousel = ref(null);
const isProductAdded = ref(false);

const breadcrumbs = ref([
  {
    title: t("artworkDetail.breadCrumbs.mainPage"),
    link: "/",
  },
  {
    title: t("artworkDetail.breadCrumbs.artworks"),
    link: "/artworks",
  },
]);

const settings = {
  itemsToShow: 1,
  snapAlign: "center",
};

const form = ref({
  basket_item_art_item_id: null,
  basket_item_quantity: 1,
});

const addToFavouritesLocal = async (id) => {
  isLoading.value = true;
  if (!token.value) {
    modals.showModal('LoginModal')
    isLoading.value = false;
    return;
  }
  await favourites.addToFavourites(id);
  await artworksStore.getArtwork(route.params.id);
  await user.getProfile();
  isLoading.value = false;
};

const addToCartLocal = async () => {
  loading.value = true;
  if (!token.value) {
    modals.showModal('LoginModal')
    loading.value = false;
    return;
  }
  form.value.basket_item_art_item_id = result.value.data.id;
  if (result.value.data.is_in_basket) {
    form.value.basket_item_quantity = 0;
  } else {
    form.value.basket_item_quantity = 1;
  }
  await cart.addOrRemoveItem(form.value);
  await artworksStore.getArtwork(route.params.id);
  if (cart.resultItem !== false) {
    await user.getProfile();
  }
  loading.value = false;
};

const toggleSubscribe = async (artist_id) => {
  subscribeLoading.value = true;
  if (!token.value) {
    modals.showModal('LoginModal')
    subscribeLoading.value = false;
    return;
  }
  await artist.addExcludeArtistSubscription(artist_id);
  await artworksStore.getArtwork(route.params.id);
  subscribeLoading.value = false;
};

const artworkTitle = computed(() =>
    result.value ? translatedBaseInfo.value.art_item_title : "Loading...",
);

const breakpoints = computed(() => {
  const itemsToShow = Math.min(4, result.value?.artist?.works?.length || 0);
  return {
    700: {itemsToShow, snapAlign: "start"},
    1024: {itemsToShow, snapAlign: "start"},
  };
});

useHead({
  title: computed(() => `${artworkTitle.value} | Global Art AI`),
  meta: [
    {
      property: "description",
      content: t("headers.artworks.description"),
    },
    {
      property: "og:description",
      content: t("headers.artworks.description"),
    },
    {
      property: "og:title",
      content: computed(() => `${artworkTitle.value} | Global Art AI`),
    },
    {
      property: "og:url",
      content: route.fullPath,
    },
  ],
  link: [{rel: "canonical", href: t("headers.artworks.canonical")}],
});

onMounted(async () => {
  await nextTick();
  await artworksStore.getArtwork(route.params.id);
  breadcrumbs.value.push({
    title: translatedBaseInfo.value.art_item_title,
    link: `/artworks/${route.params.id}`,
  });
});

watch(
    () => user.result,
    async () => {
      await artworksStore.getArtwork(route.params.id);
    },
);
</script>

<template>
  <section v-if="result" class="container mx-auto px-4 md:px-0 relative">
    <Breadcrumbs :links="breadcrumbs" class="mb-3"/>
    <div class="block md:flex gap-[80px] mb-10 md:mb-[122px]">
      <div class="w-full mb-10 md:mb-0 md:w-[59%]">
        <div class="block md:hidden mb-10">
          <div class="flex items-start justify-between mb-4">
            <h2
                class="text-2xl md:text-3xl font-bold  "
            >
              {{ translatedBaseInfo.art_item_title }}
            </h2>
            <div
                v-if="!isLoading"
                :class="{
                '!bg-red-500 text-white border-none':
                  result.data.is_in_wish_list,
              }"
                class="border rounded-full p-3 w-max   "
                @click="addToFavouritesLocal(result.data.id)"
            >
              <HeartIcon class="h-5 w-5"/>
            </div>
            <div
                v-else
                class="border rounded-full p-3 w-max cursor-pointer transition-all hover:bg-[#E8E8E8] hover:text-black   "
            >
              <div class="w-4 h-4 spinner"/>
            </div>
          </div>
          <div class="mb-10 ">
            <div class="flex flex-col gap-2">
              <div class="flex">
                <p class="mr-4 font-bold  w-1/2 md:w-1/3">
                  {{ $t("artworks.medium") }}:
                </p>
                <p class="text-secondaryText">
                  {{
                    result.data.art_item_category.translations[cur_lang]
                        .art_category_title
                  }}
                </p>
              </div>
              <div class="flex">
                <p class="mr-4 font-bold w-1/2 md:w-1/3">
                  {{ $t("artworks.movement") }}:
                </p>
                <div class="flex flex-wrap">
                  <p
                      v-for="(item, index) of result.data.art_item_styles"
                      :key="index"
                      class="text-secondaryText capitalize"
                  >
                    {{
                      item.translations[cur_lang].title
                    }}<span v-if="result.data.art_item_styles.length !== index + 1"
                  >, &nbsp;</span
                  >
                  </p>
                </div>
              </div>
              <div class="flex items-center">
                <p class="mr-4 font-bold w-1/2 md:w-1/3">
                  {{ $t("artworks.size") }}:
                </p>

                <div class="flex">
                  <p class="text-secondaryText ">
                    {{ convertCmToInch(result.data.art_item_params.size.width) }}
                    x
                    {{ convertCmToInch(result.data.art_item_params.size.height) }}
                    x
                    {{ convertCmToInch(result.data.art_item_params.size.length) }}
                    {{ $t("artworks.inch") }}
                  </p>
                  <p class="text-secondaryText mx-2">|</p>
                  <p class="text-secondaryText ">
                    {{ result.data.art_item_params.size.width }}
                    x
                    {{ result.data.art_item_params.size.height }}
                    x
                    {{ result.data.art_item_params.size.length }}
                    {{ $t("artworks.cm") }}
                  </p>
                </div>
              </div>
              <div class="flex">
                <p class="mr-4 font-bold w-1/2 md:w-1/3">
                  {{ $t("categories.artworksFilter.materials") }}:
                </p>
                <div class="flex flex-wrap">
                  <p
                      v-for="(item, index) of result.data.art_item_materials"
                      :key="index"
                      class="text-secondaryText capitalize"
                  >
                    {{
                      item.translations[cur_lang].title
                    }}<span v-if="result.data.art_item_materials.length !== index + 1"
                  >, &nbsp;</span
                  >
                  </p>
                </div>
              </div>
              <div class="flex">
                <p class="mr-4 font-bold w-1/2 md:w-1/3">
                  {{ $t("artworks.year") }} :
                </p>
                <div class="flex flex-wrap">
                  <p class="text-secondaryText">
                    {{ result.data.art_item_params.year }}
                  </p>
                </div>
              </div>
              <div class="flex">
                <p class="mr-4 font-bold w-1/2 md:w-1/3">
                  {{ $t("artworks.location") }}:
                </p>
                <div class="flex flex-wrap">
                  <p class="text-secondaryText">
                    {{
                      result.data.art_item_artist.artist_base_info.translations[
                          cur_lang
                          ].city
                    }},
                    {{
                      result.data.art_item_artist.artist_base_info.translations[
                          cur_lang
                          ].state
                    }},
                    {{
                      result.data.art_item_artist.artist_base_info.translations[
                          cur_lang
                          ].country
                    }}
                  </p>
                </div>
              </div>
              <div class="flex">
                <p class="mr-4 font-bold w-1/2 md:w-1/3">
                  {{ $t("artworks.rare") }}:
                </p>
                <div class="flex flex-wrap">
                  <p class="text-secondaryText capitalize">

                    {{
                      result.data.art_item_params.rarity.translations[cur_lang]
                          .title
                    }}
                  </p>
                </div>
              </div>
              <div class="flex">
                <p class="mr-4 font-bold w-1/2 md:w-1/3">
                  {{ $t("artworks.signature") }}:
                </p>
                <div class="flex flex-wrap">
                  <p
                      v-if="result.data.art_item_params.signature"
                      class="text-secondaryText capitalize"
                  >
                    {{
                      result.data.art_item_params.signature.translations[cur_lang]
                          .title
                    }}
                  </p>
                </div>
              </div>
              <div class="flex">
                <p class="mr-4 font-bold w-1/2 md:w-1/3">
                  {{ $t("artworks.certificate") }}:
                </p>
                <div class="flex flex-wrap">
                  <p class="text-secondaryText capitalize">
                    {{
                      result.data.art_item_params.auth_cert.translations[cur_lang]
                          .title
                    }}
                  </p>
                </div>
              </div>
              <div class="flex">
                <p class="mr-4 font-bold w-1/2 md:w-1/3">
                  {{ $t("artworks.rights") }}:
                </p>
                <div class="flex flex-wrap">
                  <p class="text-secondaryText capitalize">
                    {{ result.data.art_item_params.rights }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <hr class="transition-all"/>
        </div>
        <div class="mb-10 md:mb-[112px]">
          <div
              class="relative flex flex-col items-center justify-center mb-4 artwork__main-carousel"
          >
            <my-carousel-carousel
                ref="artworkMainCarousel"
                :items-to-show="settings.itemsToShow"
                :mouse-drag="false"
                :touch-drag="true"
                class="flex flex-col h-[550px] md:h-[700px]"
            >
              <my-carousel-slide
                  v-for="(painting, index) of result.data.art_item_images"
                  :key="index"
                  class="bg-cardBg  py-[50px]"
              >
                <img
                    :src="runtimeConfig.public.ENDPOINTS_LINK + painting.full"
                    alt="Main picture of the artwork"
                    class="bg-black w-auto h-full select-none z-10"
                />
              </my-carousel-slide>
              <template #addons="{ currentSlide, slidesCount }">
                <button
                    class="hidden md:block cursor-pointer !z-[1000] absolute left-6 top-1/3 hover:bg-gray-500 text-white hover:rounded-full "
                    @click="artworkMainCarousel.prev"
                >
                  <ChevronLeftIcon
                      :class="{ 'opacity-30': currentSlide === 0 }"
                      :stroke-width="1"
                      class="h-7 w-7 text-black  hover:text-white transition-none"
                  />
                </button>
                <button
                    class="hidden md:block cursor-pointer !z-[1000] absolute right-6 top-1/3 hover:bg-gray-500 text-white hover:rounded-full "
                    @click="artworkMainCarousel.next"
                >
                  <ChevronRightIcon
                      :class="{
                      'opacity-30': currentSlide === slidesCount - 1,
                    }"
                      :stroke-width="1"
                      class="w-7 h-7 text-black  hover:text-white transition-none"
                  />
                </button>
                <div
                    class="flex justify-center gap-4 w-full md:pl-14 overflow-x-auto h-[300px]"
                >
                  <div
                      v-for="(painting, index) of result.data.art_item_images"
                      :key="index"
                      :class="{
                      'border border-bSelected': currentSlide === index,
                    }"
                      class="my-4 p-3 bg-cardBg  cursor-pointer "
                      @click="artworkMainCarousel.slideTo(index)"
                  >
                    <img
                        :src="runtimeConfig.public.ENDPOINTS_LINK + painting.full"
                        alt=""
                        class="max-w-36 max-h-36 min-w-36 min-h-36 object-contain"
                    />
                  </div>
                </div>
              </template>
            </my-carousel-carousel>
          </div>
        </div>
        <div class="block md:hidden mb-10 ">
          <div v-if="result.data" class="mt-10 mb-4">
            <p class="font-bold text-xl ">
              ${{ result.data.art_item_price }}
            </p>
          </div>
          <div v-if="token">
            <button
                v-if="!isProductAdded"
                class="mb-4 bg-primaryText text-white rounded-3xl flex items-center justify-center py-4 px-6 w-full gap-2 "
                @click="addToCartLocal"
            >
              <ShoppingBagIcon class="w-5 h-5"/>
              <span class="font-bold"> {{ $t("artworks.add") }} </span>
            </button>
            <nuxt-link
                v-else
                :to="localePath('/cart')"
                class="mb-4 bg-primaryText text-white rounded-3xl flex items-center justify-center py-4 px-6 w-full gap-2 "
            >
              <span class="font-bold">{{ $t("artworks.viewCart") }}</span>
              <ArrowLongRightIcon class="h-5 w-5"/>
            </nuxt-link>
          </div>
          <div
              v-else
              class="mb-4 bg-primaryText text-white rounded-3xl flex items-center justify-center py-4 px-6 w-full gap-2 "
              @click="modals.showModal('LoginModal')"
          >
            <ShoppingBagIcon class="w-5 h-5"/>
            <span class="font-bold"> {{ $t("artworks.add") }} </span>
          </div>
        </div>
        <ArtworkDescriptionTabs/>
      </div>
      <div class="w-full md:w-[39%]">
        <div class="sticky top-5">
          <div class="hidden md:block">
            <div class="flex items-start justify-between mb-4">
              <h2 class="text-3xl font-bold  ">
                {{ translatedBaseInfo.art_item_title }}
              </h2>
              <div
                  v-if="!isLoading"
                  :class="{
                  '!bg-red-500 text-white border-none':
                    result.data.is_in_wish_list,
                }"
                  class="border rounded-full p-3 w-max cursor-pointer transition-all hover:bg-[#E8E8E8] hover:text-black"
                  @click="addToFavouritesLocal(result.data.id)"
              >
                <HeartIcon class="h-5 w-5"/>
              </div>
              <div
                  v-else
                  class="border rounded-full p-3 w-max cursor-pointer transition-all hover:bg-[#E8E8E8] hover:text-black   "
              >
                <div class="w-4 h-4 spinner"/>
              </div>
            </div>
            <div class="pb-10 border-b ">
              <div class="flex flex-col gap-2">
                <div class="flex">
                  <p class="mr-4 font-bold  w-1/2 md:w-1/3">
                    {{ $t("artworks.medium") }}:
                  </p>
                  <p class="text-secondaryText">
                    {{
                      result.data.art_item_category.translations[cur_lang]
                          .art_category_title
                    }}
                  </p>
                </div>
                <div class="flex">
                  <p class="mr-4 font-bold w-1/2 md:w-1/3">
                    {{ $t("artworks.movement") }}:
                  </p>
                  <div class="flex flex-wrap">
                    <p
                        v-for="(item, index) of result.data.art_item_styles"
                        :key="index"
                        class="text-secondaryText capitalize"
                    >
                      {{
                        item.translations[cur_lang].title
                      }}<span v-if="result.data.art_item_styles.length !== index + 1"
                    >, &nbsp;</span
                    >
                    </p>
                  </div>
                </div>
                <div class="flex">
                  <p class="mr-4 font-bold w-1/2 md:w-1/3">
                    {{ $t("categories.artworksFilter.materials") }}:
                  </p>
                  <div class="flex flex-wrap">
                    <p
                        v-for="(item, index) of result.data.art_item_materials"
                        :key="index"
                        class="text-secondaryText capitalize"
                    >
                      {{
                        item.translations[cur_lang].title
                      }}<span v-if="result.data.art_item_materials.length !== index + 1"
                    >, &nbsp;</span
                    >
                    </p>
                  </div>
                </div>
                <div class="flex items-center">
                  <p class="mr-4 font-bold w-1/2 md:w-1/3">
                    {{ $t("artworks.size") }}:
                  </p>

                  <div class="flex">
                    <p class="text-secondaryText ">
                      {{ convertCmToInch(result.data.art_item_params.size.width) }}
                      x
                      {{ convertCmToInch(result.data.art_item_params.size.height) }}
                      x
                      {{ convertCmToInch(result.data.art_item_params.size.length) }}
                      {{ $t("artworks.inch") }}
                    </p>
                    <p class="text-secondaryText mx-2">|</p>
                    <p class="text-secondaryText ">
                      {{ result.data.art_item_params.size.width }}
                      x
                      {{ result.data.art_item_params.size.height }}
                      x
                      {{ result.data.art_item_params.size.length }}
                      {{ $t("artworks.cm") }}
                    </p>
                  </div>
                </div>
                <div class="flex">
                  <p class="mr-4 font-bold w-1/2 md:w-1/3">
                    {{ $t("artworks.year") }} :
                  </p>
                  <div class="flex flex-wrap">
                    <p class="text-secondaryText">
                      {{ result.data.art_item_params.year }}
                    </p>
                  </div>
                </div>
                <div class="flex">
                  <p class="mr-4 font-bold w-1/2 md:w-1/3">
                    {{ $t("artworks.location") }}:
                  </p>
                  <div class="flex flex-wrap">
                    <p class="text-secondaryText">
                      {{
                        result.data.art_item_artist.artist_base_info.translations[
                            cur_lang
                            ].city
                      }},
                      {{
                        result.data.art_item_artist.artist_base_info.translations[
                            cur_lang
                            ].state
                      }},
                      {{
                        result.data.art_item_artist.artist_base_info.translations[
                            cur_lang
                            ].country
                      }}
                    </p>
                  </div>
                </div>
                <div class="flex">
                  <p class="mr-4 font-bold w-1/2 md:w-1/3">
                    {{ $t("artworks.rare") }}:
                  </p>
                  <div class="flex flex-wrap">
                    <p class="text-secondaryText capitalize">

                      {{
                        result.data.art_item_params.rarity.translations[cur_lang]
                            .title
                      }}
                    </p>
                  </div>
                </div>
                <div class="flex">
                  <p class="mr-4 font-bold w-1/2 md:w-1/3">
                    {{ $t("artworks.signature") }}:
                  </p>
                  <div class="flex flex-wrap">
                    <p
                        v-if="result.data.art_item_params.signature"
                        class="text-secondaryText capitalize"
                    >
                      {{
                        result.data.art_item_params.signature.translations[cur_lang]
                            .title
                      }}
                    </p>
                  </div>
                </div>
                <div class="flex">
                  <p class="mr-4 font-bold w-1/2 md:w-1/3">
                    {{ $t("artworks.certificate") }}:
                  </p>
                  <div class="flex flex-wrap">
                    <p class="text-secondaryText capitalize">
                      {{
                        result.data.art_item_params.auth_cert.translations[cur_lang]
                            .title
                      }}
                    </p>
                  </div>
                </div>
                <div class="flex">
                  <p class="mr-4 font-bold w-1/2 md:w-1/3">
                    {{ $t("artworks.rights") }}:
                  </p>
                  <div class="flex flex-wrap">
                    <p class="text-secondaryText capitalize">
                      {{ result.data.art_item_params.rights }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="hidden md:block">
            <div v-if="result.data" class="mt-10 mb-4">
              <p class="font-bold text-xl ">
                ${{ result.data.art_item_price }}
              </p>
            </div>
            <div v-if="token">
              <div v-if="!loading">
                <button
                    v-if="!result.data.is_in_basket"
                    class="mb-4 bg-green-500 text-white    rounded-3xl flex items-center justify-center py-4 px-6 w-full gap-2 transition-all active:bg-primaryText active:text-white"
                    @click="addToCartLocal"
                >
                  <ShoppingBagIcon class="w-5 h-5"/>
                  <span class="font-bold"> {{ $t("artworks.add") }}</span>
                </button>
                <button
                    v-else
                    class="mb-4 bg-red-500 text-white    rounded-3xl flex items-center justify-center py-4 px-6 w-full gap-2 transition-all active:bg-primaryText active:text-white"
                    @click="addToCartLocal"
                >
                  <ShoppingBagIcon class="w-5 h-5"/>
                  <span class="font-bold">{{ $t("artworks.remove") }}</span>
                </button>
              </div>
              <div v-else>
                <button
                    class="mb-4 bg-primaryText    text-white rounded-3xl flex items-center justify-center py-4 px-6 w-full gap-2 transition-all active:bg-primaryText active:text-white"
                >
                  <span class="spinner"/>
                </button>
              </div>
            </div>
            <div
                v-else
                class="mb-4 bg-primaryText text-white rounded-3xl flex items-center justify-center py-4 px-6 w-full gap-2 transition-all active:bg-primaryText active:text-white hover:bg-[#E8E8E8] hover:text-primaryText"
                @click="modals.showModal('LoginModal')"
            >
              <ShoppingBagIcon class="w-5 h-5"/>
              <span class="font-bold">{{ $t("artworks.add") }}</span>
            </div>
          </div>
          <div
              v-if="token"
              class="pb-10  border-b "
          >
            <div class="flex gap-2 mb-2">
              <MapPinIcon class="h-5 w-5"/>
              <p class="text-base">
                {{ $t("artworks.shipping") }}
                {{
                  result.data.art_item_artist.artist_base_info.translations[
                      cur_lang
                      ].state
                }},
                {{
                  result.data.art_item_artist.artist_base_info.translations[
                      cur_lang
                      ].city
                }}
                ({{ result.data.art_item_artist.artist_base_info.zipcode }})
              </p>
            </div>
            <div>
              <p v-if="result.data.delivery_price" class="mb-1">
                <span class="mr-2 text-secondaryText"
                >${{ result.data.delivery_price }}
                  {{ $t("artworks.stan_par") }}</span
                >
              </p>
              <span class="text-secondaryText text-sm">
                {{ $t("artworks.taxes") }}.
              </span>
            </div>
          </div>
          <div class="mt-10 mb-6 ">
            <h2 class="font-bold mb-4">
              {{ $t("artworks.artist") }}
            </h2>
            <div class="flex flex-col sm:flex-row gap-5 items-start">
              <div class="flex gap-5 justify-between">
                <NuxtLink
                    :to="localePath('/artists/' + result.data.art_item_artist_id)"
                    class="flex items-center gap-4 cursor-pointer"
                >
                  <img
                      v-if="result.data.art_item_artist.artist_photo"
                      :src="
                      runtimeConfig.public.ENDPOINTS_LINK +
                      result.data.art_item_artist.artist_photo.thumb
                    "
                      alt=""
                      class="rounded-full w-[64px] h-[64px]"
                  />
                  <div
                      v-else
                      class="w-28 h-28 rounded-full border p-5">
                    <img
                        alt=""
                        class="w-full h-full object-contain"
                        src="@/assets/img/null.png">
                  </div>
                  <div>
                    <h2 class="font-bold text-2xl leading-6 ">
                      {{
                        result.data.art_item_artist.artist_base_info.translations[cur_lang].last_name
                      }}
                      {{
                        result.data.art_item_artist.artist_base_info.translations[cur_lang].first_name
                      }}
                    </h2>
                    <span class="text-sm text-secondaryText">
                      {{
                        result.data.art_item_artist.artist_base_info
                            .translations[cur_lang].city
                      }},
                      {{
                        result.data.art_item_artist.artist_base_info
                            .translations[cur_lang].state
                      }},
                      {{
                        result.data.art_item_artist.artist_base_info
                            .translations[cur_lang].country
                      }}
                    </span>
                  </div>
                </NuxtLink>
              </div>
              <button
                  v-if="!subscribeLoading"
                  class="border w-full sm:w-max border-bColor  bg-[#F5F5F5] py-1 px-4 rounded-3xl text-base text-primaryText transition-all active:bg-white hover:bg-[#E8E8E8]"
                  @click="toggleSubscribe(result.data.art_item_artist.id)"
              >
                {{
                  result.data.art_item_artist.artist_is_subscribed
                      ? $t("artists.unfollow")
                      : $t("artworkDetail.descriptionTabs.follow")
                }}
              </button>
              <div
                  v-else
                  class="border w-full sm:w-max border-bColor bg-[#F5F5F5] py-1 px-4 rounded-3xl text-base text-primaryText transition-all active:bg-white hover:bg-[#E8E8E8]">
                <span class="spinner"></span>
              </div>
            </div>
          </div>
          <div v-if="result.data.art_item_artist.artist_is_available">
            <p class="text-primaryText mb-4 ">
              {{ $t("artworks.want") }}
            </p>
            <NuxtLink
                :to="localePath('/commission?artist_id=' + result.data.art_item_artist.id)"
                class="block text-white text-center w-full md:w-max    text-base py-2 px-4 bg-primaryText rounded-3xl transition-all active:bg-primaryText active:text-white hover:bg-[#E8E8E8] hover:text-primaryText"
            >
              {{ $t("artworks.order") }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
    <div class="mb-20">
      <div
          v-if="result.artist"
          class="block md:flex justify-between items-center mb-10"
      >
        <div class="flex items-center w-full gap-4 mb-4 md:mb-0">
          <div>
            <img
                :src="result.artist.img"
                alt=""
                class="w-20 h-20 rounded-full"
            />
          </div>
          <div class="">
            <p class="font-bold text-2xl mb-6">
              {{ result.data.art_item_artist.artist_base_info.translations[cur_lang].last_name }}
              {{ result.data.art_item_artist.artist_base_info.translations[cur_lang].first_name }}
            </p>
            <button
                class="border border-bColor py-1 px-4 rounded-3xl text-base text-primaryText transition-all active:bg-white hover:bg-[#E8E8E8]"
                @click="toggleSubscribe(result.data.art_item_artist.id)"
            >
              {{
                result.data.art_item_artist.artist_is_subscribed
                    ? $("artists.unfollow")
                    : $t("artworkDetail.descriptionTabs.follow")
              }}
            </button>
          </div>
        </div>
        <div class="w-full flex justify-between md:justify-end">
          <div class="w-full flex justify-between md:justify-end">
            <div class="flex flex-row-reverse">
              <button
                  class="border divide-y divide-gray-500 rounded-full p-2 ml-3"
                  @click="myCarousel.next"
              >
                <ChevronRightIcon class="w-5 h-5"/>
              </button>
              <button
                  class="border divide-y divide-gray-500 rounded-full p-2 mr-3"
                  @click="myCarousel.prev"
              >
                <ChevronLeftIcon class="w-5 h-5"/>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div v-if="breakpoints['700'].itemsToShow" class="carousel_main">
        <ClientOnly>
          <my-carousel-carousel
              ref="artworkArtistCarousel"
              :breakpoints="breakpoints"
              :items-to-show="1"
              :mouse-drag="false"
              :touch-drag="true"
              class="flex"
          >
            <my-carousel-slide
                v-for="slide of result.artist.works"
                :key="slide.id"
            >
              <div
                  class="flex w-full flex-col justify-start pr-4 h-[420px] max-h-[420px] painting"
              >
                <div class="p-9 bg-cardBg">
                  <img
                      :src="slide.img"
                      alt=""
                      class="w-full h-[288px] object-cover"
                  />
                </div>
                <nuxt-link :to="localePath('/artworks/' + slide.id)" class="w-full">
                  <div class="flex flex-col text-start justify-start w-full">
                    <p class="text-base">Test title</p>
                    <p class="font-bold text-base mb-2">$Test price</p>
                  </div>
                </nuxt-link>
              </div>
            </my-carousel-slide>
          </my-carousel-carousel>
        </ClientOnly>
      </div>
    </div>
  </section>
  <ArtworkDetailPreloader v-else/>
</template>

<style scoped>
.transition-max-height {
  transition: max-height 0.3s ease-in-out;
}
</style>
