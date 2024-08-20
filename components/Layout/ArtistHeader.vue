<script setup>
const localePath = useLocalePath();
</script>

<template>
  <div class="border-b  py-4">
    <div
        class="container mx-auto px-4 md:px-0 flex justify-between items-center"
    >
      <NuxtLink :to="localePath('/')">
        <img alt="Logo" class="w-36 h-12" src="@/assets/img/logo.svg"/>
      </NuxtLink>
    </div>
  </div>
</template>
