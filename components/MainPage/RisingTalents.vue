<script setup>
import Carousel from "~/components/General/Carousel.vue";

const artists = useArtistsStore();

const {t} = useI18n();
const body = ref({
  page_number: 1,
  show_by: 10,
  artist_is_verified: true,
  artist_is_available: null,
  enabled: true,
  artist_is_rising_talent: true,
  artist_type_of_painting: null,
  artist_material: null,
  artist_art_style: null,
});

onMounted(async () => {
  await nextTick();
  await artists.getArtistList(body.value);
});
</script>

<template>
  <div v-if="artists.artistList">
    <div v-if="artists.artistList.data.objects_list.length > 0">
      <Carousel
          :data="artists.artistList.data.objects_list"
          :show-all="t('mainPage.risingTalents.showAll')"
          :title="t('mainPage.risingTalents.title')"
          link="/artists"
          type="artist"
      />
    </div>
  </div>
</template>
