<script setup>
import md5 from "js-md5";
import {useAuthStore} from "~/store/auth.js";
import {ArrowUpTrayIcon, PhotoIcon} from "@heroicons/vue/24/outline";
import {useToastsStore} from "~/store/toastDropStore.js";

const runtimeConfig = useRuntimeConfig();

const form = ref({
  photo_base64: "",
});

const temp_media_token = ref(null);
const hash = ref(null);
const isLoading = ref(false);
const isImage = ref(true);
const uploadProgress = ref(0);
const uploadedPhoto = ref(null);
const emit = defineEmits(["receivePhoto"]);

const toasts = useToastsStore();

const auth = useAuthStore();
auth.initCookieToken();
const {token} = storeToRefs(auth);

const currentStatus = ref(null);

const props = defineProps({
  button_type: {
    type: [String, Boolean],
    default: null,
  },
  only_icon: {
    type: [String, Boolean],
    default: null,
  },
  only_percent: {
    type: [String, Boolean],
    default: null,
  },
  button_review: {
    type: String,
    default: null,
  },
  preview: {
    type: [String, Boolean],
    default: null,
  },
});

async function requestTempMediaToken() {
  await api("/api/utils/temp-media/request-temp-media-token/", {
    body: JSON.stringify({
      temp_media_prefix: "data:image/jpeg;base64",
      temp_media_extension: "jpg",
      temp_media_md5: hash.value,
    }),
  })
      .then((response) => {
        const data = response.data;
        if (data.success) {
          temp_media_token.value = data.data.temp_media_token;
        } else {
          toasts.showToast("error", "An error has occurred!", data.msg_txt);
        }
      })
      .catch((e) => {
        if (e.response && e.response.data.success === false) {
          toasts.showToast("error", "An error has occurred!", e.response.data.msg_txt);
        } else {
          toasts.showToast("error", "An error has occurred!", "Server Error! Please try again later.");
        }
      });
}

async function uploadTempMedia(item) {
  await api("/api/utils/temp-media/upload-temp-media/", {
    body: JSON.stringify({
      temp_media_token: temp_media_token.value,
      temp_media_chunk: item,
    }),
  })
      .then((response) => {
        const data = response.data;
        if (data.success) {
          currentStatus.value = data.data;
        } else {
          toasts.showToast("error", "An error has occurred!", data.msg_txt);
        }
      })
      .catch((e) => {
        if (e.response && e.response.data.success === false) {
          toasts.showToast("error", "An error has occurred!", e.response.data.msg_txt);
        } else {
          toasts.showToast("error", "An error has occurred!", "Server Error! Please try again later.");
        }
      });
}

const encodeBase64 = (event) => {
  toasts.showToast("success", "Please wait while we upload your image...", "Your image is being uploaded. Please wait...");
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = async (e) => {
      isLoading.value = true;
      let base64String = e.target.result;
      uploadedPhoto.value = base64String;

      base64String = base64String.replace(
          /^data:image\/(png|jpg|jpeg);base64,/,
          "",
      );

      hash.value = md5(base64String);

      const chunkLength = 50 * 1024;
      const base64Chunks = base64String.match(
          new RegExp(".{1," + chunkLength + "}", "g"),
      );

      form.value.photo_base64 = base64Chunks;
      await requestTempMediaToken();
      const photo = {
        temp_media_token: temp_media_token.value,
        base64: e.target.result,
      };

      const uploadedParts = [];

      for (let index = 0; index < form.value.photo_base64.length; index++) {
        try {
          await uploadTempMedia(form.value.photo_base64[index]);
          uploadedParts.push(base64Chunks[index]);
          uploadProgress.value =
              (uploadedParts.length / base64Chunks.length) * 100;
          if (currentStatus.value.temp_media_fully_uploaded) {
            form.value.photo_base64.slice(index, 1);
            break;
          }
        } catch (error) {
          console.error(`Failed to upload part ${index}: ${error}`);
        }
      }

      toasts.showToast("success", "Image uploaded successfully", "Your image has been uploaded successfully. You can now proceed.");
      emit("receivePhoto", photo);
      isLoading.value = false;
    };
    reader.readAsDataURL(file);
  }
  isImage.value = false;
  isLoading.value = false;
};
</script>

<template>
  <div v-if="token">
    <form action="">
      <div v-if="button_type" class="w-max">
        <input
            id="image"
            :disabled="isLoading"
            accept="image/jpeg, image/png, image/jpg"
            class="hidden  "
            name="image"
            type="file"
            @change="encodeBase64"
        />
        <label
            class="cursor-pointer bg-white hover:bg-[#E8E8E8] hover:text-black active:bg-white transition-all text-primaryText flex items-center justify-center gap-2 py-2 px-10 border rounded-3xl"
            for="image"
        >
          <ArrowUpTrayIcon class=" w-5 h-5" stroke-width="2"/>
          <span v-if="!only_icon" class="text-base ">{{
              $t("dragAndDrop.browseFile")
            }}</span>
        </label>
      </div>
      <div v-else-if="button_review">
        <input
            id="image"
            :disabled="isLoading"
            accept="image/jpeg, image/png, image/jpg"
            class="hidden "
            name="image"
            type="file"
            @change="encodeBase64"
        />
        <label
            class="cursor-pointer hover:bg-[#E8E8E8] hover:text-black active:bg-white transition-all text-primaryText flex items-center gap-2 py-3 px-6 border rounded-3xl"
            for="image"
        >
          <PhotoIcon class="w-5 h-5" stroke-width="2"/>
          <span class="text-base">{{ $t("dragAndDrop.uploadImage") }}</span>
        </label>
      </div>
      <input
          v-else
          :disabled="isLoading"
          accept="image/jpeg, image/png, image/jpg"
          class="file-input file-input-bordered file-input-xs w-full "
          type="file"
          @change="encodeBase64"
      />
    </form>
  </div>
  <div
      v-if="isLoading && uploadedPhoto && preview !== false"
      class="relative w-full h-full"
  >
    <img
        v-if="!only_percent"
        :src="uploadedPhoto"
        alt=""
        class="w-auto h-full object-contain mx-auto"
    />
    <div
        v-if="only_percent"
        :class="{ '!static mt-2': only_percent }"
        class="absolute left-0 top-0 flex items-center justify-center w-full h-full"
    >
      <div
          :class="{ '!bg-opacity-0': only_percent }"
          class="w-full h-full z-10 absolute left-0 top-0 bg-black bg-opacity-40"
      />
      <p
          :class="{ '!text-black': only_percent }"
          class="text-white z-20 absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2"
      >
        {{ uploadProgress.toFixed(2) }}%
      </p>
      <div
          :style="`--value:${uploadProgress.toFixed(2)};`"
          class="radial-progress"
          role="progressbar"
      >
      </div>
    </div>
    <div
        v-else
        class="absolute left-0 top-0 flex items-center justify-center w-full h-full"
    >
      <div
          class="w-full h-full z-10 absolute left-0 top-0 bg-black bg-opacity-40"
      />
      <p
          class="text-white z-20 absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2"
      >
        {{ uploadProgress.toFixed(2) }}%
      </p>
      <div
          :style="`--value:${uploadProgress.toFixed(2)};`"
          class="radial-progress"
          role="progressbar"
      >
        {{ uploadProgress.toFixed(2) }}%
      </div>
    </div>
  </div>
</template>
