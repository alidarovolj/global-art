<script setup>
import {useArtworksStore} from "~/store/artworks.js";

const {t} = useI18n();
const route = useRoute();
const router = useRouter();

const artworks = useArtworksStore()

const requestBody = ref({
  page_number: Number(route.query.currentPage) || 1,
  show_by: Number(route.query.show_by) || 20,
  only_ids: route.query.only_ids || [],
  exclude_ids: route.query.exclude_ids || [],
  category_ids: [],
  search_text: route.query.search_text || null,
  movement_and_style: route.query.movement_and_style || [],
  year_from: route.query.year_from || null,
  year_to: route.query.year_to || null,
  price_from: route.query.price_from || null,
  price_to: route.query.price_to || null,
  artist_ids: route.query.artist_ids || [],
  art_item_is_for_sale: route.query.art_item_is_for_sale || null,
  art_item_is_sold: route.query.art_item_is_sold || null,
  art_item_is_validated: route.query.art_item_is_validated || null,
  rarity: route.query.rarity || [],
  signature: route.query.signature || [],
  cert: route.query.cert || [],
  art_item_material: route.query.art_item_material || [],
  art_item_style: route.query.art_item_style || [],
  art_item_subject: route.query.art_item_subject || [],
});

const updateURL = async (form) => {
  artworks.artworksList = false
  requestBody.value = form;
};

watchEffect(() => {
  const newQuery = {};

  for (const key in requestBody.value) {
    const value = requestBody.value[key];

    if (Array.isArray(value)) {
      newQuery[key] = value;
    } else if (value !== null && value !== "") {
      newQuery[key] = value;
    }
  }

  router.push({query: newQuery});
});

onMounted(async () => {
  if (route.query.category_ids) {
    if (route.query.category_ids[0].length > 0) {
      requestBody.value.category_ids.push(route.query.category_ids);
    }
  }
});

useHead({
  title: t("headers.artworks.title"),
  meta: [
    {
      property: "description",
      content: t("headers.artworks.description"),
    },
    {
      property: "og:description",
      content: t("headers.artworks.description"),
    },
    {
      property: "og:title",
      content: t("headers.artworks.title"),
    },
    {
      property: "og:url",
      content: t("headers.artworks.og_url"),
    },
  ],
  link: [{rel: "canonical", href: t("headers.artworks.canonical")}],
});
</script>

<template>
  <div class="container mx-auto px-4 md:px-0">
    <ArtworksCategories
        :req-body="requestBody"
        @change-u-r-l="updateURL"
    />
    <div class="block md:flex justify-between gap-2 w-full">
      <ArtworksFilter
          :filters-body="requestBody"
          @change-u-r-l="updateURL"
      />
      <div class="ml-4 flex flex-col gap-4 md:flex-row">
        <ArtworksSearch
            :filters-body="requestBody"
            @change-u-r-l="updateURL"
        />
      </div>
    </div>
    <ArtworksList :filters-body="requestBody"/>
    <div class="flex-col gap-5 md:flex-row flex items-center justify-between mx-auto">
      <ShowBy
          :filters-body="requestBody"
          @change-u-r-l="updateURL"
      />
      <Pagination
          :filters-body="requestBody"
          :items-list="artworks.artworksList"
          @change:page="updateURL"
      />
    </div>
  </div>
</template>
