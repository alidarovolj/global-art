<script setup>
import {useArtistsStore} from "~/store/artists.js";
import {storeToRefs} from "pinia";

const artistsStore = useArtistsStore();
const {artistList} = storeToRefs(artistsStore);
const {getArtistList} = artistsStore;

artistList.value = null

const props = defineProps({
  filtersBody: {
    type: Object,
    required: true,
  },
});

onMounted(async () => {
  await nextTick();
  await getArtistList(props.filtersBody);
});

watch(
    () => props.filtersBody,
    async (newValue) => {
      await getArtistList(newValue);
    },
    {
      deep: true,
    },
);
</script>

<template>
  <div v-if="artistList">
    <div
        v-if="artistList.data.objects_list.length"
        class="grid grid-cols-1 md:grid-cols-3 gap-y-4 sm:gap-x-5 sm:gap-y-5"
    >
      <div
          v-for="artist in artistList.data.objects_list"
          :key="artist.id"
          class="w-full"
      >
        <Artist
            :id="artist.id"
            :artist_data="artist"
            :available="artist.artist_is_available"
            :img="artist.artist_app_user.params.photo.full"
            :name="artist.artist_app_user.app_user_full_name"
        />
      </div>
    </div>
    <div v-else>
      <NoElements
          :text="$t('artists.noArtistsText')"
          :title="$t('artists.noArtistsTitle')"
          class="py-10"
      />
    </div>
  </div>
  <div v-else class="flex flex-wrap justify-between">
    <div
        v-for="(_, index) of 8"
        :key="index"
        class="skeleton h-[420px] max-h-[420px] w-full md:w-fourth mb-5"
    />
  </div>
</template>
