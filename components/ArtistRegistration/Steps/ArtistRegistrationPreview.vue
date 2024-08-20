<script setup>
import {PencilIcon} from "@heroicons/vue/24/outline";
import {useArtistRegistrationStore} from "~/store/artistRegistration.js";
import {storeToRefs} from "pinia";
import {useArtOptions} from "~/store/artOptions.js";
import {useCategoriesStore} from "~/store/categories.js";
import {onMounted} from "vue";
import {useLanguagesStore} from "~/store/languages.js";

const runtimeConfig = useRuntimeConfig();

const artistRegistrationStore = useArtistRegistrationStore();
const {form} = storeToRefs(artistRegistrationStore);

const artOptions = useArtOptions();
const categoriesStore = useCategoriesStore();
const modals = useModalsStore()

const languages = useLanguagesStore();
const {cur_lang} = storeToRefs(languages);

const user = useUserStore();

const route = useRoute();
const {t} = useI18n();

onMounted(async () => {
  await nextTick();
  await categoriesStore.getCategoriesList();
  await artOptions.getArtStyles();
  await artOptions.getArtMaterials();
  await artOptions.getArtRarity();
});

const selectedMaterialTitles = computed(() => {
  return artistRegistrationStore.form.artist_art_materials.map((id) => {
    const material = artOptions.resultMaterials.data.find(
        (item) => item.id === id,
    );
    return material ? material.translations[cur_lang.value].title : "";
  });
});

const selectedStyleTitles = computed(() => {
  return artistRegistrationStore.form.artist_art_styles.map((id) => {
    const style = artOptions.result.data.find((item) => item.id === id);
    return style ? style.translations[cur_lang.value].title : "";
  });
});

const selectedCategoryTitles = computed(() => {
  return artistRegistrationStore.form.artist_art_categories.map((id) => {
    const category = categoriesStore.result.data.find((item) => item.id === id);
    return category
        ? category.translations[cur_lang.value].art_category_title
        : "";
  });
});

const settings = {
  itemsToShow: 1,
  snapAlign: "center",
};

const myCarousel = ref(null);

const breakpoints = computed(() => {
  const itemsToShow = Math.min(
      4,
      artistRegistrationStore.portfolio_photos.length,
  );
  return {
    700: {itemsToShow, snapAlign: "start"},
    1024: {itemsToShow, snapAlign: "start"},
  };
});

useHead({
  title: "Preview | Global Art AI",
  meta: [
    {
      property: "og:title",
      content: "Preview | Global Art AI",
    },
    {
      property: "og:url",
      content: route.fullPath,
    },
  ],
  link: [
    {rel: "canonical", href: t("headers.canonicals.artistRegistration")},
  ],
});
</script>

<template>
  <div>
    <div class="flex flex-col justify-between h-screen ">
      <div>
        <div class="container mx-auto">
          <div
              class="flex md:flex-row flex-col gap-10 justify-between border-b pb-20"
          >
            <div class="md:w-half flex flex-col justify-between">
              <div>
                <div class="mb-6">
                  <div class="flex flex-row gap-2 items-center">
                    <p
                        class="text-3xl md:text-7xl font-bold mb-3 "
                    >
                      {{ form.artist_base_info.first_name }}
                      {{ form.artist_base_info.last_name }}
                    </p>
                    <PencilIcon
                        class="p-2 cursor-pointer border border-[#E3E3E3] rounded-full w-8 h-8"
                        @click="modals.showModal('EditArtistName')"
                    />
                  </div>
                </div>
                <div class="flex flex-col gap-3 mb-4 md:mb-0">
                  <div class="flex items-center">
                    <p class="font-bold w-1/3">
                      {{ $t("artistRegistration.profileSetup.preview.style") }}:
                    </p>
                    <div class="flex gap-2 items-center">
                      <p
                          v-for="(style, index) of selectedStyleTitles"
                          :key="index"
                          class="capitalize leading-8"
                      >
                        {{
                          style
                        }}<span v-if="index !== selectedStyleTitles.length - 1"
                      >,&nbsp;</span
                      >
                      </p>
                      <PencilIcon
                          class="p-2 cursor-pointer border border-[#E3E3E3] rounded-full h-8 w-8"
                          @click="modals.showModal('EditArtistParams')"
                      />
                    </div>
                  </div>
                  <div class="flex items-center">
                    <p class="font-bold w-1/3">
                      {{
                        $t(
                            "artistRegistration.profileSetup.preview.typeOfPainting",
                        )
                      }}:
                    </p>
                    <p
                        v-for="(category, index) of selectedCategoryTitles"
                        :key="index"
                        class="capitalize flex flex-row"
                    >
                      {{
                        category
                      }}<span v-if="index !== selectedCategoryTitles.length - 1"
                    >,&nbsp;</span
                    >
                    </p>
                  </div>
                  <div class="flex items-center">
                    <p class="font-bold w-1/3">
                      {{
                        $t("artistRegistration.profileSetup.preview.material")
                      }}:
                    </p>
                    <p
                        v-for="(material, index) of selectedMaterialTitles"
                        :key="index"
                        class="capitalize"
                    >
                      {{
                        material
                      }}<span v-if="index !== selectedMaterialTitles.length - 1"
                    >,&nbsp;</span
                    >
                    </p>
                  </div>
                </div>
              </div>
              <div class="flex md:flex-row flex-col gap-2 md:gap-6 mt-8">
                <button
                    class="w-full md:w-max py-3 px-6 bg-black rounded-3xl transition-all text-white justify-center  "
                >
                  {{
                    $t("artistRegistration.profileSetup.preview.orderCustomArt")
                  }}
                </button>
                <button
                    class="w-full md:w-max py-3 px-6 border border-gray-200 transition-all  rounded-3xl text-center justify-center bg-white  "
                >
                  {{ $t("artistRegistration.profileSetup.preview.follow") }}
                </button>
              </div>
            </div>
            <div>
              <div v-if="user.result.data" class="relative flex justify-end">
                <img
                    :src="
                    runtimeConfig.public.ENDPOINTS_LINK +
                    user.result.data.params?.photo?.full
                  "
                    alt=""
                    class="w-auto object-contain min-h-[400px] max-h-[400px]"
                />
                <button
                    class="cursor-pointer absolute right-8 top-8 block w-max py-3 px-6 border border-gray-200 transition-all  rounded-3xl text-center justify-center bg-white  "
                    @click="modals.showModal('SetProfilePhoto')"
                >
                  {{ $t("artistRegistration.profileSetup.preview.replace") }}
                </button>
              </div>
            </div>
          </div>

          <div
              class="block md:flex justify-between gap-10 items-start py-10 border-b-2  mb-10"
          >
            <div class="w-full md:w-1/2 mb-10 md:mb-0">
              <div class="flex gap-2">
                <h2
                    class="text-3xl font-semibold  "
                >
                  {{ $t("detailArtist.about.title") }}
                </h2>
                <PencilIcon
                    class="p-2 cursor-pointer border border-[#E3E3E3] rounded-full h-8 w-8"
                    @click="modals.showModal('EditArtistAbout')"
                />
              </div>
              <p class="mt-6 text-[#757575]">
                {{ form.artist_about }}
              </p>
            </div>
            <div class="w-full md:w-1/2 mb-10 md:mb-0">
              <div class="flex gap-2">
                <h2
                    class="text-3xl font-semibold  "
                >
                  {{ $t("detailArtist.about.creativeCreed") }}
                </h2>
                <PencilIcon
                    class="p-2 cursor-pointer border border-[#E3E3E3] rounded-full w-8 h-8"
                    @click="modals.showModal('EditArtistCredo')"
                />
              </div>
              <p class="mt-6 text-[#757575]">
                {{ form.artist_credo }}
              </p>
            </div>
          </div>

          <div
              v-if="artistRegistrationStore.form.artist_exhibition.length > 0"
              class="pb-10"
          >
            <div class="flex gap-2">
              <p
                  class="text-primaryText font-bold text-3xl  "
              >
                {{ $t("detailArtist.about.exhibitionTitle") }}
              </p>
              <PencilIcon
                  class="p-2 cursor-pointer border border-[#E3E3E3] rounded-full w-8 h-8"
                  @click="modals.showModal('AddExhibition')"
              />
            </div>
            <div class="block md:flex gap-4 mt-10">
              <div
                  v-for="(item, index) of artistRegistrationStore.form
                  .artist_exhibition"
                  :key="index"
                  class="w-full md:w-1/3 mb-3 md:mb-0"
              >
                <p class="text-[#757575]">
                  {{ item.title }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
input[type="file"] {
  display: none;
}
</style>
