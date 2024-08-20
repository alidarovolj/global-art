<script setup>
import {getTranslate} from "~/utils/getTranslate.js";
import {onMounted} from "vue";
import {useArtOptions} from "~/store/artOptions.js";
import {useModalsStore} from "~/store/modals.js";

const languageStore = useLanguagesStore();
const {cur_lang} = storeToRefs(languageStore);

const modals = useModalsStore()

const artOptions = useArtOptions();

const translatedBaseData = computed(() =>
    getTranslate(props.artistData.translations, cur_lang.value),
);

const props = defineProps({
  artistData: {
    type: [Object],
    required: true,
  },
});

onMounted(async () => {
  await nextTick();
  await artOptions.getArtStyles();
  await artOptions.getArtMaterials();
  await artOptions.getSubjects();


});
</script>

<template>
  <div class="p-6 border rounded-2xl">
    <div class="mb-6">
      <div class="flex justify-between items-center mb-2">
        <p class="font-bold">{{ $t("artistProfile.dashboard.bio") }}</p>
        <Base-button
            class="w-max"
            type="button"
            variant="borderless"
            @click="modals.showModal('EditArtistBioModal')">
          {{ $t("artistProfile.dashboard.buttons.edit") }}
        </Base-button>
      </div>
      <ShowMoreLess :text="translatedBaseData.artist_about"/>
    </div>
    <hr class="mb-6"/>
    <div class="mb-6">
      <div class="flex justify-between items-center mb-2">
        <p class="font-bold">
          {{ $t("artistRegistration.profileSetup.secondStep.credoTitle") }}
        </p>
        <Base-button
            class="w-max"
            type="button"
            variant="borderless"
            @click="modals.showModal('EditArtistCredoModal')">
          {{ $t("artistProfile.dashboard.buttons.edit") }}
        </Base-button>
      </div>
      <ShowMoreLess :text="translatedBaseData.artist_credo"/>
    </div>
    <hr class="mb-6"/>
    <div class="mb-6">
      <div class="flex justify-between items-center mb-2">
        <p class="font-bold">{{ $t("artistProfile.dashboard.styles") }}</p>
        <Base-button
            class="w-max"
            type="button"
            variant="borderless"
            @click="modals.showModal('EditArtistStylesModal')">
          {{ $t("artistProfile.dashboard.buttons.edit") }}
        </Base-button>
      </div>
      <div>
        <div
            v-if="artistData.artist_art_styles.length > 0"
            class="flex flex-wrap gap-2"
        >
          <p
              v-for="style of artistData.artist_art_styles"
              :key="style.id"
              class="w-max border border-bColor py-2 px-3 rounded-[40px] mb-2"
          >
            {{ style.translations[cur_lang].title }}
          </p>
        </div>
        <p v-else>
          {{ $t("artistProfile.dashboard.noInfoAbout") }}
        </p>
      </div>
    </div>
    <hr class="mb-6"/>
    <div class="mb-6">
      <div class="flex justify-between items-center mb-2">
        <p class="font-bold">{{ $t("artistProfile.dashboard.materials") }}</p>
        <Base-button
            class="w-max"
            type="button"
            variant="borderless"
            @click="modals.showModal('EditArtistMaterialsModal')">
          {{ $t("artistProfile.dashboard.buttons.edit") }}
        </Base-button>
      </div>
      <div>
        <div
            v-if="artistData.artist_art_materials.length > 0"
            class="flex flex-wrap gap-2"
        >
          <p
              v-for="material of artistData.artist_art_materials"
              :key="material.id"
              class="w-max border border-bColor py-2 px-3 rounded-[40px] mb-2"
          >
            {{ material.translations[cur_lang].title }}
          </p>
        </div>
        <p v-else>
          {{ $t("artistProfile.dashboard.noInfoAbout") }}
        </p>
      </div>
    </div>
    <hr class="mb-6"/>
    <div>
      <div class="flex justify-between items-center mb-2">
        <p class="font-bold">{{ $t("artistProfile.dashboard.subjects") }}</p>
        <Base-button
            class="w-max"
            type="button"
            variant="borderless"
            @click="modals.showModal('EditArtistSubjectsModal', artistData.artist_art_subjects)">
          {{ $t("artistProfile.dashboard.buttons.edit") }}
        </Base-button>
      </div>
      <div>
        <div
            v-if="artistData.artist_art_subjects.length > 0"
            class="flex flex-wrap gap-2"
        >
          <p
              v-for="material of artistData.artist_art_subjects"
              :key="material.id"
              class="w-max border border-bColor py-2 px-3 rounded-[40px] mb-2"
          >
            {{ material.translations[cur_lang].title }}
          </p>
        </div>
        <p v-else>
          {{ $t("artistProfile.dashboard.noInfoAbout") }}
        </p>
      </div>
    </div>
  </div>
</template>
