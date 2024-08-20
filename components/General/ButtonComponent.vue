<script setup>
const localePath = useLocalePath();

const props = defineProps(["link", "title"]);
</script>

<template>
  <NuxtLink

      :to="localePath(link)"
      class="relative w-max transition-all cursor-pointer"
  >
    {{ title }}
  </NuxtLink>
</template>
