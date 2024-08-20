<script setup>
const {t} = useI18n();
</script>
<template>
  <div class="bg-black text-white flex flex-col gap-6 items-center py-12">
    <p class="text-2xl font-bold">
      {{ $t("help.contact.title") }}
    </p>
    <button class="py-3 px-16 border border-white rounded-full">
      {{ $t("help.contact.button") }}
    </button>
    <p class="font-bold">
      {{ $t("help.contact.also") }}
      <span class="border-b border-white">{{
          $t("help.contact.feedback")
        }}</span>
    </p>
  </div>
</template>
