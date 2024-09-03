<script setup>
import {CurrencyDollarIcon} from "@heroicons/vue/24/outline";
import {useVuelidate} from "@vuelidate/core";
import {email, required} from "@vuelidate/validators";
import {useToastsStore} from "~/store/toastDropStore.js";
import {useGiftCardsStore} from "~/store/giftCards.js";
import {api} from "~/composables/api.js";

const {t} = useI18n();
const tabs = ref([
  {id: 1, name: t("giftCard.buyTab")},
  {id: 2, name: t("giftCard.redeemTab")},
  {id: 3, name: t("giftCard.historyTab")},
]);
const activeTab = ref(1);
const loading = ref(false);

const runtimeConfig = useRuntimeConfig();
const giftCards = useGiftCardsStore()
const { result } = storeToRefs(giftCards)

const toasts = useToastsStore()

const amounts = ref([200, 500, 1000, 2000]);

const selectedAmount = ref(null);

const form = ref({
  gift_card_receiver_app_user: null,
  gift_card_code_amount: null,
  payment_system: 'stripe',
  host_name: runtimeConfig.public.NUXT_PUBLIC_SITE_URL,
});

const v$ = useVuelidate(
    {
      gift_card_receiver_app_user: {required, email},
      gift_card_code_amount: {required},
    },
    form,
);

const onClick = (amount) => {
  form.value.gift_card_code_amount = amount;
  selectedAmount.value = amount;
};

const onSubmit = async () => {
  loading.value = true;
  await v$.value.$validate();

  if (v$.value.$error) {
    return;
  }

    await api(`/api/order/gift-card/buy-gift-card-via-payment-system`, {
    body: JSON.stringify(form.value),
  })
        .then((response) => {
          const data = response.data;
          if (data.success) {
            if(data.data.params.checkout_link) {
              window.location.href = data.data.params.checkout_link;
              toasts.showToast("success", "Gift card has been sent successfully!", "Recevier will get an email with the gift card code.");
            } else {
              toasts.showToast("success", "Gift card has been sent successfully!", "Recevier will get an email with the gift card code.");
            }
          } else {
            toasts.showToast("error", "An error has occurred!", data.msg_txt);
          }
          loading.value = false;
        })
        .catch((e) => {
          console.log(e);
          if (e.response.data.success === false) {
            toasts.showToast("error", "An error has occurred!", e.response.data.msg_txt);
          } else {
            toasts.showToast("error", "An error has occurred!", "Server Error! Please try again later.");
          }
          loading.value = false;
        });
  loading.value = false;
};

onMounted(async () => {
  await nextTick()
  await giftCards.getGiftCards()
})

useHead({
  title: t("headers.profile.pages.gift_cards.title"),
  meta: [
    {
      property: "description",
      content: t("headers.profile.pages.gift_cards.description"),
    },
    {
      property: "og:description",
      content: t("headers.profile.pages.gift_cards.description"),
    },
    {
      property: "og:title",
      content: t("headers.profile.pages.gift_cards.title"),
    },
    {
      property: "og:url",
      content: t("headers.profile.pages.gift_cards.og_url"),
    },
  ],
  link: [
    {rel: "canonical", href: t("headers.profile.pages.gift_cards.canonical")},
  ],
});
</script>

<template>
  <div class="container mx-auto px-4 md:px-0">
    <div class="w-full">
      <div class="flex gap-8 mb-10 w-full border-b ">
        <p
            v-for="tab of tabs"
            :key="tab.id"
            :class="{
            'border-b-2 border-primaryText pb-3 !text-primaryText ':
              activeTab === tab.id,
          }"
            class="font-bold text-secondaryText text-base leading-6 cursor-pointer"
            @click="activeTab = tab.id"
        >
          {{ tab.name }}
        </p>
      </div>
      <div v-if="activeTab === 1">
        <h2 class="text-3xl font-bold mb-10 ">
          {{ $t("giftCard.title") }}
        </h2>
        <div class="flex md:flex-row flex-col gap-10 justify-between">
          <div class="w-full md:w-[50%]">
            <form @submit.prevent="onSubmit">
              <div class="flex flex-col mb-10">
                <p class="font-bold mb-2">
                  {{ $t("help.categories.payments.link.second") }}
                </p>

                <div>
                  <div class="flex">
                    <label
                        for="balance"
                        :class="{ '!bg-black text-white' : form.payment_system === null }"
                        class="w-full flex items-center justify-center bg-[#f0f0f0] border-r px-3 hover:bg-black hover:text-white cursor-pointer transition-all">
                      <input
                          id="balance"
                          v-model="form.payment_system"
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
                        :class="{ '!bg-black text-white' : form.payment_system === 'stripe' }"
                        class="w-full flex items-center justify-center bg-[#f0f0f0] border-r px-3 hover:bg-black hover:text-white cursor-pointer transition-all">
                      <input
                          id="stripe"
                          v-model="form.payment_system"
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
                        :class="{ '!bg-black text-white' : form.payment_system === 'paypal' }"
                        class="w-full flex items-center justify-center bg-[#f0f0f0] px-3 hover:bg-black hover:text-white cursor-pointer transition-all">
                      <input
                          id="paypal"
                          v-model="form.payment_system"
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
              <div class="flex flex-col mb-10">
                <p class="font-bold mb-2">
                  {{ $t("giftCard.amount") }}
                </p>

                <div class="flex xl:flex-row flex-col gap-2">
                  <div class="flex gap-2 items-end w-full">
                    <p
                        v-for="amount in amounts"
                        :key="amount"
                        :class="{
                        'border-black border-1': selectedAmount === amount,
                        'border-red-500': v$.gift_card_code_amount.$error,
                      }"
                        class="border border-bColor py-[14px] px-2 md:px-[15px] w-full whitespace-nowrap xl:w-max rounded-xl cursor-pointer"
                        @click="onClick(amount)"
                    >
                      $ {{ amount }}
                    </p>
                  </div>
                  <input
                      v-model="form.gift_card_code_amount"
                      :class="{
                      'border-red-500': v$.gift_card_code_amount.$error,
                    }"
                      :placeholder="$t('giftCard.placeholders.custom')"
                      class="border border-bColor rounded-xl py-[14px] px-2 w-full"
                      type="text"
                      @input="selectedAmount = null"
                  />
                </div>
                <p
                    v-if="v$.gift_card_code_amount.$error"
                    class="text-red-500 mt-1 text-sm"
                >
                  {{ $t("profile.address.fillOutField") }}
                </p>
              </div>
              <div class="mb-10">
                <p class="font-bold mb-2">
                  {{ $t("giftCard.to") }}
                </p>
                <div class="flex flex-col gap-4">
                  <div>
                    <div class="flex flex-col gap-2">
                      <label for="recipient_email">
                        {{ $t("giftCard.recipientEmail") }}</label
                      >
                      <input
                          id="recipient_email"
                          v-model="form.gift_card_receiver_app_user"
                          :class="{
                          'border-red-500':
                            v$.gift_card_receiver_app_user.$error,
                        }"
                          :placeholder="$t('giftCard.recipientEmail')"
                          class="py-3 px-4 border border-bColor rounded-lg"
                          type="text"
                      />
                    </div>
                    <p
                        v-if="v$.gift_card_receiver_app_user.$error"
                        class="text-red-500 text-sm"
                    >
                      {{ $t("profile.address.fillOutField") }}
                    </p>
                  </div>
                </div>
              </div>
              <button
                  v-if="!loading"
                  class="border-black border-2 rounded-full bg-black   text-white py-2 px-3 mt-4"
                  type="submit"
              >
                {{ $t("giftCard.send") }}
              </button>
              <p
                  v-else
                  class="border-black w-max border-2 rounded-full bg-black   text-white py-2 px-3 mt-4"
                  type="submit"
              >
                <span class="spinner"/>
              </p>
            </form>
          </div>
          <div
              class="relative flex flex-col items-center mb-4 artwork__main-carousel w-full md:w-[50%]"
          >
            <div class="relative">
              <img
                  alt="Main picture of the artwork"
                  class="bg-black select-none z-10 relative rounded-lg"
                  src="@/assets/img/gift1.png"
              />
              <div
                  class="absolute z-20 inset-0 flex items-center justify-center"
              >
                <div class="flex-col z-20">
                  <div class="z-20 flex gap-2 items-center justify-center">
                    <img
                        alt="Logo"
                        class="h-5 min-h-5 w-auto  z-20"
                        src="@/assets/img/g.png"
                    />
                    <p
                        class="font-bold whitespace-nowrap !no-underline text-xl text-white  z-20"
                    >
                      Global Art AI
                    </p>
                  </div>

                  <h2
                      class="text-white text-xl md:text-3xl md:text-5xl font-bold z-20 text-center"
                  >
                    Gift card
                  </h2>
                </div>
                <div
                    class="absolute inset-0 flex items-end justify-end z-20 my-5 mx-5 text-white"
                >
                  <CurrencyDollarIcon class="h-5 w-5"/>
                  <p
                      v-if="form.gift_card_code_amount"
                      class="text-7xl font-bold"
                  >
                    {{ form.gift_card_code_amount }}
                  </p>
                  <p v-else>
                    {{ $t("addArtwork.second.price") }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="activeTab === 2">
        <div class="w-full">
          <RedeemCardForm/>
        </div>
      </div>
      <div v-if="activeTab === 3">
        <div class="w-full">
          {{ result }}
        </div>
      </div>
    </div>
  </div>
</template>

