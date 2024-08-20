<script setup>
import {useArtOptions} from "~/store/artOptions.js";
import {useLanguagesStore} from "~/store/languages.js";
import {Dialog, DialogPanel, TransitionChild, TransitionRoot} from '@headlessui/vue'
import {AdjustmentsHorizontalIcon, XMarkIcon} from '@heroicons/vue/24/outline'

const open = ref(false)

const artOptions = useArtOptions();
const languages = useLanguagesStore();
const {cur_lang} = storeToRefs(languages);
const route = useRoute();
const artists = useArtistsStore()

const toasts = useToastsStore()

const emit = defineEmits(["changeURL"]);
const props = defineProps({
  filtersBody: {
    type: Object,
    required: true,
  },
});

const filters = ref({
  page_number: Number(route.query.currentPage) || 1,
  show_by: Number(route.query.show_by) || 20,
  only_ids: [],
  exclude_ids: [],
  search_text: null,
  year_from: null,
  year_to: null,
  price_from: null,
  price_to: null,
  artist_ids: [],
  art_item_is_for_sale: null,
  art_item_is_sold: null,
  art_item_is_validated: null,
  rarity: [],
  signature: [],
  cert: [],
  art_item_material: [],
  art_item_style: [],
  art_item_subject: [],
});

const elementsPicked = (element, movement) => {
  return element.includes(movement);
};

const updateFilterArray = (filterArray, value) => {
  const index = filterArray.indexOf(value);
  if (index === -1) {
    filterArray.push(value);
  } else {
    filterArray.splice(index, 1);
  }
  emit("changeURL", filters.value);
};

function resetFilter() {
  filters.value = {
    page_number: Number(route.query.currentPage) || 1,
    show_by: Number(route.query.show_by) || 20,
    only_ids: [],
    exclude_ids: [],
    category_ids: [],
    search_text: null,
    year_from: null,
    year_to: null,
    price_from: null,
    price_to: null,
    artist_ids: [],
    art_item_is_for_sale: null,
    art_item_is_sold: null,
    art_item_is_validated: null,
    rarity: [],
    signature: [],
    cert: [],
    art_item_material: [],
    art_item_style: [],
    art_item_subject: [],
  };
  emit("changeURL", filters.value);
  toasts.showToast("success", "Filters successfully reset", "You can now view all artworks.");
  open.value = false;
}

const requestBody = ref({
  page_number: Number(route.query.currentPage) || 1,
  show_by: Number(route.query.show_by) || 100,
  artist_is_available: route.query.artist_is_available || null,
  artist_art_categories: route.query.artist_art_categories || [],
  artist_material: route.query.artist_material || [],
  artist_art_style: route.query.artist_art_style || [],
  artist_art_subjects: route.query.artist_art_subjects || [],
});

watch(
    props,
    (newProps) => {
      filters.value = newProps.filtersBody;
    },
    {deep: true},
);

watch(
    open,
    async (newValue) => {
      if (newValue === true) {
        await artOptions.getArtRarity();
        await artOptions.getSignatures();
        await artOptions.getAuthCerts();
        await artOptions.getArtMaterials();
        await artOptions.getArtStyles();
        await artOptions.getSubjects();
        await artists.getArtistList(requestBody.value);
      }
    },
    {deep: true},
);
</script>

<template>
  <div
      class="border py-3 cursor-pointer px-6 bg-white rounded-3xl w-full md:w-max hover:bg-gray-100 mb-4 md:mb-0 flex items-center gap-2"
      @click="open = !open"
  >
    <AdjustmentsHorizontalIcon class="w-5 h-5"/>
    <span>{{ $t("categories.artworksFilter.showFilter") }}</span>
  </div>

  <TransitionRoot :show="open" as="template">
    <Dialog class="relative z-10" @close="open = false">
      <TransitionChild as="template" enter="ease-in-out duration-500" enter-from="opacity-0" enter-to="opacity-100"
                       leave="ease-in-out duration-500" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
      </TransitionChild>

      <div class="fixed inset-0 overflow-hidden">
        <div class="absolute inset-0 overflow-hidden">
          <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <TransitionChild as="template" enter="transform transition ease-in-out duration-500 sm:duration-700"
                             enter-from="translate-x-full" enter-to="translate-x-0"
                             leave="transform transition ease-in-out duration-500 sm:duration-700"
                             leave-from="translate-x-0" leave-to="translate-x-full">
              <DialogPanel class="pointer-events-auto relative w-screen max-w-md">
                <TransitionChild as="template" enter="ease-in-out duration-500" enter-from="opacity-0"
                                 enter-to="opacity-100" leave="ease-in-out duration-500" leave-from="opacity-100"
                                 leave-to="opacity-0">
                  <div class="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
                    <button
                        class="relative rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                        type="button"
                        @click="open = false">
                      <span class="absolute -inset-2.5"/>
                      <span class="sr-only">Close panel</span>
                      <XMarkIcon aria-hidden="true" class="h-6 w-6"/>
                    </button>
                  </div>
                </TransitionChild>
                <div class="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                  <div class="relative flex-1 px-4 sm:px-6">
                    <div class="w-full bg-base-200 text-base-content ">
                      <div>
                        <div class="pb-6 border-b border-gray ">
                          <h4 class="text-xl font-bold ">
                            {{ $t("categories.artworksFilter.year") }}
                          </h4>
                          <div class="flex justify-between">
                            <div
                                class="w-half mt-4 p-2 border border-solid border-gray  rounded-xl"
                            >
                              <p class="">
                                {{ $t("categories.artworksFilter.from") }}
                              </p>
                              <div class="flex">
                                <input
                                    v-model="filters.year_from"
                                    class="w-14 bg-zinc-100  "
                                    placeholder="0"
                                    type="number"
                                />
                                <span class="">
                    {{ $t("categories.artworksFilter.y") }}
                  </span>
                              </div>
                            </div>
                            <div
                                class="w-half mt-4 p-2 border border-solid border-gray  rounded-xl "
                            >
                              <p>
                                {{ $t("categories.artworksFilter.to") }}
                              </p>
                              <div>
                                <input
                                    v-model="filters.year_to"
                                    class="w-14 bg-zinc-100 "
                                    placeholder="1000"
                                    type="number"
                                />
                                <span>
                    {{ $t("categories.artworksFilter.y") }}
                  </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                            class="mt-6 pb-6 border-b border-gray  "
                        >
                          <h4 class="text-xl font-bold">
                            {{ $t("categories.artworksFilter.price") }}, $
                          </h4>
                          <div class="flex justify-between">
                            <div
                                class="w-half mt-4 p-2 border border-solid border-gray rounded-xl "
                            >
                              <p>
                                {{ $t("categories.artworksFilter.minimum") }}
                              </p>
                              <div class="flex">
                                <input
                                    v-model="filters.price_from"
                                    class="w-14 bg-zinc-100  "
                                    placeholder="0"
                                    type="text"
                                />
                                <span>$</span>
                              </div>
                            </div>
                            <div
                                class="w-half mt-4 p-2 border border-solid border-gray rounded-xl "
                            >
                              <p>
                                {{ $t("categories.artworksFilter.maximum") }}
                              </p>
                              <div>
                                <input
                                    v-model="filters.price_to"
                                    class="w-14 bg-zinc-100  "
                                    placeholder="1000"
                                    type="text"
                                />
                                <span>$</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                            class="form-control flex py-6 border-b border-gray "
                        >
                          <label class="cursor-pointer flex gap-2">
                            <input
                                v-model="filters.art_item_is_for_sale"
                                checked="checked"
                                class="checkbox "
                                type="checkbox"
                            />
                            <span class="label-text font-bold ">
                {{ $t("categories.artworksFilter.sale") }}
              </span>
                          </label>
                        </div>
                        <div
                            class="form-control flex py-6 border-b border-gray "
                        >
                          <label class="cursor-pointer flex gap-2">
                            <input
                                v-model="filters.art_item_is_sold"
                                class="checkbox "
                                type="checkbox"
                            />
                            <span class="label-text font-bold ">
                {{ $t("categories.artworksFilter.sold") }}
              </span>
                          </label>
                        </div>
                        <div
                            v-if="artOptions.result"
                            class="mt-6 pb-6 border-b border-gray "
                        >
                          <h3 class="font-bold ">
                            {{ $t("categories.artworksFilter.styles") }}
                          </h3>
                          <div class="h-72 overflow-y-scroll">
                            <label
                                v-for="style in artOptions.result.data"
                                :key="style.id"
                                class="cursor-pointer flex gap-2 mt-6"
                            >
                              <input
                                  :checked="elementsPicked(filters.art_item_style, style.id)"
                                  class="checkbox "
                                  type="checkbox"
                                  @change="updateFilterArray(filters.art_item_style, style.id)"
                              />
                              <span class="label-text capitalize ">
                                {{ style.translations[cur_lang].title }}
                              </span>
                            </label>
                          </div>
                        </div>
                        <div
                            v-if="artists.artistList"
                            class="mt-6 pb-6 border-b border-gray "
                        >
                          <h3 class="font-bold ">
                            {{ $t("header.links.artists") }}
                          </h3>
                          <div class="h-72 overflow-y-scroll">
                            <label
                                v-for="artist in artists.artistList.data.objects_list"
                                :key="artist.id"
                                class="cursor-pointer flex gap-2 mt-6"
                            >
                              <input
                                  :checked="elementsPicked(filters.artist_ids, artist.id)"
                                  class="checkbox "
                                  type="checkbox"
                                  @change="updateFilterArray(filters.artist_ids, artist.id)"
                              />
                              <span class="label-text capitalize ">
                                {{ artist.artist_base_info.translations[cur_lang].first_name }}
                                {{ artist.artist_base_info.translations[cur_lang].last_name }}
                              </span>
                            </label>
                          </div>
                        </div>
                        <div
                            v-if="artOptions.resultRarity"
                            class="mt-6 pb-6 border-b border-gray "
                        >
                          <h3 class="font-bold ">
                            {{ $t("categories.artworksFilter.rarity") }}
                          </h3>
                          <label
                              v-for="rarity in artOptions.resultRarity.data"
                              :key="rarity.id"
                              class="cursor-pointer flex gap-2 mt-6"
                          >
                            <input
                                :checked="elementsPicked(filters.rarity, rarity.id)"
                                class="checkbox "
                                type="checkbox"
                                @change="updateFilterArray(filters.rarity, rarity.id)"
                            />
                            <span class="label-text capitalize ">
                {{ rarity.translations[cur_lang].title }}
              </span>
                          </label>
                        </div>
                        <div
                            v-if="artOptions.resultMaterials"
                            class="mt-6 pb-6 border-b border-gray "
                        >
                          <h3 class="font-bold ">
                            {{ $t("categories.artworksFilter.materials") }}
                          </h3>
                          <div class="h-72 overflow-y-scroll">
                            <label
                                v-for="material in artOptions.resultMaterials.data"
                                :key="material.id"
                                class="cursor-pointer flex gap-2 mt-6"
                            >
                              <input
                                  :checked="
                    elementsPicked(filters.art_item_material, material.id)
                  "
                                  class="checkbox "
                                  type="checkbox"
                                  @change="
                    updateFilterArray(filters.art_item_material, material.id)
                  "
                              />
                              <span class="label-text capitalize ">
                  {{ material.translations[cur_lang].title }}
                </span>
                            </label>
                          </div>
                        </div>
                        <div
                            v-if="artOptions.resultCerts"
                            class="mt-6 pb-6 border-b border-gray "
                        >
                          <h3 class="font-bold ">
                            {{ $t("categories.artworksFilter.certs") }}
                          </h3>
                          <label
                              v-for="cert in artOptions.resultCerts.data"
                              :key="cert.id"
                              class="cursor-pointer flex gap-2 mt-6"
                          >
                            <input
                                :checked="elementsPicked(filters.cert, cert.id)"
                                class="checkbox "
                                type="checkbox"
                                @change="updateFilterArray(filters.cert, cert.id)"
                            />
                            <span class="label-text capitalize ">
                {{ cert.translations[cur_lang].title }}
              </span>
                          </label>
                        </div>
                        <div
                            v-if="artOptions.resultSignatures"
                            class="mt-6 pb-6 border-b border-gray "
                        >
                          <h3 class="font-bold ">
                            {{ $t("categories.artworksFilter.signatures") }}
                          </h3>
                          <label
                              v-for="signature in artOptions.resultSignatures.data"
                              :key="signature.id"
                              class="cursor-pointer flex gap-2 mt-6"
                          >
                            <input
                                :checked="elementsPicked(filters.signature, signature.id)"
                                class="checkbox "
                                type="checkbox"
                                @change="updateFilterArray(filters.signature, signature.id)"
                            />
                            <span class="label-text capitalize ">
                {{ signature.translations[cur_lang].title }}
              </span>
                          </label>
                        </div>
                        <div
                            v-if="artOptions.resultSubjects"
                            class="mt-6 pb-6 border-b border-gray "
                        >
                          <h3 class="font-bold ">Subjects</h3>
                          <div class="h-72 overflow-y-scroll">
                            <label
                                v-for="subject in artOptions.resultSubjects.data"
                                :key="subject.id"
                                class="cursor-pointer flex gap-2 mt-6"
                            >
                              <input
                                  :checked="
                    elementsPicked(filters.art_item_subject, subject.id)
                  "
                                  class="checkbox "
                                  type="checkbox"
                                  @change="
                    updateFilterArray(filters.art_item_subject, subject.id)
                  "
                              />
                              <span class="label-text capitalize ">
                  {{ subject.translations[cur_lang].title }}
                </span>
                            </label>
                          </div>
                        </div>
                      </div>
                      <div class="flex flex-col items-center justify-between gap-2 my-4">
                        <Base-button class="w-full py-3" @click="resetFilter">
                          {{ $t("categories.artworksFilter.reset") }}
                        </Base-button>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
