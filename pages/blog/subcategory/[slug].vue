<script setup>
import {useNewsStore} from "~/store/news.js";
import {useLanguagesStore} from "~/store/languages.js";

const news = useNewsStore();
const route = useRoute();
const localePath = useLocalePath();
const {t} = useI18n();
const languagesStore = useLanguagesStore();
const {cur_lang} = storeToRefs(languagesStore);

const breadcrumbs = ref([
  {
    title: t("blog.mainPage"),
    link: "/",
  },
  {
    title: t("blog.title"),
    link: "/blog",
  },
]);

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

const currentCategory = computed(() => {
  let category = null;
  if (news.resultCategories) {
    news.resultCategories.data.objects_list.forEach((item) => {
      if (item.article_category_alias === route.params.slug) {
        category = item;
      }
    });
  }

  return category;
});

const updateURL = async (form) => {
  requestNews.value = form;
  await news.getNewsList(requestNews.value);
};

watch(currentCategory, async (newCategory) => {
  if (newCategory) {
    const newBread = {
      title: newCategory.article_category_title,
      link: "/blog/subcategory/" + newCategory.article_category_alias,
    };

    if (!breadcrumbs.value.some((crumb) => crumb.link === newBread.link)) {
      breadcrumbs.value.push(newBread);
    }

    requestNews.value.article_category_id = newCategory.id;
    await news.getNewsList(requestNews.value);
  }
});

onMounted(async () => {
  await nextTick();
  await news.getNewsListCategories(requestCategories.value);
  await news.getNewsList(requestNews.value);
  const category = currentCategory.value;
  if (category) {
    requestNews.value.article_category_id = category.id;
    await news.getNewsList(requestNews.value);
  }
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
    <Breadcrumbs :links="breadcrumbs"/>
    <div class="flex justify-between">
      <h1 class="text-3xl font-bold">
        {{ $t("blog.title") }}
      </h1>
    </div>
    <div v-if="news.resultCategories && news.result">
      <BlogCategories :categories="news.resultCategories.data.objects_list"/>
      <div v-if="news.result.data.objects_list.length > 0">
        <BlogNewest :news-data="news.result.data.objects_list"/>
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
  </div>
</template>
