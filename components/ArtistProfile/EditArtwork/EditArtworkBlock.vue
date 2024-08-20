<script setup>
import {useArtistArtworksStore} from "~/store/artistArtworks.js";
import {storeToRefs} from "pinia";
import {useArtOptions} from "~/store/artOptions.js";
import {useLanguagesStore} from "~/store/languages.js";
import {ChevronLeftIcon, PhotoIcon, TrashIcon} from "@heroicons/vue/24/outline"

const pending = ref(true);
const route = useRoute()

const localePath = useLocalePath();
const user = useUserStore();

const artistArtworksStore = useArtistArtworksStore();
const {editArtworkImages, formEdit} = storeToRefs(artistArtworksStore);

const runtimeConfig = useRuntimeConfig();

const languages = useLanguagesStore();
const {cur_lang} = storeToRefs(languages);

const categoriesStore = useCategoriesStore();
const {result} = storeToRefs(categoriesStore);
const artOptions = useArtOptions();
const {getCategoriesList} = categoriesStore;

const pushPhoto = (index, photo) => {
  formEdit.value.new_art_item_images.push(photo.temp_media_token);
  editArtworkImages.value.push(photo.base64);
};

function addElementToArray(array, element) {
  const index = array.indexOf(element);
  if (index === -1) {
    array.push(element);
  } else {
    array.splice(index, 1);
  }
}

const deletePhoto = (index) => {
  formEdit.value.delete_art_item_images.push(editArtworkImages.value[index].uuid);
  editArtworkImages.value.splice(index, 1);
};

const preventDotComma = (event) => {
  if (event.key === '.' || event.key === ',') {
    event.preventDefault();
  }
}

const props = defineProps(['vuelidate'])

const sortedArtOptions = computed(() => {
  return artOptions.result.data.slice().sort((a, b) => {
    const titleA = a.translations[cur_lang.value].title.toLowerCase();
    const titleB = b.translations[cur_lang.value].title.toLowerCase();
    if (titleA < titleB) return -1;
    if (titleA > titleB) return 1;
    return 0;
  });
});

const sortedMaterials = computed(() => {
  return artOptions.resultMaterials.data.slice().sort((a, b) => {
    const titleA = a.translations[cur_lang.value].title.toLowerCase();
    const titleB = b.translations[cur_lang.value].title.toLowerCase();
    if (titleA < titleB) return -1;
    if (titleA > titleB) return 1;
    return 0;
  });
});

const sortedSubjects = computed(() => {
  return artOptions.resultSubjects.data.slice().sort((a, b) => {
    const titleA = a.translations[cur_lang.value].title.toLowerCase();
    const titleB = b.translations[cur_lang.value].title.toLowerCase();
    if (titleA < titleB) return -1;
    if (titleA > titleB) return 1;
    return 0;
  });
});

onMounted(async () => {
  await nextTick();
  await getCategoriesList();
  await artistArtworksStore.getArtistProfileArtwork(route.params.id);
  await artOptions.getArtStyles();
  await artOptions.getArtMaterials();
  await artOptions.getArtRarity();
  await artOptions.getAuthCerts();
  await artOptions.getSignatures();
  await artOptions.getSubjects();
  pending.value = false;
});
</script>

<template>
  <div v-if="!pending && formEdit && user.result">
    <form>
      <div class="flex flex-col">
        <div class="w-full">
          <NuxtLink :to="localePath('/artistProfile/artworks')" class="w-max flex gap-2 mb-2">
            <ChevronLeftIcon class="w-5 h-5"/>
            <p class="text-primaryText ">
              {{ $t("artistRegistration.buttons.back") }}
            </p>
          </NuxtLink>
          <h1 class="font-semibold text-5xl mb-10">
            {{ $t("addArtwork.editArtwork") }}
          </h1>
          <div class="flex flex-col md:flex-row gap-20">
            <div class="w-full md:min-w-[650px] md:max-w-[650px]">
              <div class="mb-10 pb-10 border-b border-[#E3E3E3] w-full">
                <h2 class="font-bold text-3xl text-primaryText mb-6 ">
                  {{ $t("addArtwork.artworkImages") }} <span class="text-red-500">*</span>
                </h2>
                <div>
                  <div
                      class="h-60 p-3 py-12 rounded-2xl relative bg-[#F7F7F7] flex flex-col items-center justify-center mb-2">
                    <div
                        v-if="editArtworkImages[0]"
                        class="absolute left-1/2 -translate-x-1/2 top-0 w-max h-full opacity-40 py-5 z-0"
                    >
                      <img
                          v-if="editArtworkImages[0].full"
                          :src="runtimeConfig.public.ENDPOINTS_LINK + editArtworkImages[0].full"
                          alt=""
                          class="h-full w-auto">
                      <img
                          v-else
                          :src="editArtworkImages[0]"
                          alt=""
                          class="h-full w-auto">
                    </div>
                    <div v-if="!editArtworkImages[0]" class="flex flex-col gap-4 items-center relative z-20">
                      <PhotoIcon class="w-12 h-12"/>
                      <UploadPhoto
                          :button_type="true"
                          :only_percent="true"
                          :preview="true"
                          class="w-max h-full bg-white mx-auto"
                          @receive-photo="pushPhoto(0, $event)"
                      />
                    </div>
                    <div class="ml-2 h-full flex justify-start absolute right-2 top-2">
                      <TrashIcon
                          v-if="editArtworkImages[0]"
                          class="cursor-pointer text-black  w-5 h-5"
                          @click="deletePhoto(0)"
                      />
                    </div>
                  </div>
                  <ul class="list-disc text-[#757575] text-sm pl-5">
                    <li>
                      {{ $t("addArtwork.warnings.first") }}
                    </li>
                    <li>
                      {{ $t("addArtwork.warnings.second") }}
                    </li>
                    <li>
                      {{ $t("addArtwork.warnings.third") }}
                    </li>
                  </ul>
                </div>
              </div>
              <div class="mb-10 pb-10 border-b border-[#E3E3E3] w-full">
                <h1 class="font-bold text-3xl text-primaryText mb-6 ">
                  {{ $t("addArtwork.artwork") }}
                </h1>
                <div class="flex flex-col mb-6">
                  <label class="text-sm text-primaryText mb-2 " for="artwork_title">
                    {{ $t("addArtwork.title") }} <span class="text-red-500">*</span>
                  </label>
                  <input id="artwork_title" v-model="formEdit.art_item_title"
                         :class="{ 'border-red-500': vuelidate.art_item_title.$error }"
                         :placeholder="$t('addArtwork.titlePlaceholder')"
                         class="py-[14px] px-4 border border-bColor rounded-lg   "
                         type="text"/>
                </div>
                <div class="flex flex-col mb-6">
                  <label class="text-sm text-primaryText mb-2 " for="description">
                    {{ $t("addArtwork.description") }} <span class="text-red-500">*</span>
                  </label>
                  <textarea id="description" v-model="formEdit.art_item_description"
                            :class="{ 'border-red-500': vuelidate.art_item_description.$error }"
                            :placeholder="$t('addArtwork.descriptionPlaceholder')"
                            class="py-[14px] px-4 border border-bColor rounded-lg   "
                            rows="5"/>
                  <div class="flex justify-between items-center text-sm text-secondaryText">
                    <p v-if="formEdit.art_item_description">
                      {{ formEdit.art_item_description.length }} / 40
                    </p>
                    <p class="text-end">
                      {{ $t("artistRegistration.profileSetup.secondStep.minimumCharacters") }}
                    </p>
                  </div>
                </div>
                <div class="md:flex justify-between gap-6 mb-6">
                  <div class="flex flex-col w-full md:w-[74%] mb-6 md:mb-0">
                    <label class="text-sm text-primaryText mb-2 " for="made_in">
                      {{ $t("addArtwork.made") }} <span class="text-red-500">*</span>
                    </label>
                    <input id="made_in" v-model="formEdit.art_item_params.location"
                           :class="{ 'border-red-500': vuelidate.art_item_params.location.$error }"
                           :placeholder="$t('addArtwork.madePlaceholder')"
                           class="py-[14px] px-4 border border-bColor rounded-lg   "
                           type="text"/>
                  </div>
                  <div class="flex flex-col w-full md:w-fourth">
                    <label class="text-sm text-primaryText mb-2 " for="yearMade">
                      {{ $t("addArtwork.yearMade") }} <span class="text-red-500">*</span>
                    </label>
                    <input id="yearMade" v-model="formEdit.art_item_params.year"
                           :class="{ 'border-red-500': vuelidate.art_item_params.year.$error }"
                           :placeholder="$t('addArtwork.yearPlaceholder')"
                           class="py-[14px] px-4 border border-bColor rounded-lg  "
                           max="2099" min="1900" step="1"
                           type="number"/>
                  </div>
                </div>
                <div class="flex flex-col">
                  <label class="text-sm text-primaryText mb-2 " for="signature_type">
                    {{ $t("addArtwork.signature") }} <span class="text-red-500">*</span>
                  </label>
                  <select id="signature_type" v-model="formEdit.art_item_params.signature_id"
                          :class="{ 'border-red-500': vuelidate.art_item_params.signature_id.$error }"
                          class="py-[14px] px-4 border border-bColor rounded-lg  "
                          name="">
                    <option :value="null">
                      {{ $t("addArtwork.signatureSelect") }}
                    </option>
                    <option v-for="(signature, index) of artOptions.resultSignatures.data" :key="index"
                            :value="signature.id">
                      {{ signature.translations[cur_lang].title }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div class="hidden md:flex w-full md:w-1/2 md:max-w-[50%] flex-col justify-between">
              <div class="p-4 border-l-4 border-[#058B33] top-10 sticky">
                <p>{{ $t('addArtwork.help.first.first') }} <span
                    class="text-red-500">{{ $t('addArtwork.help.first.span') }}</span>
                  {{ $t('addArtwork.help.first.second') }}</p>
              </div>
            </div>
          </div>
          <div class="flex flex-col md:flex-row gap-20">
            <div class="w-full md:min-w-[650px] md:max-w-[650px]">
              <div class="mb-10 pb-10 border-b border-[#E3E3E3]">
                <h1 class="font-bold text-3xl text-primaryText mb-6 ">
                  {{ $t("addArtwork.category") }}
                </h1>
                <div class="flex flex-col mb-6">
                  <label class="text-sm text-primaryText mb-2 " for="category">
                    {{ $t("addArtwork.categorySelect") }} <span class="text-red-500">*</span>
                  </label>
                  <select id="category" v-model="formEdit.art_item_category_id"
                          :class="{ 'border-red-500': vuelidate.art_item_category_id.$error }"
                          class="py-[14px] px-4 border border-bColor rounded-lg   "
                          name="">
                    <option :value="null">
                      {{ $t("addArtwork.categorySelect") }}
                    </option>
                    <option v-for="category of result.data" :key="category.id" :value="category.id">
                      {{ category.translations[cur_lang].art_category_title }}
                    </option>
                  </select>
                </div>
                <div class="flex flex-col mb-6">
                  <label class="text-sm text-primaryText mb-2 " for="rights">
                    {{ $t("addArtwork.rights") }} <span class="text-red-500">*</span>
                  </label>
                  <input id="rights" v-model="formEdit.art_item_params.rights"
                         :class="{ 'border-red-500': vuelidate.art_item_params.rights.$error }"
                         :placeholder="$t('addArtwork.rightsPlaceholder')"
                         class="py-[14px] px-4 border border-bColor rounded-lg   "
                         type="text"/>
                </div>
                <div class="flex flex-col mb-6">
                  <label class="text-sm text-primaryText mb-2 " for="rarity">{{
                      $t("addArtwork.rarity")
                    }} <span class="text-red-500">*</span></label>
                  <select id="rarity" v-model="formEdit.art_item_params.rarity_id"
                          :class="{ 'border-red-500': vuelidate.art_item_params.rarity_id.$error }"
                          class="py-[14px] px-4 border border-bColor rounded-lg   "
                          name="">
                    <option :value="null">
                      {{ $t("addArtwork.raritySelect") }}
                    </option>
                    <option v-for="(rarity, index) of artOptions.resultRarity.data" :key="index" :value="rarity.id"
                            class="capitalize">
                      {{ rarity.translations[cur_lang].title }}
                    </option>
                  </select>
                </div>
                <div class="flex flex-col mb-6">
                  <label class="text-sm text-primaryText mb-2 " for="auth_cert">{{
                      $t("addArtwork.auth")
                    }} <span class="text-red-500">*</span></label>
                  <select id="auth_cert" v-model="formEdit.art_item_params.auth_cert_id"
                          :class="{ 'border-red-500': vuelidate.art_item_params.auth_cert_id.$error }"
                          class="py-[14px] px-4 border border-bColor rounded-lg   "
                          name="">
                    <option :value="null">
                      {{ $t("addArtwork.selectAuth") }}
                    </option>
                    <option v-for="(auth_cert, index) of artOptions.resultCerts.data" :key="index" :value="auth_cert.id"
                            class="capitalize">
                      {{ auth_cert.translations[cur_lang].title }}
                    </option>
                  </select>
                </div>
                <div class="flex flex-col mb-6">
                  <p class="text-sm text-primaryText mb-2 ">
                    {{ $t("addArtwork.styles") }} <span class="text-red-500">*</span>
                  </p>
                  <div class="flex flex-wrap gap-4 text-sm">
                    <p v-for="(item, index) in sortedArtOptions" :key="index" :class="[{
                  '!bg-black text-white': formEdit.art_item_styles.includes(
                    item.id,
                  ),
                }, { 'border-red-500 border': vuelidate.art_item_styles.$error }]"
                       class="w-max bg-gray-200   cursor-pointer capitalize hover:bg-black hover:text-white transition-all rounded-full px-4 py-2"
                       @click="addElementToArray(formEdit.art_item_styles, item.id)">
                      {{ item.translations[cur_lang].title }}
                    </p>
                  </div>
                </div>
                <div class="flex flex-col mb-6">
                  <p class="text-sm text-primaryText mb-2 ">
                    {{ $t("addArtwork.material") }} <span class="text-red-500">*</span>
                  </p>
                  <div class="flex flex-wrap gap-4 text-sm">
                    <p v-for="(item, index) in sortedMaterials" :key="index"
                       :class="[{
                  '!bg-black text-white': formEdit.art_item_materials.includes(
                    item.id,
                  ),
                }, { 'border-red-500 border': vuelidate.art_item_materials.$error }]"
                       class="w-max bg-gray-200   cursor-pointer capitalize hover:bg-black hover:text-white transition-all rounded-full px-4 py-2"
                       @click="addElementToArray(formEdit.art_item_materials, item.id)">
                      {{ item.translations[cur_lang].title }}
                    </p>
                  </div>
                </div>
                <div class="flex flex-col mb-6">
                  <p class="text-sm text-primaryText mb-2 ">
                    {{ $t("addArtwork.subject") }} <span class="text-red-500">*</span>
                  </p>
                  <div class="flex flex-wrap gap-4 text-sm">
                    <p v-for="(item, index) in sortedSubjects" :key="index" :class="[{
                  '!bg-black text-white': formEdit.art_item_subjects.includes(
                    item.id,
                  ),
                }, { 'border-red-500 border': vuelidate.art_item_subjects.$error }]"
                       class="w-max bg-gray-200   cursor-pointer capitalize hover:bg-black hover:text-white transition-all rounded-full px-4 py-2"
                       @click="addElementToArray(formEdit.art_item_subjects, item.id)">
                      {{ item.translations[cur_lang].title }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="mb-10 pb-10 border-b border-[#E3E3E3]">
                <h1 class="font-bold text-3xl text-primaryText mb-6 ">
                  {{ $t("addArtwork.dimensions") }}
                </h1>
                <div class="flex mb-6">
                  <div class="flex border p-2 border-[#E5E7EB]  rounded-lg overflow-hidden">
                    <input id="framed" v-model="formEdit.art_item_params.frame" :value="true" checked
                           class="radio-option"
                           name="frame" type="radio"/>
                    <label for="framed">{{ $t("addArtwork.framed") }}</label>
                    <input id="unframed" v-model="formEdit.art_item_params.frame" :value="false" class="radio-option"
                           name="frame" type="radio"/>
                    <label for="unframed">{{ $t("addArtwork.unframed") }}</label>
                  </div>
                </div>
                <div>
                  <h3 class="font-bold text-primaryText mb-6 ">
                    {{ $t("addArtwork.dimensionsBase") }}
                  </h3>
                  <div class="md:flex justify-between mb-6">
                    <div class="flex flex-col w-full md:w-fourth mb-6 md:mb-0">
                      <label class="text-sm text-primaryText mb-2 " for="width">{{
                          $t("addArtwork.width")
                        }} <span class="text-red-500">*</span></label>
                      <input id="width" v-model="formEdit.art_item_params.size.width"
                             :class="{ 'border-red-500': vuelidate.art_item_params.size.width.$error }"
                             :placeholder="$t('addArtwork.width')"
                             class="py-[14px] px-4 border border-bColor rounded-lg   "
                             type="number"
                             @input="formEdit.art_item_params.size.width = $event.target.value.replace(/\D/g, '')"
                             @keydown="preventDotComma($event)"/>
                    </div>
                    <div class="flex flex-col w-full md:w-fourth mb-6 md:mb-0">
                      <label class="text-sm text-primaryText mb-2 " for="height">{{
                          $t("addArtwork.height")
                        }} <span class="text-red-500">*</span></label>
                      <input id="height" v-model="formEdit.art_item_params.size.height"
                             :class="{ 'border-red-500': vuelidate.art_item_params.size.height.$error }"
                             :placeholder="$t('addArtwork.height')"
                             class="py-[14px] px-4 border border-bColor rounded-lg   "
                             type="number"
                             @input="formEdit.art_item_params.size.height = $event.target.value.replace(/\D/g, '')"
                             @keydown="preventDotComma($event)"/>
                    </div>
                    <div class="flex flex-col w-full md:w-fourth mb-6 md:mb-0">
                      <label class="text-sm text-primaryText mb-2 " for="length">{{
                          $t("addArtwork.depth")
                        }} <span class="text-red-500">*</span></label>
                      <input id="length" v-model="formEdit.art_item_params.size.length"
                             :class="{ 'border-red-500': vuelidate.art_item_params.size.length.$error }"
                             :placeholder="$t('addArtwork.depth')"
                             class="py-[14px] px-4 border border-bColor rounded-lg   "
                             type="number"
                             @input="formEdit.art_item_params.size.length = $event.target.value.replace(/\D/g, '')"
                             @keydown="preventDotComma($event)"/>
                    </div>
                    <div class="flex flex-col w-full md:w-fifth">
                      <label class="text-sm text-primaryText mb-2 " for="style">{{
                          $t("addArtwork.units")
                        }}</label>
                      <select id="style" v-model="artistArtworksStore.dimensionType"
                              class="py-[15.5px] px-4 border border-bColor rounded-lg bg-white   "
                              name="">
                        <option value="cm">
                          {{ $t("addArtwork.cm") }}
                        </option>
                        <option value="inch">
                          {{ $t("artworks.inch") }}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div class="flex flex-col w-full md:w-fourth mb-6 md:mb-0">
                    <label class="text-sm text-primaryText mb-2 " for="length">{{
                        $t("addArtwork.weight")
                      }} <span class="text-red-500">*</span></label>
                    <div class="flex gap-2 items-center">
                      <input id="length" v-model="formEdit.art_item_params.size.weight"
                             :class="{ 'border-red-500': vuelidate.art_item_params.size.weight.$error }"
                             :placeholder="$t('addArtwork.weight')"
                             class="py-[14px] px-4 border border-bColor rounded-lg   "
                             type="number"
                             @input="formEdit.art_item_params.size.weight = $event.target.value.replace(/\D/g, '')"
                             @keydown="preventDotComma($event)"/>
                      <p>
                        {{ $t("addArtwork.kg") }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h1 class="font-bold text-3xl text-primaryText mb-6 ">
                  {{ $t("addArtwork.priceAndQuantity") }}
                </h1>
                <div class="mb-6">
                  <div class="md:flex justify-between mb-6">
                    <div class="flex flex-col w-full">
                      <label class="text-sm text-primaryText mb-2 " for="price">
                        {{ $t("addArtwork.third.price") }} <span class="text-red-500">*</span>
                      </label>
                      <div class="flex items-center gap-2">
                        <input id="price" v-model="formEdit.art_item_base_price"
                               :class="{ 'border-red-500': vuelidate.art_item_base_price.$error }"
                               :placeholder="$t('addArtwork.third.price')"
                               class="w-full py-[14px] px-4 border border-bColor rounded-lg   "
                               type="text"/>
                        <p>$</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="hidden md:flex w-full md:w-1/2 md:max-w-[50%] flex-col justify-between">
              <div class="p-4 border-l-4 border-[#058B33] top-10 sticky">
                <p>{{ $t('addArtwork.help.second') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
  <div v-else class="flex flex-col-reverse md:flex-row gap-10 justify-between">
    <div class="flex flex-col gap-5 w-full md:w-half">
      <div v-for="(_, index) of 5" :key="index" class="flex flex-col gap-5">
        <div class="skeleton w-half h-8"/>
        <div class="skeleton w-full h-10"/>
      </div>
    </div>
    <div class="md:w-half">
      <div class="skeleton w-full h-20"/>
    </div>
  </div>
</template>

<style>
.radio-option {
  display: none;
}

html.dark .radio-option + label {
  background: #303134;
  color: white;
}

.radio-option + label {
  padding: 16px 64px;
  margin: 0;
  background: #f0f0f0;
  color: #000;
  cursor: pointer;
}

.radio-option:checked + label {
  background: #000 !important;
  color: #fff;
}

/* Remove the last border */
.radio-option + label:last-of-type {
  border-right: none;
}
</style>
