<script setup>
const props = defineProps(["title", "text"]);
</script>

<template>
  <div>
    <div class=" ">
      <p class="text-lg font-bold">
        {{ props.title }}
      </p>
      <p>
        {{ props.text }}
      </p>
    </div>
  </div>
</template>
