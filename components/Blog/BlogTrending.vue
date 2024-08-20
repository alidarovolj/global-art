<script setup>
import {ChevronRightIcon} from "@heroicons/vue/24/outline";

const localePath = useLocalePath();

const props = defineProps(["id", "articles", "img", "title", "alias"]);

const truncateText = (text, maxLength) => {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};
</script>

<template>
  <div
      v-if="articles"
      class="w-full h-full mr-0 md:mr-4 painting relative flex flex-col justify-between"
  >
    <div class="flex flex-col">
      <div class="flex justify-between mb-8">
        <p class=" font-bold">
          {{ truncateText(title, 100) }}
        </p>
        <button class="flex items-center gap-2 text-[#757575]">
          <NuxtLink

              :to="localePath('/blog/subcategory/' + alias)"
              class="pb-1 border-b border-gray-300"
          >
            {{ $t("blog.showAll") }}
          </NuxtLink>
          <ChevronRightIcon class="w-5 h-5"/>
        </button>
      </div>
      <NuxtLink :to="localePath('/blog/' + articles[0].article_alias)">
        <div class="image-container">
          <img
              :src="articles[0].article_cover_image"
              alt="blogTrending"
              class="w-full h-[280px] min-h-[280px] object-cover"
          />
        </div>
        <p class="mt-4 text-start">
          {{ truncateText(articles[0].article_title, 100) }}
        </p>
      </NuxtLink>
    </div>
    <div v-if="articles.length > 1">
      <NuxtLink
          v-for="item in articles.slice(1, articles.length)"

          :to="localePath('/blog/' + item.article_alias)"
          class="flex flex-col gap-4 mt-4 pt-4 border-t border-gray-300"
      >
        <div class="flex gap-4">
          <img
              :src="item.article_cover_image"
              alt="blogTrending"
              class="max-w-28 w-full h-[80px] min-h-[80px] object-contain"
          />
          <p class="text-start">
            {{ truncateText(item.article_title, 50) }}
          </p>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
