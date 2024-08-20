<script setup>
const runtimeConfig = useRuntimeConfig();
const props = defineProps(["img", "title"]);
</script>

<template>
  <div class="w-full mr-3 relative">
    <div class="absolute left-0 top-0 w-full h-full setGrad"/>
    <div class="image-container w-full">
      <ExpandableImage
          :src="runtimeConfig.public.ENDPOINTS_LINK + img"
          :title="title"
          alt="Portfolio"
          class="image w-full h-[480px] object-cover image-zoom"
      />
    </div>
  </div>
</template>

<style>
.setGrad {
  background: linear-gradient(to bottom, transparent 0%, black 100%);
}
</style>