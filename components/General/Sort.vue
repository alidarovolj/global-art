<script setup>
const {t} = useI18n();
</script>

<template>
  <client-only>
    <select class="border select-m w-48 rounded-3xl font-bold">
      <option selected>
        <span class="font-bold">{{ $t("general.sort.title") }}:</span>
        {{ $t("general.sort.popularity") }}
      </option>
      <option>
        <span class="font-bold text-red-800"
        >{{ $t("general.sort.title") }}:</span
        >
        {{ $t("general.sort.price") }}
      </option>
    </select>
  </client-only>
</template>
