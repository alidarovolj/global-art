<script setup>
import {PencilIcon, XMarkIcon} from "@heroicons/vue/24/outline"
import {useLanguagesStore} from "~/store/languages.js";
import {useArtistProfileStore} from "~/store/artistProfile.js";
import {useArtistsStore} from "~/store/artists.js";

const runtimeConfig = useRuntimeConfig();
const modals = useModalsStore()
const loading = ref(false)

const editState = ref(null)

const props = defineProps({
  artistData: {
    type: [Object],
    required: true,
  },
});

const languages = useLanguagesStore();
const {cur_lang} = storeToRefs(languages);
const artist_profile = useArtistProfileStore()
const artists = useArtistsStore()
const toasts = useToastsStore()

const removeForm = ref({
  artist_id: "",
  artist_portfolio_id: ""
});

const editForm = ref({
  artist_id: "",
  artist_portfolio_id: "",
  title: "",
  language: cur_lang.value
})

const setEditState = async (portfolio, index) => {
  editForm.value.artist_id = props.artistData.id
  editForm.value.artist_portfolio_id = portfolio.id
  editForm.value.title = portfolio.translations[cur_lang.value].title
  await nextTick()
  editState.value = index
}

const editValue = async () => {
  loading.value = true
  await artists.editPortfolio(editForm.value)
  await artist_profile.getArtistData()
  toasts.showToast("success", "Success", "Your portfolio successfully edited");
  editState.value = null
  loading.value = false
}

const removeItem = async (id) => {
  removeForm.value.artist_portfolio_id = id
  removeForm.value.artist_id = props.artistData.id
  await nextTick()
  await artists.removePortfolio(removeForm.value)
  await artist_profile.getArtistData()
  toasts.showToast("success", "Success", "Your portfolio successfully removed");
}
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-2">
      <p class="font-semibold text-2xl ">
        {{ $t("artistProfile.dashboard.studioChronicles") }}
      </p>
      <Base-button
          class="w-max"
          type="button" variant="borderless" @click="modals.showModal('AddPortfolio', artistData)">
        {{ $t("artistRegistration.buttons.add") }}
      </Base-button>
    </div>
    <div
        v-if="artistData.artist_portfolio.length > 0"
        class="grid grid-cols-1 md:grid-cols-3 gap-y-4 sm:gap-x-5 sm:gap-y-5"
    >
      <div
          v-for="(portfolio, index) of artistData.artist_portfolio"
          :key="index"
          class="relative w-full"
      >
        <div class="relative">
          <img
              :src="runtimeConfig.public.ENDPOINTS_LINK + portfolio.photo.full"
              alt="portfolio"
              class="w-full object-cover max-w-[250px] max-h-[200px] min-h-[200px]"
          />
          <XMarkIcon
              class="w-5 h-5 absolute top-3 right-3 cursor-pointer"
              @click="removeItem(portfolio.id)"/>
        </div>
        <div
            v-if="editState === index"
            class="mt-3">
          <p class="font-semibold">{{ $t('artistProfile.artworks.info.title') }}</p>
          <div class="relative">
            <input
                v-model="editForm.title"
                class="border px-4 py-3 w-full rounded"
                type="text"
                @change="editValue">
            <div
                v-if="loading"
                class="absolute left-0 top-0 w-full h-full rounded bg-black opacity-70 flex items-center justify-center">
              <div class="spinner w-max"></div>
            </div>
          </div>
        </div>
        <div
            v-else
            class="mt-3">
          <div class="flex items-center justify-between mb-3">
            <p class="font-semibold">{{ $t('artistProfile.artworks.info.title') }}</p>
            <PencilIcon class="w-4 h-4 cursor-pointer" @click="setEditState(portfolio, index)"/>
          </div>
          <p>{{ portfolio.translations[cur_lang].title }}</p>
        </div>
      </div>
    </div>
    <p v-else>
      {{ $t("artistProfile.dashboard.noInfoAbout") }}
    </p>
  </div>
</template>