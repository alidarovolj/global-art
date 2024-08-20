<script setup>
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";

const loading = ref(false);

const form = ref({
  id: 0,
  new_value: true,
  text: null,
});

const v$ = useVuelidate({
  id: {required},
  new_value: {required},
  text: {required},
}, form);

const requestBody = ref({
  page_number: 1,
  show_by: 10,
  custom_order_app_user_ids: [],
  custom_order_artist_ids: [],
  custom_order_art_category_ids: [],
  custom_order_status_ids: [],
  is_paid: null,
  created_at_from: null,
  created_at_to: null,
  updated_at_from: null,
  updated_at_to: null,
});

const commissions = useCustomOrdersStore();
const modals = useModalsStore()
const toasts = useToastsStore()

onMounted(async () => {
  await nextTick()
  form.value.id = modals.modal.modalData.id;
});

const acceptOrderLocal = async () => {
  loading.value = true;
  v$.value.$touch();

  if (v$.value.$error) {
    toasts.showToast("error", "Please fill in all required fields", "Please fill in all required fields");
    loading.value = false;
    return;
  }

  await commissions.setStatus(form.value);
  if (commissions.resultStatus.success) {
    toasts.showToast("success", "Custom order accepted successfully", "You can now view the updated status in the custom orders list.");
    await commissions.getMyCustomOrders(requestBody.value);
    modals.modal.show = false;
    loading.value = false;
  } else if (!commissions.resultStatus.success) {
    toasts.showToast("error", "Error updating custom order status", data.msg_txt);
    loading.value = false;
  } else {
    toasts.showToast("error", "Server error", "please try again later");
    loading.value = false;
  }
  loading.value = false;
};
</script>

<template>
  <div>
    <h2 class="text-center font-semibold border-grey border-b pb-4 mb-4">
      {{ $t('artistProfile.comission.acceptOrder') }}
    </h2>
    <div class="pb-16 border-b ">
      <p class="mb-4">
        {{ $t('artistProfile.comission.acceptOrderContent') }}
      </p>
      <textarea
          id=""
          v-model="form.text"
          :class="{'border border-red-500': v$.text.$error}"
          class="w-full p-4 border    rounded-2xl focus:outline-none mb-2"
          name=""
          placeholder="Write a message to the customer"
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
        <div class="w-full">
          <p
              v-if="loading === false"
              class="cursor-pointer w-full bg-black text-white text-center py-2 rounded-xl"
              @click="acceptOrderLocal"
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
