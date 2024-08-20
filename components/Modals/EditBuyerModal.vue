<script setup>
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import {onMounted} from "vue";
import {useModalsStore} from "~/store/modals.js";

const loading = ref(false);
const modals = useModalsStore()

const form = ref({
  id: "",
  app_user_full_name: "",
});

const v$ = useVuelidate(
    {
      id: {required},
      app_user_full_name: {required},
    },
    form,
);

const user = useUserStore();

const editUserLocal = async () => {
  loading.value = true;
  await v$.value.$validate();

  if (v$.value.$error) {
    loading.value = false;
    return;
  }
  await user.editProfile(form.value);
  await user.getProfile();
  modals.modal.show = false
  loading.value = false;
};

onMounted(() => {
  form.value.id = modals.modal.modalData.id;
  form.value.app_user_full_name = modals.modal.modalData.app_user_full_name;
});
</script>

<template>
  <div>
    <form
        class="modal-box  "
        @submit.prevent="editUserLocal"
    >
      <h3 class="font-bold text-lg mb-4">
        {{ $t("buyerComponent.edit") }}
      </h3>
      <p>{{ $t("buyerComponent.change") }}:</p>
      <div class="mt-6">
        <label class="block mt-1 text-sm font-bold">
          {{ $t("buyerComponent.fullName") }}
        </label>
        <input
            v-model="form.app_user_full_name"
            :class="{ 'border-red-500': v$.app_user_full_name.$error }"
            :placeholder="$t('buyerComponent.fullName')"
            class="border-grey border rounded-lg w-full pl-4 py-3  "
            type="text"
        />
        <p
            v-if="v$.app_user_full_name.$error"
            class="text-red-500 mt-1 text-sm"
        >
          {{ $t("buyerComponent.fill") }}
        </p>
      </div>
      <div class="w-full flex justify-between gap-3 mt-5">
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
              @click="editUserLocal"
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
    </form>
  </div>
</template>
