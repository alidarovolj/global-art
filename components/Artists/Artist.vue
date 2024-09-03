<script setup>
import {BellIcon} from "@heroicons/vue/24/outline";
import {useLanguagesStore} from "~/store/languages.js";
import {useArtistsStore} from "~/store/artists.js";
import {useModalsStore} from "~/store/modals.js";

const localePath = useLocalePath();
const modals = useModalsStore()

const loading = ref(false);

const runtimeConfig = useRuntimeConfig();

const language = useLanguagesStore();
const {cur_lang} = storeToRefs(language);

const artist = useArtistsStore();
artist.result = null;

const route = useRoute();

const requestBody = ref({
  page_number: Number(route.query.currentPage) || 1,
  show_by: Number(route.query.show_by) || 20,
  artist_is_available: route.query.artist_is_available || null,
  artist_type_of_painting: route.query.artist_type_of_painting || [],
  artist_material: route.query.artist_material || [],
  artist_art_style: route.query.artist_art_style || [],
});

const auth = useAuthStore();
auth.initCookieToken();
const {token} = storeToRefs(auth);

const toggleSubscribe = async () => {
  loading.value = true;
  if (!token.value) {
    modals.showModal('LoginModal')
    loading.value = false;
    return;
  }
  await artist.addExcludeArtistSubscription(props.id);
  await artist.getArtistList(requestBody.value);
  loading.value = false;
};

const props = defineProps(["id", "img", "name", "available", "artist_data"]);
</script>

<template>
  <div class="w-full h-full mr-0 md:mr-4 painting relative">
    <div
        v-if="artist_data.artist_is_rising_talent"
        class="absolute top-4 left-4 bg-white py-1 px-2 rounded-2xl text-sm z-20"
    >
      <p>{{ $t('risingTalents.title') }}</p>
    </div>
    <div
        :class="{ '!bg-red-500 text-white': artist_data.artist_is_subscribed }"
        class="cursor-pointer absolute right-4 top-4 p-3 bg-white   rounded-full  z-10 shadow-lg transition-all"
        @click="toggleSubscribe"
    >
      <BellIcon v-if="!loading" class="w-5 h-5"/>
      <div v-else class="spinner"/>
    </div>
    <div class="image-container bg-gray-100">
      <NuxtLink :to="localePath(`/artists/${id}`)">
        <img
            v-if="img"
            :src="runtimeConfig.public.ENDPOINTS_LINK + img"
            alt="artist"
            class="w-full h-[322px] min-h-[322px] mx-auto object-cover object-center"
        />
      </NuxtLink>
    </div>
    <div class="block w-full h-max">
      <div class="text-start block ">
        <NuxtLink
            v-if="artist_data"
            :to="localePath('/artists/' + id)"
            class="font-bold mt-2 block"
        >
          <p>
            {{ artist_data.artist_base_info.translations[cur_lang].first_name }}
            {{ artist_data.artist_base_info.translations[cur_lang].last_name }}
          </p>
        </NuxtLink>
        <div class="flex text-[#757575]">
          <p
              v-for="(item, index) of artist_data.artist_art_categories"
              :key="index"
          >
            {{ item.translations[cur_lang].art_category_title }}<span v-if="artist_data.artist_art_categories.length !== index + 1">&nbsp;•&nbsp;</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
