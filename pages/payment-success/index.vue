<script setup>
import {CheckIcon} from "@heroicons/vue/24/outline";
import {useOrdersStore} from "~/store/orders.js";
import {storeToRefs} from "pinia";

const localePath = useLocalePath();
const languages = useLanguagesStore();
const {cur_lang} = storeToRefs(languages);

const route = useRoute();
const router = useRouter();
const runtimeConfig = useRuntimeConfig();
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

const ordersStore = useOrdersStore();
const {orderDetail} = storeToRefs(ordersStore);
const {getOrderDetail} = ordersStore;

const requestBody = ref({
  page_number: 1,
  show_by: 10,
  app_user_order_id: parseInt(route.query.id),
  date_from: null,
  date_to: null,
  amount_from: null,
  amount_to: null,
  app_user_ids: [],
  artist_ids: [],
});

onMounted(async () => {
  await nextTick();
  if (!route.query?.id) {
    await router.push(localePath('/'));
    return;
  }
  await getOrderDetail(requestBody.value);
});

useHead({
  title: t("headers.payment_success.title"),
  meta: [
    {
      property: "description",
      content: t("headers.payment_success.description"),
    },
    {
      property: "og:description",
      content: t("headers.payment_success.description"),
    },
    {
      property: "og:title",
      content: t("headers.payment_success.title"),
    },
    {
      property: "og:url",
      content: t("headers.payment_success.og_url"),
    },
  ],
  link: [{rel: "canonical", href: t("headers.payment_success.canonical")}],
});
</script>

<template>
  <div class="">
    <div class="container mx-auto px-4 md:px-0">
      <Breadcrumbs :links="links"/>
      <div
          v-if="orderDetail"
          class="flex md:flex-row flex-col justify-between items-start pb-24 pt-12"
      >
        <div class="text-center w-full md:w-half md:mb-0 mb-8">
          <div
              class="mx-auto p-2 rounded-full border-4 w-max border-green-500 mb-6"
          >
            <CheckIcon class="text-green-500 w-10 h-10"/>
          </div>
          <h1 class="text-3xl font-bold">
            {{ $t("payment.success.title") }}
          </h1>
          <p class="my-6">
            {{ $t("payment.success.description") }}
            <br/>{{ $t("payment.success.orderNumber") }}:
            <span v-if="route.query">{{ route.query.id }}</span>
          </p>
          <NuxtLink

              :to="localePath('/')"
              class="border  px-6 py-3 rounded-full hover:bg-black hover:text-white hover:border-black"
          >
            {{ $t("payment.success.backToMain") }}
          </NuxtLink>
        </div>
        <div class="w-full md:w-half">
          <p class="font-bold text-2xl border-b  pb-8 mb-8">
            {{ $t("payment.success.orderedArtworks") }}
          </p>
          <div class="flex gap-4 overflow-y-auto pb-8 border-b mb-8">
            <div>
              <img
                  :src="
                  runtimeConfig.public.ENDPOINTS_LINK +
                  orderDetail.data.objects_list[0].app_user_order_item_art_item
                    .art_item_images[0].full
                "
                  alt=""
                  class="w-auto object-contain h-[120px] p-4 bg-cardBg"
              />
            </div>
            <div class="w-full">
              <div class="flex justify-between text-xl mb-2">
                <p class="font-medium">
                  {{
                    orderDetail.data.objects_list[0]
                        .app_user_order_item_art_item.art_item_title
                  }}
                </p>
                <p>
                  ${{
                    orderDetail.data.objects_list[0]
                        .app_user_order_item_art_item.art_item_price
                  }}
                </p>
              </div>
              <p class="text-secondaryText ">
                by
                <span class="font-bold text-black "
                >{{
                    orderDetail.data.objects_list[0].app_user_order_item_artist
                        .artist_base_info.translations[cur_lang].last_name
                  }}
                  {{
                    orderDetail.data.objects_list[0].app_user_order_item_artist
                        .artist_base_info.translations[cur_lang].first_name
                  }}</span
                >
              </p>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="flex md:flex-row flex-col justify-between w-full">
        <div
            v-for="_ in 2"
            class="skeleton h-[420px] max-h-[420px] w-full md:w-half mb-5"
        />
      </div>
    </div>
  </div>
</template>
