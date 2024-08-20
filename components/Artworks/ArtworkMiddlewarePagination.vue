<script setup>
import {useArtworksStore} from "~/store/artworks.js";

const artworksStore = useArtworksStore();
const {artworksList} = storeToRefs(artworksStore);

const props = defineProps({
  filtersBody: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["change:page"]);

function handleChangePage(page) {
  emit("change:page", page);
}
</script>

<template>
  <Pagination
      :filters-body="props.filtersBody"
      :items-list="artworksList"
      @change:page="handleChangePage"
  />
</template>
