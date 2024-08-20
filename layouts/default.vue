<script lang="ts" setup>
const route = useRoute();
const routeName = computed(() => {
  if (
      ["/marketplace", "/help"].some((path) => route.fullPath.includes(path)) ||
      ["/"].some((path) => route.fullPath === path)
  ) {
    return "noPadTop";
  } else if (
      ["/profile", "/commission"].some((path) => route.fullPath.includes(path))
  ) {
    return "profile";
  }
});
</script>

<template>
  <div>
    <div class="flex flex-col min-h-screen">
      <Header/>
      <div
          :class="[
          { '!pt-0': routeName === 'noPadTop' },
          { '!pt-0 !pb-0': routeName === 'profile' },
        ]"
          class="pt-7 pb-[70px]"
      >
        <slot/>
      </div>
      <Footer class="mt-auto"/>
    </div>
  </div>
</template>
