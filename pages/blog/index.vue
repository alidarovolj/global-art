<script setup>
import {useLanguagesStore} from "~/store/languages.js";
import Carousel from "~/components/General/Carousel.vue";

const news = useNewsStore();

const {t} = useI18n();

const languages = useLanguagesStore();
const {cur_lang} = storeToRefs(languages);

const requestCategories = ref({
  page_number: 1,
  show_by: 10,
  article_category_parent_id: null,
  article_category_language: cur_lang,
  enabled: null,
  search_text: null,
});

const requestNews = ref({
  page_number: 1,
  show_by: 10,
  article_category_id: null,
  article_language: cur_lang,
  enabled: null,
  search_text: "",
  article_tags: [],
});

const requestArticleCategoriesByAlias = ref({
  article_category_aliases: [],
  language: cur_lang,
  articles_per_category: 100,
});

const updateURL = async (form) => {
  requestNews.value = form;
  await news.getNewsList(requestNews.value);
};

onMounted(async () => {
  await nextTick();
  await news.getNewsList(requestNews.value);
  await news.getNewsListCategories(requestCategories.value);
  news.resultCategories.data.objects_list.forEach((category) =>
      requestArticleCategoriesByAlias.value.article_category_aliases.push(
          category.article_category_alias,
      ),
  );
  await news.getArticleCategoriesByAlias(requestArticleCategoriesByAlias.value);
});

useHead({
  title: t("headers.blog.title"),
  meta: [
    {
      property: "description",
      content: t("headers.blog.description"),
    },
    {
      property: "og:description",
      content: t("headers.blog.description"),
    },
    {
      property: "og:title",
      content: t("headers.blog.title"),
    },
    {
      property: "og:url",
      content: t("headers.blog.og_url"),
    },
  ],
  link: [{rel: "canonical", href: t("headers.blog.canonical")}],
});
</script>

<template>
  <div class="flex flex-col container mx-auto px-4 md:px-0 ">
    <div class="flex justify-between">
      <h1 class="text-3xl font-bold ">
        {{ $t("blog.title") }}
      </h1>
    </div>
    <div v-if="news.result && news.articleCategoriesByAlias">
      <div v-if="news.result.data.objects_list.length > 0">
        <BlogCategories/>
        <BlogNewest :news-data="news.result.data.objects_list"/>
        <Carousel
            :data="news.articleCategoriesByAlias.data"
            :show-all="$t('blog.showAll')"
            :title="$t('blog.trending')"
            class="mt-32"
            link="/blog"
            type="blogTrending"
        />
        <BlogAllArticles :news-data="news.result.data.objects_list"/>
      </div>
      <div v-else>
        <NoElements
            :text="$t('blog.info.tryAgain')"
            :title="$t('blog.info.noNews')"
            class="py-10"
        />
      </div>
      <div class="flex items-center justify-between mx-auto">
        <ShowBy :filters-body="requestNews" @change-u-r-l="updateURL"/>
      </div>
    </div>
    <div v-else>
      <BlogNewestSkeleton/>
    </div>
  </div>
</template>
