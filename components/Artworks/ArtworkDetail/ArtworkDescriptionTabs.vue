<script setup>
import {storeToRefs} from "pinia";
import {useArtworksStore} from "~/store/artworks.js";
import {useArtistsStore} from "~/store/artists.js";
import {getTranslate} from "~/utils/getTranslate.js";
import {useModalsStore} from "~/store/modals.js";

const translatedBaseInfo = computed(() =>
    getTranslate(result.value.data.translations, cur_lang.value),
);

const {t} = useI18n();

const localePath = useLocalePath();
const runtimeConfig = useRuntimeConfig();
const artworksStore = useArtworksStore();
const modals = useModalsStore()
const {result} = storeToRefs(artworksStore);
const artist = useArtistsStore();
const route = useRoute();
const subscribeLoading = ref(false);

const languages = useLanguagesStore();
const {cur_lang} = storeToRefs(languages);

const auth = useAuthStore();
auth.initCookieToken();
const {token} = storeToRefs(auth);

const toggleSubscribe = async (artist_id) => {
  subscribeLoading.value = true
  if (!token.value) {
    modals.showModal('LoginModal')
    subscribeLoading.value = false
    return;
  }
  await artist.addExcludeArtistSubscription(artist_id);
  await artworksStore.getArtwork(route.params.id);
  subscribeLoading.value = false
};

const activeTab = ref(1);
const tabs = ref([
  {id: 1, name: t("artworkDetail.descriptionTabs.detailsArtwork")},
  {id: 2, name: t("artworkDetail.descriptionTabs.artistAbout")},
  // {id: 3, name: "Shipping & Returns"}
]);
</script>

<template>
  <div class="mb-10 w-full">
    <div class="flex gap-8 mb-10">
      <p
          v-for="tab of tabs"
          :key="tab.id"
          :class="{
          'border-b  border-primaryText pb-2 !text-primaryText ':
            activeTab === tab.id,
        }"
          class="font-bold text-secondaryText text-base md:text-xl leading-6 cursor-pointer "
          @click="activeTab = tab.id"
      >
        {{ tab.name }}
      </p>
    </div>
    <div v-if="activeTab === 1">
      <div>
        <p
            class="mb-2 text-primaryTex text-justify "
            v-html="translatedBaseInfo.art_item_description"
        />
      </div>
    </div>
    <div v-if="activeTab === 2" class="w-full">
      <div class="flex items-center gap-4 w-full">
        <NuxtLink

            :to="localePath('/artists/' + result.data.art_item_artist.id)"
            class="w-max"
        >
          <img
              v-if="result.data.art_item_artist.artist_photo"
              :src="
              runtimeConfig.public.ENDPOINTS_LINK +
              result.data.art_item_artist.artist_photo.full
            "
              alt=""
              class="min-w-40 w-40 min-h-40 h-40 rounded-full object-cover"
          />
          <div
              v-else
              class="min-w-40 w-40 min-h-40 h-40 rounded-full border p-5">
            <img
                alt=""
                class="w-full h-full object-contain"
                src="@/assets/img/null.png">
          </div>
        </NuxtLink>
        <div>
          <div class="block md:flex items-center gap-6">
            <NuxtLink

                :to="localePath('/artists/' + result.data.art_item_artist.id)"
                class="block text-base md:text-xl w-max font-bold   mb-6 md:mb-0"
            >
              {{ result.data.art_item_artist.artist_base_info.translations[cur_lang].last_name }}
              {{ result.data.art_item_artist.artist_base_info.translations[cur_lang].first_name }}
            </NuxtLink>
            <p
                v-if="!subscribeLoading"
                class="w-max py-3 px-6 bg-[#F5F5F5] rounded-full cursor-pointer"
                @click="toggleSubscribe(result.data.art_item_artist.id)"
            >
              {{
                result.data.art_item_artist.artist_is_subscribed
                    ? $t("artists.unfollow")
                    : $t("artworkDetail.descriptionTabs.follow")
              }}
            </p>
            <p
                v-else
                class="w-max py-3 px-6 bg-[#F5F5F5] rounded-full cursor-pointer"
            >
              <span class="spinner"></span>
            </p>
          </div>
          <p class="text-[#757575] py-4">
            {{ $t("artworkDetail.descriptionTabs.located") }}
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
          <p
              v-if="result.data.art_item_artist.artist_is_available"
              class="py-2 px-0 md:px-4 text-sm md:text-base border-0 md:border border-[#D9F2E2]  text-[#058B33] w-auto md:w-max rounded-lg whitespace-normal md:whitespace-nowrap"
          >
            {{ $t("artworkDetail.descriptionTabs.available") }}
          </p>
          <p
              v-else
              class="py-2 px-0 md:px-4 text-sm md:text-base border-0 md:border border-red-500  text-red-500 w-auto md:w-max rounded-lg whitespace-normal md:whitespace-nowrap"
          >
            {{ $t("artworkDetail.descriptionTabs.notAvailable") }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
