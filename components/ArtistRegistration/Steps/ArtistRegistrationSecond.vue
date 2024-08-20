<script setup>
import {useModalsStore} from "~/store/modals.js";

const artistRegistrationStore = useArtistRegistrationStore();
const {form} = storeToRefs(artistRegistrationStore);

const modals = useModalsStore()
</script>

<template>
  <div>
    <div class="flex justify-center">
      <div class="w-full">
        <div>
          <h3 class="text-3xl font-bold mb-6  ">
            {{ $t("artistRegistration.profileSetup.secondStep.briefBio") }}
          </h3>
          <div class="flex flex-col mb-10">
            <label
                class="text-sm text-primaryText mb-2 "
                for="bio"
            >{{ $t("artistRegistration.profileSetup.secondStep.bio") }}
              <span class="text-red-500">*</span></label
            >
            <textarea
                id=""
                v-model="artistRegistrationStore.form.artist_about"
                :placeholder="
                $t('artistRegistration.profileSetup.secondStep.bioPlaceholder')
              "
                class="w-full p-4 border    rounded-2xl focus:outline-none mb-2"
                name=""
                @input="
                (event) =>
                  (artistRegistrationStore.form.artist_about =
                    event.target.value)
              "
            />
            <div
                class="flex justify-between items-center text-sm text-secondaryText"
            >
              <p v-if="artistRegistrationStore.form.artist_about">
                {{ artistRegistrationStore.form.artist_about.length }} / 40
                <span
                    :class="{
                    'text-red-500':
                      artistRegistrationStore.form.artist_about.length > 1500,
                  }"
                >(max: 1500)</span
                >
              </p>
              <p class="text-end">
                {{
                  $t(
                      "artistRegistration.profileSetup.secondStep.minimumCharacters",
                  )
                }}
              </p>
            </div>
          </div>
          <h3 class="text-3xl font-bold mb-6  ">
            {{ $t("artistRegistration.profileSetup.secondStep.credoTitle") }}
          </h3>
          <div class="flex flex-col mb-10">
            <label
                class="text-sm text-primaryText mb-2 "
                for="bio"
            >{{ $t("artistRegistration.profileSetup.secondStep.credo") }}
              <span class="text-red-500">*</span></label
            >
            <textarea
                id=""
                v-model="artistRegistrationStore.form.artist_credo"
                :placeholder="
                $t(
                  'artistRegistration.profileSetup.secondStep.credoPlaceholder',
                )
              "
                class="w-full p-4 border    rounded-2xl focus:outline-none mb-2"
                name=""
                @input="
                (event) =>
                  (artistRegistrationStore.form.artist_credo =
                    event.target.value)
              "
            />
            <div
                class="flex justify-between items-center text-sm text-secondaryText"
            >
              <p v-if="artistRegistrationStore.form.artist_credo">
                {{ artistRegistrationStore.form.artist_credo.length }} / 40
                <span
                    :class="{
                    'text-red-500':
                      artistRegistrationStore.form.artist_credo.length > 1500,
                  }"
                >(max: 1500)</span
                >
              </p>
              <p class="text-end">
                {{
                  $t(
                      "artistRegistration.profileSetup.secondStep.minimumCharacters",
                  )
                }}
              </p>
            </div>
          </div>
          <div class="flex justify-center">
            <div class="w-full">
              <div class="mb-12">
                <h3
                    class="text-3xl font-bold mb-2  "
                >
                  {{
                    $t(
                        "artistRegistration.profileSetup.secondStep.additionalDetails",
                    )
                  }}
                </h3>
                <span class="text-sm text-secondaryText">
                  {{
                    $t(
                        "artistRegistration.profileSetup.secondStep.youCanUpdate",
                    )
                  }}
                </span>
              </div>
              <div>
                <div class="p-6 border  rounded-2xl mb-8">
                  <div class="flex items-center justify-between">
                    <p
                        class="text-primaryText text-xl font-bold  "
                    >
                      {{ $t("artistRegistration.modals.exhibitions.title") }}
                      <span class="text-red-500">*</span>
                    </p>
                    <button
                        class="underline "
                        @click="modals.showModal('AddExhibition')"
                    >
                      <span v-if="form.artist_exhibition[0].title">
                        {{ $t("artistRegistration.buttons.edit") }}
                      </span>
                      <span v-else>
                        {{ $t("artistRegistration.buttons.add") }}
                      </span>
                    </button>
                  </div>
                  <div v-if="form.artist_exhibition[0].title">
                    <div
                        v-for="(item, index) of form.artist_exhibition"
                        :key="index"
                        class="mt-4 "
                    >
                      <p>{{ index + 1 }}. {{ item.title }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
