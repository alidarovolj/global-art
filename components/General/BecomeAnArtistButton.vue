<script setup>
import {useAuthStore} from "~/store/auth.js";

const localePath = useLocalePath()
const user = useUserStore()

const auth = useAuthStore()
auth.initCookieToken()
const {token} = storeToRefs(auth)
</script>

<template>
  <NuxtLink
      v-if="token && user.result.data.app_user_is_artist === true"
      :to="localePath('/artistProfile')"
      class="flex gap-2 items-center px-4 py-2 rounded-full border border-[#E3E3E3]">
    {{ $t("header.artistProfile") }}
  </NuxtLink>
  <NuxtLink
      v-else-if="token && user.result.data.app_user_is_artist === false && user.result.data.artist_profile_is_verified === false"
      :to="localePath('/artistRegistration')"
      class="flex gap-2 items-center px-4 py-2 rounded-full border border-[#E3E3E3] w-max">
    {{ $t("header.becomeAnArtist") }}
  </NuxtLink>
</template>