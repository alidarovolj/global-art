<script setup>
import {ExclamationCircleIcon} from "@heroicons/vue/24/outline";
import {storeToRefs} from "pinia";

const artistProfileStore = useArtistProfileStore();
const {getArtistData} = artistProfileStore;
const {result, form} = storeToRefs(artistProfileStore);
const {t} = useI18n();
const language = useLanguagesStore();
const {cur_lang} = storeToRefs(language);

onMounted(async () => {
  await nextTick();
  await getArtistData();
  form.value.id = result.value.data.id;
  form.value.language = cur_lang.value;
  form.value.artist_about = result.value.data.artist_about;
  form.value.artist_credo = result.value.data.artist_credo;
  form.value.artist_achievement = result.value.data.artist_achievement;
  form.value.artist_base_info.first_name = result.value.data.artist_base_info.first_name;
  form.value.artist_base_info.last_name = result.value.data.artist_base_info.last_name;
  form.value.artist_base_info.address = result.value.data.artist_base_info.address;
  form.value.artist_base_info.country = result.value.data.artist_base_info.country;
  form.value.artist_base_info.state = result.value.data.artist_base_info.state;
  form.value.artist_base_info.zipcode = result.value.data.artist_base_info.zipcode;
  form.value.artist_base_info.city = result.value.data.artist_base_info.city;
  form.value.artist_base_info.phone_number = result.value.data.artist_base_info.phone_number;
  form.value.artist_art_categories = result.value.data.artist_art_categories.map((category) => category.id);
  form.value.artist_art_materials = result.value.data.artist_art_materials.map((material) => material.id);
  form.value.artist_art_styles = result.value.data.artist_art_styles.map((style) => style.id);
  form.value.artist_art_subjects = result.value.data.artist_art_subjects.map((subject) => subject.id);
});

useHead({
  title: t("headers.artist_profile.title"),
  meta: [
    {
      property: "description",
      content: t("headers.artist_profile.description"),
    },
    {
      property: "og:description",
      content: t("headers.artist_profile.description"),
    },
    {
      property: "og:title",
      content: t("headers.artist_profile.title"),
    },
    {
      property: "og:url",
      content: t("headers.artist_profile.og_url"),
    },
  ],
  link: [{rel: "canonical", href: t("headers.artist_profile.canonical")}],
});
</script>

<template>
  <div>
    <div v-if="result && result.data" class="flex flex-col md:flex-row gap-10">
      <div class="md:w-third">
        <ArtistMainInfoCard :artist-data="result.data" class="mb-6"/>
        <ArtistBioParamsCard :artist-data="result.data"/>
      </div>
      <div class="md:w-2/3">
        <div
            v-if="!result.data.artist_is_verified"
            class="w-full border  p-6 rounded-lg mb-5"
        >
          <div class="flex gap-2 items-center mb-2">
            <ExclamationCircleIcon
                class="text-white bg-[#AC1111] p-2 rounded-full w-8 h-8"
            />
            <p class="font-bold text-xl">
              {{ $t("artistProfile.confirm.title") }}
            </p>
          </div>
          <p class="text-secondaryText">
            {{ $t("artistProfile.confirm.description") }}
          </p>
        </div>
        <ArtistArtworksInfoCard :artist-data="result.data" class="mb-8"/>
        <hr class="mb-8"/>
        <ArtistPortfolioCard :artist-data="result.data" class="mb-8"/>
        <hr class="mb-8"/>
        <ArtistExhibitionsCard :artist-data="result.data"/>
      </div>
    </div>
    <div
        v-else
        class="flex flex-col-reverse md:flex-row gap-10 justify-between"
    >
      <div class="flex flex-col gap-5 w-full md:w-third">
        <div v-for="(_, index) of 1" :key="index" class="flex flex-col gap-5">
          <div class="skeleton w-full h-96"/>
          <div class="skeleton w-full h-96"/>
        </div>
      </div>
      <div class="md:w-2/3 flex flex-col gap-8">
        <div class="flex gap-6">
          <div class="skeleton w-half h-72"/>
          <div class="skeleton w-half h-72"/>
        </div>
        <div class="skeleton w-full h-96"/>
      </div>
    </div>
  </div>
</template>
