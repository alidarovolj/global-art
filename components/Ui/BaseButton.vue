<script setup>
import {defineProps} from "vue";

const localePath = useLocalePath();

const props = defineProps({
  variant: {
    type: String,
    default: "primary",
  },
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  to: {
    type: [String, Object],
    default: "",
  },
  type: {
    type: String,
    default: "submit",
    required: false,
  },
});
</script>

<template>
  <template v-if="props.to">
    <NuxtLink

        :class="['base-button', `base-button__${variant}`, $attrs.class]"
        :to="localePath(props.to)"
        class="w-full block !no-underline"
    >
      <span v-if="loading" class="spinner"/>
      <slot v-else/>
    </NuxtLink>
  </template>
  <template v-else>
    <button
        :class="['base-button', `base-button__${variant}`, $attrs.class]"
        :disabled="loading || disabled"
        :type="type"
        class="w-full block !no-underline"
    >
      <span v-if="loading" class="spinner"/>
      <slot v-else/>
    </button>
  </template>
</template>

<style scoped>
.base-button {
  cursor: pointer;
  border-radius: 24px;
  transition: all 0.1s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  white-space: nowrap;
}

.base-button__primary {
  color: #ffffff;
  background-color: #000000;
}

.base-button__primary:hover {
  color: #1a1a1a;
  background-color: #e8e8e8;
}

.base-button__primary:active {
  color: #ffffff;
  background-color: #000000;
}

.base-button__outlined {
  background-color: #ffffff;
  color: #000000;
  border-width: 1px;
  --tw-border-opacity: 1;
  border-color: rgb(229 231 235 / var(--tw-border-opacity));
}

.base-button__outlined:hover {
  background-color: #e8e8e8;
}

.base-button__outlined:active {
  background-color: #ffffff;
}

.base-button__borderless {
  border: none;
  text-decoration: underline !important;
}

.base-button__borderless:hover {
  border: none;
  text-decoration: none !important;
}

.base-button__borderless:active {
  border: none;
  text-decoration: underline !important;
}
</style>
