<script setup>
const {t} = useI18n();

useHead({
  title: t("headers.marketplace.title"),
  meta: [
    {
      property: "description",
      content: t("headers.marketplace.description"),
    },
    {
      property: "og:description",
      content: t("headers.marketplace.description"),
    },
    {
      property: "og:title",
      content: t("headers.marketplace.title"),
    },
    {
      property: "og:url",
      content: t("headers.marketplace.og_url"),
    },
  ],
  link: [{rel: "canonical", href: t("headers.marketplace.canonical")}],
});
</script>

<template>
  <div>
    <HeroAnimation/>
    <BuyArt/>
    <OrderCustomArt/>
    <InfiniteScroll/>
    <Ar/>
    <GridBlock/>
  </div>
</template>
