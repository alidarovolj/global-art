<script setup>
import {storeToRefs} from "pinia";
import {useArtistRegistrationStore} from "~/store/artistRegistration.js";
import countries from "~/countries.json";

const artistRegistrationStore = useArtistRegistrationStore();
const {form} = storeToRefs(artistRegistrationStore);

const setData = (data) => {
  artistRegistrationStore.form.artist_base_info.address = data.address;
  artistRegistrationStore.form.artist_base_info.city = data.city;
  artistRegistrationStore.form.artist_base_info.country = data.country;
  artistRegistrationStore.form.artist_base_info.state = data.state;
  artistRegistrationStore.form.artist_base_info.zipcode = data.postalCode;
};
</script>

<template>
  <div>
    <div class="flex justify-center">
      <div class="w-full">
        <div class="mb-10">
          <h3 class="text-3xl font-bold mb-2 ">
            {{ $t("artistRegistration.profileSetup.firstStep.basicInfoTitle") }}
          </h3>
          <span class="text-sm text-secondaryText">
            {{
              $t("artistRegistration.profileSetup.firstStep.basicInfoSubtitle")
            }}
          </span>
        </div>
        <div>
          <div class="flex flex-col mb-8">
            <label
                class="text-sm text-primaryText mb-2"
                for="first_name"
            >{{ $t("artistRegistration.profileSetup.firstStep.firstName") }}
              <span class="text-red-500">*</span></label
            >
            <input
                id="first_name"
                v-model="form.artist_base_info.first_name"
                :placeholder="$t('artistRegistration.placeholders.firstName')"
                class="py-[14px] px-4 border border-bColor rounded-lg"
                type="text"
            />
          </div>
          <div class="flex flex-col mb-8">
            <label
                class="text-sm text-primaryText mb-2"
                for="last_name"
            >{{ $t("artistRegistration.profileSetup.firstStep.lastName") }}
              <span class="text-red-500">*</span></label
            >
            <input
                id="last_name"
                v-model="form.artist_base_info.last_name"
                :placeholder="$t('artistRegistration.placeholders.lastName')"
                class="py-[14px] px-4 border border-bColor rounded-lg"
                type="text"
            />
          </div>
          <div class="flex flex-col mb-10">
            <label
                class="text-sm text-primaryText mb-2"
                for="artistic_name"
            >{{ $t("artistRegistration.profileSetup.firstStep.phone") }}
              <span class="text-red-500">*</span></label
            >
            <input
                id="artistic_name"
                v-model="
                artistRegistrationStore.form.artist_base_info.phone_number
              "
                :placeholder="$t('buyComponent.shipping.enterPhone')"
                class="py-[14px] px-4 border border-bColor rounded-lg"
                type="text"
            />
          </div>
          <div class="flex justify-between mb-10">
            <div class="flex flex-col w-third">
              <label
                  class="text-sm text-primaryText mb-2 "
                  for="location"
              >{{
                  $t("artistRegistration.profileSetup.firstStep.country")
                }}</label
              >
              <select
                  id="location"
                  v-model="form.artist_base_info.country"
                  class="py-[14px] px-4 border border-bColor rounded-lg   "
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
            <div class="flex flex-col w-third">
              <label
                  class="text-sm text-primaryText mb-2 "
                  for="location"
              >{{
                  $t("artistRegistration.profileSetup.firstStep.state")
                }}</label
              >
              <input
                  id="location"
                  v-model="form.artist_base_info.state"
                  class="py-[14px] px-4 border border-bColor rounded-lg   "
                  placeholder="California"
                  type="text"
              />
            </div>
            <div class="flex flex-col w-third">
              <label
                  class="text-sm text-primaryText mb-2 "
                  for="location"
              >{{
                  $t("artistRegistration.profileSetup.firstStep.city")
                }}</label
              >
              <input
                  id="location"
                  v-model="form.artist_base_info.city"
                  class="py-[14px] px-4 border border-bColor rounded-lg   "
                  placeholder="Los Angeles"
                  type="text"
              />
            </div>
          </div>
          <div class="flex justify-between mb-3 gap-2">
            <div class="flex flex-col w-full">
              <label
                  class="text-sm text-primaryText mb-2 "
                  for="location"
              >{{
                  $t("artistRegistration.profileSetup.firstStep.address")
                }}</label
              >
              <input
                  id="location"
                  v-model="form.artist_base_info.address"
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
                }}</label
              >
              <input
                  id="location"
                  v-model="form.artist_base_info.zipcode"
                  class="py-[14px] px-4 border border-bColor rounded-lg   "
                  placeholder="050000"
                  type="text"
              />
            </div>
          </div>
          <p class="text-sm text-secondaryText mb-10">
            {{
              $t(
                  "artistRegistration.profileSetup.firstStep.providesYourLocation",
              )
            }}
          </p>
          <p class="text-sm text-secondaryText">
            {{ $t("artistRegistration.profileSetup.firstStep.note") }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
