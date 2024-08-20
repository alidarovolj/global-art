<script setup>
import {useFavouritesStore} from "~/store/favourites.js";

const favourites = useFavouritesStore();
const {t} = useI18n();

onMounted(async () => {
  await nextTick();
  await favourites.getFavourites();
});

useHead({
  title: t("headers.profile.pages.saved_artworks.title"),
  meta: [
    {
      property: "description",
      content: t("headers.profile.pages.saved_artworks.description"),
    },
    {
      property: "og:description",
      content: t("headers.profile.pages.saved_artworks.description"),
    },
    {
      property: "og:title",
      content: t("headers.profile.pages.saved_artworks.title"),
    },
    {
      property: "og:url",
      content: t("headers.profile.pages.saved_artworks.og_url"),
    },
  ],
  link: [
    {
      rel: "canonical",
      href: t("headers.profile.pages.saved_artworks.canonical"),
    },
  ],
});
</script>

<template>
  <div>
    <div class="container mx-auto px-4 md:px-0">
      <h1 class="text-3xl font-bold  ">
        {{ $t("profile.savedArtworks.title") }}
      </h1>
      <div v-if="favourites.resultList">
        <div v-if="favourites.resultList.data.length <= 0" class="mt-10">
          <NoElements
              :text="$t('profile.savedArtworks.noItemsText')"
              :title="$t('profile.savedArtworks.noItems')"
          />
        </div>
        <div v-else>
          <div
              v-if="favourites.resultList.data"
              class="grid grid-cols-1 md:grid-cols-3 gap-y-4 sm:gap-x-5 sm:gap-y-5"
          >
            <div
                v-for="(item, index) in favourites.resultList.data"
                :key="index"
                class="mt-6 w-full"
            >
              <Painting
                  :id="item.id"
                  :artist="item.art_item_artist"
                  :artwork_data="item"
                  :images="item.art_item_images"
                  :is_in_wish_list="true"
                  :price="item.art_item_price"
                  :title="item.art_item_title"
              />
            </div>
          </div>
        </div>
      </div>
      <div v-else class="flex flex-wrap justify-between mt-10">
        <div
            v-for="(item, index) of 16"
            :key="index"
            class="skeleton h-[420px] max-h-[420px] w-full md:w-fourth mb-5"
        />
      </div>
    </div>
  </div>
</template>
