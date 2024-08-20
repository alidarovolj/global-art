<script setup>
import {EyeIcon, EyeSlashIcon} from "@heroicons/vue/24/outline/index";
import {ExclamationCircleIcon} from "@heroicons/vue/24/outline";
import {useUserStore} from "~/store/user.js";
import {ref} from "vue";
import {email, required} from "@vuelidate/validators";
import {useVuelidate} from "@vuelidate/core";
import {useModalsStore} from "~/store/modals.js";
import {useNotificationStore} from "~/store/notification.js";
import {useToastsStore} from "~/store/toastDropStore.js";
import {useAuthStore} from "~/store/auth.js";

const user = useUserStore();
const modals = useModalsStore()
const notification = useNotificationStore();
const toasts = useToastsStore()

const loading = ref(false);

const passwordFieldType = ref("password");
const login_res = ref(null);

const auth = useAuthStore();

const form = ref({
  app_user_login: "",
  app_user_password: "",
});

const rules = {
  app_user_login: {required, email},
  app_user_password: {required},
};

const v$ = useVuelidate(rules, form);

const switchVisibility = () => {
  passwordFieldType.value =
      passwordFieldType.value === "password" ? "text" : "password";
};

async function sendForm() {
  loading.value = true;
  login_res.value = true;
  await v$.value.$validate();

  if (v$.value.$error) {
    loading.value = false;
    return;
  }

  await api(`/api/company/app-user/login-app-user/`, {
    body: JSON.stringify(form.value),
  })
      .then(async (response) => {
        const data = response.data;
        if (data.success) {
          await auth.initCookieToken(data.data.app_user_token);
          auth.token = data.data.app_user_token;
          await nextTick();
          login_res.value = true;
          loading.value = false;
          modals.modal.show = false;
          await user.getProfile();
          await notification.getNotificationList();
        } else {
          login_res.value = false;
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
      })
      .finally(() => {
        loading.value = false;
      });
}
</script>

<template>
  <div>
    <h2 class="text-center font-semibold border-grey border-b pb-4">
      {{ $t('header.login') }}
    </h2>
    <div v-if="login_res === false" class="flex items-center gap-2 mt-6">
      <div class="w-max rounded-full bg-[#AC1111] p-2">
        <ExclamationCircleIcon class="text-white w-5 h-5"/>
      </div>
      <div>
        <p class="font-bold text-base">
          {{ $t("auth.loginModal.try") }}
        </p>
        <p>{{ $t("auth.loginModal.invalidTry") }}</p>
      </div>
    </div>
    <form class="mb-8" @submit.prevent="sendForm">
      <input
          v-model="form.app_user_login"
          :class="{ 'border-red-500': v$.app_user_login.$error }"
          :placeholder="$t('auth.loginModal.email')"
          class="border mt-6 rounded-lg w-full pl-4 py-3   "
          type="text"
      />
      <p
          v-for="error in v$.app_user_login.$errors"
          :key="error.$uid"
          class="mt-1 text-sm text-red-500"
      >
        {{ error.$message }}
      </p>
      <div class="flex justify-between mt-6 w-full relative">
        <input
            v-model="form.app_user_password"
            :class="{ 'border-red-500': v$.app_user_password.$error }"
            :placeholder="$t('auth.loginModal.password')"
            :type="passwordFieldType"
            class="border rounded-lg min-w-full w-full px-4 py-3   "
        />
        <div
            class="items-center cursor-pointer absolute right-4 top-1/2 -translate-y-1/2"
        >
          <EyeIcon
              v-if="passwordFieldType !== 'password'"
              class="w-6 h-6"
              @click="switchVisibility"
          />
          <EyeSlashIcon v-else
                        class="w-6 h-6" @click="switchVisibility"/>
        </div>
      </div>
      <p
          v-for="error in v$.app_user_password.$errors"
          :key="error.$uid"
          class="mt-1 text-sm text-red-500"
      >
        {{ error.$message }}
      </p>
      <Base-button :loading="loading" class="mt-8 py-3">
        {{ $t("auth.loginModal.login") }}
      </Base-button>
      <p class="my-4 text-[#757575] text-center">
        {{ $t("auth.loginModal.or") }}
      </p>
      <div class="w-full flex justify-center">
        <GoogleAuth @close-modal="modals.modal.show = false"/>
      </div>
    </form>
    <button
        class="underline decoration-solid"
        @click="modals.modal.modalName = 'ForgotPasswordModal'"
    >
      {{ $t("auth.loginModal.forgotPass") }}
    </button>
  </div>
</template>