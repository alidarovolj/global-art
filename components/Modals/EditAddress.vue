<script setup>
import {useDeliveryAddressStore} from "~/store/deliveryAddress.js";
import {useLanguagesStore} from "~/store/languages.js";
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import {useModalsStore} from "~/store/modals.js";
import countries from "~/countries.json";

const language = useLanguagesStore();
const {cur_lang} = storeToRefs(language);
const modals = useModalsStore()

const {t} = useI18n();

const loading = ref(false);

const toasts = useToastsStore()

const formData = ref({
  delivery_address_app_user_id: "",
  delivery_address_full_address: "",
  delivery_address_city: "",
  delivery_address_state: "",
  delivery_address_country: "",
  delivery_address_zip_code: "",
  delivery_address_phone: "",
  delivery_address_person: "",
  language: cur_lang.value,
  is_default: false,
  id: null,
});

const v$ = useVuelidate(
    {
      delivery_address_app_user_id: {required},
      delivery_address_full_address: {required},
      delivery_address_city: {required},
      delivery_address_state: {required},
      delivery_address_country: {required},
      delivery_address_zip_code: {required},
      delivery_address_phone: {required},
      delivery_address_person: {required},
      id: {required},
    },
    formData,
);

const deliveryAddress = useDeliveryAddressStore();

const submitForm = async () => {
  loading.value = true;
  await v$.value.$validate();

  if (v$.value.$error) {
    loading.value = false;
    toasts.showToast("error", "An error has occurred!", "Please fill out all fields");
    return;
  }

  try {
    await deliveryAddress.editDeliveryAddress(formData.value);
    await deliveryAddress.getDeliveryAddress();
    loading.value = false;
    modals.modal.show = false
  } catch (error) {
    loading.value = false;
    console.error(error);
  }
};

// const getUpdatedAddress = (address) => {
//   formData.value.delivery_address_city = address.city;
//   formData.value.delivery_address_state = address.state;
//   formData.value.delivery_address_country = address.country;
//   formData.value.delivery_address_zip_code = address.postalCode;
//   formData.value.delivery_address_full_address = address.address;
// };

onMounted(async () => {
  formData.value.delivery_address_app_user_id =
      modals.modal.modalData.delivery_address_app_user;
  formData.value.delivery_address_full_address =
      modals.modal.modalData.delivery_address_full_address;
  formData.value.delivery_address_city =
      modals.modal.modalData.delivery_address_city;
  formData.value.delivery_address_state =
      modals.modal.modalData.delivery_address_state;
  formData.value.delivery_address_country =
      modals.modal.modalData.delivery_address_country;
  formData.value.delivery_address_zip_code =
      modals.modal.modalData.delivery_address_zip_code;
  formData.value.delivery_address_phone =
      modals.modal.modalData.delivery_address_phone;
  formData.value.delivery_address_person =
      modals.modal.modalData.delivery_address_person;
  formData.value.id = modals.modal.modalData.id;
});
</script>

<template>
  <div>
    <h2 class="text-center font-semibold border-grey border-b pb-4 mb-4">
      {{ $t("profile.address.createAddressModal.title") }}
    </h2>
    <div v-if="formData.id" class="modal-action">
      <form class="w-full" method="dialog">
        <form @submit.prevent="submitForm">
          <div>
            <p v-if="!formData.delivery_address_zip_code">
              Пожалуйста введите адрес с почтовым индексом
            </p>
            <div class="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-y-4 sm:gap-x-4 mt-3">
              <div class="w-full  mb-2">
                <p class="font-semibold">
                  {{ $t("profile.address.title") }}:
                </p>
                <label class="flex justify-between w-full">
                  <input
                      v-model="formData.delivery_address_full_address"
                      :class="{
                        'border-red-500':
                          v$.delivery_address_full_address.$error,
                      }"
                      :placeholder="t('profile.address.title')"
                      class="border-grey border rounded-lg w-full pl-4 py-3  "
                      type="text"
                  />
                </label>
                <p
                    v-if="v$.delivery_address_full_address.$error"
                    class="text-red-500 mt-1 text-sm"
                >
                  {{ $t("profile.address.fillOutField") }}
                </p>
              </div>
              <div class="w-full mb-2 ">
                <p class="font-semibold">
                  {{ $t("profile.address.country") }}:
                </p>
                <label class="flex justify-between w-full">
                  <select
                      id="location"
                      v-model="formData.delivery_address_country"
                      :class="{
                        'border-red-500': v$.delivery_address_country.$error,
                      }"
                      class="py-[14px] w-full px-4 border border-bColor rounded-lg   "
                  >
                    <option :value="null">Choose country</option>
                    <option
                        v-for="(item, index) of countries"
                        :key="index"
                        :value="item.code"
                    >
                      {{ item.name }}
                    </option>
                  </select>
                </label>
                <p
                    v-if="v$.delivery_address_country.$error"
                    class="text-red-500 mt-1 text-sm"
                >
                  {{ $t("profile.address.fillOutField") }}
                </p>
              </div>
              <div class="w-full mb-2 ">
                <p class="font-semibold">{{ $t("profile.address.city") }}:</p>
                <label class="flex justify-between w-full">
                  <input
                      v-model="formData.delivery_address_city"
                      :class="{
                        'border-red-500': v$.delivery_address_city.$error,
                      }"
                      :placeholder="t('profile.address.city')"
                      class="border-grey border rounded-lg w-full pl-4 py-3  "
                      type="text"
                  />
                </label>
                <p
                    v-if="v$.delivery_address_city.$error"
                    class="text-red-500 mt-1 text-sm"
                >
                  {{ $t("profile.address.fillOutField") }}
                </p>
              </div>
              <div class="w-full mb-2 ">
                <p class="font-semibold">
                  {{ $t("profile.address.state") }}:
                </p>
                <label class="flex justify-between w-full">
                  <input
                      v-model="formData.delivery_address_state"
                      :class="{
                        'border-red-500': v$.delivery_address_state.$error,
                      }"
                      :placeholder="t('profile.address.state')"
                      class="border-grey border rounded-lg w-full pl-4 py-3  "
                      type="text"
                  />
                </label>
                <p
                    v-if="v$.delivery_address_state.$error"
                    class="text-red-500 mt-1 text-sm"
                >
                  {{ $t("profile.address.fillOutField") }}
                </p>
              </div>
              <div class="w-full mb-2 ">
                <p class="font-semibold">{{ $t("profile.address.zip") }}:</p>
                <label class="flex justify-between w-full">
                  <input
                      v-model="formData.delivery_address_zip_code"
                      :class="{
                        'border-red-500': v$.delivery_address_zip_code.$error,
                      }"
                      :placeholder="t('profile.address.zip')"
                      class="border-grey border rounded-lg w-full pl-4 py-3  "
                      type="text"
                  />
                </label>
                <p
                    v-if="v$.delivery_address_zip_code.$error"
                    class="text-red-500 mt-1 text-sm"
                >
                  {{ $t("profile.address.fillOutField") }}
                </p>
              </div>
              <div class="w-full mb-2 ">
                <p class="font-semibold">
                  {{ $t("profile.address.phone") }}:
                </p>
                <label class="flex justify-between w-full">
                  <input
                      v-model="formData.delivery_address_phone"
                      :class="{
                          'border-red-500': v$.delivery_address_phone.$error,
                        }"
                      :placeholder="t('profile.address.phone')"
                      class="border-grey border rounded-lg w-full pl-4 py-3  "
                      type="text"
                  />
                </label>
                <p
                    v-if="v$.delivery_address_phone.$error"
                    class="text-red-500 mt-1 text-sm"
                >
                  {{ $t("profile.address.fillOutField") }}
                </p>
              </div>
              <div class="w-full mb-2 ">
                <p class="font-semibold">
                  {{ $t("profile.address.fullName") }}:
                </p>
                <label class="flex justify-between w-full">
                  <input
                      v-model="formData.delivery_address_person"
                      :class="{
                          'border-red-500': v$.delivery_address_person.$error,
                        }"
                      :placeholder="t('profile.address.fullName')"
                      class="border-grey border rounded-lg w-full pl-4 py-3  "
                      type="text"
                  />
                </label>
                <p
                    v-if="v$.delivery_address_person.$error"
                    class="text-red-500 mt-1 text-sm"
                >
                  {{ $t("profile.address.fillOutField") }}
                </p>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <input v-model="formData.is_default" type="checkbox"/>
            <p>{{ $t("profile.address.default") }}</p>
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
                    @click="submitForm"
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
        </form>
      </form>
    </div>
  </div>
</template>
