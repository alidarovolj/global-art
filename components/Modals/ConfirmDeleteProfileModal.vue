<script setup>
import {useModalsStore} from "~/store/modals.js";

const loading = ref(false);

const user = useUserStore();
const auth = useAuthStore();
const modals = useModalsStore()

const localePath = useLocalePath();

const removeProfile = async () => {
  loading.value = true;

  await api(`/api/company/company-person/delete-company-person/`, {
    body: JSON.stringify({id: user.result.data.id}),
  })
      .then(async (response) => {
        const data = response.data;
        if (data.success) {
          await navigateTo(localePath("/"));
          auth.token = null;
          await auth.initCookieToken();
          loading.value = false;
          modals.modal.show = false;
        } else {
          navigateTo(localePath("/"));
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
};

onMounted(async () => {
  await nextTick();
});
</script>

<template>
  <div>
    <h2 class="text-center font-semibold border-grey border-b pb-4 mb-4">
      {{ $t("profile.address.createAddressModal.title") }}
    </h2>
    <p>{{ $t("profile.profile.deleteConfirm") }}</p>
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
              v-if="loading === false"
              class="cursor-pointer w-full bg-red-500 text-white text-center py-2 rounded-xl"
              @click="removeProfile"
          >
            {{ $t("profile.profile.deleteButton") }}
          </p>
          <div
              v-else
              class="cursor-pointer w-full bg-red-500 text-white text-center py-2 rounded-xl"
          >
            <div class="spinner"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
