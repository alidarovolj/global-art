<script setup>
import {useUserStore} from "~/store/user.js";
import {storeToRefs} from "pinia";
import {useOrdersStore} from "~/store/orders.js";
import {useModalsStore} from "~/store/modals.js";

const localePath = useLocalePath();
const {t} = useI18n();
const router = useRouter();
const language = useLanguagesStore();
const {cur_lang} = storeToRefs(language);
const modals = useModalsStore()

const pending = ref(true);

const user = useUserStore();
const {getSubscriptions} = user;
const {subscriptions} = storeToRefs(user);

const runtimeConfig = useRuntimeConfig();

const orders = useOrdersStore();
const {result} = storeToRefs(orders);

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
  await user.getProfile();
  await orders.ordersList(requestForm.value);
  await getSubscriptions();
  pending.value = false;
});

useHead({
  title: t("headers.profile.title"),
  meta: [
    {
      property: "description",
      content: t("headers.profile.description"),
    },
    {
      property: "og:description",
      content: t("headers.profile.description"),
    },
    {
      property: "og:title",
      content: t("headers.profile.title"),
    },
    {
      property: "og:url",
      content: t("headers.profile.og_url"),
    },
  ],
  link: [{rel: "canonical", href: t("headers.profile.canonical")}],
});
</script>

<template>
  <div>
    <div class="container mx-auto px-4 md:px-0">
      <div class="w-full">
        <div v-if="!pending" class="flex gap-3 items-center mb-4">
          <button
              v-if="!user.result.data.params.photo"
              class="border p-4 h-14 w-14 text-center rounded-full font-bold bg-avaColor relative"
              @click="modals.showModal('SetProfilePhoto')"
          >
            <div
                class="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2"
            >
              <span
                  v-for="(
                  word, index
                ) in user.result.data.app_user_full_name.split(' ')"
                  :key="index"
              >
                {{ word.charAt(0) }}
              </span>
            </div>
          </button>
          <div
              v-else
              @click="modals.showModal('SetProfilePhoto')">
            <img
                :src="
                runtimeConfig.public.ENDPOINTS_LINK +
                user.result.data.params.photo.thumb
              "
                alt=""
                class="h-14 w-14 rounded-full"
            />
          </div>
          <p class="text-2xl font-bold ">
            {{ user.result.data.app_user_full_name }}
          </p>
        </div>
        <div v-else class="flex gap-3 items-center mb-4">
          <div class="skeleton w-14 h-14 rounded-full"/>
          <div class="skeleton w-40 h-5"/>
        </div>
        <button
            v-if="!pending"
            class="border rounded-full py-2 px-6 "
            @click="modals.showModal('EditBuyerModal', user.result.data)"
        >
          {{ $t("profile.dashboard.editProfile") }}
        </button>
        <div
            v-else
            class="border  rounded-full py-3 px-6 mb-14 w-max"
        >
          <div class="skeleton w-20 h-4"/>
        </div>
        <div>
          <div class="flex justify-between items-center mt-14 mb-4">
            <p class="text-2xl font-bold ">
              {{ $t("profile.dashboard.recentOrders") }}
            </p>
          </div>
          <div v-if="!pending">
            <div
                v-if="result.data.objects_list.length > 0"
                class="grid grid-cols-1 md:grid-cols-3 gap-y-4 sm:gap-x-5 sm:gap-y-5"
            >
              <div
                  v-for="(order, index) in result.data.objects_list"
                  :key="index"
                  class="w-full"
              >
                <div class="flex w-full justify-between">
                  <p class="text-xl font-bold ">
                    {{ $t("profile.orders.orderId") }}: {{ order.id }}
                  </p>
                </div>
                <div
                    :class="{
                    'border-none':
                      result.data.objects_list.length === index + 1,
                  }"
                    class="flex flex-col gap-1 "
                >
                  <p class="text-inner_head">
                    {{ $t("profile.orders.date") }}: {{ order.created_at }}
                  </p>
                  <div class="overflow-x-auto">
                    <div
                        class="flex flex-wrap md:flex-nowrap md:justify-start justify-center gap-4 mt-4 w-full"
                    >
                      <div
                          v-for="(item, index) in order.app_user_order_items"
                          :key="index"
                          class="flex justify-center items-start flex-col text-center w-full"
                      >
                        <div class="p-3 py-6 bg-cardBg  w-full">
                          <img
                              :src="
                              runtimeConfig.public.ENDPOINTS_LINK +
                              item.app_user_order_item_art_item
                                .art_item_images[0].full
                            "
                              alt=""
                              class="w-full h-[200px] object-contain mx-auto"
                          />
                        </div>
                        <p class="mt-2">
                          {{ item.app_user_order_item_art_item.art_item_title }}
                        </p>
                        <p class="font-bold mb-2">
                          ${{ item.app_user_order_item_sale_price }}
                        </p>
                        <div class="">
                          <NuxtLink

                              :to="
                              localePath(
                                '/artists/' +
                                  item.app_user_order_item_artist.id,
                              )
                            "
                          >
                            <div class="flex items-center gap-2">
                              <img
                                  v-if="
                                  item.app_user_order_item_art_item
                                    .art_item_artist.artist_photo
                                "
                                  :src="
                                  runtimeConfig.public.ENDPOINTS_LINK +
                                  item.app_user_order_item_art_item
                                    .art_item_artist.artist_photo.thumb
                                "
                                  alt=""
                                  class="w-6 h-6 rounded-full"
                              />
                              <p>
                                {{
                                  item.app_user_order_item_art_item
                                      .art_item_artist.artist_base_info
                                      .translations[cur_lang].last_name
                                }}
                                {{
                                  item.app_user_order_item_art_item
                                      .art_item_artist.artist_base_info
                                      .translations[cur_lang].first_name
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
          <div v-else class="w-full flex flex-wrap md:flex-nowrap gap-4">
            <div class="skeleton md:w-1/3 w-full h-40"/>
            <div class="skeleton md:w-1/3 w-full h-40"/>
            <div class="skeleton md:w-1/3 w-full h-40"/>
          </div>
          <div class="block md:flex justify-between items-center mt-14 mb-4">
            <p class="text-xl font-bold  mb-4 md:mb-0">
              {{ $t("profile.dashboard.artistsYouFollow") }}
            </p>
          </div>
          <div>
            <div v-if="!pending">
              <div
                  v-if="subscriptions.data?.length > 0"
                  class="flex flex-wrap gap-5"
              >
                <div
                    v-for="item in subscriptions.data"
                    :key="item.id"
                    class="flex justify-center items-center cursor-pointer flex-col text-center gap-3"
                    @click="router.push(localePath('/artists/' + item.id))"
                >
                  <img
                      v-if="item.artist_photo"
                      :src="
                      runtimeConfig.public.ENDPOINTS_LINK +
                      item.artist_photo.full
                    "
                      alt="artist"
                      class="w-28 h-28 rounded-full object-cover"
                  />
                  <div
                      v-else
                      class="w-28 h-28 rounded-full border p-5">
                    <img
                        alt=""
                        class="w-full h-full object-contain"
                        src="@/assets/img/null.png">
                  </div>
                  {{ item.artist_base_info.translations[cur_lang].last_name }}
                  {{ item.artist_base_info.translations[cur_lang].first_name }}
                </div>
              </div>
              <div v-else>
                <NoElements
                    :text="$t('profile.dashboard.noSubscriptionsText')"
                    :title="$t('profile.dashboard.noSubscriptions')"
                    class="mt-10"
                />
              </div>
            </div>
            <div v-else class="w-full flex flex-wrap md:flex-nowrap gap-4">
              <div class="skeleton w-28 h-28 rounded-full"/>
              <div class="skeleton w-28 h-28 rounded-full"/>
              <div class="skeleton w-28 h-28 rounded-full"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
