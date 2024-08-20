<script setup>
const props = defineProps({
  filtersBody: {
    type: Object,
    required: true,
  },
});

const searchValue = ref(props.filtersBody.search_text);
</script>

<template>
  <form>
    <input
        v-model="searchValue"
        :placeholder="$t('categories.sort.search')"
        class="border py-3 px-6 w-full md:w-80 rounded-3xl  "
        type="text"
    />
  </form>
</template>
