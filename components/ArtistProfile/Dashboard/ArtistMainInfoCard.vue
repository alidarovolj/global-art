<script setup>
const runtimeConfig = useRuntimeConfig();

const languageStore = useLanguagesStore();
const {cur_lang} = storeToRefs(languageStore);
const modals = useModalsStore();

const props = defineProps({
  artistData: {
    type: [Object],
    required: true,
  },
});
</script>

<template>
  <div class="p-6 border rounded-2xl">
    <div class="mb-6">
      <img
          :src="
          runtimeConfig.public.ENDPOINTS_LINK +
          artistData.artist_app_user.params.photo.full
        "
          alt="Artist avatar"
          class="w-full h-full object-cover mb-4"
      />
      <div class="flex flex-col gap-2 mb-4">
        <p class="text-center font-semibold text-xl ">
          {{ artistData.artist_base_info.translations[cur_lang].first_name }}
          {{ artistData.artist_base_info.translations[cur_lang].last_name }}
        </p>
        <p class="text-center text-secondaryText">
          <span
              v-if="artistData.artist_base_info.translations[cur_lang].address"
          >
            {{ artistData.artist_base_info.translations[cur_lang].address }},
          </span>
          <span v-if="artistData.artist_base_info.translations[cur_lang].city">
            {{ artistData.artist_base_info.translations[cur_lang].city }},
          </span>
          <span v-if="artistData.artist_base_info.translations[cur_lang].state">
            {{ artistData.artist_base_info.translations[cur_lang].state }},
          </span>
          <span v-if="artistData.artist_base_info.country">
            {{ artistData.artist_base_info.country }}
          </span>
        </p>
      </div>
      <Base-button
          class="py-2 mb-4"
          type="button"
          variant="outlined"
          @click="modals.showModal('EditArtistAddressModal', artistData)">
        {{ $t("profile.address.editAddressModal.title") }}
      </Base-button>
      <Base-button
          class="py-2 mb-4"
          type="button"
          variant="outlined"
          @click="modals.showModal('EditArtistNameModal', artistData)">
        {{ $t("artistProfile.dashboard.buttons.editProfile") }}
      </Base-button>
    </div>
    <hr class="mb-6"/>
    <div class="flex flex-col gap-4">
      <p class="flex justify-between items-center">
        <span>{{ $t("artistProfile.dashboard.followers") }}</span>
        <span>{{ artistData.artist_subscribers }}</span>
      </p>
    </div>
  </div>
</template>
