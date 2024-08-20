<script setup>
import {useLanguagesStore} from "~/store/languages.js";
import {onMounted} from "vue";
import {useArtOptions} from "~/store/artOptions.js";
import {useCategoriesStore} from "~/store/categories.js";

const artistRegistrationStore = useArtistRegistrationStore();

const artOptions = useArtOptions();
const categories = useCategoriesStore();
const languages = useLanguagesStore();
const {cur_lang} = storeToRefs(languages);
const loading = ref(false);

function addElementToArray(array, element) {
  const index = array.indexOf(element);
  if (index === -1) {
    array.push(element);
  } else {
    array.splice(index, 1);
  }
}

const toasts = useToastsStore()

onMounted(async () => {
  await categories.getCategoriesList();
  await artOptions.getArtStyles();
  await artOptions.getArtMaterials();
  await artOptions.getArtRarity();
  await artOptions.getSubjects();
});

const form = ref({
  title: "",
  alias: "",
  language: cur_lang.value,
});
</script>

<template>
  <div class="text-sm">
    <div class="mb-11">
      <h3 class="text-3xl font-bold mb-2  ">
        {{ $t("artistRegistration.profileSetup.fourthStep.describeYourStyle") }}
      </h3>
    </div>
    <div class="mb-14">
      <p class="text-black font-bold mb-1 ">
        {{ $t("artistRegistration.profileSetup.fourthStep.category") }}
        <span class="text-red-500">*</span>
      </p>
      <p class="text-[#757575] text-sm mb-3">
        {{ $t("artistRegistration.profileSetup.fourthStep.chooseAtLeast") }}
      </p>
      <div v-if="categories.result" class="flex flex-wrap gap-4">
        <p
            v-for="(item, index) of categories.result.data"
            :key="index"
            :class="{
            '!bg-black text-white':
              artistRegistrationStore.form.artist_art_categories.includes(
                item.id,
              ),
          }"
            class="w-max bg-none border border-[#CCCCCC] cursor-pointer capitalize hover:bg-black hover:text-white transition-all rounded-full px-4 py-2  "
            @click="
            addElementToArray(
              artistRegistrationStore.form.artist_art_categories,
              item.id,
            )
          "
        >
          {{ item.translations[cur_lang].art_category_title }}
        </p>
      </div>
      <div v-else>
        <div class="spinner p-4"/>
      </div>
    </div>
    <div class="mb-14">
      <p class="text-black font-bold mb-1 ">
        {{ $t("artistRegistration.profileSetup.fourthStep.materials") }}
        <span class="text-red-500">*</span>
      </p>
      <p class="text-[#757575] text-sm mb-3">
        {{ $t("artistRegistration.profileSetup.fourthStep.chooseAtLeast") }}
      </p>
      <div v-if="artOptions.resultMaterials" class="flex flex-wrap gap-4">
        <p
            v-for="(item, index) of artOptions.resultMaterials.data"
            :key="index"
            :class="{
            '!bg-black text-white':
              artistRegistrationStore.form.artist_art_materials.includes(
                item.id,
              ),
          }"
            class="w-max border border-[#CCCCCC] cursor-pointer capitalize hover:bg-black hover:text-white transition-all rounded-full px-4 py-2  "
            @click="
            addElementToArray(
              artistRegistrationStore.form.artist_art_materials,
              item.id,
            )
          "
        >
          {{ item.translations[cur_lang].title }}
        </p>
      </div>
      <div v-else>
        <div class="spinner p-4"/>
      </div>
    </div>
    <div class="mb-14">
      <p class="text-black font-bold mb-1 ">
        {{ $t("artistRegistration.profileSetup.fourthStep.styles") }}
        <span class="text-red-500">*</span>
      </p>
      <p class="text-[#757575] text-sm mb-3">
        {{ $t("artistRegistration.profileSetup.fourthStep.chooseAtLeast") }}
      </p>
      <div v-if="artOptions.result" class="flex flex-wrap gap-4">
        <p
            v-for="(item, index) of artOptions.result.data"
            :key="index"
            :class="{
            '!bg-black text-white':
              artistRegistrationStore.form.artist_art_styles.includes(item.id),
          }"
            class="w-max border border-[#CCCCCC] cursor-pointer capitalize hover:bg-black hover:text-white transition-all rounded-full px-4 py-2  "
            @click="
            addElementToArray(
              artistRegistrationStore.form.artist_art_styles,
              item.id,
            )
          "
        >
          {{ item.translations[cur_lang].title }}
        </p>
      </div>
      <div v-else>
        <div class="spinner p-4"/>
      </div>
    </div>
    <div class="mb-14">
      <p class="text-black font-bold mb-1 ">
        {{ $t("artistRegistration.profileSetup.fourthStep.subject") }}
        <span class="text-red-500">*</span>
      </p>
      <p class="text-[#757575] text-sm mb-3">
        {{ $t("artistRegistration.profileSetup.fourthStep.chooseAtLeast") }}
      </p>
      <div v-if="artOptions.resultSubjects" class="flex flex-wrap gap-4">
        <p
            v-for="(item, index) of artOptions.resultSubjects.data"
            :key="index"
            :class="{
            '!bg-black text-white':
              artistRegistrationStore.form.artist_art_subjects.includes(
                item.id,
              ),
          }"
            class="w-max border border-[#CCCCCC] cursor-pointer capitalize hover:bg-black hover:text-white transition-all rounded-full px-4 py-2  "
            @click="
            addElementToArray(
              artistRegistrationStore.form.artist_art_subjects,
              item.id,
            )
          "
        >
          {{ item.translations[cur_lang].title }}
        </p>
      </div>
      <div v-else>
        <div class="spinner p-4"/>
      </div>
    </div>
  </div>
</template>
