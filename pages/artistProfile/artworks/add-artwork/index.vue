<script setup>
import {useArtistArtworksStore} from "~/store/artistArtworks.js";
import {storeToRefs} from "pinia";
import {useLanguagesStore} from "~/store/languages.js";
import {useLoadingStore} from "~/store/loading.js";
import {useVuelidate} from "@vuelidate/core";
import {minLength, required} from "@vuelidate/validators";

const toasts = useToastsStore()

const router = useRouter();
const {t} = useI18n();

const language = useLanguagesStore();
const localePath = useLocalePath()

const loadingStore = useLoadingStore();

const artistArtworksStore = useArtistArtworksStore();
const {form} = storeToRefs(artistArtworksStore);
const {getArtistArtworks} = artistArtworksStore;
const artistProfileStore = useArtistProfileStore();
const {getArtistData} = artistProfileStore;

const v$ = useVuelidate({
      art_item_artist_id: {required},
      art_item_category_id: {required},
      art_item_title: {required},
      art_item_description: {required},
      art_item_base_price: {required},
      art_item_materials: {
        required,
        minLength: minLength(1),
        $each: {
          required
        }
      },
      art_item_styles: {
        required,
        minLength: minLength(1),
        $each: {
          required
        }
      },
      art_item_images: {
        required,
        minLength: minLength(1),
        $each: {
          required
        }
      },
      art_item_subjects: {
        required,
        minLength: minLength(1),
        $each: {
          required
        }
      },
      art_item_params: {
        size: {
          length: {required},
          width: {required},
          height: {required},
          weight: {required},
        },
        year: {required},
        location: {required},
        rarity_id: {required},
        signature_id: {required},
        auth_cert_id: {required},
        frame: {required},
        rights: {required},
      },
    },
    form,
);

const requestBody = ref({
  page_number: 1,
  show_by: 10,
  only_ids: [],
  exclude_ids: [],
  search_text: null,
  movement_and_style: [],
  year_from: null,
  year_to: null,
  price_from: null,
  price_to: null,
  artist_ids: [],
  art_item_is_for_sale: null,
  art_item_is_sold: null,
  art_item_is_validated: null,
  rarity: [],
  art_item_material: [],
  art_item_style: [],
});

const user = useUserStore();
const {result} = storeToRefs(user);

const registration_finished = ref(false);

async function sendForm() {
  await v$.value.$validate();

  if (v$.value.$error) {
    return;
  }

  loadingStore.setLoading(true, t("preloader.pleaseWait"));

  if (artistArtworksStore.dimensionType === "inch") {
    form.value.art_item_params.size.width =
        form.value.art_item_params.size.width * 2.54;
    form.value.art_item_params.size.height =
        form.value.art_item_params.size.height * 2.54;
    form.value.art_item_params.size.length =
        form.value.art_item_params.size.length * 2.54;
  }

  await api(`/api/art/art-item/create-art-item/`, {
    body: JSON.stringify(form.value),
  })
      .then(async (response) => {
        const data = response.data;
        if (data.success) {
          await user.getProfile();
          await getArtistArtworks(requestBody.value);
          registration_finished.value = true;
          router.push(localePath('/artistProfile/artworks'))
        } else {
          toasts.showToast("error", "An error has occurred!", data.msg_txt);
        }
      })
      .catch((e) => {
        if (e.response.data.success === false) {
          toasts.showToast("error", "An error has occurred!", e.response.data.msg_txt);
        } else {
          toasts.showToast("error", "An error has occurred!", "Server Error! Please try again later.");
        }
      });
  loadingStore.setLoading(false, null);
}

onMounted(async () => {
  await nextTick();
  await user.getProfile();
  await getArtistData();
  if (user.result) {
    requestBody.value.artist_ids = [artistProfileStore.result.data.id];
  }
  form.value.art_item_artist_id = result.value.data.id;
  form.value.language = language.cur_lang;
});
</script>

<template>
  <div class="h-screen flex flex-col justify-between">
    <section class="container mx-auto py-5 pr-2 mb-20">
      <div>
        <CreateArtworkBlock :vuelidate="v$"/>
      </div>
    </section>
    <div class="py-4 border-t ">
      <div class="container mx-auto px-4 md:px-0 flex justify-between">
        <button
            class="border py-4 px-6 text-primaryText rounded-[120px]  "
            @click="router.push(localePath('/artistProfile/artworks'))"
        >
          {{ $t("artistProfile.addArtwork.back") }}
        </button>
        <button
            class="border py-4 px-6 rounded-[120px]   text-white font-bold bg-black cursor-pointer"
            @click="sendForm"
        >
          {{ $t("artistRegistration.buttons.publish") }}
        </button>
      </div>
    </div>
  </div>
</template>
