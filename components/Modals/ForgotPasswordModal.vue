<script setup>
import {useModalsStore} from "~/store/modals.js";
import {ref} from "vue";
import {useVuelidate} from "@vuelidate/core";
import {email, required} from "@vuelidate/validators";
import {useUserStore} from "~/store/user.js";

const modals = useModalsStore();
const user = useUserStore();

const loading = ref(false);

const formForgot = ref({
  app_user_login: "",
});

const v$Forgot = useVuelidate(
    {
      app_user_login: {required, email},
    },
    formForgot,
);

async function sendFormForgot() {
  loading.value = true;
  await v$Forgot.value.$validate();

  if (v$Forgot.value.$error) {
    loading.value = false;
    return;
  }

  await api(`/api/company/app-user/request-app-user-password-reset/`, {
    body: JSON.stringify(formForgot.value),
  })
      .then(async (response) => {
        const data = response.data;
        if (data.success) {
          loading.value = false;
          modals.modal.show = false;
          toasts.showToast("success", "Link sent to your email", "Please check your email!");
          await user.getProfile();
        } else {
          user.result = false;
          loading.value = false;
          toasts.showToast("error", "An error has occurred!", data.msg_txt);
        }
      })
      .catch((e) => {
        if (e.response.data.success === false) {
          toasts.showToast("error", "An error has occurred!", e.response.data.msg_txt);
        } else {
          toasts.showToast("error", "An error has occurred!", "Server Error! Please try again later.");
        }
      });
}
</script>

<template>
  <form
      class="modal-box flex flex-col justify-center py-2  "
      @submit.prevent="sendFormForgot"
  >
    <p
        class="font-bold text-base text-center border-grey border-b-2 pb-4 "
    >
      {{ $t("auth.forgotPassword.forgot") }}
    </p>
    <p class="mt-4">
      {{ $t("auth.forgotPassword.enter") }}
    </p>
    <div
        class="flex justify-between mt-6 border-grey border-2 rounded-lg w-92 "
    >
      <input
          v-model="formForgot.app_user_login"
          :class="{ 'border-red-500': v$Forgot.app_user_login.$error }"
          class="border min-w-92 w-full px-4 py-3    rounded-lg"
          placeholder="Please fill email"
          type="text"
      />
    </div>
    <button
        class="w-full border-black border-2 rounded-3xl bg-black text-white mt-6 py-3"
        type="submit"
    >
      {{ $t("auth.forgotPassword.send") }}
    </button>
  </form>
</template>