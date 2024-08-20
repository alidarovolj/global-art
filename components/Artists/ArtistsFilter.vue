<script setup>
import {Dialog, DialogPanel, TransitionChild, TransitionRoot} from '@headlessui/vue'
import {AdjustmentsHorizontalIcon, XMarkIcon} from '@heroicons/vue/24/outline'
import {useCategoriesStore} from "~/store/categories.js";
import {useArtOptions} from "~/store/artOptions.js";
import {useLanguagesStore} from "~/store/languages.js";

const languages = useLanguagesStore();
const categories = useCategoriesStore();
const artOptions = useArtOptions();

const open = ref(false);
const {cur_lang} = storeToRefs(languages);

const route = useRoute();

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
  artist_is_available: null,
  artist_art_categories: [],
  artist_art_materials: [],
  artist_art_styles: [],
  artist_art_subjects: [],
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
    emit("changeURL", filters.value);
  }
};

async function resetFilter() {
  filters.value = {
    page_number: Number(route.query.currentPage) || 1,
    show_by: Number(route.query.show_by) || 20,
    artist_is_available: true,
    artist_art_categories: [],
    artist_art_materials: [],
    artist_art_styles: [],
    artist_art_subjects: [],
  };
  emit("changeURL", filters.value);
  toasts.showToast("success", "Filters successfully reset", "You can now view all artworks.");
  open.value = false;
}

watch(
    props,
    (newProps) => {
      filters.value = newProps.filtersBody;
    },
    {deep: true},
);

watch(
    open,
    async (newState) => {
      if (newState === true) {
        await categories.getCategoriesList();
        await artOptions.getArtStyles();
        await artOptions.getArtMaterials();
        await artOptions.getSubjects();
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
                    <div>
                      <div
                          class="form-control pb-6 border-b border-gray  "
                      >
                        <h2 class="text-2xl font-bold">
                          {{ $t("artistFilter.filter") }}
                        </h2>
                        <label class="cursor-pointer flex gap-2 mt-6">
                          <input
                              v-model="filters.artist_is_available"
                              checked="checked"
                              class="checkbox "
                              type="checkbox"
                          />
                          <span class="label-text font-bold ">
                  {{ $t("artistFilter.artwork") }}
                </span>
                        </label>
                      </div>
                      <div
                          v-if="categories.result"
                          class="mt-6 pb-6 border-b border-gray  "
                      >
                        <h3 class="font-bold">
                          {{ $t("artistFilter.type") }}
                        </h3>
                        <label
                            v-for="category in categories.result.data"
                            :key="category.id"
                            class="cursor-pointer flex gap-2 mt-6"
                        >
                          <input
                              :checked="
                    elementsPicked(filters.artist_art_categories, category.id)
                  "
                              class="checkbox "
                              type="checkbox"
                              @change="
                    updateFilterArray(
                      filters.artist_art_categories,
                      category.id,
                    )
                  "
                          />
                          <span class="label-text ">{{
                              category.translations[cur_lang].art_category_title
                            }}</span>
                        </label>
                      </div>
                      <div
                          v-if="artOptions.resultMaterials"
                          class="mt-6 pb-6 border-b border-gray  "
                      >
                        <h3 class="font-bold">
                          {{ $t("artistFilter.materials") }}
                        </h3>
                        <div class="h-72 overflow-y-scroll">
                          <label
                              v-for="material in artOptions.resultMaterials.data"
                              :key="material.id"
                              class="cursor-pointer flex gap-2 mt-6"
                          >
                            <input
                                :checked="
                      elementsPicked(filters.artist_art_materials, material.id)
                    "
                                class="checkbox "
                                type="checkbox"
                                @change="
                      updateFilterArray(
                        filters.artist_art_materials,
                        material.id,
                      )
                    "
                            />
                            <span class="label-text ">{{
                                material.translations[cur_lang].title
                              }}</span>
                          </label>
                        </div>
                      </div>
                      <div
                          v-if="artOptions.result"
                          class="mt-6 pb-6 border-b border-gray  "
                      >
                        <h3 class="font-bold">
                          {{ $t("artistFilter.styles") }}
                        </h3>
                        <div class="h-72 overflow-y-scroll">
                          <label
                              v-for="style in artOptions.result.data"
                              :key="style.id"
                              class="cursor-pointer flex gap-2 mt-6"
                          >
                            <input
                                :checked="
                      elementsPicked(filters.artist_art_styles, style.id)
                    "
                                class="checkbox "
                                type="checkbox"
                                @change="
                      updateFilterArray(filters.artist_art_styles, style.id)
                    "
                            />
                            <span class="label-text ">{{
                                style.translations[cur_lang].title
                              }}</span>
                          </label>
                        </div>
                      </div>
                      <div
                          v-if="artOptions.resultSubjects"
                          class="mt-6 pb-6 border-b border-gray "
                      >
                        <h3 class="font-bold ">
                          {{ $t("artistProfile.dashboard.subjects") }}
                        </h3>
                        <div class="h-72 overflow-y-scroll">
                          <label
                              v-for="subject in artOptions.resultSubjects.data"
                              :key="subject.id"
                              class="cursor-pointer flex gap-2 mt-6"
                          >
                            <input
                                :checked="
                      elementsPicked(filters.artist_art_subjects, subject.id)
                    "
                                class="checkbox "
                                type="checkbox"
                                @change="
                      updateFilterArray(filters.artist_art_subjects, subject.id)
                    "
                            />
                            <span class="label-text capitalize ">
                    {{ subject.translations[cur_lang].title }}
                  </span>
                          </label>
                        </div>
                      </div>

                      <div
                          class="mt-6 pb-6 border-b border-gray  "
                      >
                        <div
                            class="flex flex-col items-center justify-between gap-2 my-4"
                        >
                          <Base-button
                              class="w-full py-3"
                              type="button"
                              @click="resetFilter"
                          >
                            {{ $t("artistFilter.reset") }}
                          </Base-button>
                        </div>
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
