<script setup>
import {formatDate} from "~/utils/formatDate.js";

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
  <div v-if="newsData.length > 0">
    <div>
      <h3 class="mt-20 mb-10 text-2xl font-bold ">
        {{ $t("blog.newest") }}
      </h3>
      <div
          class="block md:flex gap-10 h-full border-b  pb-10 mb-10"
      >
        <NuxtLink

            :to="localePath('/blog/' + newsData[0].article_alias)"
            class="w-full md:w-[70%] h-full mb-10 md:mb-0"
        >
          <div class="block md:flex gap-6 h-full">
            <div
                class="w-full md:w-1/2 flex flex-col justify-between mb-5 md:mb-0"
            >
              <div>
                <h1 class="text-3xl font-bold md:text-5xl">
                  {{ newsData[0].article_title }}
                </h1>
                <p class="mt-4" v-html="newsData[0].article_intro"/>
              </div>
              <div class="text-sm text-[#757575]">
                <span>
                  {{ newsData[0].article_category.article_category_title }}|
                </span>
                <span>{{ formatDate(newsData[0].created_at) }}</span>
              </div>
            </div>
            <div class="w-full md:w-1/2">
              <img
                  :src="newsData[0].article_cover_image"
                  alt="blogNewest"
                  class="w-full h-full object-cover"
              />
            </div>
          </div>
        </NuxtLink>
        <div
            class="w-full md:w-[30%] flex flex-col gap-10 justify-between h-full"
        >
          <NuxtLink
              v-for="(item, index) of newsData.slice(0, 3)"
              :key="index"

              :to="localePath('/blog/' + item.article_alias)"
              class="flex gap-5"
          >
            <div class="w-1/3">
              <img
                  :src="item.article_cover_image"
                  alt="blogNewest"
                  class="w-full h-full object-cover"
              />
            </div>
            <div class="w-2/3">
              <p class="text-sm text-[#757575] mb-2">
                {{ item.article_category.article_category_title }}
              </p>
              <p class="text-xl text-black  mb-4">
                {{ item.article_title }}
              </p>
              <div class="text-sm text-[#757575]">
                <span
                >{{ newsData[0].article_category.article_category_title }}
                  |
                </span>
                <span>{{ formatDate(newsData[0].created_at) }}</span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
      <div class="block md:flex justify-between gap-7">
        <NuxtLink
            v-for="(item, index) of newsData.slice(0, 5)"
            :key="index"

            :to="localePath('/blog/' + item.article_alias)"
            class="w-full md:w-1/4 mb-5 md:mb-0"
        >
          <p class="text-sm text-[#757575] mb-2">
            {{ item.article_category.article_category_title }}
          </p>
          <p class="text-xl text-black  mb-4">
            {{ item.article_title }}
          </p>
          <div class="text-sm text-[#757575]">
            <span
            >{{ newsData[0].article_category.article_category_title }}
              |
            </span>
            <span>{{ formatDate(newsData[0].created_at) }}</span>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
  <div v-else>
    <BlogNewestSkeleton/>
  </div>
</template>
