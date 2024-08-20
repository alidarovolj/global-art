<script setup>
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import {usePromocodeStore} from "~/store/promocode.js";
import {useModalsStore} from "~/store/modals.js";

const loading = ref(false);
const promocode = usePromocodeStore();
const modals = useModalsStore()

const formCreate = ref({
  is_discount_by_percent: false,
  discount_amount: null,
  start_date: null,
  end_date: null,
  is_reusable: false,
});

const v$ = useVuelidate(
    {
      is_discount_by_percent: {required},
      discount_amount: {required},
      start_date: {required},
      end_date: {required},
      is_reusable: {required},
    },
    formCreate,
);

const addPromocodeData = async () => {
  loading.value = true;

  await v$.value.$validate();
  if (v$.value.$error) {
    loading.value = false;
    return;
  }

  await promocode.createPromocode(formCreate.value);
  if (promocode.promocodeCreate.success) {
    formCreate.value = {
      is_discount_by_percent: false,
      discount_amount: null,
      start_date: null,
      end_date: null,
      is_reusable: false,
    };
    await promocode.getPromocodeList(form.value);
    modals.modal.show = false;
  }
  loading.value = false;
};
</script>

<template>
  <div class="modal-box !max-w-[680px] !pb-0 !px-0 !rounded-none  ">
    <h2 class="text-center font-semibold border-grey border-b pb-4 mb-4">
      {{ $t("artistProfile.promocode.promocodeAdd") }}
    </h2>
    <div class="border-b ">
      <div>
        <div class="flex justify-between">
          <h3 class="font-bold text-xl mb-6 ">
            {{ $t("artistProfile.tabs.promocode") }}
          </h3>
        </div>
        <div class="flex flex-col mb-6">
          <label
              class="text-sm text-primaryText mb-1 "
              for="Promo code"
          >
            {{ $t("artistProfile.tabs.promocode") }}
          </label>
          <div class="flex gap-2">
            <input
                v-model="formCreate.discount_amount"
                :class="{
                      'border-red-500':
                        v$.discount_amount.$error && v$.discount_amount.$dirty,
                    }"
                :placeholder="$t('artistProfile.tabs.promocode')"
                class="py-[14px] px-4 border border-bColor rounded-lg   w-full"
                type="number"
            />
            <select
                v-model="formCreate.is_discount_by_percent"
                class="py-[14px] px-4 border border-bColor rounded-lg  "
                type="number"
            >
              <option :value="true">%</option>
              <option :value="false">$</option>
            </select>
          </div>
        </div>
        <div class="flex gap-2 mb-6">
          <div class="flex flex-col w-full">
            <label
                class="text-sm text-primaryText mb-1 "
                for="start_date"
            >{{
                $t("artistRegistration.modals.exhibitions.startDate")
              }}</label
            >
            <input
                id="start_date"
                v-model="formCreate.start_date"
                :class="{
                      'border-red-500':
                        v$.start_date.$error && v$.start_date.$dirty,
                    }"
                class="py-[14px] px-4 border border-bColor rounded-lg  "
                placeholder="DD.MM.YYYY"
                type="datetime-local"
            />
          </div>
          <div class="flex flex-col w-full">
            <label
                class="text-sm text-primaryText mb-1 "
                for="end_date"
            >{{
                $t("artistRegistration.modals.exhibitions.endData")
              }}</label
            >
            <input
                id="end_date"
                v-model="formCreate.end_date"
                :class="{
                      'border-red-500':
                        v$.end_date.$error && v$.end_date.$dirty,
                    }"
                class="py-[14px] px-4 border border-bColor rounded-lg  "
                placeholder="DD.MM.YYYY"
                type="datetime-local"
            />
          </div>
        </div>
        <label
            :class="{
                  'text-red-500':
                    v$.is_reusable.$error && v$.is_reusable.$dirty,
                }"
            for=""
        >
          <input
              v-model="formCreate.is_reusable"
              class="mr-2 border"
              type="checkbox"
          />
          {{ $t("promocodes.modals.createPromocode.reusable") }}
        </label>
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
              @click="addPromocodeData"
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