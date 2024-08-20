<script setup>
import {PencilIcon, XMarkIcon} from "@heroicons/vue/24/outline/index.js";
import {useArtistProfileStore} from "~/store/artistProfile.js";
import {useArtistsStore} from "~/store/artists.js";

const runtimeConfig = useRuntimeConfig();
const language = useLanguagesStore();
const {cur_lang} = storeToRefs(language);
const modals = useModalsStore()
const artist_profile = useArtistProfileStore()
const artists = useArtistsStore()
const toasts = useToastsStore()
const editState = ref(null)
const loading = ref(false)

const editForm = ref({
  artist_id: "",
  artist_exhibition_id: "",
  title: "",
  language: cur_lang.value
})

const removeForm = ref({
  artist_id: "",
  artist_exhibition_id: ""
})

const editValue = async () => {
  loading.value = true
  await artists.editExhibition(editForm.value)
  await artist_profile.getArtistData()
  toasts.showToast("success", "Success", "Your exhibition successfully edited");
  editState.value = null
  loading.value = false
}

const removeItem = async (id) => {
  removeForm.value.artist_exhibition_id = id
  removeForm.value.artist_id = props.artistData.id
  await nextTick()
  await artists.removeExhibition(removeForm.value)
  await artist_profile.getArtistData()
  toasts.showToast("success", "Success", "Your exhibition successfully removed");
}

const setEditState = async (exhibition, index) => {
  editForm.value.artist_id = props.artistData.id
  editForm.value.artist_exhibition_id = exhibition.id
  editForm.value.title = exhibition.translations[cur_lang.value].title
  await nextTick()
  editState.value = index
}

const props = defineProps({
  artistData: {
    type: [Object],
    required: true,
  },
});
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-2">
      <p class="font-semibold text-2xl ">
        {{ $t("artistProfile.dashboard.exhibitions") }}
      </p>
      <Base-button
          class="w-max"
          type="button" variant="borderless" @click="modals.showModal('AddExhibitionProfile', artistData)">
        {{ $t("artistRegistration.buttons.add") }}
      </Base-button>
    </div>

    <div v-if="artistData.artist_exhibition.length > 0" class="pb-10">
      <div class="flex flex-col gap-3">
        <div
            v-for="(item, index) of artistData.artist_exhibition"
            :key="index"
            class="w-full mb-3 md:mb-0 flex items-center gap-3"
        >
          <XMarkIcon
              class="w-5 h-5 cursor-pointer"
              @click="removeItem(item.id)"
          />
          <p
              v-if="editState !== index"
              class="">
            {{ item.translations[cur_lang].title }}
          </p>
          <div v-else class="relative">
            <input
                v-model="editForm.title"
                class="border px-4 py-3 w-full rounded"
                type="text"
                @change="editValue"
            >
            <div
                v-if="loading"
                class="absolute left-0 top-0 w-full h-full rounded bg-black opacity-70 flex items-center justify-center">
              <div class="spinner w-max"></div>
            </div>
          </div>
          <PencilIcon v-if="editState !== index" class="w-4 h-4 cursor-pointer" @click="setEditState(item, index)"/>
        </div>
      </div>
    </div>
    <p v-else>
      {{ $t("artistProfile.dashboard.noInfoAbout") }}
    </p>
  </div>
</template>
