<script setup>
import {PencilIcon, PlusIcon, TrashIcon} from "@heroicons/vue/24/outline";
import {useDeliveryAddressStore} from "~/store/deliveryAddress.js";
import {useModalsStore} from "~/store/modals.js";

const {t} = useI18n();

const deliveryAddress = useDeliveryAddressStore();
const modals = useModalsStore()

const pending = ref(true);

const editAddress = async (modalDataSet) => {
  modals.showModal("EditAddress", modalDataSet);
}

const deleteAddress = async (id) => {
  try {
    await deliveryAddress.deleteDeliveryAddress(id);
    await deliveryAddress.getDeliveryAddress();
  } catch (error) {
    console.error(error);
  }
};

onMounted(async () => {
  await nextTick();
  await deliveryAddress.getDeliveryAddress();
  pending.value = false;
});

useHead({
  title: t("headers.profile.pages.address_book.title"),
  meta: [
    {
      property: "description",
      content: t("headers.profile.pages.address_book.description"),
    },
    {
      property: "og:description",
      content: t("headers.profile.pages.address_book.description"),
    },
    {
      property: "og:title",
      content: t("headers.profile.pages.address_book.title"),
    },
    {
      property: "og:url",
      content: t("headers.profile.pages.address_book.og_url"),
    },
  ],
  link: [
    {
      rel: "canonical",
      href: t("headers.profile.pages.address_book.canonical"),
    },
  ],
});
</script>

<template>
  <div>
    <div class="w-full">
      <div
          class="flex md:flex-row flex-col gap-4 items-start justify-between mb-10"
      >
        <p class="text-xl md:text-3xl font-bold ">
          {{ $t("profile.address.savedAddresses") }}
        </p>
        <div
            v-if="!pending"
            class="cursor-pointer border rounded-full py-2 hover:bg-black hover:text-white px-3 md:px-6  flex items-center justify-center w-max gap-2"
            @click="modals.showModal('CreateAddress')"
        >
          <PlusIcon class="w-5 h-5"/>
          <p>{{ $t("profile.address.addNew") }}</p>
        </div>
      </div>
      <div class="flex flex-col gap-10">
        <div>
          <div class="w-full">
            <div v-if="!pending" class="flex flex-wrap gap-4">
              <div
                  v-if="deliveryAddress.result.data.length > 0"
                  class="grid grid-cols-1 md:grid-cols-3 gap-y-4 sm:gap-x-5 sm:gap-y-5"
              >
                <div
                    v-for="result in deliveryAddress.result.data"
                    class="flex flex-col gap-2 w-full border p-6 bg-cardBg   rounded-lg"
                >
                  <div class="flex justify-between">
                    <p class="text-base font-bold">
                      {{ result.delivery_address_person }}
                    </p>
                    <p
                        v-if="result.is_default"
                        class="py-1 px-2 text-sm text-statusDelivered bg-statusDeliveredBg rounded-full"
                    >
                      {{ $t("profile.address.default") }}
                    </p>
                  </div>
                  <div class="flex gap-2">
                    <span class="text-[#757575]"
                    >{{ $t("profile.address.title") }}:</span
                    >
                    <span>{{ result.delivery_address_full_address }}</span>
                  </div>
                  <div class="flex gap-2">
                    <span class="text-[#757575]"
                    >{{ $t("profile.address.city") }}:</span
                    >
                    <span>{{ result.delivery_address_city }}</span>
                  </div>
                  <div class="flex gap-2">
                    <span class="text-[#757575]"
                    >{{ $t("profile.address.state") }}:</span
                    >
                    <span>{{ result.delivery_address_state }}</span>
                  </div>
                  <div class="flex gap-2">
                    <span class="text-[#757575]"
                    >{{ $t("profile.address.country") }}:</span
                    >
                    <span>{{ result.delivery_address_country }}</span>
                  </div>
                  <div class="flex gap-2">
                    <span class="text-[#757575]"
                    >{{ $t("profile.address.zip") }}:</span
                    >
                    <span>{{ result.delivery_address_zip_code }}</span>
                  </div>
                  <div class="flex gap-2">
                    <span class="text-[#757575]"
                    >{{ $t("profile.address.phone") }}:</span
                    >
                    <span>{{ result.delivery_address_phone }}</span>
                  </div>
                  <div class="flex gap-3">
                    <button
                        class="flex items-center gap-2 border px-3 py-2 rounded-full  "
                        @click="() => deleteAddress(result.id)"
                    >
                      <TrashIcon class="w-5 h-5"/>
                      {{ $t("profile.address.remove") }}
                    </button>
                    <button
                        class="flex items-center gap-2 border px-3 py-2 rounded-full  "
                        @click="editAddress(result)"
                    >
                      <PencilIcon class="w-5 h-5"/>
                      {{ $t("profile.address.edit") }}
                    </button>
                  </div>
                </div>
              </div>
              <div v-else>
                <NoElements
                    :text="$t('profile.address.noAddressesText')"
                    :title="$t('profile.address.noAddresses')"
                />
              </div>
            </div>
            <div v-else class="flex gap-4 mt-10">
              <div class="skeleton w-96 h-80"/>
              <div class="skeleton w-96 h-80"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
