<script setup>
import {storeToRefs} from "pinia";
import {useLanguagesStore} from "~/store/languages.js";
import {useModalsStore} from "~/store/modals.js";
import {onMounted} from "vue";

const runtimeConfig = useRuntimeConfig();
const localePath = useLocalePath();
const languages = useLanguagesStore()
const {cur_lang} = storeToRefs(languages);
const modals = useModalsStore()

const pending = ref(true);

const user = useUserStore();

const artistProfileStore = useArtistProfileStore();
const {resultOrders} = storeToRefs(artistProfileStore)
const {artistOrders} = artistProfileStore;

const {t} = useI18n();

const requestBody = ref({
  page_number: 1,
  show_by: 20,
  app_user_order_id: null,
  date_from: null,
  date_to: null,
  amount_from: null,
  amount_to: null,
  app_user_ids: [],
  artist_ids: []
});

onMounted(async () => {
  pending.value = true;
  await nextTick();
  await user.getProfile();
  await artistOrders(requestBody.value);
  pending.value = false;
});

useHead({
  title: t("headers.artist_profile.pages.artworks.title"),
  meta: [
    {
      property: "description",
      content: t("headers.artist_profile.pages.artworks.description"),
    },
    {
      property: "og:description",
      content: t("headers.artist_profile.pages.artworks.description"),
    },
    {
      property: "og:title",
      content: t("headers.artist_profile.pages.artworks.title"),
    },
    {
      property: "og:url",
      content: t("headers.artist_profile.pages.artworks.og_url"),
    },
  ],
  link: [
    {
      rel: "canonical",
      href: t("headers.artist_profile.pages.artworks.canonical"),
    },
  ],
});
</script>

<template>
  <div class="container mx-auto px-4 md:px-0 ">
    <div class="flex items-center justify-between mb-10 ">
      <h1 class="text-3xl md:text-5xl  font-bold">
        {{ $t("header.orders") }}
      </h1>
    </div>
    <div v-if="!pending">
      <div v-if="resultOrders.data.objects_list.length > 0">
        <div class="mt-8 flow-root">
          <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table class="min-w-full divide-y divide-gray-300">
                <thead>
                <tr>
                  <th
                      class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                      scope="col">
                    {{ $t('addArtwork.artwork') }}
                  </th>
                  <th
                      class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      scope="col">
                    {{ $t('addArtwork.dimensions') }}
                  </th>
                  <th
                      class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      scope="col">
                    {{ $t('addArtwork.preview.category') }}
                  </th>
                  <th
                      class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      scope="col">
                    {{ $t('addArtwork.preview.price') }}
                  </th>
                  <th
                      class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      scope="col">
                    {{ $t('artistProfile.artworks.info.validateStatus') }}
                  </th>
                  <th
                      class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      scope="col">
                    {{ $t('categories.artworksFilter.sold') }}
                  </th>
                  <th
                      class="relative py-3.5 pl-3 pr-4 sm:pr-0"
                      scope="col">
                    <span class="sr-only">{{ $t('profile.profile.edit') }}</span>
                  </th>
                </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white">
                <tr
                    v-for="(item, index) in resultOrders.data.objects_list"
                    :key="index">
                  <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                    <div class="flex items-center gap-3">
                      <div class="h-11 w-11 flex-shrink-0">
                        <img
                            :src="
                  runtimeConfig.public.ENDPOINTS_LINK +
                  item.app_user_order_item_art_item.art_item_images[0].full
                "
                            alt="artwork"
                            class="h-11 w-11 rounded-full"
                        />
                      </div>
                      <div class="ml-4">
                        <div class="font-medium text-gray-900">
                          {{ item.app_user_order_item_art_item.art_item_title }}
                        </div>
                        <div class="mt-1">
                          <p
                              v-for="(item, index) of item.app_user_order_item_art_item.art_item_materials"
                              :key="index"
                              class="font-medium text-gray-500">
                            {{ item.translations[cur_lang].title }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                    <div class="text-gray-900">
                      {{ item.app_user_order_item_art_item.art_item_params.size.width }} x
                      {{ item.app_user_order_item_art_item.art_item_params.size.height }}
                    </div>
                  </td>
                  <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                    <div class="text-gray-900">
                      {{
                        item.app_user_order_item_art_item.art_item_category.translations[cur_lang].art_category_title
                      }}
                    </div>
                  </td>
                  <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                    <div class="text-gray-900"> $ {{ item.app_user_order_item_art_item.art_item_base_price }}</div>
                    <div class="mt-1 text-gray-500">$ {{ item.app_user_order_item_art_item.art_item_price }}</div>
                  </td>
                  <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                    <span
                        v-if="!item.app_user_order_item_art_item.art_item_is_validated"
                        class="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20"
                    >
                      {{ $t("artistProfile.artworks.info.notValidated") }}
                    </span>
                    <span
                        v-else
                        class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20"
                    >
                      {{ $t("artistProfile.artworks.info.validateStatus") }}
                    </span>
                  </td>
                  <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                    <span
                        v-if="!item.app_user_order_item_art_item.art_item_is_sold"
                        class="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20"
                    >
                      {{ $t("categories.artworksFilter.sale") }}
                    </span>
                    <span
                        v-else
                        class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20"
                    >
                      {{ $t("categories.artworksFilter.sold") }}
                    </span>
                  </td>
                  <td class="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                    <p
                        v-if="item.app_user_order_item_art_item.art_item_is_sold"
                        class="w-max px-3 py-1 text-xs border border-green-200 rounded-md bg-green-100 text-green-500 cursor-pointer"
                        @click="modals.showModal('SetReadyToSend', item)">
                      {{ $t('artistProfile.artworks.ready_to_send') }}
                    </p>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <NoElements
          v-else
          :text="$t('artistProfile.noElements.text')"
          :title="$t('artistProfile.noElements.title')"
      />
    </div>
    <div v-else>
      <div class="border rounded-lg p-2">
        <div
            v-for="(_, index) of 10"
            :key="index">
          <div class="flex justify-between mb-3 border p-2 rounded-lg gap-3">
            <div
                :class="{ 'bg-[#989898]' : index === 0 }"
                class="skeleton w-10 h-4"
            ></div>
            <div
                :class="{ 'bg-[#989898]' : index === 0 }"
                class="skeleton w-20 h-4"></div>
            <div
                :class="{ 'bg-[#989898]' : index === 0 }"
                class="skeleton w-32 h-4"></div>
            <div
                :class="{ 'bg-[#989898]' : index === 0 }"
                class="skeleton w-1/2 h-4"></div>
            <div
                :class="{ 'bg-[#989898]' : index === 0 }"
                class="skeleton w-1/2 h-4"></div>
            <div
                :class="{ 'bg-[#989898]' : index === 0 }"
                class="skeleton w-20 h-4"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
