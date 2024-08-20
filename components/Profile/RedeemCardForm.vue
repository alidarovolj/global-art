<script setup>
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import {useUserStore} from "~/store/user.js";

const {t} = useI18n();

const user = useUserStore()

const toasts = useToastsStore()

const form = ref({
  gift_card_code_text: null,
});

const v$ = useVuelidate(
    {
      gift_card_code_text: {required},
    },
    form,
);
const loading = ref(false);

const onSubmit = async () => {
  await v$.value.$validate();

  if (v$.value.$error) {
    toasts.showToast("error", "Please check your entries and try again.", "All fields are required.");
    return;
  }
  loading.value = true;

  await api("/api/order/gift-card/use-gift-card/", {
    body: JSON.stringify(form.value),
  })
      .then(async (response) => {
        const data = response.data;
        if (data.success) {
          Ï
          await user.getProfile()
          toasts.showToast("success", "Your gift card successfully redeemed.", "Received amount has been added to your balance.");
        } else {
          toasts.showToast("error", "An error has occurred!", data.msg_txt);
        }
      })
      .catch((e) => {
        if (e.response && e.response.data.success === false) {
          toasts.showToast("error", "An error has occurred!", e.response.data.msg_txt);
        } else {
          toasts.showToast("error", "An error has occurred!", "Server Error! Please try again later.");
        }
      });
};
</script>

<template>
  <form
      class="w-full flex flex-col md:flex-row gap-10"
      @submit.prevent="onSubmit"
  >
    <div class="w-full md:w-1/2">
      <h2 class="text-3xl font-bold mb-10 ">
        {{ $t("giftCard.redeem.title") }}
      </h2>
      <p class="text-xl text-secondaryText">
        {{ $t("giftCard.redeem.apply") }}
      </p>
      <h4 class="font-bold mt-6 mb-2">
        {{ $t("giftCard.redeem.code") }}
      </h4>
      <input
          v-model="form.gift_card_code_text"
          :class="{
          'border-red-500': v$.gift_card_code_text.$error,
        }"
          :placeholder="t('giftCard.redeem.enterCode')"
          class="border border-bColor rounded-xl py-[14px] px-2 w-full mb-6"
          type="text"
      />
      <button
          :disabled="loading"
          class="border-black border-2 rounded-full bg-black   text-white py-3 px-3"
          type="submit"
      >
        {{ $t("giftCard.redeem.submit") }}
      </button>
    </div>
    <img
        alt=""
        class="w-full md:w-1/2 object-contain"
        src="../../assets/img/redeemCard.png"
    />
  </form>
</template>
