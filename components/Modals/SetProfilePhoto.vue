<script setup>
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import {useUserStore} from "~/store/user";
import {useModalsStore} from "~/store/modals.js";

const user = useUserStore();
const modals = useModalsStore()
const isLoading = ref(false);

const form = ref({
  photo_base64: "",
});

const v$PP = useVuelidate(
    {
      photo_base64: {required},
    },
    form,
);

const setProfilePhotoLocal = async () => {
  isLoading.value = true;
  await v$PP.value.$validate();

  if (v$PP.value.$error) {
    isLoading.value = false;
    return;
  }

  await user.setProfilePhoto(form.value);
  isLoading.value = false;
  modals.modal.show = false
  await user.getProfile();
};
</script>

<template>
  <div>
    <div class="pb-4 flex items-center gap-5">
      <h3 class="font-bold text-lg">
        {{ $t("artistRegistration.modals.profilePhoto.setPhoto") }}
      </h3>
    </div>
    <p class="pb-4">
      {{ $t("artistRegistration.modals.profilePhoto.uploadPhoto") }}
    </p>
    <UploadPhotoWithoutLoading
        @receive-photo="(item) => (form.photo_base64 = item.photo_base64)"
    />
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
              v-if="isLoading === false"
              class="cursor-pointer w-full bg-black text-white text-center py-2 rounded-xl"
              @click="setProfilePhotoLocal"
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
