<script setup>
import {useArtworksStore} from "~/store/artworks.js";
import Carousel from "~/components/General/Carousel.vue";

const artworks = useArtworksStore();
const {t} = useI18n();
const user = useUserStore();

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
  artist_ids: [],
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
});
</script>

<template>
  <div v-if="artworks.artworksList">
    <div v-if="artworks.artworksList.data.objects_list.length > 0">
      <Carousel
          :data="artworks.artworksList.data.objects_list"
          :show-all="t('mainPage.trending.showAll')"
          :title="t('mainPage.trending.title')"
          link="/artworks"
          type="painting"
      />
    </div>
  </div>
</template>
