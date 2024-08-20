<script setup>
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";

const localePath = useLocalePath();
const user = useUserStore();

const route = useRoute();
const router = useRouter();
const loading = ref(false);

const links = [
  {
    title: "Home",
    link: "/",
  },
  {
    title: "Reset password",
    link: "/reset-password-by-token",
  },
];

const form = ref({
  app_user_password: "",
  app_user_password_reset_token: "",
});

const v$ = useVuelidate(
    {
      app_user_password: {required},
      app_user_password_reset_token: {required},
    },
    form,
);

const toasts = useToastsStore()

async function sendForm() {
  loading.value = true;
  form.value.app_user_password_reset_token = route.query.token;
  await v$.value.$validate();

  if (v$.value.$error) {
    loading.value = false;
    return;
  }

  await api(`/api/company/app-user/reset-app-user-password-by-token/`, {
    body: JSON.stringify(form.value),
  })
      .then(async (response) => {
        const data = response.data;
        if (data.success) {
          loading.value = false;
          await user.getProfile();
          toasts.showToast("success", "Password has been reset successfully", "You can now login with your new password.");
          await router.push(localePath('/'));
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

onMounted(async () => {
  await nextTick();
  if (!route.query?.token) {
    await router.push(localePath('/'));

  }
});
</script>

<template>
  <div class="">
    <div class="container mx-auto px-4 md:px-0">
      <Breadcrumbs :links="links"/>
      <div>
        <h1 class="text-2xl font-bold mt-4">Reset password</h1>
        <div class="mt-4">
          <form action="" class="w-full md:w-1/2" @submit.prevent="sendForm">
            <div>
              <label class="block text-sm font-medium mb-2" for="password"
              >Password</label
              >
              <input
                  id="password"
                  v-model="form.app_user_password"
                  :class="{ 'border-red-500': v$.app_user_password.$error }"
                  class="border min-w-92 w-full px-4 py-3    rounded-lg"
                  name="password"
                  placeholder="Please fill password"
                  required
                  type="password"
              />
            </div>
            <button
                class="w-full border-black border-2 rounded-3xl bg-black text-white mt-6 mb-6 py-3"
                type="submit"
            >
              {{ $t("auth.forgotPassword.send") }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
