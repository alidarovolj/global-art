<script setup>
import {XMarkIcon} from "@heroicons/vue/24/outline";

const form = ref({
  id: null,
  use_balance_amount: 0,
  host_name: "https://globalart.ai",
});

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

const toasts = useToastsStore()

const commissions = useCustomOrdersStore();

const props = defineProps(["element"]);

const acceptPricingLocal = async () => {
  await nextTick();
  await commissions.setPricing(form.value);
  if (commissions.resultPricing.success) {
    toasts.showToast("success", "Custom order price accepted successfully", "You can now view the updated price in the custom orders list.");
    await commissions.getCustomOrders(requestBody.value);
    acceptPricing.close();
  } else if (!commissions.resultPricing.success) {
    toasts.showToast("error", "Error updating custom order price", data.msg_txt);
  } else {
    toasts.showToast("error", "Server error", "please try again later");
  }
};

watch(
    () => props.element,
    (newVal) => {
      if (newVal) {
        form.value.id = newVal.id;
      }
    },
    {immediate: true},
);
</script>

<template>
  <client-only>
    <dialog id="acceptPricing" class="modal modal-bottom sm:modal-middle">
      <div
          class="modal-box !max-w-[680px] !pb-0 !px-0 !rounded-none  "
      >
        <div class="pb-6 border-b ">
          <h3 class="font-bold text-lg text-center  mb-5">
            Accept custom order price
          </h3>
          <div v-if="element">
            <p class="text-center text-gray-500">
              Please confirm the price for the custom order
              <span class=" font-bold text-black"
              >{{ element.custom_order_price }}$</span
              >
            </p>
          </div>
          <div class="absolute right-6 top-6">
            <form method="dialog">
              <button>
                <XMarkIcon class="w-10 h-10"/>
              </button>
            </form>
          </div>
        </div>
        <div class="flex justify-between p-6">
          <div class="modal-action">
            <form method="dialog">
              <button class="text-primaryText underline">Cancel</button>
            </form>
          </div>
          <button
              class="py-4 px-10 bg-green-500 text-white rounded-[120px] "
              @click="acceptPricingLocal"
          >
            {{ $t("artistRegistration.buttons.save") }}
          </button>
        </div>
      </div>
      <form class="modal-backdrop" method="dialog">
        <button>close</button>
      </form>
    </dialog>
  </client-only>
</template>
