<script setup>
const artistArtworksStore = useArtistArtworksStore();
const {getArtistArtworks} = artistArtworksStore;
const {artistArtworks} = storeToRefs(artistArtworksStore);

const user = useUserStore()
const localePath = useLocalePath()

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

onMounted(async () => {
  await nextTick();
  requestBody.value.artist_ids = [props.artistData.id];
  await getArtistArtworks(requestBody.value);
});

const props = defineProps({
  artistData: {
    type: [Object],
    required: true,
  },
});
</script>

<template>
  <div>
    <h2 class="font-semibold text-2xl mb-4 ">
      {{ $t("artistProfile.dashboard.yourArtworks") }}
    </h2>
    <div class="flex flex-col md:flex-row gap-4">
      <div
          class="flex justify-center p-6 border rounded-2xl md:w-half"
      >
        <div>
          <div class="text-center mb-4">
            <p
                v-if="artistArtworks"
                class="font-semibold text-3xl">
              {{ artistArtworks.data.all_items_count }}
            </p>
            <div v-else class="skeleton h-6 w-full"></div>
            <p>{{ $t("artistProfile.dashboard.artworksInStock") }}</p>
          </div>
          <Base-button
              :to="localePath('/artistProfile/artworks')"
              class="py-3 px-6 w-max"
              variant="outlined"
          >
            {{ $t("artistProfile.dashboard.buttons.goToArtworks") }}
          </Base-button>
        </div>
      </div>
      <div
          class="flex justify-center items-center p-6 border rounded-2xl md:w-half"
      >
        <div>
          <div class="text-center mb-4">
            <p v-if="user.result" class="font-semibold text-3xl">
              {{ user.result.data.sold_art_items_count }}
            </p>
            <div v-else class="skeleton h-6 w-full"></div>
            <p>{{ $t("artistProfile.dashboard.artworksSold") }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
