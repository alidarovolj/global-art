<script setup>
import {useArtistRegistrationStore} from "~/store/artistRegistration.js";

const {t} = useI18n();

const artistRegistrationStore = useArtistRegistrationStore();
const {form} = storeToRefs(artistRegistrationStore);
const modals = useModalsStore()

const isFormFilled = computed(() => {
  return !!form.value.artist_achievement;
});

const addAchievementsData = () => {
  modals.modal.show = false;
};
</script>

<template>
  <div>
    <h2 class="text-center font-semibold border-grey border-b pb-4 mb-4">
      {{ $t("artistRegistration.modals.achievements.title") }}
    </h2>
    <div class="p-6 pb-16 border-b ">
      <p class="mb-4">
        {{ $t("artistRegistration.modals.achievements.subtitle") }}
      </p>
      <textarea
          id=""
          v-model="form.artist_achievement"
          class="w-full p-4 border    rounded-2xl focus:outline-none mb-2"
          name=""
          @input="(event) => (form.artist_achievement = event.target.value)"
      />
    </div>
    <div class="mt-5">
      <div class="w-full flex justify-between gap-3">
        <form class="w-full" method="dialog">
          <button
              class="w-full bg-gray-200 py-2 rounded-xl"
              @click="modals.modal.show = false">
            {{ $t("artistRegistration.buttons.cancel") }}
          </button>
        </form>
        <button
            :class="{
              'text-white font-bold bg-black cursor-pointer': isFormFilled,
            }"
            :disabled="!isFormFilled"
            class="py-4 px-10 bg-[#F5F5F5] text-[#A8A8A8] cursor-not-allowed rounded-[120px] "
            @click="addAchievementsData"
        >
          {{ $t("artistRegistration.buttons.save") }}
        </button>
      </div>
    </div>
  </div>
</template>
