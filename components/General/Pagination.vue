<script setup>
import {ChevronLeftIcon, ChevronRightIcon} from "@heroicons/vue/24/outline";

const props = defineProps(["filtersBody", "itemsList"]);
const emit = defineEmits(["change:page"]);
const route = useRoute();

const filtersBody = computed(() => props.filtersBody);
const itemsList = computed(() => props.itemsList);

function onClickChangePage(changedPage) {
  emit("change:page", {
    ...props.filtersBody,
    page_number: changedPage,
  });
}
</script>

<template>
  <div v-if="itemsList && route.query" class="flex items-center gap-2">
    <button
        :class="{ '!text-[#757575]': filtersBody.page_number === 1 }"
        :disabled="filtersBody.page_number === 1"
        class="flex items-center p-2 "
        @click="onClickChangePage(filtersBody.page_number - 1)"
    >
      <ChevronLeftIcon class="w-5 h-5"/>
      <p>{{ $t("general.pagination.prev") }}</p>
    </button>
    <div v-for="pageNumber in itemsList.data.all_pages_count" :key="pageNumber">
      <p
          :class="{
          'bg-black  rounded-full text-white': pageNumber === itemsList.data.current_page,
        }"
          class="p-1 px-3 cursor-pointer hover:bg-black hover:text-white rounded-full transition-all"
          @click="onClickChangePage(pageNumber)"
      >
        {{ pageNumber }}
      </p>
    </div>
    <button
        :class="{
        '!text-[#757575]':
          filtersBody.page_number === itemsList.data.all_pages_count,
      }"
        :disabled="filtersBody.page_number === itemsList.data.all_pages_count"
        class="flex items-center p-2 "
        @click="onClickChangePage(filtersBody.page_number + 1)"
    >
      <p>{{ $t("general.pagination.next") }}</p>
      <ChevronRightIcon class="w-5 h-5"/>
    </button>
  </div>
</template>
