<script setup>
import {storeToRefs} from "pinia";
import {getTranslate} from "~/utils/getTranslate.js";
import {useArtworksStore} from "~/store/artworks.js";
import {formatDate} from "~/utils/formatDate";
import {StarIcon} from "@heroicons/vue/24/outline";
import Carousel from "~/components/General/Carousel.vue";

const runtimeConfig = useRuntimeConfig();

const language = useLanguagesStore();
const {cur_lang} = storeToRefs(language);
const {t} = useI18n();
const artworks = useArtworksStore();
const user = useUserStore();
const reviews = useReviewsStore();

const route = useRoute();

const props = defineProps({
  artist: Object,
});

const requestBody = ref({
  page_number: 1,
  show_by: 10,
  only_ids: [],
  exclude_ids: [],
  category_ids: [],
  search_text: null,
  movement_and_style: [],
  year_from: null,
  year_to: null,
  price_from: null,
  price_to: null,
  artist_ids: [route.params.id],
  art_item_is_for_sale: null,
  art_item_is_sold: null,
  art_item_is_validated: null,
  rarity: [],
  art_item_material: [],
  art_item_style: [],
  cert: [],
  signature: [],
});

onMounted(async () => {
  await nextTick();
  await artworks.getArtworks(requestBody.value);
  await reviews.artistsReviews(parseInt(route.params.id));
});

watch(
    () => user.result,
    async () => {
      await artworks.getArtworks(requestBody.value);
    },
);

const translatedBaseInfo = computed(() =>
    getTranslate(props.artist.translations, cur_lang.value),
);
</script>

<template>
  <div>
    <div
        class="block md:flex justify-between gap-10 items-start py-10 border-b-2  mb-10"
    >
      <div class="w-full md:w-1/2 mb-10 md:mb-0">
        <h2 class="text-3xl font-semibold  ">
          {{ $t("detailArtist.about.title") }}
        </h2>
        <p class="mt-6 text-[#757575]">
          <ShowMoreLess :text="translatedBaseInfo.artist_about" max-lines="3" />
        </p>
      </div>
      <div class="w-full md:w-1/2 mb-10 md:mb-0">
        <h2 class="text-3xl font-semibold  ">
          {{ $t("detailArtist.about.creativeCreed") }}
        </h2>
        <p v-if="translatedBaseInfo.artist_credo" class="mt-6 text-[#757575]">
          <ShowMoreLess :text="translatedBaseInfo.artist_credo" max-lines="3" />
        </p>
      </div>
    </div>
    <div v-if="props.artist.artist_portfolio.length > 0">
      <Carousel
          :data="props.artist.artist_portfolio"
          :title="$t('detailArtist.about.studioTitle')"
          class="mt-10"
          type="artist_portfolio"
      />
    </div>
    <div v-if="artworks.artworksList" class="pb-7 border-b mb-10">
      <h2 class="text-3xl font-semibold  ">
        {{ $t("detailArtist.about.authorWorks") }}
      </h2>
      <div
          v-if="artworks.artworksList.data.objects_list.length > 0"
          class="block md:flex gap-3 flex-wrap"
      >
        <div
            v-for="item in artworks.artworksList.data.objects_list"
            :key="item.id"
            v-memo="[item]"
            class="mt-6 w-full md:w-fourth"
        >
          <Painting
              :id="item.id"
              :artist="item.art_item_artist"
              :artwork_data="item"
              :images="item.art_item_images"
              :is_in_wish_list="item.is_in_wish_list"
              :price="item.art_item_price"
              :title="item.art_item_title"
          />
        </div>
      </div>
      <div v-else>
        <NoElements
            :text="$t('artistProfile.artworks.info.tryAgain')"
            :title="$t('artistProfile.artworks.info.noArtworks')"
            class="py-10"
        />
      </div>
    </div>
    <div v-if="reviews.resultArtistReviews">
      <div v-if="reviews.resultArtistReviews.data.length > 0" class="pb-10">
        <p
            class="text-primaryText font-bold text-3xl  "
        >
          {{ $t("profile.links.reviews") }}
        </p>
        <div class="block md:flex flex-wrap gap-2 mt-10">
          <div
              v-for="(item, index) of reviews.resultArtistReviews.data"
              :key="index"
              class="w-full md:w-1/2 md:basis-[48%] mb-3 md:mb-0 block md:flex gap-6 items-start"
          >
            <div
                v-if="item.art_item_review_images"
                class="w-full md:min-w-[50%] md:w-1/2 mb-4"
            >
              <img
                  v-for="(it, ind) of item.art_item_review_images"
                  :key="ind"
                  :src="runtimeConfig.public.ENDPOINTS_LINK + it.full"
                  alt="review"
                  class="w-full min-h-48 object-contain mb-2"
              />
              <p class="text-[#757575]">
                {{ item.art_item_review_art_item.art_item_title }}
              </p>
            </div>
            <div>
              <p class="text-xl font-semibold mb-2">
                {{ item.art_item_review_app_user.app_user_full_name }}
              </p>
              <p class="mb-2">
                {{ formatDate(item.art_item_review_art_item.created_at) }}
              </p>
              <div class="flex gap-1 mb-4">
                <StarIcon
                    v-for="(it, ind) of item.art_item_review_rate"
                    :key="ind"
                    class="text-yellow-500 w-5 h-5"
                />
              </div>
              <p class="text-sm">
                {{ item.art_item_review_content }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="artist.artist_exhibition.length > 0" class="pb-10">
      <p
          class="text-primaryText font-bold text-3xl  "
      >
        {{ $t("detailArtist.about.exhibitionTitle") }}
      </p>
      <div class="block">
        <div
            v-for="(item, index) of artist.artist_exhibition"
            :key="index"
            class="w-full mb-3"
        >
          <div
              v-if="item.images"
              class="flex gap-3 overflow-x-auto w-full mb-4"
          >
            <img
                v-for="(it, ind) of item.images"
                :key="ind"
                :src="runtimeConfig.public.ENDPOINTS_LINK + it.full"
                alt="exhibition"
                class="w-full min-h-48 object-cover"
            />
          </div>
          <p class="mb-1 ">
            {{ item.translations[cur_lang].title }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
