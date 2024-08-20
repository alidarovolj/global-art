<script setup>
const {t} = useI18n();
const localePath = useLocalePath()
const data = defineProps([
  "id",
  "name",
  "description",
  "img",
  "duration",
  "date",
  "content",
]);
</script>

<template>
  <div
      class="flex flex-col justify-start mr-0 md:mr-4 h-[540px] max-h-[540px] painting w-full relative"
  >
    <nuxt-link :to="localePath('/artworks/' + id)" class="mb-2 w-full h-full max-h-[320px]">
      <div class="image-container h-full mb-5">
        <img
            :src="img"
            alt="blog"
            class="w-full h-full object-cover"
        />
      </div>
      <div class="text-start">
        <p class="text-xl mb-2 ">
          {{ name.slice(0, 60) }} <span v-if="name.length > 60">...</span>
        </p>
        <div class="text-inner_head">
          <p class="text-sm mb-4">
            {{ description.slice(0, 90) }}
            <span v-if="name.length > 90">...</span>
          </p>
          <div class="flex text-xs items-center">
            <p class="mr-4">
              {{ date }}
            </p>
            <p class="mr-4">|</p>
            <p>{{ duration }} {{ $t("general.blogBlock") }}</p>
          </div>
        </div>
      </div>
    </nuxt-link>
  </div>
</template>
