<script setup>
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";

const form = ref({
  id: null,
  custom_order_price: null,
});

const v$ = useVuelidate({
  id: {required},
  custom_order_price: {required},
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
const loading = ref(false);

const props = defineProps(["element"]);

const toasts = useToastsStore()

const updateOrderPriceLocal = async () => {
  loading.value = true;
  v$.value.$touch();

  if (v$.value.$error) {
    toasts.showToast("error", "Please fill in all required fields", "Please fill in all required fields");
    loading.value = false;
    return;
  }

  await commissions.updateCustomOrderPrice(form.value);
  if (commissions.resultUpdatePrice.success) {
    toasts.showToast("success", "Custom order price updated successfully", "You can now view the updated price in the custom orders list.");
    await commissions.getMyCustomOrders(requestBody.value);
    modals.modal.show = false;
    loading.value = false;
  } else if (!commissions.resultUpdatePrice.success) {
    toasts.showToast("error", "Error updating custom order price", data.msg_txt);
    loading.value = false;
  } else {
    toasts.showToast("error", "Server error", "please try again later");
    loading.value = false;
  }
  loading.value = false;
};

onMounted(async () => {
  await nextTick()
  form.value.id = modals.modal.modalData.id;
})
</script>

<template>
  <div>
    <h2 class="text-center font-semibold border-grey border-b pb-4 mb-4">
      {{ $t('artistProfile.comission.updateOrderPrice') }}
    </h2>
    <div class="pb-16 border-b ">
      <div class="w-full flex flex-col gap-2">
        <p class="font-bold">{{ $t('artistProfile.comission.updatePriceTitle') }}</p>
        <p>{{ $t('artistProfile.comission.updatePriceContent') }}</p>
        <div class="flex items-center gap-2">
          <input
              id="width"
              v-model="form.custom_order_price"
              class="py-[14px] px-4 border border-bColor rounded-lg   "
              placeholder="Enter price"
              type="text"
          />
          <p>$</p>
        </div>
      </div>
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
              @click="updateOrderPriceLocal"
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
