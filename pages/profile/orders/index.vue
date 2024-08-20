<script setup>
import {useOrdersStore} from "~/store/orders.js";

const localePath = useLocalePath();
const {t} = useI18n();
const runtimeConfig = useRuntimeConfig();

const orders = useOrdersStore();
const {result} = storeToRefs(orders);

const languages = useLanguagesStore();
const {cur_lang} = storeToRefs(languages);

const requestForm = ref({
  page_number: 1,
  show_by: 10,
  date_from: null,
  date_to: null,
  amount_from: null,
  amount_to: null,
  artist_ids: [],
  app_user_ids: [],
  order_type: null,
});

onMounted(async () => {
  await nextTick();
  await orders.ordersList(requestForm.value);
});

const timelineElements = ["start", "middle", "end"];

useHead({
  title: t("headers.profile.pages.orders.title"),
  meta: [
    {
      property: "description",
      content: t("headers.profile.pages.orders.description"),
    },
    {
      property: "og:description",
      content: t("headers.profile.pages.orders.description"),
    },
    {
      property: "og:title",
      content: t("headers.profile.pages.orders.title"),
    },
    {
      property: "og:url",
      content: t("headers.profile.pages.orders.og_url"),
    },
  ],
  link: [
    {rel: "canonical", href: t("headers.profile.pages.orders.canonical")},
  ],
});
</script>

<template>
  <div>
    <div class="container mx-auto px-4 md:px-0">
      <h1 class="text-3xl font-bold mb-4 ">
        {{ $t("profile.orders.title") }}
      </h1>
      <div v-if="result">
        <div v-if="result.data.objects_list.length > 0">
          <div v-for="(order, index) in result.data.objects_list" :key="index">
            <div class="flex w-full justify-between mt-10">
              <p class="text-xl font-bold ">
                {{ $t("profile.orders.orderId") }}: {{ order.id }}
              </p>
              <div>
                <p class="text-black text-base  text-end">
                  {{ $t("profile.orders.total") }}
                  <span class="text-xl font-bold ml-3"
                  >${{ order.app_user_order_summary.base_total }}</span
                  >
                </p>
                <p class="text-end">
                  {{ $t("profile.orders.items") }}:
                  {{ order.app_user_order_summary.products_count }}
                </p>
              </div>
            </div>
            <div
                :class="{
                'border-none': result.data.objects_list.length === index + 1,
              }"
                class="flex flex-col gap-1 border-b pb-6 mb-6 "
            >
              <p class="text-inner_head">
                {{ $t("profile.orders.date") }}: {{ order.created_at }}
              </p>
              <p
                  v-if="order.app_user_order_checkout_details.delivery_address"
                  class="text-inner_head"
              >
                {{ $t("profile.orders.address") }}:
                {{
                  order.app_user_order_checkout_details.delivery_address
                      .delivery_address_country
                }},
                {{
                  order.app_user_order_checkout_details.delivery_address
                      .delivery_address_city
                }},
                {{
                  order.app_user_order_checkout_details.delivery_address
                      .delivery_address_full_address
                }}
              </p>
              <div class="flex gap-10 justify-between">
                <div
                    class="flex flex-wrap md:flex-nowrap md:justify-start justify-center gap-4 mt-4"
                >
                  <div
                      v-for="(item, index) in order.app_user_order_items"
                      :key="index"
                      class="flex justify-center items-start flex-col text-center w-full md:w-[215px]"
                  >
                    <div class="p-3 py-6 bg-cardBg  w-full">
                      <img
                          :src="
                          runtimeConfig.public.ENDPOINTS_LINK +
                          item.app_user_order_item_art_item.art_item_images[0]
                            .full
                        "
                          alt=""
                          class="w-auto h-[192px] object-contain"
                      />
                    </div>
                    <p class="mt-2 text-start">
                      {{ item.app_user_order_item_art_item.art_item_title }}
                    </p>
                    <p
                        v-if="app_user_order_delivery_details"
                        class="my-2 w-max bg-[#D9F2E2] text-[#058B33] text-sm rounded-full px-4 py-2"
                    >
                      {{ app_user_order_delivery_details }}
                    </p>
                    <p
                        v-else
                        class="my-2 w-max bg-[#F2E5D9] text-[#7D4605] text-sm rounded-full px-4 py-2"
                    >
                      Not accepted
                    </p>
                    <p class="font-bold mb-2">
                      ${{ item.app_user_order_item_sale_price }}
                    </p>
                    <div class="">
                      <NuxtLink

                          :to="
                          localePath(
                            '/artists/' + item.app_user_order_item_artist.id,
                          )
                        "
                      >
                        <div class="flex items-center gap-2">
                          <img
                              v-if="
                              item.app_user_order_item_art_item.art_item_artist
                                .artist_photo
                            "
                              :src="
                              runtimeConfig.public.ENDPOINTS_LINK +
                              item.app_user_order_item_art_item.art_item_artist
                                .artist_photo.thumb
                            "
                              alt=""
                              class="w-6 h-6 rounded-full"
                          />
                          <p>
                            {{
                              item.app_user_order_item_art_item.art_item_artist
                                  .artist_base_info.translations[cur_lang]
                                  .last_name
                            }}
                            {{
                              item.app_user_order_item_art_item.art_item_artist
                                  .artist_base_info.translations[cur_lang]
                                  .first_name
                            }}
                          </p>
                        </div>
                      </NuxtLink>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <NoElements
              :text="$t('profile.orders.noOrdersText')"
              :title="$t('profile.orders.noOrders')"
              class="mt-10"
          />
        </div>
      </div>
      <div v-else>
        <div
            v-for="(_, index) of 16"
            :key="index"
            class="skeleton h-[420px] max-h-[420px] w-full mb-5"
        />
      </div>
    </div>
  </div>
</template>
