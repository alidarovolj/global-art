<script setup>
const {t} = useI18n();

useHead({
  title: t("headers.mainPage.title"),
  meta: [
    {
      property: "description",
      content: t("headers.mainPage.description"),
    },
    {
      property: "og:description",
      content: t("headers.mainPage.description"),
    },
    {
      property: "og:title",
      content: t("headers.mainPage.title"),
    },
    {
      property: "og:url",
      content: t("headers.mainPage.og_url"),
    },
  ],
  link: [{rel: "canonical", href: t("headers.mainPage.canonical")}],
});
</script>

<template>
  <div>
    <div class="container mx-auto px-4 md:px-0 pt-7">
      <Hero/>
      <Trending/>
      <RisingTalents/>
      <Categories/>
      <BlogCarousel/>
    </div>
    <FAQ/>
  </div>
</template>
