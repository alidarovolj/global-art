<script setup>
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";

const modals = useModalsStore()
const loading = ref(false);

const form = ref({
  id: null,
  custom_order_final_dimensions: {
    length: null,
    width: null,
    height: null,
    weight: null,
  },
  custom_order_final_execution_days: null,
});

const v$ = useVuelidate({
  id: {required},
  custom_order_final_dimensions: {
    length: {required},
    width: {required},
    height: {required},
    weight: {required},
  },
  custom_order_final_execution_days: {required},
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

const props = defineProps(["element"]);

const toasts = useToastsStore()

const updateOrderParamsLocal = async () => {
  loading.value = true;
  v$.value.$touch();

  if (v$.value.$error) {
    toasts.showToast("error", "Please fill in all required fields", "Please fill in all required fields");
    loading.value = false;
    return;
  }

  await commissions.updateCustomOrderParams(form.value);
  if (commissions.resultUpdateParams.success) {
    toasts.showToast("success", "Custom order parameters updated successfully", "You can now view the updated parameters in the custom orders list.");
    await commissions.getMyCustomOrders(requestBody.value);
    modals.modal.show = false;
    loading.value = false;
  } else if (!commissions.resultUpdateParams.success) {
    toasts.showToast("error", "Error updating custom order parameters", "Please try again later");
    loading.value = false;
  } else {
    toasts.showToast("error", "Server error", "Please try again later");
    loading.value = false;
  }
  loading.value = false;
};

onMounted(async () => {
  await nextTick()
  form.value.id = modals.modal.modalData.id
})
</script>

<template>
  <div>
    <h2 class="text-center font-semibold border-grey border-b pb-4 mb-4">
      {{ $t('artistProfile.comission.updateOrderParams') }}
    </h2>
    <div class="pb-16 border-b ">
      <div class="w-full mb-10 flex flex-col gap-2">
        <p class="font-bold">
          {{ $t("commission.timeline.title") }}
        </p>
        <p>
          {{ $t("commission.timeline.description") }}
        </p>
        <div class="flex items-center gap-2">
          <select
              v-model="form.custom_order_final_execution_days"
              :class="{'border border-red-500': v$.custom_order_final_execution_days.$error}"
              class="border select-m w-40 px-4 py-2 rounded-lg font-bold "
          >
            <option :value="null">
              {{ $t("commission.timeline.select") }}
            </option>
            <option v-for="(item, index) of 20" :key="index" :value="item">
              {{ item }}
            </option>
          </select>
          <p>days</p>
        </div>
      </div>
      <div>
        <div class="mb-3">
          <p class="font-bold">
            {{ $t("commission.size.title") }}
          </p>
          <p>
            {{ $t("commission.size.description") }}
          </p>
        </div>
        <div class="md:flex justify-between mb-4">
          <div class="flex flex-col w-full md:w-fourth mb-4 md:mb-0">
            <label
                class="text-sm text-primaryText mb-2 "
                for="width"
            >{{ $t("addArtwork.width") }}</label
            >
            <input
                id="width"
                v-model="form.custom_order_final_dimensions.width"
                :class="{'border border-red-500': v$.custom_order_final_dimensions.weight.$error}"
                :placeholder="$t('addArtwork.width')"
                class="py-[14px] px-4 border border-bColor rounded-lg   "
                type="text"
            />
          </div>
          <div class="flex flex-col w-full md:w-fourth mb-4 md:mb-0">
            <label
                class="text-sm text-primaryText mb-2 "
                for="height"
            >{{ $t("addArtwork.height") }}</label
            >
            <input
                id="height"
                v-model="form.custom_order_final_dimensions.height"
                :class="{'border border-red-500': v$.custom_order_final_dimensions.height.$error}"
                :placeholder="$t('addArtwork.height')"
                class="py-[14px] px-4 border border-bColor rounded-lg   "
                type="text"
            />
          </div>
          <div class="flex flex-col w-full md:w-fourth mb-4 md:mb-0">
            <label
                class="text-sm text-primaryText mb-2 "
                for="length"
            >{{ $t("addArtwork.depth") }}</label
            >
            <input
                id="length"
                v-model="form.custom_order_final_dimensions.length"
                :class="{'border border-red-500': v$.custom_order_final_dimensions.length.$error}"
                :placeholder="$t('addArtwork.depth')"
                class="py-[14px] px-4 border border-bColor rounded-lg   "
                type="text"
            />
          </div>
          <div class="flex flex-col w-full md:w-fifth">
            <label
                class="text-sm text-primaryText mb-2 "
                for="style"
            >{{ $t("addArtwork.units") }}</label
            >
            <select
                id="style"
                class="py-[15.5px] px-4 border border-bColor rounded-lg bg-white   "
                name=""
            >
              <option :value="null">
                {{ $t("addArtwork.cm") }}
              </option>
            </select>
          </div>
        </div>
        <div class="flex flex-col w-full md:w-fourth mb-4 md:mb-0">
          <label
              class="text-sm text-primaryText mb-2 "
              for="length"
          >{{ $t("addArtwork.weight") }}</label
          >
          <div class="flex gap-2 items-center">
            <input
                id="length"
                v-model="form.custom_order_final_dimensions.weight"
                :class="{'border border-red-500': v$.custom_order_final_dimensions.weight.$error}"
                :placeholder="$t('addArtwork.weight')"
                class="py-[14px] px-4 border border-bColor rounded-lg   "
                type="text"
            />
            <p>
              {{ $t("addArtwork.kg") }}
            </p>
          </div>
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
              @click="updateOrderParamsLocal"
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
