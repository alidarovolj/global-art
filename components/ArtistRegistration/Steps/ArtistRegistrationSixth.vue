<script setup>
import {PlusIcon, TrashIcon} from "@heroicons/vue/24/outline";
import {useArtistRegistrationStore} from "~/store/artistRegistration.js";
import {storeToRefs} from "pinia";

const artistRegistrationStore = useArtistRegistrationStore();
const {form} = storeToRefs(artistRegistrationStore);

const addMoreReferences = () => {
  form.value.artist_references.push({
    full_name: "",
    contact_info: "",
  });
};

const removeReference = (index) => {
  form.value.artist_references.splice(index, 1);
};
</script>

<template>
  <div>
    <div class="flex justify-center">
      <div class="w-full">
        <div class="mb-10">
          <h3 class="text-3xl font-bold mb-2  ">
            {{ $t("artistRegistration.profileSetup.sixthStep.verifyIdentity") }}
          </h3>
          <span class="text-sm text-secondaryText">
            {{ $t("artistRegistration.profileSetup.sixthStep.pleaseProvide") }}
          </span>
        </div>
        <div>
          <div v-for="(item, index) of form.artist_references" :key="index">
            <div class="flex justify-between">
              <p class="font-bold mb-4 ">
                {{ $t("artistRegistration.profileSetup.sixthStep.artist") }} №{{
                  index + 1
                }}
              </p>
              <TrashIcon
                  v-if="form.artist_references.length > 1"
                  class="cursor-pointer text-red-500 h-5 w-5"
                  @click="removeReference(index)"
              />
            </div>
            <div class="mb-10">
              <div class="flex flex-col mb-4">
                <label
                    class="text-sm text-primaryText mb-1 "
                    for="first_artist-name"
                >{{
                    $t("artistRegistration.profileSetup.sixthStep.artistName")
                  }}</label
                >
                <input
                    id="first_artist-name"
                    v-model="item.full_name"
                    :placeholder="$t('artistRegistration.placeholders.fullName')"
                    class="py-[14px] px-4 border border-bColor rounded-lg   "
                    type="text"
                />
              </div>
              <div class="flex flex-col">
                <label
                    class="text-sm text-primaryText mb-2 "
                    for="first_artist-contacts"
                >{{
                    $t(
                        "artistRegistration.profileSetup.sixthStep.artistContacts",
                    )
                  }}</label
                >
                <input
                    id="first_artist-contacts"
                    v-model="item.contact_info"
                    :placeholder="
                    $t(
                      'artistRegistration.profileSetup.sixthStep.contactsPlaceholder',
                    )
                  "
                    class="py-[14px] px-4 border border-bColor rounded-lg   "
                    type="text"
                />
              </div>
            </div>
          </div>
          <button
              class="flex items-center gap-2 py-3 px-10 border rounded-3xl   "
              @click="addMoreReferences"
          >
            <PlusIcon class="w-5 h-5"/>
            {{
              $t("artistRegistration.profileSetup.sixthStep.addMoreContacts")
            }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
