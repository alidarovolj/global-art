<script setup>
import {useArtistsStore} from "~/store/artists.js";
import {useAuthStore} from "~/store/auth.js";
import {storeToRefs} from "pinia";
import {useModalsStore} from "~/store/modals.js";

const route = useRoute();
const runtimeConfig = useRuntimeConfig();

const localePath = useLocalePath();

const artist = useArtistsStore();
artist.result = null;
const user = useUserStore();
const modals = useModalsStore()

artist.detailArtist = null;

const language = useLanguagesStore();
const {cur_lang} = storeToRefs(language);

const auth = useAuthStore();
auth.initCookieToken();
const {token} = storeToRefs(auth);

const artistFullName = computed(() =>
    artist.detailArtist
        ? artist.detailArtist.data.artist_base_info.translations[cur_lang.value]
            .last_name +
        " " +
        artist.detailArtist.data.artist_base_info.translations[cur_lang.value]
            .first_name
        : "Loading...",
);

const {t} = useI18n();

const loading = ref(false);

onMounted(async () => {
  await nextTick();
  await artist.getDetailArtist(route.params.id);
});

const activeTab = ref(1);

watch(
    () => user.result,
    async () => {
      await artist.getDetailArtist(route.params.id);
    },
);

const toggleSubscribe = async () => {
  loading.value = true;
  if (!token.value) {
    loading.value = false;
    modals.showModal('LoginModal')
    return;
  }
  await artist.addExcludeArtistSubscription(route.params.id);
  await artist.getDetailArtist(route.params.id);
  loading.value = false;
};

const orderCustomArt = async () => {
  if (!token.value) {
    modals.showModal('LoginModal')
    return;
  }
  navigateTo(localePath("/commission/?artist_id=" + artist.detailArtist.data.id));
};

useHead({
  title: computed(() => `${artistFullName.value} | Global Art AI`),
  meta: [
    // {
    //   property: "description",
    //   content: computed(() => `${translatedBaseInfo.value && translatedBaseInfo.value.artist_about ? translatedBaseInfo.value.artist_about : 'Default description'}`),
    // },
    // {
    //   property: "og:description",
    //   content: computed(() => `${translatedBaseInfo.value && translatedBaseInfo.value.artist_about ? translatedBaseInfo.value.artist_about : 'Default description'}`),
    // },
    {
      property: "og:title",
      content: computed(() => `${artistFullName.value} | Global Art AI`),
    },
    {
      property: "og:url",
      content: route.fullPath,
    },
  ],
  link: [{rel: "canonical", href: t("headers.artists.canonical")}],
});
</script>

<template>
  <div class="container mx-auto px-4 md:px-0">
    <div v-if="artist.detailArtist" class="flex flex-col justify-between">
      <div
          class="flex justify-between md:flex-nowrap flex-wrap gap-4 border-b pb-10"
      >
        <div class="flex flex-col gap-3">
          <h1
              class="text-3xl md:text-7xl font-bold  "
          >
            {{
              artist.detailArtist.data.artist_base_info.translations[cur_lang]
                  .first_name
            }}
            {{
              artist.detailArtist.data.artist_base_info.translations[cur_lang]
                  .last_name
            }}
          </h1>
          <p class="text-gray-500">
            {{
              artist.detailArtist.data.artist_base_info.translations[cur_lang]
                  .city
            }},
            {{
              artist.detailArtist.data.artist_base_info.translations[cur_lang]
                  .state
            }}
          </p>
          <p class="text-gray-500">
            {{ artist.detailArtist.data.artist_subscribers }}
            {{ $t("artists.followers") }}
          </p>
          <div class="flex gap-10 ">
            <div>
              <div class="flex mb-3">
                <p class="font-bold mr-2">
                  {{ $t("artists.available") }}
                  :
                </p>

                <p>
                  {{
                    artist.detailArtist.data.artist_is_available
                        ? $t("cus_art_req.open")
                        : $t("cus_art_req.close")
                  }}
                </p>
              </div>
              <div class="flex mb-3">
                <p class="font-bold mr-2">{{ $t("addArtwork.styles") }}:</p>
                <div class="flex flex-wrap gap-1">
                  <div
                      v-for="(item, index) of artist.detailArtist.data
                    .artist_art_styles"
                      :key="index"
                  >
                    {{
                      item.translations[cur_lang].title
                    }}<span
                      v-if="
                      index <
                      artist.detailArtist.data.artist_art_styles.length - 1
                    "
                  >,&nbsp;</span
                  >
                  </div>
                </div>
              </div>
              <div class="flex">
                <p class="font-bold mr-2">{{ $t("artists.material") }}:</p>
                <div
                    v-for="(item, index) of artist.detailArtist.data
                    .artist_art_materials"
                    :key="index"
                >
                  {{
                    item.translations[cur_lang].title
                  }}<span
                    v-if="
                      index <
                      artist.detailArtist.data.artist_art_materials.length - 1
                    "
                >,&nbsp;</span
                >
                </div>
              </div>
            </div>
            <div>
              <div class="flex flex-wrap">
                <p
                    v-for="(type_of_painting, index) in artist.detailArtist.data
                    .artist_type_of_painting"
                    :key="index"
                >
                  {{
                    type_of_painting[0].toUpperCase() +
                    type_of_painting.slice(1)
                  }}<span
                    v-if="
                      artist.detailArtist.data.artist_type_of_painting
                        .length !==
                      index + 1
                    "
                >,&nbsp;</span
                >
                </p>
              </div>
              <div class="flex flex-wrap">
                <p
                    v-for="(material, index) in artist.detailArtist.data
                    .artist_material"
                    :key="material"
                >
                  {{
                    material[0].toUpperCase().replace(/_/g, " ") +
                    material.slice(1)
                  }}<span
                    v-if="
                      artist.detailArtist.data.artist_material.length !==
                      index + 1
                    "
                >,&nbsp</span
                >
                </p>
              </div>
            </div>
          </div>
          <div class="flex flex-wrap gap-3 justify-start md:flex-nowrap mt-14">
            <Base-button
                v-if="artist.detailArtist.data.artist_is_available"
                class="md:text-base p-2 font-bold px-5 text-xs w-max"
                @click="orderCustomArt"
            >
              {{ $t("artists.custom") }}
            </Base-button>
            <Base-button
                :loading="loading"
                :variant="
                artist.detailArtist.data.artist_is_subscribed
                  ? 'primary'
                  : 'outlined'
              "
                class="px-6 py-2 w-max"
                type="button"
                @click="toggleSubscribe"
            >
              {{
                artist.detailArtist.data.artist_is_subscribed
                    ? $t("artists.unfollow")
                    : $t("artists.follow")
              }}
            </Base-button>
          </div>
        </div>
        <img
            :src="
            runtimeConfig.public.ENDPOINTS_LINK +
            artist.detailArtist.data.artist_app_user.params.photo?.full
          "
            alt="artist"
            class="md:w-auto md:h-[400px] w-full h-full object-cover"
        />
      </div>
      <div class="flex flex-col">
        <div v-if="activeTab === 1">
          <DetailArtistAbout :artist="artist.detailArtist.data"/>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="w-full flex justify-between">
        <div class="flex flex-col gap-4 text-start justify-start w-1/2">
          <div class="skeleton h-12 w-full"/>
          <div class="skeleton h-4 w-1/2"/>
          <div class="skeleton h-4 w-1/2"/>
          <div class="flex gap-3">
            <div class="skeleton h-12 w-56 rounded-xl"/>
            <div class="skeleton h-12 w-44 rounded-xl"/>
          </div>
        </div>
        <div class="skeleton w-1/3 h-[400px]"/>
      </div>
      <div>
        <div
            class="font-bold border-b-2  pb-3 flex gap-3 text-base mb-2"
        >
          <div class="skeleton h-8 w-32"/>
          <div class="skeleton h-8 w-32"/>
          <div class="skeleton h-8 w-32"/>
        </div>
        <div class="flex w-full text-base mb-2 mt-8 justify-between">
          <div class="skeleton h-12 w-44 rounded-xl"/>
          <div class="skeleton h-12 w-44 rounded-xl"/>
        </div>
        <div class="skeleton h-4 w-32 mb-4"/>

        <div class="w-full flex flex-col gap-4 md:flex-row justify-between">
          <div
              v-for="slide in 4"
              :key="slide"
              class="w-full flex justify-between pr-0 gap-4 mb-5 md:mb-0"
          >
            <div class="skeleton h-[400px] w-full"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
