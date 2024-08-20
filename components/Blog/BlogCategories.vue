<script setup>
import {useNewsStore} from "~/store/news.js";

const router = useRouter();
const localePath = useLocalePath();
const {t, locale} = useI18n();
const currentLocaleCode = locale.value.split("-")[0];
const news = useNewsStore();

const props = defineProps(["categories"]);

const requestCategories = ref({
  page_number: 1,
  show_by: 10,
  article_category_parent_id: null,
  article_category_language: currentLocaleCode,
  enabled: null,
  search_text: null,
});

onMounted(async () => {
  await nextTick();
  await news.getNewsListCategories(requestCategories.value);
});
</script>

<template>
  <div
      v-if="news.resultCategories"
      class="flex gap-8 mt-6 pb-4 border-b border-gray-300 "
  >
    <NuxtLink :to="localePath('/blog')" class="text-sm text-[#757575]">
      {{ $t("blog.news") }}
    </NuxtLink>
    <NuxtLink
        v-for="(category, index) of news.resultCategories.data.objects_list"
        :key="index"

        :to="localePath('/blog/subcategory/' + category.article_category_alias)"
        class="text-sm text-[#757575] cursor-pointer font-bold"
    >
      {{ category.article_category_title }}
    </NuxtLink>
  </div>
</template>
