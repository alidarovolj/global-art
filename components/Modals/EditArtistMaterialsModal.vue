<script setup>
import {useArtOptions} from "~/store/artOptions.js";
import {useLanguagesStore} from "~/store/languages.js";
import {storeToRefs} from "pinia";
import {useVuelidate} from "@vuelidate/core";
import {minLength, required} from "@vuelidate/validators";
import {useModalsStore} from "~/store/modals.js";

const artOptions = useArtOptions();
const languages = useLanguagesStore();
const {cur_lang} = storeToRefs(languages);

const artistProfileStore = useArtistProfileStore();
const {editArtistData, getArtistData} = artistProfileStore;
const {form} = storeToRefs(artistProfileStore);

const modals = useModalsStore()

const mergedArray = computed(() => {
  const mergedSet = new Set();

  // Add objects from artOptions.resultSubjects.data to set
  if (artOptions.resultMaterials && artOptions.resultMaterials.data) {
    artOptions.resultMaterials.data.forEach(item => {
      mergedSet.add(item);
    });
  }

  // Add objects from modals.modal.modalData to set
  if (modals.modal.modalData) {
    modals.modal.modalData.forEach(item => {
      mergedSet.add(item);
    });
  }

  // Convert set back to array
  return Array.from(mergedSet);
});

function addElementToArray(array, element) {
  const index = array.indexOf(element);
  if (index === -1) {
    array.push(element);
  } else {
    array.splice(index, 1);
  }
}

const loading = ref(false);

const v$ = useVuelidate(
    {
      artist_art_materials: {required, minLength: minLength(1)},
    },
    form,
);

const onClick = async () => {
  await v$.value.$validate();
  if (v$.value.$error) return;
  loading.value = true;
  await editArtistData()
  await getArtistData();
  loading.value = false;
  modals.modal.show = false;
};
</script>

<template>
  <div class="modal-box">
    <h2 class="text-center font-semibold border-grey border-b pb-4 mb-4">
      {{ $t("artistRegistration.modals.editArtistParams.title") }}
    </h2>
    <form class="flex flex-col gap-2">
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
              v-for="(item, index) of mergedArray"
              :key="index"
              :class="{
                  '!bg-black text-white':
                    artistProfileStore.form.artist_art_materials.includes(
                      item.id,
                    ),
                }"
              class="w-max bg-gray-200 cursor-pointer capitalize hover:bg-black hover:text-white transition-all rounded-full px-5 py-2  "
              @click="
                  addElementToArray(
                    artistProfileStore.form.artist_art_materials,
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
              v-if="loading === false"
              class="cursor-pointer w-full bg-black text-white text-center py-2 rounded-xl"
              @click="onClick"
          >
            {{ $t("artistRegistration.buttons.save") }}
          </p>
          <div
              v-else
              class="cursor-pointer w-full bg-black text-white text-center py-2 rounded-xl"
          >
            <div class="spinner"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
