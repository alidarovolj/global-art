<script setup>
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import {useModalsStore} from "~/store/modals.js";

const artistProfileStore = useArtistProfileStore();
const {editArtistData, getArtistData} = artistProfileStore;
const {form} = storeToRefs(artistProfileStore);

const modals = useModalsStore()

const loading = ref(false);

const v$ = useVuelidate(
    {
      artist_base_info: {
        first_name: {required},
        last_name: {required},
      },
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
      {{ $t("artistRegistration.modals.editArtistName.title") }}
    </h2>
    <form>
      <label class="block mb-6" for="first_name">
        {{ $t("artistRegistration.modals.editArtistName.firstName") }}
        <input
            id="first_name"
            v-model="form.artist_base_info.first_name"
            :class="{
                'border-red-500':
                  v$.artist_base_info.first_name.$dirty &&
                  v$.artist_base_info.first_name.$error,
              }"
            class="border-grey border rounded-lg w-full pl-4 py-3   "
            placeholder="Alan"
            type="text"
        />
      </label>
      <label for="last_name">
        {{ $t("artistRegistration.modals.editArtistName.lastName") }}
        <input
            id="last_name"
            v-model="form.artist_base_info.last_name"
            :class="{
                'border-red-500':
                  v$.artist_base_info.last_name.$dirty &&
                  v$.artist_base_info.last_name.$error,
              }"
            class="border-grey border rounded-lg w-full pl-4 py-3   "
            placeholder="Alan"
            type="text"
        />
      </label>
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
