<script setup>
const {t} = useI18n();

const props = defineProps({
  newsData: {
    type: [Object, Array],
    required: true,
  },
});

const localePath = useLocalePath();
</script>

<template>
  <div class="mt-28">
    <h3 class="text-2xl font-bold mb-10 ">
      {{ $t("blog.allArticles") }}
    </h3>
    <div
        v-if="newsData"
        class="grid grid-cols-1 md:grid-cols-3 gap-4"
    >
      <NuxtLink
          v-for="(item, index) in newsData"
          :key="index"

          :to="localePath('/blog/' + item.article_alias)"
          class="mb-10"
      >
        <img
            :src="item.article_cover_image"
            alt="painting"
            class="w-full object-cover h-[320px] max-h-[320px] min-h-[320px]"
        />
        <div class="mt-5">
          <p class="text-sm text-[#757575]">
            {{ item.article_category.article_category_title }}
          </p>
          <p class="mt-2 text-xl" v-html="item.article_title"/>
          <p class="mt-2 text-xs text-[#757575]" v-html="item.article_intro"/>
          <div class="mt-4 text-xs text-[#757575]">
            <span>{{ item.date }}</span>
          </div>
        </div>
      </NuxtLink>
    </div>
    <div v-else class="flex justify-between flex-wrap gap-4 md:flex-nowrap">
      <div v-for="item in 4" class="flex flex-col gap-2 w-1/4">
        <div class="skeleton h-52"/>
        <div class="skeleton h-8"/>
        <div class="skeleton h-8"/>
      </div>
    </div>
  </div>
</template>
