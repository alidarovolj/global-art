<script setup>
import {useModalsStore} from "~/store/modals.js";
import {useArtworksStore} from "~/store/artworks.js";

const artworks = useArtworksStore()
const modals = useModalsStore()
const isLoading = ref(false);

const form = ref({
  id: "",
});

const setProfilePhotoLocal = async () => {
  isLoading.value = true;
  form.value.id = modals.modal.modalData.id
  await artworks.setReadyToShipment(form.value);
  isLoading.value = false;
  modals.modal.show = false
  await user.getProfile();
};
</script>

<template>
  <div>
    <div class="pb-4 flex items-center gap-5">
      <h3 class="font-bold text-lg">
        {{ $t("artistProfile.artworks.ready_to_send_modal.title") }}
      </h3>
    </div>
    <p class="pb-4">
      {{ $t("artistProfile.artworks.ready_to_send_modal.description") }}
    </p>
    <div class="mt-5">
      <div class="w-full flex justify-between gap-3">
        <form class="w-full" method="dialog">
          <button
              class="w-full bg-gray-200 py-2 rounded-xl"
              @click="modals.modal.show = false">
            {{ $t("artistProfile.artworks.ready_to_send_modal.cancel") }}
          </button>
        </form>
        <div class="w-full">
          <p
              v-if="isLoading === false"
              class="cursor-pointer w-full bg-black text-white text-center py-2 rounded-xl"
              @click="setProfilePhotoLocal"
          >
            {{ $t("artistProfile.artworks.ready_to_send_modal.send") }}
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
