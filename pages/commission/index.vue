<script setup>
import {Listbox, ListboxButton, ListboxOption, ListboxOptions} from '@headlessui/vue'
import {CheckIcon, ChevronUpDownIcon} from '@heroicons/vue/20/solid'
import {useArtistsStore} from "@/store/artists.js";
import {useLanguagesStore} from "~/store/languages.js";
import {useVuelidate} from "@vuelidate/core";
import {maxLength, minLength, required} from "@vuelidate/validators";
import {useToastsStore} from "~/store/toastDropStore.js";

const loadingStore = useLoadingStore();
const localePath = useLocalePath()
const artworkType = ref({
  title: "Choose size",
  type: "standard",
  value: {
    length: null,
    width: null,
    height: null,
  }
});

const artworkTypes = ref([
  {
    title: "Choose size",
    type: "standard",
    value: {
      length: null,
      width: null,
      height: null,
    }
  },
  {
    title: "11.8″ x 15.7″ or 30 × 40 cm",
    type: "standard",
    value: {
      length: 30,
      width: 40,
      height: 30,
    },
  },
  {
    title: "15.7″ x 19.7″ or 40 × 50 cm",
    type: "standard",
    value: {
      length: 40,
      width: 50,
      height: 40,
    },
  },
  {
    title: "19.7″ x 23.6″ or 50 × 60 cm",
    type: "standard",
    value: {
      length: 50,
      width: 60,
      height: 50,
    },
  },
  {
    title: "21.7″ x 27.6″ or 55 × 70 cm",
    type: "standard",
    value: {
      length: 55,
      width: 70,
      height: 55,
    },
  },
  {
    title: "23.6″ x 35.4″ or 60 × 90 cm",
    type: "standard",
    value: {
      length: 60,
      width: 90,
      height: 60,
    },
  },
  {
    title: "35.4″ x 39.4″ or 90 × 100 cm",
    type: "standard",
    value: {
      length: 90,
      width: 100,
      height: 90,
    },
  },
  {
    title: "39.4″ x 47.2″ or 100 × 120 cm",
    type: "standard",
    value: {
      length: 100,
      width: 120,
      height: 100,
    },
  },
  {
    title: "47.2″ x 59.1″ or 120 × 150 cm",
    type: "standard",
    value: {
      length: 120,
      width: 150,
      height: 120,
    },
  },
  {
    title: "Custom size",
    type: "custom",
    value: {
      length: null,
      width: null,
      height: null,
    }
  },
]);

const {t} = useI18n();

const language = useLanguagesStore();
const {cur_lang} = storeToRefs(language);

const artOptions = useArtOptions();

const artworks = useArtworksStore();

const toasts = useToastsStore()

const addresses = useDeliveryAddressStore();

const router = useRouter();

const runtimeConfig = useRuntimeConfig();
const artistStore = useArtistsStore();
const route = useRoute();
const {detailArtist} = storeToRefs(artistStore);
const {getDetailArtist} = artistStore;

const photos = ref([]);

const pending = ref(true);

const form = ref({
  custom_order_artist_id: null,
  custom_order_art_category_id: null,
  custom_order_execution_days: null,
  custom_order_budget: null,
  custom_order_dimensions: {
    length: null,
    width: null,
    height: null,
  },
  custom_order_reference_images: [],
  custom_order_reference_arts: [],
  custom_order_reference_art_styles: [],
  custom_order_reference_artists: [],
  custom_order_message: null,
  language: cur_lang,
});

const requestBody = ref({
  page_number: 1,
  show_by: 10,
  search_text: "",
  artist_is_available: route.query.artist_is_available || null,
  artist_type_of_painting: route.query.artist_type_of_painting || [],
  artist_material: route.query.artist_material || [],
  artist_art_style: route.query.artist_art_style || [],
});

const v$ = useVuelidate(
    {
      custom_order_artist_id: {required},
      custom_order_art_category_id: {required},
      custom_order_execution_days: {required},
      custom_order_budget: {required},
      custom_order_delivery_address_id: {required},
      custom_order_dimensions: {
        length: {required},
        width: {required},
        height: {required},
      },
      custom_order_reference_images: {
        required,
        minLength: (value) => value.length > 0,
      },
      custom_order_reference_art_styles: {
        required,
        minLength: (value) => value.length > 0,
      },
      custom_order_message: {
        required,
        minLength: minLength(20),
        maxLength: maxLength(1500),
      },
      language: {required},
    },
    form,
);

const orderExecutionDays = computed(() => {
  return Array.from({length: 21}, (v, k) => k + 10);
})

const requestBodyArtworks = ref({
  page_number: Number(route.query.currentPage) || 1,
  show_by: Number(route.query.show_by) || 20,
  only_ids: route.query.only_ids || [],
  exclude_ids: route.query.exclude_ids || [],
  category_ids: [],
  search_text: route.query.search_text || null,
  movement_and_style: route.query.movement_and_style || [],
  year_from: route.query.year_from || null,
  year_to: route.query.year_to || null,
  price_from: route.query.price_from || null,
  price_to: route.query.price_to || null,
  artist_ids: route.query.artist_ids || [],
  art_item_is_for_sale: route.query.art_item_is_for_sale || null,
  art_item_is_sold: route.query.art_item_is_sold || null,
  art_item_is_validated: route.query.art_item_is_validated || null,
  rarity: route.query.rarity || [],
  art_item_material: route.query.art_item_material || [],
  art_item_style: route.query.art_item_style || [],
  cert: route.query.cert || [],
  signature: route.query.signature || [],
});

onMounted(async () => {
  await nextTick();
  await artistStore.getArtistList(requestBody.value);
  if (route.query.artist_id) {
    await getDetailArtist(route.query.artist_id);
  }
  await artOptions.getArtStyles();
  await addresses.getDeliveryAddress();
  await artworks.getArtworks(requestBodyArtworks.value);
  form.value.custom_order_artist_id = route.query.artist_id;
  pending.value = false;
});

const setCurrentArtist = async (id) => {
  form.value.custom_order_artist_id = id;
  await getDetailArtist(id);
};

async function sendForm() {
  loadingStore.setLoading(true, t("preloader.pleaseWait"));

  form.value.custom_order_dimensions = artworkType.value.value;

  await v$.value.$validate();

  if (v$.value.$error) {
    loadingStore.setLoading(false, null);
    return;
  }

  await api(`/api/order/custom-order/create-custom-order/`, {
    body: JSON.stringify(form.value),
  })
      .then(async (response) => {
        const data = response.data;
        if (data.success) {
          loadingStore.setLoading(false, null);
          toasts.showToast("success", "Your order has been successfully sent", "You can now check your order in the order list.");
          await router.push(localePath("/profile/commissions/messages?id=" + data.data.custom_order_chat_room_id));
        } else {
          loadingStore.setLoading(false, null);
          toasts.showToast("error", "An error has occurred!", data.msg_txt);
        }
      })
      .catch((e) => {
        if (e.response.data.success === false) {
          loadingStore.setLoading(false, null);
          toasts.showToast("error", "An error has occurred!", e.response.data.msg_txt);
        } else {
          loadingStore.setLoading(false, null);
          toasts.showToast("error", "An error has occurred!", "Server Error! Please try again later.");
        }
      });
  loadingStore.setLoading(false, null);
}

const setRef = (item) => {
  if (form.value.custom_order_reference_arts.includes(item)) {
    form.value.custom_order_reference_arts =
        form.value.custom_order_reference_arts.filter((i) => i !== item);
  } else {
    form.value.custom_order_reference_arts.push(item);
  }
};

const showImage = (item) => {
  photos.value.push(item.base64);
  form.value.custom_order_reference_images.push(item.temp_media_token);
};
</script>

<template>
  <div class="container mx-auto px-4 md:px-0">
    <div>
      <div
          v-if="!pending"
          class="flex gap-10 md:justify-between justify-center md:flex-nowrap flex-wrap "
      >
        <form class="w-full md:w-custom py-9" @submit.prevent="sendForm">
          <p class="text-5xl font-bold mb-10 ">
            {{ $t("commission.title") }}
          </p>
          <div class="w-full">

            <div class="w-full md:w-3/5 flex flex-col gap-2 mb-12">
              <p class="text-xl font-semibold">
                {{ $t("commission.chooseArtist") }}
              </p>
              <div>
                <div
                    :class="[
                        {
                          'border-red-500':
                            v$.custom_order_artist_id.$error &&
                            v$.custom_order_artist_id.$dirty,
                        },
                      ]"
                    class="p-4 rounded-2xl border">
                  <form
                      class="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600 mb-3"
                      @submit.prevent="artistStore.artistList = false; artistStore.getArtistList(requestBody)">
                    <label
                        class="block text-xs font-medium text-gray-900"
                        for="name">
                      {{ $t('search_general.title') }}
                    </label>
                    <input
                        id="name"
                        v-model="requestBody.search_text"
                        :placeholder="$t('search_general.placeholder')"
                        class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        name="name"
                        type="text"
                    />
                  </form>
                  <fieldset v-if="artistStore.artistList">
                    <div
                        v-if="artistStore.artistList.data.objects_list.length > 0"
                        class="space-y-5">
                      <div
                          v-for="(item, index) of artistStore.artistList.data.objects_list"
                          :key="index"
                          class="relative flex items-center">
                        <div class="flex h-6 items-center">
                          <input
                              :id="item.id"
                              v-model="form.custom_order_artist_id"
                              :value="item.id"
                              aria-describedby="comments-description"
                              class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                              name="artist_pick"
                              type="radio"
                              @change="setCurrentArtist(item.id)"
                          />
                        </div>
                        <label
                            :for="item.id"
                            class="ml-3 text-sm flex items-center gap-2">
                          <img
                              v-if="item.artist_app_user.params.photo"
                              :src="runtimeConfig.public.ENDPOINTS_LINK + item.artist_app_user.params.photo.thumb"
                              alt=""
                              class="w-10 h-10 rounded-full">
                          <div
                              v-else
                              class="w-10 h-10 rounded-full border p-5">
                            <img
                                alt=""
                                class="w-full h-full object-contain"
                                src="@/assets/img/null.png">
                          </div>
                          {{ item.artist_base_info.translations[cur_lang].last_name }}
                          {{ item.artist_base_info.translations[cur_lang].first_name }}
                        </label>
                      </div>
                    </div>

                    <NoElements
                        v-else
                        :text="$t('artists.noArtistsText')"
                        :title="$t('artists.noArtistsTitle')"
                    />
                  </fieldset>

                  <div v-else>
                    <div class="spinner p-10"/>
                  </div>
                </div>
                <span
                    v-if="
                    v$.custom_order_artist_id.$error &&
                    v$.custom_order_artist_id.$dirty
                  "
                    class="text-red-500 text-xs"
                >
                  {{ $t("aboutAI.value") }}
                </span>
              </div>
            </div>
            <div class="w-full md:w-3/5 flex flex-col gap-2 mb-12">
              <p class="text-xl font-semibold">
                {{ $t("commission.category") }}
              </p>
              <p class="text-base text-[#757575] mt-2 mb-5">
                {{ $t("commission.categoryText") }}
              </p>
              <div
                  v-if="detailArtist"
                  class="flex flex-wrap gap-4">
                <p
                    v-for="(item, index) of detailArtist.data
                    .artist_art_categories"
                    :key="index"
                    :class="[
                    {
                      '!bg-black text-white':
                        form.custom_order_art_category_id === item.id,
                    },
                    {
                      'border-red-500':
                        v$.custom_order_art_category_id.$error &&
                        v$.custom_order_art_category_id.$dirty,
                    },
                  ]"
                    class="w-max bg-gray-200 border border-gray-200 cursor-pointer capitalize hover:bg-black hover:text-white transition-all rounded-full px-5 py-2  "
                    @click="form.custom_order_art_category_id = item.id"
                >
                  {{ item.translations[cur_lang].art_category_title }}
                </p>
              </div>
              <div v-else>
                <p class="text-[#757575] font-semibold">{{ $t('commission.selectCategory') }}</p>
              </div>
              <span
                  v-if="
                  v$.custom_order_art_category_id.$error &&
                  v$.custom_order_art_category_id.$dirty
                "
                  class="text-red-500 text-xs"
              >
                {{ $t("aboutAI.value") }}
              </span>
            </div>
            <div class="w-full md:w-3/5 flex flex-col gap-2 mb-12">
              <p class="text-xl font-semibold">
                {{ $t("commission.styleChoose") }}
              </p>
              <p class="text-base text-[#757575] mt-2 mb-5">
                {{ $t("commission.styleChooseText") }}
              </p>
              <div class="flex flex-wrap gap-4">
                <p
                    v-for="(item, index) of artOptions.result.data"
                    :key="index"
                    :class="[
                    {
                      '!bg-black text-white':
                        form.custom_order_reference_art_styles.includes(
                          item.id,
                        ),
                    },
                    {
                      'border-red-500':
                        v$.custom_order_reference_art_styles.$error &&
                        v$.custom_order_reference_art_styles.$dirty,
                    },
                  ]"
                    class="w-max bg-gray-200 border border-gray-200 cursor-pointer capitalize hover:bg-black hover:text-white transition-all rounded-full px-5 py-2  "
                    @click="
                    form.custom_order_reference_art_styles.includes(item.id)
                      ? (form.custom_order_reference_art_styles =
                          form.custom_order_reference_art_styles.filter(
                            (i) => i !== item.id,
                          ))
                      : form.custom_order_reference_art_styles.push(item.id)
                  "
                >
                  {{ item.translations[cur_lang].title }}
                </p>
              </div>
              <span
                  v-if="
                  v$.custom_order_reference_art_styles.$error &&
                  v$.custom_order_reference_art_styles.$dirty
                "
                  class="text-red-500 text-xs"
              >
                {{ $t("aboutAI.value") }}
              </span>
            </div>
            <div class="w-full md:w-3/5 flex flex-col gap-2 mb-12">
              <p class="text-xl font-semibold">
                {{ $t("commission.budget") }}
              </p>
              <div>
                <div class="flex gap-2 items-center">
                  <input
                      v-model="form.custom_order_budget"
                      :class="[
                      {
                        'border-red-500':
                          v$.custom_order_budget.$error &&
                          v$.custom_order_budget.$dirty,
                      },
                    ]"
                      :placeholder="$t('commission.budgetPlaceholder')"
                      class="border w-full py-3 px-4 text-sm rounded-lg "
                      type="number"
                  />
                  <p>$</p>
                </div>
                <span
                    v-if="
                    v$.custom_order_budget.$error &&
                    v$.custom_order_budget.$dirty
                  "
                    class="text-red-500 text-xs"
                >
                  {{ $t("aboutAI.value") }}
                </span>
              </div>
            </div>
            <div class="w-full md:w-3/5 flex flex-col gap-2 mb-12">
              <p class="text-xl font-semibold">
                {{ $t("commission.delAddress") }}
              </p>
              <div>
                <div class="flex items-center gap-2">
                  <select
                      id=""
                      v-model="form.custom_order_delivery_address_id"
                      :class="[
                      {
                        'border-red-500':
                          v$.custom_order_delivery_address_id.$error &&
                          v$.custom_order_delivery_address_id.$dirty,
                      },
                    ]"
                      class="w-full px-4 py-3 rounded-lg border border-bColor   "
                      name=""
                  >
                    <option :value="null">
                      {{ $t("cart.chooseAddress") }}
                    </option>
                    <option
                        v-for="(address, index) in addresses.result.data"
                        :key="index"
                        :value="address.id"
                    >
                      {{ address.delivery_address_full_address }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div class="w-full md:w-3/5 flex flex-col gap-2 mb-12">
              <p class="text-xl font-semibold">
                {{ $t("commission.description.title") }}
              </p>
              <textarea
                  v-model="form.custom_order_message"
                  :class="[
                  {
                    'border-red-500':
                      v$.custom_order_message.$error &&
                      v$.custom_order_message.$dirty,
                  },
                ]"
                  :placeholder="$t('commission.description.placeholder')"
                  class="w-full h-[167px] border border-gray-300 rounded-lg  py-3 px-4"
              />
              <div
                  class="flex justify-between items-center text-sm text-secondaryText"
              >
                <p v-if="form.custom_order_message">
                  {{ form.custom_order_message.length }} / 40
                  <span
                      :class="{
                      'text-red-500': form.custom_order_message.length > 1500,
                    }"
                  >(max: 1500)</span
                  >
                </p>
                <p class="text-end">
                  {{
                    $t(
                        "artistRegistration.profileSetup.secondStep.minimumCharacters",
                    )
                  }}
                </p>
              </div>
              <span
                  v-if="
                  v$.custom_order_message.$error &&
                  v$.custom_order_message.$dirty
                "
                  class="text-red-500 text-xs"
              >
                {{ $t("aboutAI.value") }}
              </span>
            </div>
            <div class="w-full md:w-3/5 flex flex-col gap-2 mb-12">
              <p class="text-xl font-semibold">
                {{ $t("commission.size.title") }}
              </p>
              <p class="text-[#757575]">
                {{ $t("commission.size.description") }}
              </p>
              <Listbox
                  v-model="artworkType"
                  as="div">
                <div class="relative mt-2">
                  <ListboxButton
                      :class="[
                        {
                          'border border-red-500':
                            v$.custom_order_dimensions.width.$error &&
                            v$.custom_order_dimensions.width.$dirty,
                        },
                      ]"
                      class="relative w-full cursor-default rounded-md bg-white py-3 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                    <span v-if="artworkType" class="block truncate">{{ artworkType.title }}</span>
                    <span v-else class="block truncate">{{ artworkTypes[0].title }}</span>
                    <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon aria-hidden="true" class="h-5 w-5 text-gray-400"/>
                    </span>
                  </ListboxButton>

                  <transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100"
                              leave-to-class="opacity-0">
                    <ListboxOptions
                        class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      <ListboxOption
                          v-for="(item, index) in artworkTypes"
                          :key="index"
                          v-slot="{ active, artworkType }"
                          :value="item"
                          as="template">
                        <li :class="[active ? 'bg-indigo-600 text-white' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-3 pr-9']">
                          <span :class="[artworkType ? 'font-semibold' : 'font-normal', 'block truncate']">{{
                              item.title
                            }}</span>

                          <span v-if="artworkType"
                                :class="[active ? 'text-white' : 'text-indigo-600', 'absolute inset-y-0 right-0 flex items-center pr-4']">
                <CheckIcon aria-hidden="true" class="h-5 w-5"/>
              </span>
                        </li>
                      </ListboxOption>
                    </ListboxOptions>
                  </transition>
                </div>
              </Listbox>
              <div
                  v-if="artworkType.type === 'custom'"
                  class="w-full flex flex-col gap-2">
                <div class="flex gap-3">
                  <div class="flex items-center gap-2">
                    <p>{{ $t("addArtwork.width") }}:</p>
                    <div>
                      <input
                          v-model="form.custom_order_dimensions.width"
                          :class="[
                        {
                          'border-red-500':
                            v$.custom_order_dimensions.width.$error &&
                            v$.custom_order_dimensions.width.$dirty,
                        },
                      ]"
                          class="border w-full text-sm rounded-lg  px-4 py-3"
                          placeholder="Please fill in the width"
                          type="number"
                      />
                      <span
                          v-if="
                        v$.custom_order_dimensions.width.$error &&
                        v$.custom_order_dimensions.width.$dirty
                      "
                          class="text-red-500 text-xs"
                      >
                      {{ $t("aboutAI.value") }}
                    </span>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <p>{{ $t("addArtwork.height") }}:</p>
                    <div>
                      <input
                          v-model="form.custom_order_dimensions.height"
                          :class="[
                        {
                          'border-red-500':
                            v$.custom_order_dimensions.height.$error &&
                            v$.custom_order_dimensions.height.$dirty,
                        },
                      ]"
                          class="border w-full text-sm rounded-lg  px-4 py-3"
                          placeholder="Please fill in the width"
                          type="number"
                      />
                      <span
                          v-if="
                        v$.custom_order_dimensions.height.$error &&
                        v$.custom_order_dimensions.height.$dirty
                      "
                          class="text-red-500 text-xs"
                      >
                      {{ $t("aboutAI.value") }}
                    </span>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <p>{{ $t("addArtwork.depth") }}:</p>
                    <div>
                      <input
                          v-model="form.custom_order_dimensions.length"
                          :class="[
                        {
                          'border-red-500':
                            v$.custom_order_dimensions.length.$error &&
                            v$.custom_order_dimensions.length.$dirty,
                        },
                      ]"
                          class="border w-full text-sm rounded-lg  px-4 py-3"
                          placeholder="Please fill in the width"
                          type="number"
                      />
                      <span
                          v-if="
                        v$.custom_order_dimensions.length.$error &&
                        v$.custom_order_dimensions.length.$dirty
                      "
                          class="text-red-500 text-xs"
                      >
                      {{ $t("aboutAI.value") }}
                    </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="w-full md:w-3/5 mb-12 flex flex-col gap-2">
              <p class="text-xl font-semibold">
                {{ $t("commission.timeline.title") }}
              </p>
              <p class="text-[#757575]">
                {{ $t("commission.timeline.description") }}
              </p>
              <div class="flex items-center gap-2">
                <select
                    v-model="form.custom_order_execution_days"
                    :class="[
      {
        'border-red-500':
          v$.custom_order_execution_days.$error &&
          v$.custom_order_execution_days.$dirty,
      },
    ]"
                    class="border select-m w-full p-4 rounded-lg font-bold "
                >
                  <option :value="null">
                    {{ $t("commission.timeline.select") }}
                  </option>
                  <option
                      v-for="item in orderExecutionDays"
                      :key="item"
                      :value="item"
                  >
                    {{ item }}
                  </option>
                </select>
                <p>{{ $t("commission.days") }}</p>
              </div>
              <span
                  v-if="
                  v$.custom_order_execution_days.$error &&
                  v$.custom_order_execution_days.$dirty
                "
                  class="text-red-500 text-xs"
              >
                {{ $t("aboutAI.value") }}
              </span>
            </div>
            <div class="w-full mb-12 flex flex-col gap-2">
              <div class="w-full md:w-3/5">
                <p class="text-base font-semibold mb-2">
                  {{ $t("commission.reference.title") }}
                </p>
                <p class="text-[#757575] mb-6">
                  {{ $t("commission.reference.description") }}
                </p>
                <UploadPhoto :button_type="true" @receive-photo="showImage"/>
              </div>
              <div class="w-full overflow-auto">
                <div class="flex gap-5">
                  <img
                      v-for="(item, index) of photos"
                      :key="index"
                      :src="item"
                      alt=""
                      class="w-[300px] h-[300px] object-contain"
                  />
                </div>
              </div>
              <span
                  v-if="
                  v$.custom_order_reference_images.$error &&
                  v$.custom_order_reference_images.$dirty
                "
                  class="text-red-500 text-xs"
              >
                {{ $t("aboutAI.value") }}
              </span>
            </div>
            <div class="w-full">
              <p class="text-xl font-semibold mb-6">
                {{ $t("commission.referenceArts") }}
              </p>
              <div v-if="artworks.artworksList" class="overflow-auto">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-y-4 sm:gap-x-5 sm:gap-y-5">
                  <div
                      v-for="(image, index) in artworks.artworksList.data
                      .objects_list"
                      :key="index"
                      :class="{
                      '!border-black':
                        form.custom_order_reference_arts.includes(image.id),
                    }"
                      class="flex flex-col p-4 bg-cardBg border border-cardBg mb-2 w-full h-auto"
                      @click="setRef(image.id)"
                  >
                    <img
                        :src="
                        runtimeConfig.public.ENDPOINTS_LINK +
                        image.art_item_images[0].full
                      "
                        alt="ArtistImage"
                        class="w-full h-full object-cover "
                    />
                    <p class="font-bold mt-4 text-base ">
                      {{ image.art_item_title }}
                    </p>
                    <p class="">
                      Starts from ${{ image.art_item_price }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <button
                class="py-4 w-full md:w-3/5 text-base font-bold mt-20 rounded-full bg-black text-white"
                type="submit"
            >
              {{ $t("commission.submit") }}
            </button>
          </div>
        </form>

        <div
            v-if="detailArtist"
            class="w-full md:w-[200px] min-w-[200px] md:border-l border-l-0 py-9"
        >
          <div class="pl-0 md:pl-10 md:mt-0 mt-4 h-full">
            <div>
              <img
                  v-if="detailArtist.data.artist_photo"
                  :src="
                  runtimeConfig.public.ENDPOINTS_LINK +
                  detailArtist.data.artist_photo.full
                "
                  alt="Artist Image"
                  class="w-[104px] h-[104px] object-cover rounded-full"
              />
              <div
                  v-else
                  class="w-[104px] h-[104px] rounded-full border p-5">
                <img
                    alt=""
                    class="w-full h-full object-contain"
                    src="@/assets/img/null.png">
              </div>
              <div class="mt-6 flex flex-col gap-3">
                <p class="text-2xl font-bold ">
                  {{ detailArtist.data.artist_base_info.translations[cur_lang].last_name }}
                  {{ detailArtist.data.artist_base_info.translations[cur_lang].first_name }}
                </p>
                <p class="text-neutral-500 capitalize">
                  {{ detailArtist.data.artist_base_info.country }},
                  {{ detailArtist.data.artist_base_info.state }},
                  {{ detailArtist.data.artist_base_info.city }}
                </p>
                <p class="text-neutral-500">
                  {{ detailArtist.data.artist_subscribers }}
                  {{ $t("commission.artist.followers") }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="flex justify-between">
          <div class="w-1/2 py-9">
            <div class="w-full flex">
              <div
                  class="flex flex-col gap-4 text-start mb-3 justify-start w-full"
              >
                <div class="skeleton h-12 w-full"/>
                <div class="skeleton h-4 w-full"/>
              </div>
            </div>
            <div>
              <div class="font-bold border-b-2 pb-3 flex gap-3 text-base mb-2">
                <div class="skeleton h-8 w-32"/>
                <div class="skeleton h-8 w-32"/>
                <div class="skeleton h-8 w-32"/>
              </div>

              <div
                  class="w-full flex flex-col gap-4 mb-10 md:flex-row justify-between"
              >
                <div
                    v-for="slide in 3"
                    :key="slide"
                    class="w-full flex justify-between pr-0 gap-4 mb-5 md:mb-0"
                >
                  <div class="skeleton h-[160px] w-full"/>
                </div>
              </div>
              <div class="skeleton h-4 w-full mb-4"/>
              <div class="skeleton h-40 w-full mb-12"/>
              <div>
                <div class="skeleton h-4 w-1/2 mb-4"/>
                <div class="skeleton h-4 w-full mb-4"/>
                <div class="skeleton h-12 w-44 rounded-xl"/>
              </div>
              <div class="mt-20">
                <div class="skeleton h-4 w-1/2 mb-4"/>
                <div class="skeleton h-4 w-full mb-4"/>
                <div class="skeleton h-12 w-44 rounded-xl"/>
              </div>
              <div class="skeleton h-4 w-full mt-20 mb-4"/>
              <div class="skeleton h-52 w-full mb-12"/>
              <div class="skeleton h-12 w-full rounded-full mt-20"/>
            </div>
          </div>
          <div class="py-9 flex flex-col justify-start w-52 border-l px-3">
            <div class="skeleton h-20 w-20 rounded-full"/>
            <div class="skeleton h-4 w-full mt-6"/>
            <div class="skeleton h-4 w-full mt-3"/>
            <div class="skeleton h-4 w-full mt-3"/>
            <div class="skeleton h-12 w-44 rounded-xl mt-4"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
