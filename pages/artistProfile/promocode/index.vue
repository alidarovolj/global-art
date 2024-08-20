<script setup>
import {TrashIcon} from "@heroicons/vue/24/outline";
import {usePromocodeStore} from "~/store/promocode.js";
import {formatDate} from "~/utils/formatDate.js";
import {useModalsStore} from "~/store/modals.js";

const {t} = useI18n();

const promocode = usePromocodeStore();
const {promocodeList, promocodeCreate, promocodeRemove} =
    storeToRefs(promocode);
const {getPromocodeList} = promocode;

const modals = useModalsStore()

const form = ref({
  page_number: 1,
  show_by: 10,
  promo_code_app_user_id: null,
});

onMounted(async () => {
  await nextTick();
  getPromocodeList(form.value);
});

const deletePromocode = async (id) => {
  promocode.removePromocode(id);
  if (promocode.promocodeRemove.success) {
    promocode.getPromocodeList(form.value);
  }
};

useHead({
  title: t("headers.artist_profile.pages.promocodes.title"),
  meta: [
    {
      property: "description",
      content: t("headers.artist_profile.pages.promocodes.description"),
    },
    {
      property: "og:description",
      content: t("headers.artist_profile.pages.promocodes.description"),
    },
    {
      property: "og:title",
      content: t("headers.artist_profile.pages.promocodes.title"),
    },
    {
      property: "og:url",
      content: t("headers.artist_profile.pages.promocodes.og_url"),
    },
  ],
  link: [
    {
      rel: "canonical",
      href: t("headers.artist_profile.pages.promocodes.canonical"),
    },
  ],
});
</script>

<template>
  <div class="container mx-auto ">
    <div class="flex items-center justify-between mb-10 ">
      <h1 class="text-3xl md:text-5xl  font-bold">
        {{ $t("artistProfile.tabs.promocode") }}
      </h1>
      <div
          class="bg-black text-white py-3 px-6 rounded-lg font-bold cursor-pointer"
          @click="modals.showModal('CreatePromocode')"
      >
        + {{ $t("artistProfile.promocode.promocodeAdd") }}
      </div>
    </div>
    <div v-if="promocodeList">
      <table
          v-if="promocode.promocodeList.data.objects_list.length > 0"
          class="table table-xs md:table-sm"
      >
        <thead class="font-bold text-sm uppercase">
        <tr class="border-t  ">
          <th class="border-r ">
            {{ $t("artistProfile.artworks.info.id") }}
          </th>
          <th class="border-r ">
            {{ $t("artistProfile.tabs.promocode") }}
          </th>
          <th class="border-r ">
            {{ $t("artistRegistration.modals.exhibitions.startDate") }}
          </th>
          <th class="border-r ">
            {{ $t("artistRegistration.modals.exhibitions.endData") }}
          </th>
          <th class="border-r ">
            {{ $t("artistProfile.promocode.discountAmount") }}
          </th>
          <th class="border-r ">
            {{ $t("artistProfile.artworks.info.actions") }}
          </th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="(item, index) in promocode.promocodeList.data.objects_list"
            :key="index"
            class="border-t "
        >
          <td class="border-r ">
            {{ item.id }}
          </td>
          <td class="border-r ">
            {{ item.promo_code_text }}
          </td>
          <td class="border-r ">
            {{ formatDate(item.start_date) }}
          </td>
          <td class="border-r ">
            {{ formatDate(item.end_date) }}
          </td>
          <td class="border-r ">
            {{ item.discount_amount }}
            {{ item.is_discount_by_percent ? "%" : "$" }}
          </td>
          <td class="border-r ">
            <button
                class="text-primaryText underline"
                @click="deletePromocode(item.id)"
            >
              <TrashIcon class="w-5 h-5"/>
            </button>
          </td>
        </tr>
        </tbody>
      </table>
      <NoElements
          v-else
          :text="$t('artistProfile.promocode.promocodeNoText')"
          :title="$t('artistProfile.promocode.promocodeNo')"
      />
    </div>
    <div v-else class="border rounded-lg p-2">
      <div
          v-for="(_, index) of 10"
          :key="index">
        <div class="flex justify-between mb-3 border p-2 rounded-lg gap-3">
          <div
              :class="{ 'bg-[#989898]' : index === 0 }"
              class="skeleton w-10 h-4"
          ></div>
          <div
              :class="{ 'bg-[#989898]' : index === 0 }"
              class="skeleton w-20 h-4"></div>
          <div
              :class="{ 'bg-[#989898]' : index === 0 }"
              class="skeleton w-32 h-4"></div>
          <div
              :class="{ 'bg-[#989898]' : index === 0 }"
              class="skeleton w-1/2 h-4"></div>
          <div
              :class="{ 'bg-[#989898]' : index === 0 }"
              class="skeleton w-1/2 h-4"></div>
          <div
              :class="{ 'bg-[#989898]' : index === 0 }"
              class="skeleton w-20 h-4"></div>
        </div>
      </div>
    </div>
  </div>
</template>
