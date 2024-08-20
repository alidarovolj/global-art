<script setup>
const {t} = useI18n();
const localePath = useLocalePath();

const questions = ref([
  {
    title: t("faq.first.title"),
    content: t("faq.first.content"),
  },
  {
    title: t("faq.second.title"),
    content: t("faq.second.content"),
  },
  {
    title: t("faq.third.title"),
    content: t("faq.third.content"),
  },
  {
    title: t("faq.fourth.title"),
    content: t("faq.fourth.content"),
  },
  {
    title: t("faq.fifth.title"),
    content: t("faq.fifth.content"),
  },
  {
    title: t("faq.sixth.title"),
    content: t("faq.sixth.content"),
  },
]);
</script>

<template>
  <div>
    <div class="container mx-auto px-4 md:px-0 text-center bg-[#F8D4AE] py-16">
      <p class="text-4xl font-bold mb-8 ">
        {{ $t("faq.title") }}
      </p>
      <NuxtLink :to="localePath('/help')" class="underline">
        {{ $t("faq.subtitle") }}
      </NuxtLink>
    </div>
  </div>
</template>
