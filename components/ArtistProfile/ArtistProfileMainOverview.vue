<script setup>
import {EllipsisHorizontalIcon, PencilSquareIcon} from "@heroicons/vue/24/outline"

`import {storeToRefs} from "pinia";`

const router = useRouter();
const runtimeConfig = useRuntimeConfig();

const pending = ref(true);

const user = useUserStore();
const {result} = storeToRefs(user);
const localePath = useLocalePath()

const artistArtworksStore = useArtistArtworksStore();
const {getArtistArtworks} = artistArtworksStore;
const {artistArtworks} = storeToRefs(artistArtworksStore);

const artistProfileStore = useArtistProfileStore();
const {getArtistData} = artistProfileStore;

const pickedArtwork = ref(null);

const addNewArt = () => {
  router.push(localePath("/artistProfile/artworks/add-artwork"));
};

const editArtwork = (id) => {
  router.push(localePath(`/artistProfile/artworks/edit-artwork/${id}`));
};
const {t} = useI18n();

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
  await user.getProfile();
  await getArtistData();
  if (user.result) {
    requestBody.value.artist_ids = [artistProfileStore.result.data.id];
  }
  await getArtistArtworks(requestBody.value);
  pending.value = false;
});
</script>

<template>
  <div class="">
    <div class="flex items-center justify-between mb-10 ">
      <h1 class="text-3xl font-bold">
        {{ $t("artistProfile.artworks.title") }}
      </h1>
      <div
          class="bg-black text-white py-3 px-6 rounded-lg font-bold cursor-pointer"
          @click="addNewArt"
      >
        + Add new art
      </div>
    </div>
    <div v-if="!pending" class="overflow-x-auto md:overflow-hidden">
      <table
          v-if="artistArtworks.data.objects_list.length > 0"
          class="table table-xs md:table-sm"
      >
        <thead class="font-bold text-sm uppercase">
        <tr class="border-t  ">
          <th class="border-r ">
            {{ $t("artistProfile.artworks.info.id") }}
          </th>
          <th class="border-r ">
            {{ $t("artistProfile.artworks.info.images") }}
          </th>
          <th class="border-r ">
            {{ $t("artistProfile.artworks.info.title") }}
          </th>
          <th class="border-r ">
            {{ $t("artistProfile.artworks.info.description") }}
          </th>
          <th class="border-r ">
            {{ $t("artistProfile.artworks.info.price") }}
          </th>
          <th class="border-r ">
            {{ $t("artistProfile.artworks.info.date") }}
          </th>
          <th class="border-r ">
            {{ $t("artistProfile.artworks.info.validateStatus") }}
          </th>
          <th class="border-r ">
            {{ $t("artistProfile.artworks.info.sale") }}
          </th>
          <th class="border-r ">
            {{ $t("artistProfile.artworks.info.sold") }}
          </th>
          <th class="border-r ">
            {{ $t("artistProfile.artworks.info.actions") }}
          </th>
        </tr>
        </thead>
        <tbody class="text-xs">
        <tr
            v-for="(artwork, index) of artistArtworks.data.objects_list"
            :key="index"
            :class="{ 'bg-[#F0F0F0] ': index % 2 === 1 }"
            class="cursor-pointer "
        >
          <td
              class="border-r "
              @click="router.push(localePath('/admin/artworks/' + artwork.id))"
          >
            {{ index + 1 }}
          </td>
          <td
              class="border-r "
              @click="router.push(localePath('/admin/artworks/' + artwork.id))"
          >
            <div class="flex gap-2">
              <div
                  v-for="(image, ind) of artwork.art_item_images"
                  :key="ind"
                  class="w-10 h-10 bg-gray-200 rounded-xl"
              >
                <img
                    :src="runtimeConfig.public.ENDPOINTS_LINK + image.thumb"
                    alt="Artwork image"
                    class="w-full h-full object-cover rounded-xl"
                />
              </div>
            </div>
          </td>
          <td
              class="border-r "
              @click="router.push(localePath('/admin/artworks/' + artwork.id))"
          >
            {{ artwork.art_item_title }}
          </td>
          <td
              class="border-r "
              @click="router.push(localePath('/admin/artworks/' + artwork.id))"
          >
            {{
              artwork.art_item_description.slice(0, 20)
            }}<span v-if="artwork.art_item_description.length > 20">...</span>
          </td>
          <td
              class="border-r "
              @click="router.push(localePath('/admin/artworks/' + artwork.id))"
          >
            {{ artwork.art_item_price }}
          </td>
          <td
              class="border-r "
              @click="router.push(localePath('/admin/artworks/' + artwork.id))"
          >
            {{ artwork.created_at }}
          </td>
          <td
              class="border-r "
              @click="router.push(localePath('/admin/artworks/' + artwork.id))"
          >
            <p
                v-if="artwork.art_item_is_validated"
                class="bg-[#D9FBD0] py-1 px-2 rounded-xl bg-opacity-60 text-[#1C6C09] w-max"
            >
              {{ $t("artistProfile.artworks.info.validateStatus") }}
            </p>
            <p
                v-else
                class="bg-red-500 py-1 px-2 rounded-xl bg-opacity-30 text-red-500 w-max"
            >
              {{ $t("artistProfile.artworks.info.notValidated") }}
            </p>
          </td>
          <td
              class="border-r "
              @click="router.push(localePath('/admin/artworks/' + artwork.id))"
          >
            <p
                v-if="artwork.art_item_is_for_sale"
                class="bg-[#D9FBD0] py-1 px-2 rounded-xl bg-opacity-60 text-[#1C6C09] w-max"
            >
              {{ $t("artistProfile.artworks.info.yes") }}
            </p>
            <p
                v-else
                class="bg-red-500 py-1 px-2 rounded-xl bg-opacity-30 text-red-500 w-max"
            >
              {{ $t("artistProfile.artworks.info.no") }}
            </p>
          </td>
          <td
              class="border-r "
              @click="router.push(localePath('/admin/artworks/' + artwork.id))"
          >
            <p
                v-if="artwork.art_item_is_sold"
                class="bg-[#D9FBD0] py-1 px-2 rounded-xl bg-opacity-60 text-[#1C6C09] w-max"
            >
              {{ $t("artistProfile.artworks.info.yes") }}
            </p>
            <p
                v-else
                class="bg-red-500 py-1 px-2 rounded-xl bg-opacity-30 text-red-500 w-max"
            >
              {{ $t("artistProfile.artworks.info.no") }}
            </p>
          </td>
          <td class="border-r ">
            <div class="dropdown ">
              <div
                  class="btn m-1"
                  role="button"
                  tabindex="0"
              >
                <EllipsisHorizontalIcon class="cursor-pointer w-7 h-7"/>
              </div>
              <div
                  class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-max"
                  tabindex="0"
              >
                <div class="flex gap-2">
                  <button
                      class="bg-buyerMenuBg px-1 py-1 rounded-lg block"
                      @click="editArtwork(artwork.id)"
                  >
                    <PencilSquareIcon class="w-5 h-5"/>
                  </button>
                </div>
              </div>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
      <NoElements
          v-else
          :text="$t('artistProfile.noElements.text')"
          :title="$t('artistProfile.noElements.title')"
      />
    </div>
    <div v-else>
      <div
          v-for="(_, index) of 10"
          :key="index"
          class="flex justify-between mb-5"
      >
        <div class="skeleton w-fifth h-4"/>
        <div class="skeleton w-fifth h-4"/>
        <div class="skeleton w-fifth h-4"/>
        <div class="skeleton w-fifth h-4"/>
        <div class="skeleton w-fifth h-4"/>
      </div>
    </div>
  </div>
</template>
