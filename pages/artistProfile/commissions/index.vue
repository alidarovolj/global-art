<script setup>
import {CircleStackIcon, EnvelopeIcon, PencilIcon} from "@heroicons/vue/24/outline";
import {useLanguagesStore} from "~/store/languages.js";

const {t} = useI18n();
const pending = ref(true);
const localePath = useLocalePath();

const languages = useLanguagesStore();
const {cur_lang} = storeToRefs(languages);

const runtimeConfig = useRuntimeConfig();

const tabs = ref({
  active: 0,
  items: [
    {
      title: t("artistProfile.comissions.links.commissions"),
      query: "",
    },
  ],
});

const commissions = useCustomOrdersStore();
const {resultMyCusOrders} = storeToRefs(commissions);
const modals = useModalsStore()

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
  await commissions.getMyCustomOrders(requestBody.value);
  await commissions.getCustomOrderStatuses();
  pending.value = false;
});

const handleTabChange = async (query) => {
  pending.value = true;
  if (query) {
    requestBody.value.custom_order_status_ids = [query];
  } else {
    requestBody.value.custom_order_status_ids = [];
  }
  await commissions.getMyCustomOrders(requestBody.value);
  pending.value = false;
};

const setStatusLocal = async (item, state) => {
  await nextTick();
  if (state === true) {
    modals.showModal("AcceptCustomOrder", item)
  } else {
    modals.showModal("DeclineCustomOrder", item)
  }
};

const updateParamsCall = async (item) => {
  await nextTick();
  modals.showModal("UpdateCommissionParams", item)
};

const updatePriceCall = async (item) => {
  await nextTick();
  modals.showModal("UpdateCommissionPrice", item)
};

useHead({
  title: t("headers.artist_profile.pages.commissions.title"),
  meta: [
    {
      property: "description",
      content: t("headers.artist_profile.pages.commissions.description"),
    },
    {
      property: "og:description",
      content: t("headers.artist_profile.pages.commissions.description"),
    },
    {
      property: "og:title",
      content: t("headers.artist_profile.pages.commissions.title"),
    },
    {
      property: "og:url",
      content: t("headers.artist_profile.pages.commissions.og_url"),
    },
  ],
  link: [
    {
      rel: "canonical",
      href: t("headers.artist_profile.pages.commissions.canonical"),
    },
  ],
});
</script>

<template>
  <div>
    <div class="container mx-auto px-4 md:px-0 ">
      <div class="flex items-center justify-between mb-10">
        <h1 class="text-3xl md:text-5xl  font-bold">
          {{ $t("artistProfile.comissions.title") }}
        </h1>
      </div>
      <div
          v-if="commissions.resultStatus"
          class="flex overflow-x-auto gap-8 border-b border-[#E3E3E3] mb-10 "
      >
        <p
            v-for="(tab, index) of tabs.items"
            :key="index"
            :class="{
            'border-b-2 pb-4 border-black font-bold !text-black ':
              tabs.active === index,
          }"
            class="cursor-pointer text-primaryText whitespace-nowrap "
            @click="
            tabs.active = index;
            handleTabChange(tab.query);
          "
        >
          {{ tab.title }}
        </p>
        <p
            v-for="(tab, index) of commissions.resultStatus.data"
            :key="index"
            :class="{
            'border-b-2 pb-4 border-black font-bold !text-black ':
              tabs.active === tab.id,
          }"
            class="cursor-pointer text-primaryText whitespace-nowrap  capitalize"
            @click="
            tabs.active = tab.id;
            handleTabChange(tab.id.toString());
          "
        >
          {{ tab.translations[cur_lang].title }}
        </p>
      </div>
      <div v-if="!pending">
        <div v-if="resultMyCusOrders.data.objects_list.length > 0">
          <div
              v-for="(item, index) of resultMyCusOrders.data.objects_list"
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
                <p class=" text-xl font-bold mb-2 flex gap-2">
                  <span v-if="item.custom_order_price"
                  >{{ item.custom_order_budget }}$</span
                  >
                  <span v-else>{{
                      $t("artistProfile.comission.notSpecified")
                    }}</span>
                  <span class="text-[#757575]"
                  >({{ $t("artistProfile.comission.requested") }}:
                    {{ item.custom_order_budget }}$)</span
                  >
                </p>
                <div class="mb-4">
                  <p>
                    {{ $t("artistProfile.comission.title") }}:
                    <span class="text-sm text-[#757575]">
                      {{ item.custom_order_execution_days }}
                    </span>
                  </p>
                  <p>
                    {{ $t("artistProfile.comission.requestedUser") }}:
                    <span class="text-sm text-[#757575]"
                    >{{ item.custom_order_dimensions.width }}x{{
                        item.custom_order_dimensions.height
                      }}x{{ item.custom_order_dimensions.length }} ({{
                        item.custom_order_dimensions.weight
                      }}kg)</span
                    >
                  </p>
                  <p v-if="item.custom_order_final_dimensions.length > 0">
                    {{ $t("artistProfile.comission.finalSize") }}:
                    <span class="text-sm text-[#757575]"
                    >{{ item.custom_order_final_dimensions.width }}x{{
                        item.custom_order_final_dimensions.height
                      }}x{{ item.custom_order_final_dimensions.length }} ({{
                        item.custom_order_final_dimensions.weight
                      }}kg)</span
                    >
                  </p>
                </div>
              </div>
              <div>
                <div v-if="item.custom_order_status.alias === 'new'">
                  <p class="font-bold mb-2">
                    {{ $t("artistProfile.comission.decision") }}
                  </p>
                  <p class="mb-4">
                    {{ $t("artistProfile.comission.discussDetails") }}
                  </p>
                  <div class="flex gap-3">
                    <p
                        class="w-max py-3 px-6 border border-green-500 text-green-500 rounded-full cursor-pointer hover:bg-green-500 hover:text-white"
                        @click="setStatusLocal(item, true)"
                    >
                      {{ $t("artistProfile.comission.acceptCommission") }}
                    </p>
                    <p
                        class="w-max py-3 px-6 border border-red-500 text-red-500 rounded-full cursor-pointer hover:bg-red-500 hover:text-white"
                        @click="setStatusLocal(item, false)"
                    >
                      {{ $t("artistProfile.comission.decline") }}
                    </p>
                  </div>
                </div>
                <NuxtLink
                    :to="
                    localePath(
                      '/artistProfile/messages?id=' +
                        item.custom_order_chat_room_id,
                    )
                  "
                    class="flex gap-2 mt-4 bg-black w-max px-6 py-2 rounded-full text-white"
                >
                  <EnvelopeIcon class="w-5 h-5"/>
                  <p>{{ $t("artistProfile.comission.chat") }}</p>
                </NuxtLink>
              </div>
            </div>
            <div class="w-full md:w-1/3">
              <div class="grid grid-rows-1 gap-1">
                <div class="grid grid-cols-2 gap-1">
                  <div
                      v-for="(image, index) in item.custom_order_reference_images"
                      :key="index"
                      class="flex items-center justify-center mb-5"
                  >
                    <img
                        :src="runtimeConfig.public.ENDPOINTS_LINK + image.full"
                        alt="Image"
                        class="h-full w-auto object-contain"
                    />
                  </div>
                </div>
              </div>
              <div>
                <div
                    v-if="item.custom_order_status.alias !== 'new'"
                    class="flex gap-3"
                >
                  <button
                      class="flex items-center gap-2 text-[#757575] hover:text-black"
                      @click="updateParamsCall(item)"
                  >
                    <PencilIcon class="w-5 h-5"/>
                    <p>{{ $t("artistProfile.comission.updateParams") }}</p>
                  </button>
                  <button
                      v-if="
                      item.custom_order_status.alias === 'pricing' ||
                      item.custom_order_status.alias === 'on-review'
                    "
                      class="flex items-center gap-2 text-[#757575] hover:text-black"
                      @click="updatePriceCall(item)"
                  >
                    <CircleStackIcon class="w-5 h-5"/>
                    <p>{{ $t("artistProfile.comission.updatePrice") }}</p>
                  </button>
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
</template>
