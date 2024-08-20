<script setup>
import {useArtistRegistrationStore} from "~/store/artistRegistration.js";

const loading = ref(true);

const artistRegistrationStore = useArtistRegistrationStore();

const user = useUserStore();

onMounted(async () => {
  await nextTick();
  await user.getProfile();
  loading.value = false;
});
</script>

<template>
  <div>
    <div class="flex justify-center">
      <div class="w-full">
        <div class="">
          <div class="mb-11">
            <h3
                class="text-3xl font-bold mb-2 "
            >
              {{ $t("artistRegistration.profileSetup.thirdStep.areYouOpen") }}
            </h3>
            <span class="text-sm text-secondaryText">
              {{ $t("artistRegistration.profileSetup.thirdStep.youCanChange") }}
            </span>
          </div>
          <div class="mb-6">
            <div
                class="cursor-pointer border rounded-2xl p-6 gap-6 flex"
                @click="artistRegistrationStore.form.artist_is_available = true"
            >
              <input
                  v-model="artistRegistrationStore.form.artist_is_available"
                  :value="true"
                  class="w-6 h-6"
                  name="artist_is_available"
                  type="radio"
              />
              <div>
                <p class="mb-2 font-bold">
                  {{
                    $t("artistRegistration.profileSetup.thirdStep.yesImOpen")
                  }}
                </p>
                <p>
                  {{
                    $t(
                        "artistRegistration.profileSetup.thirdStep.thisIndicatesToYes",
                    )
                  }}
                </p>
              </div>
            </div>
          </div>
          <div>
            <div
                class="cursor-pointer border rounded-2xl p-6 gap-6 flex"
                @click="artistRegistrationStore.form.artist_is_available = false"
            >
              <input
                  v-model="artistRegistrationStore.form.artist_is_available"
                  :value="false"
                  class="w-6 h-6"
                  name="artist_is_available"
                  type="radio"
              />
              <div>
                <p class="mb-2 font-bold">
                  {{
                    $t("artistRegistration.profileSetup.thirdStep.noImNotOpen")
                  }}
                </p>
                <p>
                  {{
                    $t(
                        "artistRegistration.profileSetup.thirdStep.thisIndicatesToNot",
                    )
                  }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
