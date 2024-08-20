<script setup>
import {useNewsStore} from "~/store/news.js";
import Carousel from "~/components/General/Carousel.vue";

const news = useNewsStore();

onMounted(async () => {
  await nextTick();
  await news.getNewsList();
});
</script>

<template>
  <div class="">
    <Carousel
        :data="news.result"
        link="/"
        show-all="All blog posts"
        title="From our blog"
        type="blog"
    />
  </div>
</template>
