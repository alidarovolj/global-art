<script setup>
import {useNewsStore} from "~/store/news.js";
import {formatDate} from "~/utils/formatDate.js";

const localePath = useLocalePath();
const route = useRoute();
const news = useNewsStore();

const {t, locale} = useI18n();
const currentLocaleCode = locale.value.split("-")[0];

const truncateText = (text, maxLength) => {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

const requestNewsItem = ref({
  article_alias: null,
  article_language: currentLocaleCode,
});

const requestNewsList = ref({
  page_number: 1,
  show_by: 10,
  article_category_id: null,
  article_language: currentLocaleCode,
  enabled: null,
  search_text: "",
  article_tags: [],
});

onMounted(async () => {
  await nextTick();
  requestNewsItem.value.article_alias = route.params.slug;
  await news.getNewsItem(requestNewsItem.value);
  await news.getNewsList(requestNewsList.value);
  if (!news.newsItem) {
    await navigateTo(localePath("/blog"));
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
  <div
      v-if="news.newsItem && news.result"
      class="container mx-auto px-4 py-10 md:px-0 "
  >
    <div class="flex flex-col gap-4 max-w-[800px] mx-auto">
      <h1 class="text-3xl font-bold">
        {{ news.newsItem.data.article_title }}
      </h1>

      <div class="self-start text-xs text-[#757575]">
        {{ formatDate(news.newsItem.data.created_at) }} | 10
        {{ $t("general.blogBlock") }}
      </div>
      <div>
        <img
            :src="news.newsItem.data.article_cover_image"
            alt="detailBlog"
            class="mt-10 w-full h-full object-cover"
        />
      </div>
      <p class="text-xl" v-html="news.newsItem.data.article_content"/>
    </div>
    <div class="max-w-[800px] mx-auto">
      <div v-if="news.result.data.objects_list.length > 0" class="mt-14">
        <h2 class="text-3xl font-bold">{{ $t("blog.readAlso") }}:</h2>
        <div class="flex gap-10">
          <div>
            <div class="mt-8">
              <NuxtLink

                  :to="
                  localePath(
                    '/blog/' + news.result.data.objects_list[0].article_alias,
                  )
                "
              >
                <img
                    :src="news.result.data.objects_list[0].article_cover_image"
                    alt="blogTrending"
                    class="w-full h-full object-cover"
                />
              </NuxtLink>
              <p class="mt-4 text-start">
                {{
                  truncateText(
                      news.result.data.objects_list[0].article_title,
                      100,
                  )
                }}
              </p>
              <p
                  class="mt-2 text-sm text-[#757575]"
                  v-html="truncateText(news.newsItem.data.article_content, 100)"
              />
              <div class="mt-2 text-xs text-[#757575]">
                {{ news.result.data.objects_list[0].created_at }} | 9
                {{ $t("detailBlog.readAlso") }}
              </div>
            </div>
            <div
                v-for="item in news.result.data.objects_list"
                :key="item.id"
                class="flex flex-col gap-4 mt-6"
            >
              <div class="flex justify-between gap-4">
                <NuxtLink
                    :to="localePath('/blog/' + item.article_alias)"
                >
                  <img
                      :src="item.article_cover_image"
                      alt="blogTrending"
                      class="max-w-28 w-full max-h-20 h-full object-cover"
                  />
                </NuxtLink>
                <div class="flex flex-col w-60">
                  <p class="text-base">
                    {{ truncateText(item.article_title, 50) }}
                  </p>
                  <p class="mt-2 text-xs text-[#757575]">
                    {{ item.created_at }} | 9
                    {{ $t("detailBlog.readAlso") }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div>
              <div class="mt-8">
                <NuxtLink

                    :to="
                    localePath(
                      '/blog/' + news.result.data.objects_list[0].article_alias,
                    )
                  "
                >
                  <img
                      :src="news.result.data.objects_list[0].article_cover_image"
                      alt="blogTrending"
                      class="w-full h-full object-cover"
                  />
                </NuxtLink>
                <p class="mt-4 text-start">
                  {{
                    truncateText(
                        news.result.data.objects_list[0].article_title,
                        100,
                    )
                  }}
                </p>
                <p
                    class="mt-2 text-sm text-[#757575]"
                    v-html="truncateText(news.newsItem.data.article_content, 100)"
                />
                <div class="mt-2 text-xs text-[#757575]">
                  {{ news.result.data.objects_list[0].created_at }} | 9
                  {{ $t("detailBlog.readAlso") }}
                </div>
              </div>
              <div
                  v-for="item in news.result.data.objects_list"
                  :key="item.id"
                  class="flex flex-col mt-6"
              >
                <div class="flex justify-between">
                  <NuxtLink

                      :to="localePath('/blog/' + item.article_alias)"
                  >
                    <img
                        :src="item.article_cover_image"
                        alt="blogTrending"
                        class="max-w-28 w-full max-h-20 h-full object-cover"
                    />
                  </NuxtLink>
                  <div class="flex flex-col w-60">
                    <p class="text-base">
                      {{ truncateText(item.article_title, 50) }}
                    </p>
                    <p class="mt-2 text-xs text-[#757575]">
                      {{ item.created_at }} | 9
                      {{ $t("detailBlog.readAlso") }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div
      v-else
      class="container mx-auto px-4 py-10 md:px-0 flex flex-col items-center gap-4"
  >
    <div class="skeleton max-w-[800px] w-full h-10"/>
    <div class="skeleton max-w-[800px] w-full h-10"/>
    <div class="skeleton max-w-[1200px] w-full h-[800px]"/>
    <div class="skeleton max-w-[800px] w-full h-10"/>
    <div class="flex gap-10">
      <div class="skeleton w-80 h-96"/>
      <div class="skeleton w-80 h-96"/>
    </div>
  </div>
</template>
