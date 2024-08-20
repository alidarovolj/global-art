<script setup>
import {useLanguagesStore} from "~/store/languages.js";
import {useArtistsStore} from "~/store/artists.js";

const artistProfileStore = useArtistProfileStore();
const {getArtistData} = artistProfileStore;
const loading = ref(false);

const modals = useModalsStore()
const users = useUserStore()
const languages = useLanguagesStore()
const {cur_lang} = storeToRefs(languages)
const artists = useArtistsStore()

const portfolio_photos = ref([]);

const form = ref({
  artist_id: null,
  artist_portfolios: [],
  language: cur_lang.value
});

onMounted(async () => {
  await nextTick();
  form.value.artist_id = modals.modal.modalData.id;
});

const pushPhoto = (photo) => {
  form.value.artist_portfolios.push({
    title: null,
    media_token: photo.temp_media_token,
  });
  portfolio_photos.value.push(photo.base64);
};

const submitForm = async () => {
  loading.value = true;

  try {
    await artists.addPortfolio(form.value);
    await getArtistData()
    loading.value = false;
    modals.modal.show = false
  } catch (error) {
    toasts.showToast("error", "An error has occurred!", error);
    loading.value = false;
  }
};
</script>

<template>
  <div>
    <h2 class="text-center font-semibold border-grey border-b pb-4 mb-4">
      {{ $t("artistRegistration.modals.portfolio.title") }}
    </h2>
    <div
        class="border-b  max-h-[650px] overflow-y-auto"
    >
      <div v-if="portfolio_photos.length > 0" class="mb-10">
        <p class="mb-3 font-normal">
          {{ $t("artistRegistration.modals.portfolio.works") }}:
        </p>
        <div class="overflow-auto">
          <div class="flex gap-3">
            <div
                v-for="(item, index) of portfolio_photos"
                :key="index"
                class="min-w-[200px] w-[200px] h-auto mb-3"
            >
              <img
                  :src="item"
                  alt=""
                  class="w-full h-[200px] object-cover mb-3"
              />
              <div class="w-full">
                <p class="text-xs mb-1">Title</p>
                <input
                    v-model="
                        form.artist_portfolios[index]
                          .title
                      "
                    :placeholder="
                        $t(
                          'artistRegistration.modals.portfolio.fillTitlePlaceholder',
                        )
                      "
                    class="py-2 px-4 border border-bColor rounded-lg   w-full"
                    type="text"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <p class="mb-3">
          {{ $t("artistRegistration.modals.portfolio.pleaseUpload") }}
        </p>
        <UploadPhoto @receive-photo="pushPhoto"/>
      </div>
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
          <p
              v-if="loading === false"
              class="cursor-pointer w-full bg-black text-white text-center py-2 rounded-xl"
              @click="submitForm"
          >
            {{ $t("artistRegistration.buttons.save") }}
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
  </div>
</template>
