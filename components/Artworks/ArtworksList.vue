<script setup>
import {useArtworksStore} from "~/store/artworks.js";
import {storeToRefs} from "pinia";

const artworksStore = useArtworksStore();
const {artworksList} = storeToRefs(artworksStore);
const {getArtworks} = artworksStore;

artworksList.value = null;

const props = defineProps({
  filtersBody: {
    type: Object,
    required: true,
  },
});

watch(
    () => props.filtersBody,
    async (newValue) => {
      await getArtworks(newValue);
    },
    {
      deep: true,
    },
);
</script>

<template>
  <div class="mt-8">
    <div v-if="artworksList" class="block mx-auto">
      <p class="text-[#757575] ">
        {{ artworksList.data.objects_list.length }} {{ $t("artworks.title") }}
      </p>
      <div
          v-if="artworksList.data.objects_list.length > 0"
          class="grid grid-cols-1 md:grid-cols-3 gap-y-4 sm:gap-x-5 sm:gap-y-5"
      >
        <div
            v-for="item in artworksList.data.objects_list"
            :key="item.id"
            v-memo="[item]"
            class="mt-6 w-full"
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
    <div v-else class="flex flex-wrap justify-between">
      <div
          v-for="(_, index) of 8"
          :key="index"
          class="skeleton h-[420px] max-h-[420px] w-full md:w-fourth mb-5"
      />
    </div>
  </div>
</template>
