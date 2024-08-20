<script setup>
import {EyeIcon, EyeSlashIcon} from "@heroicons/vue/24/outline/index";
import {ExclamationCircleIcon} from "@heroicons/vue/24/outline";
import {useVuelidate} from "@vuelidate/core";
import {email, required} from "@vuelidate/validators";
import {useLanguagesStore} from "~/store/languages.js";
import {storeToRefs} from "pinia";
import {useModalsStore} from "~/store/modals.js";
import {useUserStore} from "~/store/user.js";
import {useToastsStore} from "~/store/toastDropStore.js";
import {useAuthStore} from "~/store/auth.js";

const activate_res = ref(null);
const registration_res = ref(null);
const isActivationCodeSent = ref(false);
const loading = ref(false);
const toasts = useToastsStore();
const modals = useModalsStore();
const user = useUserStore();
const passwordFieldType = ref("password");
const language = useLanguagesStore();
const {cur_lang} = storeToRefs(language);
const auth = useAuthStore()
const localePath = useLocalePath();
const activationDone = ref(false);
const goToArtistRegistration = ref(false);

const rulesReg = {
  app_user_login: {required, email},
  app_user_password: {required},
  app_user_full_name: {required},
  language: {required},
};

const formReg = ref({
  app_user_login: "",
  app_user_password: "",
  app_user_full_name: "",
  app_user_ref_code: "",
  language: cur_lang.value,
});

const v$Reg = useVuelidate(rulesReg, formReg);

const activateForm = ref({
  app_user_login: "",
  app_user_activation_code: "",
});

const switchVisibility = () => {
  passwordFieldType.value =
      passwordFieldType.value === "password" ? "text" : "password";
};

async function activateUser() {
  try {
    const response = await api(`/api/company/app-user/activate-app-user-by-code/`, {
      body: JSON.stringify(activateForm.value),
    });

    // Log the response to see the structure and status code
    console.log('Response:', response);

    const data = response.data;
    if (data.success) {
      activate_res.value = true;

      await auth.initCookieToken(data.data.app_user_token);
      auth.token = data.data.app_user_token;
      await nextTick();

      await user.getProfile();
      isActivationCodeSent.value = false;
      activationDone.value = true;
    } else {
      activate_res.value = false;
      toasts.showToast("error", "An error has occurred!", data.msg_txt);
    }
  } catch (e) {
    // Log the error to see why the catch block is being triggered
    console.error('Error:', e);

    const errorMessage = e.response?.data?.msg_txt || "Server Error! Please try again later.";
    toasts.showToast("error", "An error has occurred!", errorMessage);
  }
}

async function sendRegistration() {
  loading.value = true;
  await v$Reg.value.$validate();

  if (v$Reg.value.$error) {
    loading.value = false;
    return;
  }

  try {
    const response = await api(`/api/company/app-user/register-app-user/`, {
      body: JSON.stringify(formReg.value),
    });

    const data = response.data;
    if (data.success) {
      loading.value = false;
      registration_res.value = true;
      activateForm.value.app_user_login = formReg.value.app_user_login;
      isActivationCodeSent.value = true;
    } else {
      registration_res.value = false;
      loading.value = false;
      toasts.showToast("error", "An error has occurred!", data.msg_txt);
    }
  } catch (e) {
    const errorMessage = e.response?.data?.msg_txt || "Server Error! Please try again later.";
    toasts.showToast("error", "An error has occurred!", errorMessage);
    loading.value = false;
  }
}

async function resendCode() {
  try {
    const response = await api(`/api/company/app-user/resend-app-user-activation-code/`, {
      body: JSON.stringify({
        app_user_login: activateForm.value.app_user_login,
      }),
    });

    const data = response.data;
    if (data.success) {
      toasts.showToast("success", "Code send to email", "Please check your email!");
    } else {
      toasts.showToast("error", "An error has occurred!", data.msg_txt);
    }
  } catch (e) {
    const errorMessage = e.response?.data?.msg_txt || "Server Error! Please try again later.";
    toasts.showToast("error", "An error has occurred!", errorMessage);
  }
}

const registerUser = () => {
  if (!isActivationCodeSent.value) {
    sendRegistration();
  } else {
    activateUser();
  }
};
</script>

<template>
  <div>
    <form v-if="!activationDone" @submit.prevent="registerUser">
      <div
          v-if="registration_res === false"
          class="flex items-center gap-2 mt-6"
      >
        <div class="w-max rounded-full bg-[#AC1111] p-2">
          <ExclamationCircleIcon class="text-white w-5 h-5"/>
        </div>
        <div>
          <p class="font-bold text-base">
            {{ $t("auth.signUpModal.again") }}
          </p>
          <p>{{ $t("auth.signUpModal.invalidTry") }}</p>
        </div>
      </div>
      <div v-if="!isActivationCodeSent">
        <div class="text-center mb-8">
          <p class="font-semibold text-2xl mb-2">{{ $t('auth.signUpModal.title') }}</p>
          <p class="text-7xl font-semibold">{{ $t('auth.signUpModal.discount') }}</p>
          <p>{{ $t('auth.signUpModal.firstPurchase') }}</p>
        </div>
        <div class="w-full flex justify-center">
          <GoogleAuth @close-modal="modals.modal.show = false"/>
        </div>
        <div class="flex items-center gap-2">
          <div class="block h-[1px] bg-[#E3E3E3] w-full"></div>
          <p class="my-4 text-[#757575] text-center">
            {{ $t("auth.signUpModal.or") }}
          </p>
          <div class="block h-[1px] bg-[#E3E3E3] w-full"></div>
        </div>
        <input
            v-model="formReg.app_user_full_name"
            :class="{ 'border-red-500': v$Reg.app_user_full_name.$error }"
            :placeholder="$t('auth.signUpModal.fullName')"
            class="border rounded-lg w-full pl-4 py-3   "
            type="text"
        />
        <p
            v-for="error in v$Reg.app_user_full_name.$errors"
            :key="error.$uid"
            class="mt-1 text-sm text-red-500"
        >
          {{ error.$message }}
        </p>
        <input
            v-model="formReg.app_user_login"
            :class="{ 'border-red-500': v$Reg.app_user_login.$error }"
            :placeholder="$t('auth.signUpModal.email')"
            class="mt-6 border rounded-lg w-full pl-4 py-3   "
            type="email"
        />
        <p
            v-for="error in v$Reg.app_user_login.$errors"
            :key="error.$uid"
            class="mt-1 text-sm text-red-500"
        >
          {{ error.$message }}
        </p>

        <div class="flex justify-between my-6 w-full relative">
          <input
              v-model="formReg.app_user_password"
              :class="{ 'border-red-500': v$Reg.app_user_password.$error }"
              :placeholder="$t('auth.signUpModal.password')"
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
            <EyeSlashIcon
                v-else
                class="w-6 h-6"
                @click="switchVisibility"/>
          </div>
        </div>
        <div class="relative flex items-start">
          <div class="flex h-6 items-center">
            <input
                id="comments"
                v-model="goToArtistRegistration"
                aria-describedby="comments-description"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                name="comments"
                type="checkbox"
            />
          </div>
          <div class="ml-3 text-sm leading-6">
            <label class="font-medium text-gray-900" for="comments">
              {{ $t('auth.signUpModal.artistOrNo') }}
            </label>
          </div>
        </div>
        <p
            v-for="error in v$Reg.app_user_password.$errors"
            :key="error.$uid"
            class="mt-1 text-sm text-red-500"
        >
          {{ error.$message }}
        </p>
      </div>
      <div v-if="isActivationCodeSent">
        <h2 class="text-center font-semibold border-grey border-b pb-4">
          {{ $t('auth.signUpModal.enterCode') }}
        </h2>
        <input
            v-model="activateForm.app_user_activation_code"
            :class="{ 'border-red-500': v$Reg.app_user_login.$error }"
            :placeholder="$t('header.activationCode')"
            class="mt-6 border rounded-lg w-full pl-4 py-3   "
            type="password"
        />
        <p v-if="v$Reg.app_user_login.$error" class="text-red-500 mt-1 text-sm">
          {{ $t("auth.signUpModal.fill") }}
        </p>
        <span
            v-if="isActivationCodeSent"
            class="cursor-pointer text-sm text-[#757575] hover:underline"
            @click="resendCode"
        >
            {{ $t('header.resendCode') }}
          </span>
      </div>
      <p class="mt-8 text-sm text-[#757575]">
        {{ $t("auth.signUpModal.agree") }}
        <NuxtLink
            :to="localePath('/')"
            class="underline decoration-solid text-[#0317CC]"
        >
          {{ $t("auth.signUpModal.terms") }}
        </NuxtLink>
        {{ $t("auth.signUpModal.and") }}
        <NuxtLink
            :to="localePath('/')"
            class="underline decoration-solid text-[#0317CC]"
        >
          {{ $t("auth.signUpModal.privacy") }}
        </NuxtLink>
      </p>
      <Base-button :loading="loading" class="my-8 py-3">
        {{
          !isActivationCodeSent
              ? $t("auth.signUpModal.sendCode")
              : $t("auth.signUpModal.signUp")
        }}
      </Base-button>
      <p class="text-center">
        {{ $t('auth.signUpModal.haveAnAccount') }} <span
          class="text-[#0317CC] cursor-pointer"
          @click="modals.modal.show = false; modals.showModal('LoginModal')">{{ $t('auth.signUpModal.signIn') }}</span>
      </p>
    </form>
    <div
        v-else
        class="flex gap-10 justify-center h-[80vh] -m-10"
    >
      <img
          alt=""
          class="w-1/2 object-cover" src="@/assets/img/registration.png">
      <div class="w-1/2 flex items-center mr-10">
        <div class="w-full">
          <p class="text-2xl font-semibold mb-3">
            {{ $t('auth.signUpModal.welcome') }}
          </p>
          <div class="mb-10 text-sm">
            <p>
              {{ $t('auth.signUpModal.first') }}
            </p>
            <p>
              {{ $t('auth.signUpModal.second') }}
            </p>
          </div>
          <Base-button
              v-if="goToArtistRegistration"
              :loading="loading"
              :to="localePath('/artistRegistration')"
              class="my-8 py-3" @click="modals.modal.show = false">
            {{ $t('auth.signUpModal.artistRegistration') }}
          </Base-button>
          <Base-button
              v-else
              :loading="loading"
              class="my-8 py-3"
              @click="modals.modal.show = false">
            {{ $t('auth.signUpModal.continue') }}
          </Base-button>
        </div>
      </div>
    </div>
  </div>
</template>