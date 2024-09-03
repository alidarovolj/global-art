<script setup>
import {HeartIcon} from "@heroicons/vue/24/outline";
import {useFavouritesStore} from "~/store/favourites.js";
import {useArtworksStore} from "~/store/artworks.js";
import {useAuthStore} from "~/store/auth.js";
import {storeToRefs} from "pinia";
import {useLanguagesStore} from "~/store/languages.js";

const runtimeConfig = useRuntimeConfig();
const localePath = useLocalePath();

const language = useLanguagesStore();
const {cur_lang} = storeToRefs(language);

const modals = useModalsStore()

const isLoading = ref(false);

const favourites = useFavouritesStore();
const artworks = useArtworksStore();
const user = useUserStore();

const auth = useAuthStore();
auth.initCookieToken();
const {token} = storeToRefs(auth);

const tile = ref(null);

const requestBody = ref({
  page_number: 1,
  show_by: 10,
  only_ids: [],
  exclude_ids: [],
  search_text: null,
  movement_and_style: [],
  year_from: null,
  year_to: null,
  price_from: null,
  price_to: null,
  artist_ids: [],
  art_item_is_for_sale: null,
  art_item_is_sold: null,
  art_item_is_validated: null,
  rarity: [],
  art_item_material: [],
  art_item_style: [],
});

const addToFavouritesLocal = async (id) => {
  isLoading.value = true;
  if (!token.value) {
    modals.showModal('LoginModal');
    isLoading.value = false;
    return
  }
  await favourites.addToFavourites(id);
  await artworks.getArtworks(requestBody.value);
  await favourites.getFavourites();
  await user.getProfile();
  isLoading.value = false;
};

const data = defineProps([
  "id",
  "title",
  "price",
  "artist",
  "images",
  "is_in_wish_list",
  "artwork_data",
]);

const handleMouseOver = (event) => {
  const img = event.currentTarget.querySelector("img");
  if (img) {
    img.style.transform = `scale(${event.currentTarget.dataset.scale})`;
  }
};

const handleMouseOut = (event) => {
  const img = event.currentTarget.querySelector("img");
  if (img) {
    img.style.transform = "scale(1)";
  }
};

const handleMouseMove = (event) => {
  const img = event.currentTarget.querySelector("img");
  if (img) {
    const x =
        ((event.clientX - event.currentTarget.getBoundingClientRect().left) /
            event.currentTarget.offsetWidth) *
        100;
    const y =
        ((event.clientY - event.currentTarget.getBoundingClientRect().top) /
            event.currentTarget.offsetHeight) *
        100;
    img.style.transformOrigin = `${x}% ${y}%`;
  }
};

onMounted(() => {
  const tileElement = tile.value;
  if (tileElement) {
    // Add text to show zoom level
    const textDiv = document.createElement("div");
    textDiv.className = "txt";
    textDiv.innerHTML = `<div class="x">${tileElement.dataset.scale}x</div>ZOOM ON<br>HOVER</div>`;
    tileElement.appendChild(textDiv);
  }
});
</script>

<template>
  <div
      class="flex flex-col justify-start mr-0 md:mr-4 h-[440px] max-h-[440px] painting w-full relative"
  >
    <div
        v-if="!isLoading"
        :class="{ '!bg-red-500 text-white border-none': is_in_wish_list }"
        class="cursor-pointer absolute right-4 top-4 p-3 bg-white rounded-full z-10 shadow-lg transition-all"
        @click="addToFavouritesLocal(data.id)"
    >
      <HeartIcon class="w-5 h-5"/>
    </div>
    <div
        v-else
        class="cursor-pointer absolute right-4 top-4 p-3 bg-white    rounded-full z-10 shadow-lg"
    >
      <div class="w-4 h-4 spinner"/>
    </div>

    <NuxtLink
        :to="localePath('/artworks/' + data.id)"
        class="bg-gray-100 p-7"
    >
      <div
          ref="tile"
          :data-image="runtimeConfig.public.ENDPOINTS_LINK + images[0].full"
          class="tile w-auto h-[280px] min-h-[280px] mx-auto object-contain relative mb-2"
          data-scale="2.4"
          @mousemove="handleMouseMove"
          @mouseout="handleMouseOut"
          @mouseover="handleMouseOver"
      >
        <img
            :src="runtimeConfig.public.ENDPOINTS_LINK + images[0].full"
            alt="Artwork"
            class="w-full h-full object-contain"
        />
      </div>
    </NuxtLink>
    <nuxt-link
        :to="localePath('/artworks/' + id)"
        class="w-full "
    >
      <div class="flex flex-col text-start justify-start w-full">
        <p v-for="(item, index) of artwork_data.translations" :key="index">
          <span v-if="item.language === cur_lang">
            {{ item.art_item_title }}
          </span>
        </p>
        <p class="font-bold text-base mb-2">${{ price }}</p>
      </div>
    </nuxt-link>
    <div class="">
      <NuxtLink :to="localePath('/artists/' + artist.id)">
        <div class="flex items-center gap-1">
          <img
              :src="runtimeConfig.public.ENDPOINTS_LINK + artist.artist_photo.thumb"
              alt="Artist"
              class="w-8 h-8 rounded-full object-cover object-top"
          />
          <p class="text-sm">
            {{ artist.artist_base_info.translations[cur_lang].last_name }}
            {{ artist.artist_base_info.translations[cur_lang].first_name }}
          </p>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.tile {
  position: relative;
  overflow: hidden;
}

.tile img {
  transition: transform 0.2s ease-in-out;
}

.txt {
  position: absolute;
  bottom: 10px;
  left: 10px;
  color: white;
  font-size: 14px;
  z-index: 10;
}

.x {
  font-size: 20px;
  font-weight: bold;
}
</style>
