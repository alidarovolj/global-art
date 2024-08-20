<script setup>
const {t} = useI18n();

useHead({
  title: t("headers.about-ai.title"),
  meta: [
    {
      property: "description",
      content: t("headers.about-ai.description"),
    },
    {
      property: "og:description",
      content: t("headers.about-ai.description"),
    },
    {
      property: "og:title",
      content: t("headers.about-ai.title"),
    },
    {
      property: "og:url",
      content: t("headers.about-ai.og_url"),
    },
  ],
  link: [{rel: "canonical", href: t("headers.about-ai.canonical")}],
});
</script>

<template>
  <div class="">
    <HeroAI class="mb-28"/>
    <VideoAI/>
    <PickVideo/>
    <JoinWaitlist/>
  </div>
</template>
