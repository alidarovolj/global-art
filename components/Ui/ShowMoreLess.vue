<template>
  <div v-if="text">
    <p class="text-secondaryText">
      {{ isExpanded ? text : truncatedText }}
    </p>
    <Base-button
        class="w-max"
        type="button"
        variant="borderless"
        @click="toggleExpanded"
    >
      {{
        isExpanded
            ? $t("artistProfile.dashboard.buttons.less")
            : $t("artistProfile.dashboard.buttons.more")
      }}
    </Base-button>
  </div>
</template>

<script setup>
import {computed, ref} from "vue";

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  maxLines: {
    type: Number,
    default: 2,
  },
  lineLength: {
    type: Number,
    default: 40, // Assuming an average of 40 characters per line
  },
});

const isExpanded = ref(false);

const truncatedText = computed(() => {
  const maxLength = props.maxLines * props.lineLength;
  if (props.text.length > maxLength) {
    return props.text.slice(0, maxLength) + "...";
  }
  return props.text;
});

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value;
};
</script>
