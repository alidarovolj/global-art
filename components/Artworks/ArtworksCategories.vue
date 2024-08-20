<script setup>
import {useCategoriesStore} from "~/store/categories.js";
import {useLanguagesStore} from "~/store/languages.js";

const {t} = useI18n();

const categoryTitle = ref("");
const emit = defineEmits(["changeURL"]);

const categories = useCategoriesStore();
const runtimeConfig = useRuntimeConfig();

const language = useLanguagesStore();
const {cur_lang} = storeToRefs(language);
const activeCategory = ref(null);

const route = useRoute();

const props = defineProps(["reqBody"]);

onMounted(async () => {
  await nextTick();
  await categories.getCategoriesList();
  if (props.reqBody.category_ids) {
    activeCategory.value = props.reqBody.category_ids[0];
    await nextTick();
    await categories.result.data.forEach((category) => {
      if (category.id === parseInt(activeCategory.value)) {
        categoryTitle.value =
            category.translations[cur_lang.value].art_category_title;
      }
    });
    changeURLByCategory(activeCategory.value, categoryTitle.value);
  }
});

function changeURLByCategory(id, title) {
  const form = {
    page_number: Number(route.query.currentPage) || 1,
    show_by: Number(route.query.show_by) || 10,
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
    art_item_material: [],
    art_item_style: [],
    cert: [],
    signature: [],
    category_ids: [],
    art_item_subject: [],
  };
  if (id) {
    form.category_ids.push(id);
  } else {
    form.category_ids = [];
  }
  emit("changeURL", form);
  categoryTitle.value = title;
  activeCategory.value = id;
}
</script>

<template>
  <section class="mb-16 ">
    <h1
        :class="{ 'mb-10': route.query.category_ids }"
        class="text-3xl md:text-5xl font-bold  "
    >
      {{ categoryTitle ? categoryTitle : t("artworks.explore") }}
    </h1>
    <p class="text-xl font-bold mt-2 ">
      {{ categoryTitle && t("artworks.browse") }}
    </p>
    <div v-if="categories.result" class="overflow-x-auto md:overflow-hidden">
      <div class="flex flex-row justify-between items-center gap-4">
        <div
            v-for="category in categories.result.data"
            :key="category.id"
            :class="{
            'border !border-gray-300 ':
              category.id === parseInt(activeCategory),
          }"
            class="mt-4 w-full md:w-full p-3 rounded-2xl border hover:border-gray-300  border-white cursor-pointer"
            @click="
            () =>
              changeURLByCategory(
                category.id,
                category.translations[cur_lang].art_category_title,
              )
          "
        >
          <img
              :key="category.id"
              :src="
              runtimeConfig.public.ENDPOINTS_LINK + category.params.image.full
            "
              alt="category"
              class="w-full h-[100px] object-cover object-top"
          />
          <p class="mt-1">
            {{ category.translations[cur_lang].art_category_title }}
          </p>
        </div>
      </div>
    </div>
    <div v-else class="flex flex-wrap justify-between mt-4">
      <div v-for="(_, index) of 6" :key="index" class="w-full md:w-sixth">
        <div class="skeleton h-[120px] w-full mb-2"/>
        <div class="skeleton h-4 w-1/2"/>
      </div>
    </div>
  </section>
</template>
