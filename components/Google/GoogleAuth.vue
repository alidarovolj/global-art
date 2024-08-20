<script lang="ts" setup>
import {type AuthCodeFlowErrorResponse, type AuthCodeFlowSuccessResponse, useTokenClient,} from "vue3-google-signin";
import axios from "axios";

const auth = useAuthStore();
const user = useUserStore();
const notification = useNotificationStore();

const toasts = useToastsStore()

const emit = defineEmits(['closeModal'])

async function logInGoogle(access_token: string) {
  await api(`/api/company/app-user/login-via-google/`, {
    body: JSON.stringify({
      access_token: access_token,
    }),
  })
      .then(async (response) => {
        const data = response.data;
        if (data.success) {
          await auth.initCookieToken(data.data.app_user_token);
          auth.token = data.data.app_user_token;
          await nextTick();
          await user.getProfile();
          await notification.getNotificationList();
          emit('closeModal')
        } else {
          toasts.showToast("error", "An error has occurred!", data.msg_txt);
          user.result = false;
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

async function getUserInfo(accessToken: string) {
  const response = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}&alt=json`,
  );
}

const handleLoginSuccess = (response: AuthCodeFlowSuccessResponse) => {
  getUserInfo(response.access_token);
  logInGoogle(response.access_token);
};

const handleLoginError = (errorResponse: AuthCodeFlowErrorResponse) => {
  console.error("Error: ", errorResponse);
};

const {isReady, login} = useTokenClient({
  onSuccess: handleLoginSuccess,
  onError: handleLoginError,
});
</script>

<template>
  <div
      class="cursor-pointer w-full flex justify-center items-center gap-2 border  py-3 rounded-3xl"
      @click="() => login()"
  >
    <img alt="" class="w-4 h-4" src="@/assets/img/google.png"/>
    <p>{{ $t("auth.loginModal.continueWithGoogle") }}</p>
  </div>
</template>
