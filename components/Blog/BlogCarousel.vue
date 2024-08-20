<script setup>
import {useNewsStore} from "~/store/news";
import {useLanguagesStore} from "~/store/languages.js";
import Carousel from "~/components/General/Carousel.vue";

const news = useNewsStore();

const languagesStore = useLanguagesStore();
const {cur_lang} = storeToRefs(languagesStore);

const requestCategories = ref({
  page_number: 1,
  show_by: 10,
  article_category_parent_id: null,
  article_category_language: cur_lang,
  enabled: null,
  search_text: null,
});

const requestArticleCategoriesByAlias = ref({
  article_category_aliases: [],
  language: cur_lang,
  articles_per_category: 100,
});

await news.getNewsListCategories(requestCategories.value);
news.resultCategories.data.objects_list.forEach((category) =>
    requestArticleCategoriesByAlias.value.article_category_aliases.push(
        category.article_category_alias,
    ),
);
await news.getArticleCategoriesByAlias(requestArticleCategoriesByAlias.value);
</script>

<template>
  <div v-if="news.articleCategoriesByAlias">
    <Carousel
        :data="news.articleCategoriesByAlias.data"
        :show-all="$t('blog.showAll')"
        :title="$t('blog.trending')"
        class="mt-32"
        link="/blog"
        type="blogTrending"
    />
  </div>
</template>
