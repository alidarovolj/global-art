<script setup>
import {useCategoriesStore} from "~/store/categories.js";
import {useLanguagesStore} from "~/store/languages.js";

const localePath = useLocalePath();

const categories = useCategoriesStore();
const {result} = storeToRefs(categories);

const language = useLanguagesStore();
const {cur_lang} = storeToRefs(language);

const runtimeConfig = useRuntimeConfig();

onMounted(async () => {
  await nextTick();
  await categories.getCategoriesList();
});
</script>

<template>
  <section class="mb-20 border-b border-bColor  pb-20">
    <div>
      <h2 class="text-3xl font-bold mb-8  ">
        {{ $t("mainPage.categories.shopBy") }}
      </h2>

      <div v-if="categories.result" class="overflow-x-auto md:overflow-hidden">
        <div
            class="flex flex-row flex-nowrap md:flex-wrap justify-between items-center gap-4"
        >
          <NuxtLink
              v-for="category in categories.result.data"
              :key="category.id"

              :to="localePath('/artworks?category_ids=' + category.id)"
              class="mt-4 w-[150px] min-w-[150px] md:w-[32%] rounded-2xl cursor-pointer"
          >
            <img
                :key="category.id"
                :src="
                runtimeConfig.public.ENDPOINTS_LINK + category.params.image.full
              "
                alt="category"
                class="w-full h-[100px] md:h-[270px] object-cover object-top"
            />
            <p class="mt-1 font-bold">
              {{ category.translations[cur_lang].art_category_title }}
            </p>
          </NuxtLink>
        </div>
      </div>
      <div v-else class="flex flex-wrap justify-between mt-4">
        <div v-for="(_, index) of 6" :key="index" class="w-full md:w-sixth">
          <div class="skeleton h-[120px] w-full mb-2"/>
          <div class="skeleton h-4 w-1/2"/>
        </div>
      </div>
    </div>
  </section>
</template>
