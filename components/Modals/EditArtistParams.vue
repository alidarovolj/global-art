<script setup>
import {useArtOptions} from "~/store/artOptions.js";
import {useCategoriesStore} from "~/store/categories.js";
import {useLanguagesStore} from "~/store/languages.js";

const artistRegistrationStore = useArtistRegistrationStore();
const {form} = storeToRefs(artistRegistrationStore);

const artOptions = useArtOptions();
const categoriesStore = useCategoriesStore();
const modals = useModalsStore();
const languages = useLanguagesStore();
const {cur_lang} = storeToRefs(languages);

function addElementToArray(array, element) {
  const index = array.indexOf(element);
  if (index === -1) {
    array.push(element);
  } else {
    array.splice(index, 1);
  }
}
</script>

<template>
  <div>
    <h2 class="text-center font-semibold border-grey border-b pb-4 mb-4">
      {{ $t("artistRegistration.modals.editArtistParams.title") }}
    </h2>
    <form class="flex flex-col gap-2">
      <div v-if="artOptions.result">
        <p>{{ $t("artistRegistration.profileSetup.fourthStep.styles") }}</p>
        <p class="text-[#757575] text-sm mb-3">
          {{
            $t("artistRegistration.profileSetup.fourthStep.chooseAtLeast")
          }}
        </p>
        <div class="flex flex-wrap gap-4">
          <p
              v-for="(item, index) of artOptions.result.data"
              :key="index"
              :class="{
                  '!bg-black text-white':
                    artistRegistrationStore.form.artist_art_styles.includes(
                      item.id,
                    ),
                }"
              class="w-max bg-gray-200 cursor-pointer capitalize hover:bg-black hover:text-white transition-all rounded-full px-5 py-2  "
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
      </div>
      <div v-if="categoriesStore.result">
        <p>
          {{ $t("artistRegistration.profileSetup.fourthStep.category") }}
        </p>
        <p class="text-[#757575] text-sm mb-3">
          {{
            $t("artistRegistration.profileSetup.fourthStep.chooseAtLeast")
          }}
        </p>
        <div class="flex flex-wrap gap-4">
          <p
              v-for="(item, index) of categoriesStore.result.data"
              :key="index"
              :class="{
                  '!bg-black text-white':
                    artistRegistrationStore.form.artist_art_categories.includes(
                      item.id,
                    ),
                }"
              class="w-max bg-gray-200 cursor-pointer capitalize hover:bg-black hover:text-white transition-all rounded-full px-5 py-2  "
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
      </div>
      <div v-if="artOptions.resultMaterials">
        <p>
          {{ $t("artistRegistration.profileSetup.fourthStep.materials") }}
        </p>
        <p class="text-[#757575] text-sm mb-3">
          {{
            $t("artistRegistration.profileSetup.fourthStep.chooseAtLeast")
          }}
        </p>
        <div class="flex flex-wrap gap-4">
          <p
              v-for="(item, index) of artOptions.resultMaterials.data"
              :key="index"
              :class="{
                  '!bg-black text-white':
                    artistRegistrationStore.form.artist_art_materials.includes(
                      item.id,
                    ),
                }"
              class="w-max bg-gray-200 cursor-pointer capitalize hover:bg-black hover:text-white transition-all rounded-full px-5 py-2  "
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
      </div>
    </form>
    <div class="mt-5">
      <div class="w-full flex justify-between gap-3">
        <form class="w-full" method="dialog">
          <button
              class="w-full bg-gray-200 py-2 rounded-xl"
              @click="modals.modal.show = false">
            {{ $t("artistRegistration.buttons.cancel") }}
          </button>
        </form>
        <div class="w-full">
          <p
              class="cursor-pointer w-full bg-black text-white text-center py-2 rounded-xl"
              @click="modals.modal.show = false"
          >
            {{ $t("artistRegistration.buttons.save") }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
