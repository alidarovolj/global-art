<script setup>
import {useArtistsStore} from "~/store/artists.js";

const route = useRoute();
const router = useRouter();
const {t} = useI18n();

const requestBody = ref({
  page_number: Number(route.query.currentPage) || 1,
  show_by: Number(route.query.show_by) || 20,
  artist_is_available: route.query.artist_is_available || null,
  artist_art_categories: route.query.artist_art_categories || [],
  artist_material: route.query.artist_material || [],
  artist_art_style: route.query.artist_art_style || [],
  artist_art_subjects: route.query.artist_art_subjects || [],
});

const artistsStore = useArtistsStore();

const updateURL = async (form) => {
  artistsStore.artistList = false
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

useHead({
  title: t("headers.artists.title"),
  meta: [
    {
      property: "description",
      content: t("headers.artists.description"),
    },
    {
      property: "og:description",
      content: t("headers.artists.description"),
    },
    {
      property: "og:title",
      content: t("headers.artists.title"),
    },
    {
      property: "og:url",
      content: t("headers.artists.og_url"),
    },
  ],
  link: [{rel: "canonical", href: t("headers.artists.canonical")}],
});
</script>

<template>
  <div class="container mx-auto px-4 md:px-0">
    <h1
        class="text-3xl md:text-5xl font-bold  "
    >
      {{ $t("artists.title") }}
    </h1>
    <div class="block md:flex items-center justify-between mt-8 mb-11">
      <ArtistsFilter
          :filters-body="requestBody"
          class="mb-2 md:mb-0"
          @change-u-r-l="updateURL"
      />
      <div class="ml-0 md:ml-4 flex flex-col gap-2 md:gap-4 md:flex-row">
        <ArtworksSearch
            :filters-body="requestBody"
            @change-u-r-l="updateURL"
        />
      </div>
    </div>
    <ArtistList :filters-body="requestBody"/>
    <div
        class="flex-col gap-5 md:flex-row flex items-center justify-between mx-auto mt-10"
    >
      <ShowBy
          :filters-body="requestBody"
          @change-u-r-l="updateURL"
      />
      <Pagination
          :filters-body="requestBody"
          :items-list="artistsStore.artistList"
          @change:page="updateURL"
      />
    </div>
  </div>
</template>
