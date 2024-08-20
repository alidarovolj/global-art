<script setup>
import {storeToRefs} from "pinia";
import {useCustomOrdersStore} from "~/store/customOrders.js";
import {EnvelopeIcon} from "@heroicons/vue/24/outline";
import {formatDate} from "@/utils/formatDate.js"

const localePath = useLocalePath();

const runtimeConfig = useRuntimeConfig();

const {t} = useI18n();

const pending = ref(true);

const pickedOrder = ref(null);

const commissions = useCustomOrdersStore();
const {result} = storeToRefs(commissions);
const languages = useLanguagesStore()
const {cur_lang} = storeToRefs(languages)

const requestBody = ref({
  page_number: 1,
  show_by: 10,
  custom_order_app_user_ids: [],
  custom_order_artist_ids: [],
  custom_order_art_category_ids: [],
  custom_order_status_ids: [],
  is_paid: null,
  created_at_from: null,
  created_at_to: null,
  updated_at_from: null,
  updated_at_to: null,
});

onMounted(async () => {
  await nextTick();
  await commissions.getCustomOrders(requestBody.value);
  pending.value = false;
});

const changeStatusLocal = async (item, state) => {
  pickedOrder.value = item;
  await nextTick();
  if (state === true) {
    acceptPricing.showModal();
  } else {
    declineOrder.showModal();
  }
};

useHead({
  title: t("headers.profile.pages.commissions.title"),
  meta: [
    {
      property: "description",
      content: t("headers.profile.pages.commissions.description"),
    },
    {
      property: "og:description",
      content: t("headers.profile.pages.commissions.description"),
    },
    {
      property: "og:title",
      content: t("headers.profile.pages.commissions.title"),
    },
    {
      property: "og:url",
      content: t("headers.profile.pages.commissions.og_url"),
    },
  ],
  link: [
    {
      rel: "canonical",
      href: t("headers.profile.pages.commissions.canonical"),
    },
  ],
});
</script>

<template>
  <div>
    <div class="container mx-auto px-4 md:px-0">
      <div class="w-full">
        <div>
          <div class="block md:flex justify-between items-center mb-8">
            <p class="text-2xl font-bold mb-3 md:mb-0 ">
              {{ $t("profile.links.commissions") }}
            </p>
          </div>
          <div v-if="!pending">
            <div v-if="result.data.objects_list.length > 0">
              <div
                  v-for="(item, index) of result.data.objects_list"
                  :key="index"
                  class="p-7 border rounded-2xl flex flex-col md:flex-row gap-6 mb-5"
              >
                <div class="w-full md:w-2/3 flex flex-col justify-between">
                  <div>
                    <div
                        :class="[
                        {
                          'bg-[#EDE4F6] text-[#48058B]':
                            item.custom_order_status.alias === 'new',
                        },
                        {
                          'bg-orange-200 text-orange-500':
                            item.custom_order_status.alias === 'on-review',
                        },
                        {
                          'bg-blue-200 text-blue-500':
                            item.custom_order_status.alias === 'pricing',
                        },
                        {
                          'bg-cyan-200 text-cyan-500':
                            item.custom_order_status.alias ===
                            'waiting-for-payment',
                        },
                        {
                          'bg-green-200 text-green-500':
                            item.custom_order_status.alias === 'paid',
                        },
                        {
                          'bg-slate-200 text-slate-500':
                            item.custom_order_status.alias === 'in-process',
                        },
                        {
                          'bg-yellow-200 text-yellow-500':
                            item.custom_order_status.alias ===
                            'waiting-for-delivery',
                        },
                        {
                          'bg-green-200 text-green-500':
                            item.custom_order_status.alias === 'completed',
                        },
                      ]"
                        class="py-1 px-3 rounded-lg capitalize w-max  font-bold mb-4"
                    >
                      {{ item.custom_order_status.title }}
                    </div>
                    <div
                        class=" text-xl font-bold mb-2 block md:flex gap-2"
                    >
                      <p v-if="item.custom_order_price">
                        {{ item.custom_order_budget }}$
                      </p>
                      <p v-else>
                        {{ $t("artistProfile.comission.notSpecified") }}
                      </p>
                      <p class="text-[#757575]">
                        ({{ $t("artistProfile.comission.requested") }}:
                        {{ item.custom_order_budget }}$)
                      </p>
                    </div>
                    <div class="mb-4">
                      <p class="font-semibold">
                        {{ $t("artistProfile.comission.execution") }}:
                        <span class="text-sm text-[#757575] font-normal">
                          {{ item.custom_order_execution_days }}
                        </span>
                      </p>
                      <p class="font-semibold">
                        {{ $t("artistProfile.comission.requestedUser") }}:
                        <span class="text-sm text-[#757575] font-normal"
                        >{{ item.custom_order_dimensions.width }}x{{
                            item.custom_order_dimensions.height
                          }}x{{ item.custom_order_dimensions.length }} ({{
                            item.custom_order_dimensions.weight
                          }}{{ $t("addArtwork.kg") }})</span
                        >
                      </p>
                      <p v-if="item.custom_order_final_dimensions.length > 0" class="font-semibold">
                        {{ $t("artistProfile.comission.finalSize") }}:
                        <span class="text-sm text-[#757575] font-normal"
                        >{{ item.custom_order_final_dimensions.width }}x{{
                            item.custom_order_final_dimensions.height
                          }}x{{ item.custom_order_final_dimensions.length }} ({{
                            item.custom_order_final_dimensions.weight
                          }}{{ $t("addArtwork.kg") }})</span
                        >
                      </p>
                      <p class="font-semibold">
                        {{ $t("artistProfile.artworks.info.date") }}:
                        <span class="text-sm text-[#757575] font-normal">
                          {{ formatDate(item.created_at) }}
                        </span>
                      </p>
                    </div>
                    <div class="flex items-center gap-2">
                      <img
                          :src="runtimeConfig.public.ENDPOINTS_LINK + item.custom_order_artist.artist_photo.thumb"
                          alt=""
                          class="w-14 h-14 rounded-full object-cover">
                      <p class="text-xl">
                        {{ item.custom_order_artist.artist_base_info.translations[cur_lang].last_name }}
                        {{ item.custom_order_artist.artist_base_info.translations[cur_lang].first_name }}
                      </p>
                    </div>
                  </div>
                  <div v-if="item.custom_order_status.alias === 'pricing'">
                    <p class="font-bold mb-2">
                      {{ $t("artistProfile.comission.final_price_set") }}
                    </p>
                    <p class="mb-4">
                      {{ $t("artistProfile.comission.final_price_set_text") }}
                    </p>
                    <div class="flex gap-3">
                      <p
                          class="w-max py-3 px-6 border border-green-500 text-green-500 rounded-full cursor-pointer hover:bg-green-500 hover:text-white"
                          @click="changeStatusLocal(item, true)"
                      >
                        {{ $t("artistProfile.comission.acceptCommission") }}
                      </p>
                    </div>
                  </div>
                  <NuxtLink

                      :to="
                      localePath(
                        '/profile/commissions/messages?id=' +
                          item.custom_order_chat_room_id,
                      )
                    "
                      class="flex gap-2 mt-4 bg-black w-max px-6 py-2 rounded-full text-white"
                  >
                    <EnvelopeIcon class="w-5 h-5"/>
                    <p>{{ $t("artistProfile.comission.chat") }}</p>
                  </NuxtLink>
                  <div
                      v-if="
                      item.custom_order_status.alias === 'waiting-for-payment'
                    "
                  >
                    <p class="font-bold mb-2">
                      {{ $t("artistProfile.comission.final_price_set") }}
                    </p>
                    <p class="mb-4">
                      {{ $t("artistProfile.comission.final_price_set_text") }}
                    </p>
                    <div class="flex gap-3">
                      <a
                          :href="item.custom_order_checkout_link"
                          class="w-max py-3 px-6 border border-green-500 text-green-500 rounded-full cursor-pointer hover:bg-green-500 hover:text-white"
                      >
                        {{ $t("artistProfile.comission.pay_bill") }}
                      </a>
                    </div>
                  </div>
                </div>
                <div class="w-full md:w-1/3">
                  <div class="grid grid-rows-1 gap-1">
                    <div class="grid grid-cols-2 gap-1">
                      <div
                          v-for="(
                          image, index
                        ) in item.custom_order_reference_images"
                          :key="index"
                          class="flex items-center justify-center mb-5"
                      >
                        <img
                            :src="
                            runtimeConfig.public.ENDPOINTS_LINK + image.full
                          "
                            alt="Image"
                            class="h-full w-auto"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
              <NoElements
                  :text="$t('profile.commissions.noCommissionsText')"
                  :title="$t('profile.commissions.noCommissions')"
                  class="mt-10"
              />
            </div>
          </div>

          <div v-else>
            <div
                v-for="(item, index) of 5"
                :key="index"
                class="w-full flex flex-col gap-10 mb-5"
            >
              <div class="border rounded-2xl p-7 flex gap-6">
                <div class="w-full md:w-2/3">
                  <div class="skeleton w-10 h-5 mb-4"/>
                  <div class="skeleton w-20 h-4 mb-4"/>
                  <div class="skeleton w-32 h-2 mb-4"/>
                  <div class="skeleton w-32 h-2 mb-4"/>
                  <div class="skeleton w-full h-4 mb-4"/>
                  <div class="skeleton w-full h-4 mb-4"/>
                </div>
                <div class="w-full md:w-1/3">
                  <div class="skeleton w-full h-full"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <AcceptPricing :element="pickedOrder"/>
  </div>
</template>
