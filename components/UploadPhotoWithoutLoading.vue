<script setup>
import {defineEmits} from "vue";

const emit = defineEmits(["receivePhoto"]);

const form = ref({
  encodedBase64: "",
  photo_base64: "",
});

const props = defineProps({
  preview: {
    type: Boolean,
    default: true,
  },
});

const encodeBase64 = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      let base64String = e.target.result;
      form.value.encodedBase64 = base64String;
      base64String = base64String.replace(
          /^data:image\/(png|jpg|jpeg);base64,/,
          "",
      );
      form.value.photo_base64 = base64String;
      emit("receivePhoto", form.value);
    };
    reader.readAsDataURL(file);
  }
};
</script>

<template>
  <form :class="{ 'mb-3': form.encodedBase64 }">
    <input
        accept="image/jpeg, image/png, image/jpg"
        class="file-input file-input-bordered file-input-xs w-full"
        type="file"
        @change="encodeBase64"
    />
  </form>
  <img
      v-if="form.encodedBase64 && props.preview"
      :src="form.encodedBase64"
      alt=""
      class="w-full h-[400px] object-contain"
  />
</template>
