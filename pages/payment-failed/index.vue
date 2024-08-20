<script setup>
import {ExclamationCircleIcon} from "@heroicons/vue/24/outline";

const localePath = useLocalePath();

const route = useRoute();
const {t} = useI18n();

const links = [
  {
    title: "Home",
    link: "/",
  },
  {
    title: "Failed payment",
    link: "/payment-failed",
  },
];

useHead({
  title: t("headers.payment_failed.title"),
  meta: [
    {
      property: "description",
      content: t("headers.payment_failed.description"),
    },
    {
      property: "og:description",
      content: t("headers.payment_failed.description"),
    },
    {
      property: "og:title",
      content: t("headers.payment_failed.title"),
    },
    {
      property: "og:url",
      content: t("headers.payment_failed.og_url"),
    },
  ],
  link: [{rel: "canonical", href: t("headers.payment_failed.canonical")}],
});
</script>

<template>
  <div class="">
    <div class="container mx-auto px-4 md:px-0">
      <Breadcrumbs :links="links"/>
      <div class="text-center py-24">
        <div
            class="mx-auto p-2 rounded-full border-4 w-max border-red-500 mb-6"
        >
          <ExclamationCircleIcon class="text-red-500 w-10 h-10"/>
        </div>
        <h1 class="text-3xl font-bold">
          {{ $t("payment.failed.title") }}
        </h1>
        <p class="my-6">
          {{ $t("payment.failed.description") }}
          <br/>{{ $t("payment.failed.orderNumber") }}:
          <span v-if="route.query">{{ route.query.id }}</span>
        </p>
        <NuxtLink

            :to="localePath('/')"
            class="border  px-6 py-3 rounded-full hover:bg-black hover:text-white hover:border-black"
        >
          {{ $t("payment.failed.backToMain") }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
