<script setup>
import {CheckIcon} from "@heroicons/vue/24/outline";

const localePath = useLocalePath();

const {t} = useI18n();

const links = [
  {
    title: "Home",
    link: "/",
  },
  {
    title: "Successful payment",
    link: "/payment-success",
  },
];

useHead({
  title: t("headers.gift_card_success.title"),
  meta: [
    {
      property: "description",
      content: t("headers.gift_card_success.description"),
    },
    {
      property: "og:description",
      content: t("headers.gift_card_success.description"),
    },
    {
      property: "og:title",
      content: t("headers.gift_card_success.title"),
    },
    {
      property: "og:url",
      content: t("headers.gift_card_success.og_url"),
    },
  ],
  link: [{rel: "canonical", href: t("headers.gift_card_success.canonical")}],
});
</script>

<template>
  <div class="">
    <div class="container mx-auto px-4 md:px-0">
      <Breadcrumbs :links="links"/>
      <div
          class="flex md:flex-row flex-col justify-center items-start pb-24 pt-12"
      >
        <div class="text-center w-full md:w-half md:mb-0 mb-8">
          <div
              class="mx-auto p-2 rounded-full border-4 w-max border-green-500 mb-6"
          >
            <CheckIcon class="text-green-500 w-10 h-10"/>
          </div>
          <h1 class="text-3xl font-bold">
            {{ $t("gift_card_payment.success.title") }}
          </h1>
          <p class="my-6">
            {{ $t("gift_card_payment.success.description") }}
          </p>
          <NuxtLink

              :to="localePath('/')"
              class="border  px-6 py-3 rounded-full hover:bg-black hover:text-white hover:border-black"
          >
            {{ $t("gift_card_payment.success.backToMain") }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
