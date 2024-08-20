<script setup>
const props = defineProps({
  artistData: {
    type: [Object],
    required: true,
  },
});
</script>

<template>
  <div class="p-6 border border-bColor rounded-2xl">
    <p class="font-bold mb-2">
      {{ $t("artistProfile.dashboard.availableForCommissions") }}
    </p>
    <p class="text-secondaryText mb-6">
      {{ $t("artistProfile.dashboard.availableSubtitle") }}
    </p>
    <Base-button class="py-2" variant="outlined">
      {{ $t("artistProfile.dashboard.buttons.editAvailability") }}
    </Base-button>
  </div>
</template>
