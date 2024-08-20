<script setup>
import {useFavouritesStore} from "~/store/favourites.js";

const favourites = useFavouritesStore();
const {t} = useI18n();

onMounted(async () => {
  await nextTick();
  await favourites.getFavourites();
});

useHead({
  title: t("headers.wishlist.title"),
  meta: [
    {
      property: "description",
      content: t("headers.wishlist.description"),
    },
    {
      property: "og:description",
      content: t("headers.wishlist.description"),
    },
    {
      property: "og:title",
      content: t("headers.wishlist.title"),
    },
    {
      property: "og:url",
      content: t("headers.wishlist.og_url"),
    },
  ],
  link: [{rel: "canonical", href: t("headers.wishlist.canonical")}],
});
</script>

<template>
  <div class="container mx-auto px-4 md:px-0">
    <h1 class="text-3xl font-bold  ">
      {{ $t("wishList.title") }}
    </h1>
    <div v-if="favourites.resultList">
      <div v-if="favourites.resultList.data.length <= 0" class="mt-10">
        <NoElements
            :text="$t('wishList.noItemsText')"
            :title="$t('wishList.noItemsTitle')"
        />
      </div>
      <div v-else>
        <div
            v-if="favourites.resultList.data"
            class="block md:flex gap-3 flex-wrap mx-auto"
        >
          <div
              v-for="(item, index) in favourites.resultList.data"
              :key="index"
              class="mt-6 w-full md:w-fourth"
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
</template>
