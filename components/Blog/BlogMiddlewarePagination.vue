<script setup>
import {useNewsStore} from "~/store/news.js";

const blogStore = useNewsStore();
const {result} = storeToRefs(blogStore);

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
      :items-list="result"
      @change:page="handleChangePage"
  />
</template>
