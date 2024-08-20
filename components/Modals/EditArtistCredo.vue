<script setup>
import {useArtistRegistrationStore} from "~/store/artistRegistration.js";
import {useVuelidate} from "@vuelidate/core";
import {minLength, required} from "@vuelidate/validators";

const artistRegistrationStore = useArtistRegistrationStore();
const modals = useModalsStore()

const form = ref({
  creativeCredo: null,
});
const v$ = useVuelidate(
    {
      creativeCredo: {required, minLength: minLength(40)},
    },
    form,
);

const onClick = () => {
  v$.value.$validate();
  if (v$.value.$error) return;
  artistRegistrationStore.form.artist_credo = form.value.creativeCredo;
  modals.modal.show = false;
};

onMounted(async () => {
  await nextTick();
  form.value.creativeCredo = artistRegistrationStore.form.artist_credo;
});
</script>

<template>
  <div class="modal-box">
    <h2 class="text-center font-semibold border-grey border-b pb-4 mb-4">
      {{ $t("artistRegistration.modals.editCreativeCredo.title") }}
    </h2>
    <form class="flex flex-col gap-2">
      <div class="flex flex-col mb-10">
            <textarea
                v-model="form.creativeCredo"
                :class="{
                'border-red-500':
                  v$.creativeCredo.$error && v$.creativeCredo.$dirty,
              }"
                class="w-full p-4 border    rounded-2xl focus:outline-none mb-2"
            />
        <div
            class="flex justify-between items-center text-sm text-secondaryText"
        >
          <p v-if="artistRegistrationStore.form.artist_credo">
            {{ artistRegistrationStore.form.artist_credo.length }} / 40
          </p>
          <p>
            {{
              $t("artistRegistration.modals.editAbout.minimumCharacters")
            }}
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
              class="cursor-pointer w-full bg-black text-white text-center py-2 rounded-xl"
              @click="onClick"
          >
            {{ $t("artistRegistration.buttons.save") }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
