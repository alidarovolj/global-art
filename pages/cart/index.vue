<script setup>
import {HeartIcon, PencilIcon, TrashIcon} from "@heroicons/vue/24/outline";
import {useAuthStore} from "~/store/auth.js";
import {useFavouritesStore} from "~/store/favourites.js";
import {useArtworksStore} from "~/store/artworks.js";
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import {useToastsStore} from "~/store/toastDropStore.js";
import {useModalsStore} from "~/store/modals.js";

const {t} = useI18n();
const modals = useModalsStore()

const runtimeConfig = useRuntimeConfig();
const localePath = useLocalePath();

const shippingStep = ref(false);

const cart = useCartStore();
const {result} = storeToRefs(cart);

const languages = useLanguagesStore();
const {cur_lang} = storeToRefs(languages);

const favourites = useFavouritesStore();
const artworks = useArtworksStore();
const user = useUserStore();

const auth = useAuthStore();
auth.initCookieToken();
const {token} = storeToRefs(auth);

const addresses = useDeliveryAddressStore();

const toasts = useToastsStore()

const loading = ref(false);
const pending = ref(true);

const form = ref({
  basket_item_art_item_id: null,
  basket_item_quantity: 0,
});

const formRef = ref({
  app_user_order_delivery_address_id: null,
  host_name: "https://globalart.ai",
  payment_system: null,
});

const requestCart = ref({
  delivery_address_id: null,
});

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

const removeLocal = async (id) => {
  form.value.basket_item_art_item_id = id
  await cart.addOrRemoveItem(form.value)
  if (cart.resultItem !== false) {
    await cart.getCart(requestCart.value)
    await user.getProfile()
  }
}

const sendForm = async () => {
  if (formRef.value.app_user_order_delivery_address_id !== null) {
    await cart.createCheckout(formRef.value);
    if (cart.resultCheckout !== false) {
      loading.value = false;
      window.location.href =
          cart.resultCheckout.data.app_user_order_session_url;
    } else {
      toasts.showToast("error", "An error has occurred!", "Please try again later");
      loading.value = false;
    }
  } else {
    toasts.showToast("error", "Please select an address", "Please select an address before proceeding to checkout");
  }
};

const addToFavouritesLocal = async (id) => {
  await favourites.addToFavourites(id);
  await artworks.getArtworks(requestBody.value);
  await favourites.getFavourites();
  await user.getProfile();
  await cart.getCart(requestCart.value);
};

watch(
    () => formRef.value.app_user_order_delivery_address_id,
    async (newId) => {
      requestCart.value.delivery_address_id = newId;
      await cart.getCart(requestCart.value);
    },
);

const editAddress = (address) => {
  modals.showModal("EditAddress", address)
};

const deliverySum = ref(0);
const totalToPay = ref(0);

const deliverySumComp = () => {
  totalToPay.value = 0;
  deliverySum.value = 0;
  if (result.value.data.length > 0) {
    result.value.data.forEach((el) => {
      if (el.basket_item_art_item.delivery_price) {
        deliverySum.value += el.basket_item_art_item.delivery_price;
        totalToPay.value = el.basket_item_art_item.delivery_price + el.basket_item_art_item.art_item_price;
      }
    })
    // totalToPay.value += result.value.totalPrice;
  }
}

const formData = ref({
  delivery_address_app_user_id: "",
  delivery_address_full_address: "",
  delivery_address_city: "",
  delivery_address_state: "",
  delivery_address_country: "",
  delivery_address_zip_code: "",
  delivery_address_phone: "",
  delivery_address_person: "",
  language: cur_lang.value,
});

// const getUpdatedAddress = (address) => {
//   formData.value.delivery_address_city = address.city;
//   formData.value.delivery_address_state = address.state;
//   formData.value.delivery_address_country = address.country;
//   formData.value.delivery_address_zip_code = address.postalCode;
//   formData.value.delivery_address_full_address = address.address;
// };

const v$ = useVuelidate(
    {
      delivery_address_app_user_id: {required},
      delivery_address_full_address: {required},
      delivery_address_city: {required},
      delivery_address_state: {required},
      delivery_address_country: {required},
      delivery_address_zip_code: {required},
      delivery_address_phone: {required},
      delivery_address_person: {required},
    },
    formData,
);

const submitForm = async () => {
  loading.value = true;
  await v$.value.$validate();

  if (v$.value.$error) {
    loading.value = false;
    toasts.showToast("error", "An error has occurred!", "Please fill out all fields");
    return;
  }

  try {
    await addresses.createDeliveryAddress(formData.value);
    await addresses.getDeliveryAddress();
    loading.value = false;
    newAddress.value = false;
    formData.value.delivery_address_full_address = null;
    formData.value.delivery_address_city = null;
    formData.value.delivery_address_state = null;
    formData.value.delivery_address_country = null;
    formData.value.delivery_address_zip_code = null;
    formData.value.delivery_address_phone = null;
    formData.value.delivery_address_person = null;
  } catch (error) {
    console.error(error);
    loading.value = false;
  }
};

const deleteAddress = async (id) => {
  try {
    await addresses.deleteDeliveryAddress(id);
    await addresses.getDeliveryAddress();
  } catch (error) {
    console.error(error);
  }
};

const newAddress = ref(false);

onMounted(async () => {
  await nextTick();
  await addresses.getDeliveryAddress();
  await user.getProfile();
  requestCart.value.delivery_address_id =
      user.result.data.default_delivery_address_id;
  formRef.value.app_user_order_delivery_address_id =
      user.result.data.default_delivery_address_id;
  await nextTick();
  await cart.getCart(requestCart.value);
  pending.value = false;
  await deliverySumComp();
  formData.value.delivery_address_app_user_id = user.result.data.id;
});

watch(
    requestCart.value,
    async (newRequestCart) => {
      await cart.getCart(newRequestCart);
      await deliverySumComp();
      formRef.value.app_user_order_delivery_address_id =
          requestCart.value.delivery_address_id;
    },
    {deep: true},
);

useHead({
  title: t("headers.cart.title"),
  meta: [
    {
      property: "description",
      content: t("headers.cart.description"),
    },
    {
      property: "og:description",
      content: t("headers.cart.description"),
    },
    {
      property: "og:title",
      content: t("headers.cart.title"),
    },
    {
      property: "og:url",
      content: t("headers.cart.og_url"),
    },
  ],
  link: [{rel: "canonical", href: t("headers.cart.canonical")}],
});
</script>

<template>
  <section class="container mx-auto px-4 md:px-0">
    <div v-if="token" class="my-10">
      <div v-if="!pending">
        <div v-if="result.data.length > 0">
          <div class="w-full flex mb-0 md:mb-8">
            <h1 class="text-3xl md:text-5xl  font-bold">
              {{ $t("cart.title") }}:
              <span v-if="result.data">{{ result.data.length }}</span>
            </h1>
          </div>
          <div>
            <div
                v-if="result.data.length > 0"
                class="w-full flex gap-20 flex-col md:flex-row items-start justify-between"
            >
              <div v-if="!shippingStep" class="w-full md:w-4/5">
                <div class="w-full flex justify-between mt-0 md:mt-10">
                  <div v-if="result.data" class="w-full">
                    <div class="flex flex-col flex-wrap justify-between gap-4">
                      <NuxtLink
                          v-for="(product, index) in result.data"
                          :key="index"

                          :to="
                          localePath(
                            `/artworks/${product.basket_item_art_item_id}`,
                          )
                        "
                          class="block mb-16 hovElem border p-6 rounded-2xl w-full"
                      >
                        <div class="mb-6 flex items-center gap-2">
                          <p class="font-bold">
                            {{
                              product.basket_item_art_item.art_item_artist
                                  .artist_name
                            }}
                          </p>
                        </div>
                        <div class="block md:flex items-start gap-6">
                          <div class="p-7 bg-[#F7F7F7]">
                            <img
                                :alt="product.basket_item_art_item.id"
                                :src="
                                runtimeConfig.public.ENDPOINTS_LINK +
                                product.basket_item_art_item.art_item_images[0]
                                  .medium
                              "
                                class="h-full md:h-56 w-full md:w-52 object-cover object-top mb-3 md:mb-0"
                            />
                          </div>
                          <div class="w-full">
                            <div
                                class="flex justify-between items-center "
                            >
                              <h3
                                  class="text-lg md:text-2xl font-bold w-[70%] "
                              >
                                {{
                                  product.basket_item_art_item.art_item_title
                                }}
                              </h3>
                              <div
                                  class="text-xl font-bold  flex flex-col gap-2"
                              >
                                <p>
                                  ${{
                                    product.basket_item_art_item.art_item_price
                                  }}
                                </p>
                                <p
                                    v-if="
                                    product.basket_item_art_item.delivery_price
                                  "
                                >
                                  {{
                                    $t("landing.gridBlock.delivery.title")
                                  }}(${{
                                    product.basket_item_art_item.delivery_price
                                  }})
                                </p>
                              </div>
                            </div>
                            <div class="flex justify-between mb-3">
                              <p class="text-sm text-[#757575]">
                                {{
                                  product.basket_item_art_item
                                      .art_item_description
                                }}
                              </p>
                            </div>
                            <div
                                class="flex items-center justify-between "
                            >
                              <div class="flex gap-2">
                                <p
                                    :class="{
                                    'text-red-500':
                                      product.basket_item_art_item
                                        .is_in_wish_list,
                                  }"
                                    class="flex items-center gap-1 text-sm text-[#757575] cursor-pointer"
                                    @click.stop.prevent="
                                    addToFavouritesLocal(
                                      product.basket_item_art_item.id,
                                    )
                                  "
                                >
                                  <HeartIcon class="w-5 h-5"/>
                                  <span
                                      v-if="
                                      !product.basket_item_art_item
                                        .is_in_wish_list
                                    "
                                  >
                                    {{ $t("cart.save") }}
                                  </span>
                                  <span v-else> {{ $t("cart.saved") }} </span>
                                </p>
                                <p
                                    class="flex items-center gap-1 text-sm text-[#757575] cursor-pointer"
                                    @click.stop.prevent="
                                    removeLocal(product.basket_item_art_item.id)
                                  "
                                >
                                  <TrashIcon class="w-5 h-5"/>
                                  {{ $t("cart.remove") }}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </NuxtLink>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="w-full md:w-4/5">
                <div class="flex flex-col mb-10">
                  <p class="font-bold mb-2">
                    {{ $t("help.categories.payments.link.second") }}
                  </p>

                  <div class="w-1/3">
                    <div class="flex">
                      <label
                          for="balance"
                          :class="{ '!bg-black text-white' : formRef.payment_system === null }"
                          class="w-full flex items-center justify-center bg-[#f0f0f0] border-r px-3 hover:bg-black hover:text-white cursor-pointer transition-all">
                        <input
                            id="balance"
                            v-model="formRef.payment_system"
                            :value="null"
                            checked
                            class="hidden"
                            name="frame"
                            type="radio"
                        />
                        <p>
                          {{$t("payment_types.balance")}}
                        </p>
                      </label>
                      <label
                          for="stripe"
                          :class="{ '!bg-black text-white' : formRef.payment_system === 'stripe' }"
                          class="w-full flex items-center justify-center bg-[#f0f0f0] border-r px-3 hover:bg-black hover:text-white cursor-pointer transition-all">
                        <input
                            id="stripe"
                            v-model="formRef.payment_system"
                            value="stripe"
                            class="hidden"
                            name="frame"
                            type="radio"
                        />
                        <div class="flex items-center gap-2">
                          <img
                              alt=""
                              class="w-5 h-5"
                              src="@/assets/img/stripe.webp"
                          />
                          <p>{{ $t("payment_types.stripe") }}</p>
                        </div>
                      </label>
                      <label
                          for="paypal"
                          :class="{ '!bg-black text-white' : formRef.payment_system === 'paypal' }"
                          class="w-full flex items-center justify-center bg-[#f0f0f0] px-3 hover:bg-black hover:text-white cursor-pointer transition-all">
                        <input
                            id="paypal"
                            v-model="formRef.payment_system"
                            value="paypal"
                            class="hidden"
                            name="frame"
                            type="radio"
                        />
                        <img
                            alt=""
                            class="w-full h-auto"
                            src="@/assets/img/paypal.png"
                        />
                      </label>
                    </div>
                  </div>
                </div>
                <div class="w-full flex justify-between mt-10">
                  <div v-if="result.data" class="w-full">
                    <div>
                      <p class="mb-4">
                        {{ $t("profile.address.savedAddresses") }}
                      </p>
                      <div>
                        <div
                            v-for="(address, index) in addresses.result.data"
                            :key="index"
                            class="mb-4 p-4 border rounded flex justify-between items-start"
                        >
                          <div class="flex items-start mb-2 gap-4">
                            <input
                                :id="'address' + index"
                                v-model="requestCart.delivery_address_id"
                                :value="address.id"
                                class="w-6 h-6"
                                name="savedAddress"
                                type="radio"
                            />
                            <div>
                              <label
                                  :for="'address' + index"
                                  class="font-semibold"
                              >{{ address.delivery_address_person }}</label
                              >
                              <div class="flex gap-3">
                                <p>
                                  {{ address.delivery_address_full_address }}
                                </p>
                                <p class="text-[#CCCCCC]">|</p>
                                <p>{{ address.delivery_address_zip_code }}</p>
                              </div>
                              <div class="flex gap-3">
                                <p>
                                  {{ address.delivery_address_state }},
                                  {{ address.delivery_address_country }}
                                </p>
                                <p class="text-[#CCCCCC]">|</p>
                                <p>{{ address.delivery_address_phone }}</p>
                              </div>
                            </div>
                          </div>
                          <div class="flex justify-end mt-2 text-[#757575]">
                            <p
                                class="w-max mr-2 cursor-pointer px-3"
                                @click="editAddress(address)"
                            >
                              <PencilIcon class="w-5 h-5"/>
                            </p>
                            <button
                                class="cursor-pointer px-3"
                                @click="() => deleteAddress(address.id)"
                            >
                              <TrashIcon class="w-5 h-5"/>
                            </button>
                          </div>
                        </div>
                        <div
                            class="mt-4 p-4 border rounded flex items-center font-bold gap-4"
                        >
                          <input
                              id="addNewAddress"
                              class="w-6 h-6"
                              name="savedAddress"
                              type="radio"
                              @click="newAddress = true"
                          />
                          <label for="addNewAddress">{{
                              $t("profile.address.addNew")
                            }}</label>
                        </div>
                        <div v-if="newAddress" class="mt-10">
                          <p class="font-bold mb-3">
                            {{ $t("profile.address.addNew") }}
                          </p>
                          <form
                              class="overflow-y-auto"
                              @submit.prevent="submitForm"
                          >
                            <div>
                              <div class="flex gap-3 mt-3">
                                <div class="w-1/2 mb-2 basis-[49%]">
                                  <p class="font-semibold">
                                    {{ $t("profile.address.phone") }}:
                                  </p>
                                  <label class="flex justify-between w-full">
                                    <input
                                        v-model="formData.delivery_address_phone"
                                        :class="{
                                        'border-red-500':
                                          v$.delivery_address_phone.$error,
                                      }"
                                        :placeholder="t('profile.address.phone')"
                                        class="w-full   border"
                                        type="text"
                                    />
                                  </label>
                                  <p
                                      v-if="v$.delivery_address_phone.$error"
                                      class="text-red-500 mt-1 text-sm"
                                  >
                                    {{ $t("profile.address.fillOutField") }}
                                  </p>
                                </div>
                                <div class="w-1/2 mb-2 basis-[49%]">
                                  <p class="font-semibold">
                                    {{ $t("profile.address.fullName") }}:
                                  </p>
                                  <label class="flex justify-between w-full">
                                    <input
                                        v-model="formData.delivery_address_person"
                                        :class="{
                                        'border-red-500':
                                          v$.delivery_address_person.$error,
                                      }"
                                        :placeholder="
                                        t('profile.address.fullName')
                                      "
                                        class="w-full   border"
                                        type="text"
                                    />
                                  </label>
                                  <p
                                      v-if="v$.delivery_address_person.$error"
                                      class="text-red-500 mt-1 text-sm"
                                  >
                                    {{ $t("profile.address.fillOutField") }}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <button
                                v-if="!loading"
                                class="w-full border-black border-2 rounded-3xl bg-black text-white mt-6 mb-6 py-3"
                                type="submit"
                            >
                              {{ $t("profile.address.submit") }}
                            </button>
                            <div
                                v-else
                                class="w-full border-black border-2 rounded-3xl bg-black text-white mt-6 mb-6 py-3"
                            >
                              <div class="spinner"/>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="w-full md:w-max flex justify-end ">
                <div class="max-w-[460px] w-full flex flex-col mt-0 md:mt-10">
                  <div class="flex justify-between text-base mb-4">
                    <p>{{ result.data.length }} {{ $t("cart.artworks") }}</p>
                    <p>${{ result.totalPrice }}</p>
                  </div>
                  <div class="flex justify-between text-base mb-4">
                    <p>{{ $t("cart.delivery_price") }}</p>
                    <p>${{ deliverySum }}</p>
                  </div>
                  <div class="mt-8 flex justify-between gap-10">
                    <div>
                      <p
                          class="text-xl font-bold  whitespace-nowrap"
                      >
                        {{ $t("cart.total") }}
                      </p>
                      <p class="text-sm text-[#757575] underline">
                        ({{ $t("cart.shipping") }})
                      </p>
                    </div>
                    <p class="text-xl font-bold">${{ result.totalPrice + deliverySum }}</p>
                  </div>
                  <div>
                    <p
                        v-if="shippingStep === false"
                        class="w-full border-black border-2 text-center cursor-pointer rounded-3xl bg-black text-white mt-8 mb-6 py-3 transition-all divide-gray-500 hover:bg-black hover:text-white p-2 px-6"
                        @click="shippingStep = true"
                    >
                      {{ $t("buyComponent.shipping.next") }}
                    </p>
                    <p
                        v-else
                        class="w-full border-black border-2 text-center cursor-pointer rounded-3xl bg-black text-white mt-8 mb-6 py-3 transition-all divide-gray-500 hover:bg-black hover:text-white p-2 px-6"
                        @click="sendForm"
                    >
                      {{ $t("cart.checkout") }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="mt-10">
          <h1 class="text-3xl font-bold  ">
            {{ $t("cart.title") }}
          </h1>
          <NoElements
              :text="$t('cart.emptyText')"
              :title="$t('cart.emptyTitle')"
              class="py-10"
          />
        </div>
      </div>
      <div v-else>
        <div class="skeleton w-1/5 h-4 mb-10"/>
        <div class="flex items-start justify-between gap-5">
          <div class="w-2/3">
            <div class="skeleton w-full h-80 mb-5"/>
            <div class="skeleton w-full h-80 mb-5"/>
            <div class="skeleton w-full h-80 mb-5"/>
            <div class="skeleton w-full h-80 mb-5"/>
            <div class="skeleton w-full h-80 mb-5"/>
          </div>
          <div class="w-1/3">
            <div class="skeleton w-full h-40 mb-5"/>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="my-10">
        <p class="text-xl text-center mb-4 ">
          {{ $t("cart.unfortunately") }}
        </p>
        <div class="flex !justify-center gap-3">
          <button
              class="px-5 py-2 rounded-full border hover:bg-black hover:text-white transition-all"
              onclick="loginModal.showModal()"
          >
            {{ $t("cart.login") }}
          </button>
          <button
              class="px-5 py-2 rounded-full  border hover:bg-black hover:text-white transition-all"
              onclick="registration.showModal()"
          >
            {{ $t("cart.register") }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
