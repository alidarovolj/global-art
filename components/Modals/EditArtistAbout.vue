<script setup>
import {useArtistRegistrationStore} from "~/store/artistRegistration.js";

const artistRegistrationStore = useArtistRegistrationStore();
const modals = useModalsStore()
</script>

<template>
  <div>
    <h2 class="text-center font-semibold border-grey border-b pb-4 mb-4">
      {{ $t("artistRegistration.modals.editAbout.title") }}
    </h2>
    <form class="flex flex-col gap-2">
      <div class="flex flex-col mb-10">
            <textarea
                id=""
                v-model="artistRegistrationStore.form.artist_about"
                class="w-full p-4 border    rounded-2xl focus:outline-none mb-2"
                name=""
                @input="
                (event) =>
                  (artistRegistrationStore.form.artist_about =
                    event.target.value)
              "
            />
        <div
            class="flex justify-between items-center text-sm text-secondaryText"
        >
          <p v-if="artistRegistrationStore.form.artist_about">
            {{ artistRegistrationStore.form.artist_about.length }} / 40
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
              @click="modals.modal.show = false"
          >
            {{ $t("artistRegistration.buttons.save") }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
