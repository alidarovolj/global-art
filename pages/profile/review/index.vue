<script setup>
import {useOrdersStore} from "~/store/orders.js";
import {StarIcon} from "@heroicons/vue/24/outline";
import {formatDate} from "~/utils/formatDate";
import {useModalsStore} from "~/store/modals.js";

const {t} = useI18n();

const runtimeConfig = useRuntimeConfig();

const reviews = useReviewsStore();
const orders = useOrdersStore();

const pickedOrder = ref(null);
const modals = useModalsStore()

const pending = ref(true);

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

const pickOrder = (order) => {
  pickedOrder.value = order;
  modals.showModal("ReviewModal", pickedOrder.value);
};

const activeTab = ref(1);
const tabs = ref([
  {id: 1, name: t("profile.review.tabs.notReviewed")},
  {id: 2, name: t("profile.review.tabs.previouslyReviewed")},
]);

onMounted(async () => {
  await nextTick();
  await reviews.getReviews();
  await reviews.myReviews();
  await orders.ordersList(requestForm.value);
  pending.value = false;
});

useHead({
  title: t("headers.profile.pages.reviews.title"),
  meta: [
    {
      property: "description",
      content: t("headers.profile.pages.reviews.description"),
    },
    {
      property: "og:description",
      content: t("headers.profile.pages.reviews.description"),
    },
    {
      property: "og:title",
      content: t("headers.profile.pages.reviews.title"),
    },
    {
      property: "og:url",
      content: t("headers.profile.pages.reviews.og_url"),
    },
  ],
  link: [
    {rel: "canonical", href: t("headers.profile.pages.reviews.canonical")},
  ],
});
</script>

<template>
  <div>
    <div class="container mx-auto px-4 md:px-0">
      <p class="text-3xl font-bold mb-10 ">
        {{ $t("profile.review.reviews") }}
      </p>

      <div v-if="!pending" class="flex flex-col mt-3">
        <div class="flex gap-8 mb-2 w-full border-b ">
          <p
              v-for="tab of tabs"
              :key="tab.id"
              :class="{
              'border-b-2 border-primaryText   pb-3 !text-primaryText':
                activeTab === tab.id,
            }"
              class="font-bold text-secondaryText text-base leading-6 cursor-pointer"
              @click="activeTab = tab.id"
          >
            {{ tab.name }}
          </p>
        </div>
        <div v-if="activeTab === 1">
          <div v-if="reviews.result.data.length === 0">
            <NoElements
                :text="$t('profile.review.noReviewsText')"
                :title="$t('profile.review.noReviews')"
            />
          </div>
          <div v-else>
            <div class="mt-4">
              <div
                  v-for="(item, index) in reviews.result.data"
                  :key="index"
                  class="flex flex-col items-start text-center "
              >
                <div
                    class="flex flex-wrap md:flex-nowrap gap-6 items-start mb-12 pb-12 border-b text-center"
                >
                  <div class="p-3 py-6 bg-cardBg ">
                    <img
                        :src="
                        runtimeConfig.public.ENDPOINTS_LINK +
                        item.art_item_images[0].full
                      "
                        alt=""
                        class="min-w-[200px] w-[200px] min-h-48 h-48 object-contain"
                    />
                  </div>
                  <div class="flex flex-col text-start">
                    <p class="text-2xl font-bold">
                      {{ item.art_item_title }}
                    </p>
                    <p class="text-inner_head mb-3">
                      ${{ item.art_item_price }}
                    </p>
                    <p>
                      {{ item.art_item_description }}
                    </p>
                    <div
                        class="w-max flex gap-2 border mt-12 py-3 px-6 rounded-full items-center"
                        @click="pickOrder(item)"
                    >
                      {{ $t("profile.review.writeReview") }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <div v-if="reviews.resultMyReviews">
            <div v-if="reviews.resultMyReviews.data.length === 0">
              <NoElements
                  :text="$t('profile.review.noReviewsText')"
                  :title="$t('profile.review.noReviews')"
              />
            </div>
            <div v-else>
              <div class="mt-4">
                <div v-if="reviews.resultMyReviews">
                  <div
                      v-if="reviews.resultMyReviews.data.length > 0"
                      class="pb-10"
                  >
                    <div class="block md:flex flex-wrap gap-2 mt-10">
                      <div
                          v-for="(item, index) of reviews.resultMyReviews.data"
                          :key="index"
                          class="w-full mb-5 md:mb-0 block md:flex gap-6 items-start"
                      >
                        <div
                            v-if="item.art_item_review_images"
                            class="w-full md:min-w-[33%] md:w-1/3 mb-4"
                        >
                          <img
                              v-for="(it, ind) of item.art_item_review_images"
                              :key="ind"
                              :src="runtimeConfig.public.ENDPOINTS_LINK + it.full"
                              alt="review"
                              class="w-full min-h-48 object-contain mb-2"
                          />
                          <p class="text-[#757575]">
                            {{ item.art_item_review_art_item.art_item_title }}
                          </p>
                        </div>
                        <div class="w-full">
                          <p class="text-xl font-semibold mb-2">
                            {{
                              item.art_item_review_app_user.app_user_full_name
                            }}
                          </p>
                          <p class="mb-2">
                            {{
                              formatDate(
                                  item.art_item_review_art_item.created_at,
                              )
                            }}
                          </p>
                          <div class="flex gap-1 mb-4">
                            <StarIcon
                                v-for="(it, ind) of item.art_item_review_rate"
                                :key="ind"
                                class="text-yellow-500 w-5 h-5"
                            />
                          </div>
                          <p class="text-sm">
                            {{ item.art_item_review_content }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="skeleton w-40 h-3 mb-10"/>
        <div class="flex gap-3 mb-10">
          <div class="skeleton w-20 h-3"/>
          <div class="skeleton w-20 h-3"/>
        </div>
        <div class="skeleton w-48 h-5 mb-10"/>
        <div v-for="(item, index) of 3" :key="index">
          <div class="skeleton w-1/2 h-96 mb-10"/>
        </div>
      </div>
    </div>
  </div>
</template>
