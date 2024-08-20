<script setup>
import {ArrowUpTrayIcon, PhotoIcon} from "@heroicons/vue/24/outline";
import {useArtistRegistrationStore} from "~/store/artistRegistration.js";
import {storeToRefs} from "pinia";

const modals = useModalsStore()
const artistRegistrationStore = useArtistRegistrationStore();
const {form} = storeToRefs(artistRegistrationStore);

const user = useUserStore();

const runtimeConfig = useRuntimeConfig();
</script>

<template>
  <div>
    <div class="flex justify-center">
      <div class="w-full">
        <div class="mb-10">
          <h3 class="text-3xl font-bold mb-2  ">
            {{ $t("artistRegistration.profileSetup.fifthStep.upload") }}
          </h3>
          <span class="text-sm text-secondaryText">
            {{ $t("artistRegistration.profileSetup.fifthStep.subtitle") }}
          </span>
        </div>
        <div class="flex mb-10 gap-6 h-[280px]">
          <div v-if="user.result" class="w-full">
            <div
                class="relative w-full border h-full flex justify-center items-center flex-col py-20 text-[#1A1A1A] border-[#CCCCCC]  rounded-lg border-dashed"
            >
              <div class="w-1/2 mx-auto">
                <div
                    class="z-10 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  <PhotoIcon class="w-10 h-10 mb-4 mx-auto "/>
                  <p class="text-center mb-4 ">
                    {{
                      $t(
                          "artistRegistration.profileSetup.fifthStep.profilePhoto",
                      )
                    }}
                    <span class="text-red-500">*</span>
                  </p>
                  <button
                      :class="{
                      'bg-black text-white': user.result.data.params.photo,
                    }"
                      class="cursor-pointer  mx-auto hover:bg-[#E8E8E8] hover:text-black active:bg-white transition-all text-primaryText flex justify-center items-center gap-2 py-2 px-4 border rounded-3xl"
                      @click="modals.showModal('SetProfilePhoto')"
                  >
                    <ArrowUpTrayIcon
                        class=" w-5 h-5"
                        stroke-width="2"
                    />
                    <span class="text-base ">{{
                        $t("dragAndDrop.browseFile")
                      }}</span>
                  </button>
                </div>
              </div>
              <img
                  v-if="user.result.data.params.photo"
                  :src="
                  runtimeConfig.public.ENDPOINTS_LINK +
                  user.result.data.params.photo.full
                "
                  alt=""
                  class="rounded-lg h-full absolute left-1/2 -translate-x-1/2 top-0 w-auto p-5 opacity-30"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
