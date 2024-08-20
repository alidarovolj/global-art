<script setup>
import {TrashIcon} from "@heroicons/vue/24/outline";
import {useArtistRegistrationStore} from "~/store/artistRegistration.js";
import {useModalsStore} from "~/store/modals.js";

const loading = ref(false);

const emit = defineEmits(["addExhibitionData"]);

const artistRegistrationStore = useArtistRegistrationStore();
const {form} = storeToRefs(artistRegistrationStore);
const modals = useModalsStore()

const currentItem = ref(null);

const addAnotherExhibition = () => {
  form.value.artist_exhibition.push({
    title: null,
    images: [],
  });
};
const removeExhibition = (index) => {
  form.value.artist_exhibition.splice(index, 1);
};

const addExhibitionData = () => {
  emit("addExhibitionData", true);
  modals.modal.show = false;
};

const handleReceivePhoto = (photo, index) => {
  currentItem.value = index;
  setPhoto(photo, index);
};

const setPhoto = (photo, index) => {
  form.value.artist_exhibition[index].images.push(photo.temp_media_token);
};

const isExhibitionFormFilled = computed(() => {
  return form.value.artist_exhibition.every((item) => {
    return !!item.title;
  });
});
</script>

<template>
  <div>
    <h2 class="text-center font-semibold border-grey border-b pb-4 mb-4">
      {{ $t("artistRegistration.modals.exhibitions.title") }}
    </h2>
    <div class="border-b  pb-24">
      <div
          v-for="(item, index) of form.artist_exhibition"
          :key="index"
          class="flex items-center gap-2 flex-row-reverse"
      >
        <div class="flex justify-between">
          <TrashIcon
              v-if="form.artist_exhibition.length > 1"
              class="cursor-pointer w-6 h-6"
              @click="removeExhibition(index)"
          />
        </div>
        <div class="flex flex-col mb-6 w-full">
          <label
              class="text-sm text-primaryText mb-1 "
              for="exhibition_name"
          >{{ $t("artistRegistration.modals.exhibitions.name") }}</label
          >
          <textarea
              id="exhibition_name"
              v-model="item.title"
              :placeholder="$t('artistRegistration.modals.exhibitions.name')"
              class="py-[14px] px-4 border border-bColor rounded-lg  "
              type="text"
          />
        </div>
      </div>
      <button
          class="underline text-primaryText "
          @click="addAnotherExhibition"
      >
        {{ $t("artistRegistration.modals.exhibitions.addAnother") }}
      </button>
    </div>
    <div class="mt-5">
      <div class="w-full flex justify-between gap-3">
        <form class="w-full" method="dialog">
          <button
              class="w-full bg-gray-200 py-2 rounded-xl"
              @click="modals.modal.show = false">
            {{ $t("artistRegistration.buttons.cancel") }}
          </button>
        </form>
        <div class="w-full">
          <button
              v-if="loading === false"
              :class="{
              'text-white font-bold bg-black cursor-pointer':
                isExhibitionFormFilled,
            }"
              :disabled="!isExhibitionFormFilled"
              class="cursor-pointer w-full bg-black text-white text-center py-2 rounded-xl"
              @click="addExhibitionData"
          >
            {{ $t("artistRegistration.buttons.save") }}
          </button>
          <div
              v-else
              class="cursor-pointer w-full bg-black text-white text-center py-2 rounded-xl"
          >
            <div class="spinner"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
