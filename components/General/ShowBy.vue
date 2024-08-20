<script setup>
const {t} = useI18n();

const props = defineProps({
  filtersBody: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["changeURL"]);

function onClickChangeShowBy(event) {
  emit("changeURL", {
    ...props.filtersBody,
    show_by: event.target.value,
  });
}

const options = [10, 20, 30, 40, 50, 60];
</script>

<template>
  <div class="flex items-center gap-2">
    <p class="">
      {{ $t("general.pagination.showBy") }}
    </p>
    <select
        class="p-2 border rounded-lg"
        @change="onClickChangeShowBy($event)"
    >
      <option
          v-for="option in options"
          :key="option"
          :selected="filtersBody.show_by === option"
          :value="option"
      >
        {{ option }}
      </option>
    </select>
  </div>
</template>