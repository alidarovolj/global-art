<script setup>
import {useLoadingStore} from "~/store/loading.js";

const loadingStore = useLoadingStore();
</script>

<template>
  <div
      v-if="loadingStore.loading"
      class="fixed z-[10000] left-0 top-0 w-full h-full bg-white opacity-90"
  >
    <div class="flex justify-center items-center w-full h-full">
      <div class="flex flex-col items-center text-center">
        <div
            class="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"
        />
        <div class="mt-10 text-3xl  font-semibold mb-3">
          {{ loadingStore.text }}
        </div>
        <p class="text-[#757575]">
          {{ $t("preloader.minute") }} <br/>{{ $t("preloader.keepTab") }}
          <br/>{{ $t("preloader.thankYou") }}
        </p>
      </div>
    </div>
  </div>
</template>
