<script setup>
import {
  CreditCardIcon,
  CubeIcon,
  FolderIcon,
  HeartIcon,
  PaintBrushIcon,
  SparklesIcon,
  UserCircleIcon
} from "@heroicons/vue/24/outline";

const {t} = useI18n();
const localePath = useLocalePath();

const accounts = ref([
  {
    title: t("help.categories.account.link.first"),
    link: "/",
  },
  {
    title: t("help.categories.account.link.second"),
    link: "/",
  },
  {
    title: t("help.categories.account.link.third"),
    link: "/",
  },
  {
    title: t("help.categories.account.link.fourth"),
    link: "/",
  },
  {
    title: t("help.categories.account.link.fifth"),
    link: "/",
  },
]);
const artworks = ref([
  {
    title: t("help.categories.artworks.link.first"),
    link: "/",
  },
  {
    title: t("help.categories.artworks.link.second"),
    link: "/",
  },
  {
    title: t("help.categories.artworks.link.third"),
    link: "/",
  },
  {
    title: t("help.categories.artworks.link.fourth"),
    link: "/",
  },
]);

const orders = ref([
  {
    title: t("help.categories.orders.link.first"),
    link: "/",
  },
  {
    title: t("help.categories.orders.link.second"),
    link: "/",
  },
  {
    title: t("help.categories.orders.link.third"),
    link: "/",
  },
  {
    title: t("help.categories.orders.link.fourth"),
    link: "/",
  },
  {
    title: t("help.categories.orders.link.fifth"),
    link: "/",
  },
  {
    title: t("help.categories.orders.link.sixth"),
    link: "/",
  },
]);

const generates = ref([
  {
    title: t("help.categories.generates.link.first"),
    link: "/",
  },
  {
    title: t("help.categories.generates.link.second"),
    link: "/",
  },
  {
    title: t("help.categories.generates.link.third"),
    link: "/",
  },
  {
    title: t("help.categories.generates.link.fourth"),
    link: "/",
  },
]);

const payments = ref([
  {
    title: t("help.categories.payments.link.first"),
    link: "/",
  },
  {
    title: t("help.categories.payments.link.second"),
    link: "/",
  },
  {
    title: t("help.categories.payments.link.third"),
    link: "/",
  },
]);

const deliveries = ref([
  {
    title: t("help.categories.deliveries.link.first"),
    link: "/",
  },
  {
    title: t("help.categories.deliveries.link.second"),
    link: "/",
  },
  {
    title: t("help.categories.deliveries.link.third"),
    link: "/",
  },
  {
    title: t("help.categories.deliveries.link.fourth"),
    link: "/",
  },
]);

const terms = ref([
  {
    title: t("help.categories.terms.link.first"),
    link: "/",
  },
  {
    title: t("help.categories.terms.link.second"),
    link: "/",
  },
]);
</script>
<template>
  <p class="text-2xl font-bold mb-6 ">
    {{ $t("help.categories.title") }}
  </p>
  <div class="flex flex-wrap gap-y-8 justify-between">
    <div class="flex flex-col w-[310px]">
      <UserCircleIcon class=" w-5 h-5"/>
      <p class="font-bold mb-6 mt-2 ">
        {{ $t("help.categories.account.title") }}
      </p>
      <div class="flex flex-col">
        <NuxtLink
            v-for="(account, index) in accounts"
            :key="index"

            :to="localePath(account.link)"
            class="text-base transition-all   mb-4"
        >
          <div class="hover:underline leading-4">
            {{ account.title }}
          </div>
        </NuxtLink>
      </div>
    </div>
    <div class="flex flex-col w-[310px]">
      <PaintBrushIcon class=" w-5 h-5"/>
      <p class="font-bold mb-6 mt-2 ">
        {{ $t("help.categories.artworks.title") }}
      </p>
      <div class="flex flex-col">
        <NuxtLink
            v-for="(artwork, index) in artworks"
            :key="index"

            :to="localePath(artwork.link)"
            class="text-base mb-4 block transition-all  "
        >
          <div class="hover:underline leading-4">
            {{ artwork.title }}
          </div>
        </NuxtLink>
      </div>
    </div>
    <div class="flex flex-col w-[310px]">
      <HeartIcon class=" w-5 h-5"/>
      <p class="font-bold mb-6 mt-2 ">
        {{ $t("help.categories.orders.title") }}
      </p>
      <div class="flex flex-col">
        <NuxtLink
            v-for="(order, index) in orders"
            :key="index"

            :to="localePath(order.link)"
            class="text-base mb-4 block transition-all  "
        >
          <div class="hover:underline leading-4">
            {{ order.title }}
          </div>
        </NuxtLink>
      </div>
    </div>
    <div class="flex flex-col w-[310px]">
      <SparklesIcon class=" w-5 h-5"/>
      <p class="font-bold mb-6 mt-2 ">
        {{ $t("help.categories.generates.title") }}
      </p>
      <div class="flex flex-col">
        <NuxtLink
            v-for="(generate, index) in generates"
            :key="index"

            :to="localePath(generate.link)"
            class="text-base mb-4 block transition-all  "
        >
          <div class="hover:underline leading-4">
            {{ generate.title }}
          </div>
        </NuxtLink>
      </div>
    </div>
    <div class="flex flex-col w-[310px]">
      <CreditCardIcon class=" w-5 h-5"/>
      <p class="font-bold mb-6 mt-2 ">
        {{ $t("help.categories.payments.title") }}
      </p>
      <div class="flex flex-col">
        <NuxtLink
            v-for="(payment, index) in payments"
            :key="index"

            :to="localePath(payment.link)"
            class="text-base mb-4 block transition-all  "
        >
          <div class="hover:underline leading-4">
            {{ payment.title }}
          </div>
        </NuxtLink>
      </div>
    </div>
    <div class="flex flex-col w-[310px]">
      <CubeIcon class=" h-5 w-5"/>
      <p class="font-bold mb-6 mt-2 ">
        {{ $t("help.categories.deliveries.title") }}
      </p>
      <div class="flex flex-col">
        <NuxtLink
            v-for="(delivery, index) in deliveries"
            :key="index"

            :to="localePath(delivery.link)"
            class="text-base mb-4 block transition-all  "
        >
          <div class="hover:underline leading-4">
            {{ delivery.title }}
          </div>
        </NuxtLink>
      </div>
    </div>
    <div class="flex flex-col w-[310px]">
      <FolderIcon class=" w-5 h-5"/>
      <p class="font-bold mb-6 mt-2 ">
        {{ $t("help.categories.terms.title") }}
      </p>
      <div class="flex flex-col">
        <NuxtLink
            v-for="(term, index) in terms"
            :key="index"

            :to="localePath(term.link)"
            class="text-base mb-4 block transition-all  "
        >
          <div class="hover:underline leading-4">
            {{ term.title }}
          </div>
        </NuxtLink>
      </div>
    </div>
    <div class="w-[310px]"/>
  </div>
</template>
