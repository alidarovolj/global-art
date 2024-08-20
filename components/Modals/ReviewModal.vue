<script setup>
import {StarIcon} from "@heroicons/vue/24/outline";
import {getTranslate} from "~/utils/getTranslate.js";
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import {useModalsStore} from "~/store/modals.js";

const reviews = useReviewsStore();

const loading = ref(false);
const modals = useModalsStore()

const languages = useLanguagesStore();
const {cur_lang} = storeToRefs(languages);

const loadingStore = useLoadingStore();

const translatedBaseData = computed(() =>
    getTranslate(modals.modal.modalData.translations, cur_lang.value),
);

const hoverIndex = ref(0);

const runtimeConfig = useRuntimeConfig();

const toasts = useToastsStore()

const mouseHover = () => {
  if (dataSet.value.art_item_review_rate === null) {
    hoverIndex.value = 0;
  } else {
    hoverIndex.value = dataSet.art_item_review_rate - 1;
  }
};

const dataSet = ref({
  art_item_review_art_item_id: null,
  art_item_review_rate: null,
  art_item_review_content: "",
  art_item_review_images: [],
  language: cur_lang.value,
});

const v$ = useVuelidate(
    {
      art_item_review_art_item_id: {required},
      art_item_review_rate: {required},
      art_item_review_content: {required},
    },
    dataSet,
);

const uploadedPhotos = ref([]);

const sendForm = async () => {
  await loadingStore.setLoading(true, t("preloader.pleaseWait"));
  await v$.value.$validate();

  if (v$.value.$error) {
    return;
  }

  await api(`/api/art/art-item-review/create-art-item-review/`, {
    body: JSON.stringify(dataSet.value),
  })
      .then(async (response) => {
        const data = response.data;
        if (data.success) {
          await reviews.getReviews();
          await reviews.myReviews();
          modals.modal.show = false;
          toasts.showToast("success", "Review successfully added", "Thank you for your feedback!");
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
  loadingStore.setLoading(false, null);
};

const receivePhoto = (data) => {
  dataSet.value.art_item_review_images.push(data.temp_media_token);
  uploadedPhotos.value.push(data.base64);
};

watch(
    () => modals.modal.modalData,
    (newValue) => {
      if (newValue) {
        dataSet.value.art_item_review_art_item_id = newValue.id;
      }
    },
);

onMounted(async () => {
  await nextTick();
  await reviews.getReviews();
});
</script>
<template>
  <div>
    <div class="flex justify-between border-b  pb-4">
      <p class="font-bold">
        {{ $t("profile.review.title") }}
      </p>
    </div>
    <div v-if="modals.modal.modalData" class="flex items-start gap-4 py-6">
      <div class="w-full md:w-1/2">
        <div class="w-full h-auto object-contain p-4 bg-[#F7F7F7]">
          <img
              :src="
                  runtimeConfig.public.ENDPOINTS_LINK +
                  modals.modal.modalData.art_item_images[0].full
                "
              alt=""
          />
        </div>
      </div>
      <div class="w-full md:w-1/2">
        <p class="text-2xl font-semibold text-start mb-2">
          {{ translatedBaseData.art_item_title }}
        </p>
        <div class="mb-3">
          <p
              v-for="(item, index) of modals.modal.modalData.art_item_styles"
              :key="index"
              class="text-[#757575] text-sm"
          >
            {{ item.translations[cur_lang].title }}
          </p>
        </div>
        <p class="mb-8">
          {{
            modals.modal.modalData.art_item_artist.artist_base_info.translations[
                cur_lang
                ].last_name
          }}
          {{
            modals.modal.modalData.art_item_artist.artist_base_info.translations[
                cur_lang
                ].first_name
          }}
        </p>
        <div class="mb-4">
          <div class="flex gap-3">
            <div
                v-for="index in 5"
                :key="index"
                class="cursor-pointer"
                @click="
                    dataSet.art_item_review_rate = index;
                    hoverIndex = dataSet.art_item_review_rate;
                  "
                @mouseleave="mouseHover"
                @mouseover="hoverIndex = index"
            >

              <StarIcon
                  v-if="
                      index <=
                      (hoverIndex >= 0
                        ? hoverIndex
                        : dataSet.art_item_review_rate)
                    "
                  class="text-yellow-500 w-5 h-5"
              />
              <StarIcon v-else class="text-[#757575] w-5 h-5"/>
            </div>
          </div>
          <span
              v-if="
                  v$.art_item_review_rate.$error &&
                  v$.art_item_review_rate.$dirty
                "
              class="text-red-500 text-xs"
          >
                {{ $t("aboutAI.value") }}</span
          >
        </div>
        <div class="mb-4">
          <textarea
              id="comment"
              v-model="dataSet.art_item_review_content"
              :class="{
                  'border-red-500':
                    v$.art_item_review_content.$error &&
                    v$.art_item_review_content.$dirty,
                }"
              :placeholder="$t('profile.review.writeReview')"
              class="block w-full rounded-md border-0 py-1.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              name="comment"
              rows="4"
          />

          <span
              v-if="
                  v$.art_item_review_content.$error &&
                  v$.art_item_review_content.$dirty
                "
              class="text-red-500 text-xs"
          >
                {{ $t("aboutAI.value") }}</span
          >
        </div>
        <UploadPhoto
            :button_type="true"
            :only_percent="true"
            :preview="true"
            @receive-photo="receivePhoto"
        />
        <div class="overflow-x-auto mt-3">
          <div class="flex gap-3">
            <div
                v-for="(photo, ind) of uploadedPhotos"
                :key="ind"
                class="bg-[#F7F7F7] p-4"
            >
              <img :src="photo" alt="" class="h-16 w-auto object-contain"/>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="w-full flex justify-between gap-3 mt-5">
      <form class="w-full" method="dialog">
        <button
            class="w-full bg-gray-200 py-2 rounded-xl"
            @click="modals.modal.show = false">
          {{ $t("artistRegistration.buttons.cancel") }}
        </button>
      </form>
      <div class="w-full">
        <p
            v-if="loading === false"
            class="cursor-pointer w-full bg-black text-white text-center py-2 rounded-xl"
            @click="sendForm"
        >
          {{ $t("profile.review.submit") }}
        </p>
        <div
            v-else
            class="cursor-pointer w-full bg-black text-white text-center py-2 rounded-xl"
        >
          <div class="spinner"/>
        </div>
      </div>
    </div>
  </div>
</template>
