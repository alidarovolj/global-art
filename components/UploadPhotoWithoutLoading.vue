<script setup>
import {defineEmits} from "vue";
import {CircleStencil, Cropper} from "vue-advanced-cropper"
import 'vue-advanced-cropper/dist/style.css'

const emit = defineEmits(["receivePhoto"]);

const cropper = ref()

const coords = ref({
  width: 0,
  height: 0,
  left: 0,
  top: 0,
})

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
    };
    reader.readAsDataURL(file);
  }
};

const onChange = ({canvas}) => {
  const croppedBase64String = canvas.toDataURL().replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
  form.value.photo_base64 = croppedBase64String;

  emit("receivePhoto", form.value);
}

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
  <Cropper
      v-if="form.encodedBase64 && props.preview"
      ref="cropper"
      @change="onChange"
      :src="form.encodedBase64"
      :stencil-component="CircleStencil"
      :stencil-props="{
		    aspectRatio: 6/9,
		    resizable: false
	    }"
  />
</template>
