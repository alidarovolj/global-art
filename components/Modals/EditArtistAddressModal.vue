<script setup>
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import {useModalsStore} from "~/store/modals.js";
import countries from "~/countries.json";

const artistProfileStore = useArtistProfileStore();
const {editArtistData, getArtistData} = artistProfileStore;
const {form} = storeToRefs(artistProfileStore);

const modals = useModalsStore()

const loading = ref(false);

const v$ = useVuelidate(
    {
      artist_base_info: {
        address: {required},
        country: {required},
        city: {required},
        state: {required},
        zipcode: {required}
      },
    },
    form,
);

// const setData = (data) => {
//   form.value.artist_base_info.address = data.address;
//   form.value.artist_base_info.city = data.city;
//   form.value.artist_base_info.country = data.country;
//   form.value.artist_base_info.state = data.state;
//   form.value.artist_base_info.zipcode = data.postalCode;
// };

const onClick = async () => {
  await v$.value.$validate();
  if (v$.value.$error) return;
  loading.value = true;
  await editArtistData()
  await getArtistData();
  loading.value = false;
  modals.modal.show = false;
};
</script>

<template>
  <div class="modal-box">
    <h2 class="text-center font-semibold border-grey border-b pb-4 mb-4">
      {{ $t("profile.address.editAddressModal.title") }}
    </h2>
    <form>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-y-4 sm:gap-x-5 sm:gap-y-5">
        <div class="flex flex-col w-full">
          <label
              class="text-sm text-primaryText mb-2 "
              for="location"
          >{{
              $t("artistRegistration.profileSetup.firstStep.country")
            }} <span class="text-red-500">*</span></label
          >
          <select
              id="location"
              v-model="form.artist_base_info.country"
              :class="{'border-red-500': v$.artist_base_info.country.$dirty && v$.artist_base_info.country.$error}"
              class="py-[14px] px-4 border border-bColor rounded-lg   "
              type="text"
          >
            <option :value="null">
              {{
                $t(
                    "artistRegistration.profileSetup.firstStep.chooseCountry",
                )
              }}
            </option>
            <option
                v-for="(item, index) of countries"
                :key="index"
                :value="item.code"
            >
              {{ item.name }}
            </option>
          </select>
        </div>
        <div class="flex flex-col ">
          <label
              class="text-sm text-primaryText mb-2 "
              for="location"
          >{{
              $t("artistRegistration.profileSetup.firstStep.state")
            }} <span class="text-red-500">*</span></label
          >
          <input
              id="location"
              v-model="form.artist_base_info.state"
              :class="{'border-red-500': v$.artist_base_info.state.$dirty && v$.artist_base_info.state.$error}"
              class="py-[14px] px-4 border border-bColor rounded-lg   "
              placeholder="California"
              type="text"
          />
        </div>
        <div class="flex flex-col ">
          <label
              class="text-sm text-primaryText mb-2 "
              for="location"
          >{{
              $t("artistRegistration.profileSetup.firstStep.city")
            }} <span class="text-red-500">*</span></label
          >
          <input
              id="location"
              v-model="form.artist_base_info.city"
              :class="{'border-red-500': v$.artist_base_info.city.$dirty && v$.artist_base_info.city.$error}"
              class="py-[14px] px-4 border border-bColor rounded-lg   "
              placeholder="Los Angeles"
              type="text"
          />
        </div>
      </div>
      <div class="flex justify-between my-3 gap-2">
        <div class="flex flex-col w-full">
          <label
              class="text-sm text-primaryText mb-2 "
              for="location"
          >{{
              $t("artistRegistration.profileSetup.firstStep.address")
            }} <span class="text-red-500">*</span></label
          >
          <input
              id="location"
              v-model="form.artist_base_info.address"
              :class="{ 'border-red-500': v$.artist_base_info.address.$dirty && v$.artist_base_info.address.$error}"
              class="py-[14px] px-4 border border-bColor rounded-lg   "
              placeholder="ex. 1234 Main St."
              type="text"
          />
        </div>
        <div class="flex flex-col w-full">
          <label
              class="text-sm text-primaryText mb-2 "
              for="location"
          >{{
              $t("artistRegistration.profileSetup.firstStep.zipcode")
            }} <span class="text-red-500">*</span></label
          >
          <input
              id="location"
              v-model="form.artist_base_info.zipcode"
              :class="{ 'border-red-500': v$.artist_base_info.zipcode.$dirty && v$.artist_base_info.zipcode.$error}"
              class="py-[14px] px-4 border border-bColor rounded-lg   "
              placeholder="050000"
              type="text"
          />
        </div>
      </div>
    </form>
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
              @click="onClick"
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
