<script setup>
import {useVuelidate} from "@vuelidate/core";
import {email, required} from "@vuelidate/validators";
import {GlobeAltIcon} from "@heroicons/vue/24/outline";
import {useIntersectionObserver} from "~/composables/useIntersectionObserver.js";

const localePath = useLocalePath();
const {t} = useI18n();

const toasts = useToastsStore()

const loading = ref(false);

const route = useRoute();

const form = ref({
  news_letter_subscription_email: null,
});

const v$ = useVuelidate(
    {
      news_letter_subscription_email: {required, email},
    },
    form,
);

const onSubmit = async () => {
  loading.value = true;
  await v$.value.$validate();
  if (v$.value.$error) {
    loading.value = false;
    return;
  }

  await api(`/api/company/news-letter-subscription/subscribe-on-news-letter/`, {
    body: JSON.stringify(form.value),
  })
      .then((response) => {
        const data = response.data;
        if (data.success) {
          toasts.showToast("success", "You are subscribed to our newsletter", "Thank you for subscribing!");
          form.value.news_letter_subscription_email = null;
          loading.value = false;
          v$.value.$reset();
        } else {
          loading.value = false;
          toasts.showToast("error", "An error has occurred!", data.msg_txt);
        }
      })
      .catch((e) => {
        if (e.response.data.success === false) {
          toasts.showToast("error", "An error has occurred!", e.response.data.msg_txt);
        } else {
          toasts.showToast("error", "An error has occurred!", "Server Error! Please try again later.");
        }
        loading.value = false;
      });
};

// Intersection Observer Logic - Сброс валидации формы при скрытии футера
const footerVisible = ref(true);

const {elementRef: footerRef, isVisible} = useIntersectionObserver(
    (isIntersecting) => {
      footerVisible.value = isIntersecting;
      if (!isIntersecting) {
        form.value.news_letter_subscription_email = null;
        v$.value.$reset();
      }
    },
);
</script>

<template>
  <div
      v-if="route.fullPath.includes('profile/commissions/messages') === false"
      class="border-t border-gray-200 pt-10 pb-5   "
  >
    <div class="container mx-auto px-4 md:px-0 ">
      <div class="flex flex-col justify-between gap-8 md:flex-row">
        <div class="flex flex-col gap-2">
          <h6 class="text-sm font-bold uppercase mb-2 tracking-widest">
            {{ $t("footer.about") }}
          </h6>

          <NuxtLink :to="localePath('/marketplace')">
            {{ $t("header.links.marketplace") }}
          </NuxtLink>
          <NuxtLink :to="localePath('/blog')">
            {{ $t("footer.blog") }}
          </NuxtLink>
          <NuxtLink :to="localePath('/help')">
            {{ $t("footer.contact") }}
          </NuxtLink>

        </div>
        <div class="flex flex-col gap-2">
          <h6 class="text-sm font-bold uppercase mb-2 tracking-widest">
            {{ $t("footer.explore") }}
          </h6>
          <NuxtLink :to="localePath('/artworks')">
            {{ $t("footer.artworks") }}
          </NuxtLink>
          <NuxtLink :to="localePath('/artists')">
            {{ $t("footer.artists") }}
          </NuxtLink>

        </div>
        <div class="flex flex-col gap-2">
          <h6 class="text-sm font-bold uppercase mb-2 tracking-widest">
            {{ $t("footer.letUsHelp") }}
          </h6>
          <NuxtLink :to="localePath('/profile/orders')">
            {{ $t("footer.orderStatus") }}
          </NuxtLink>
          <NuxtLink :to="localePath('/help')">
            {{ $t("footer.customerSupport") }}
          </NuxtLink>
        </div>
        <div class="flex flex-col gap-2">
          <h6 class="text-sm font-bold uppercase mb-2 tracking-widest">
            {{ $t("footer.sellWithUs") }}
          </h6>
          <NuxtLink :to="localePath('/artists')">
            {{ $t("footer.artists") }}
          </NuxtLink>
        </div>
        <div class="flex flex-col">
          <h6 class="text-sm font-bold uppercase mb-2 tracking-widest">
            {{ $t("footer.subscribeToNewsLetter") }}
          </h6>
          <p class="text-sm text-[#757575]">
            {{ $t("footer.getWeekly") }}
          </p>
          <form
              ref="footerRef"
              class="flex flex-col items-start gap-2 mt-4 md:flex-row"
              @submit.prevent="onSubmit"
          >
            <div class="w-full">
              <input
                  v-model="form.news_letter_subscription_email"
                  :class="{
                  'border-red-500':
                    v$.news_letter_subscription_email.$error &&
                    v$.news_letter_subscription_email.$dirty,
                }"
                  :placeholder="t('footer.yourEmail')"
                  class="border w-full rounded-lg px-4 p-3  "
                  type="text"
              />
              <p
                  v-if="
                  v$.news_letter_subscription_email.$error &&
                  v$.news_letter_subscription_email.$dirty
                "
                  class="text-sm text-red-500"
              >
                {{ $t("footer.valueRequired") }}
              </p>
            </div>
            <Base-button class="py-2 px-3 border-2 w-full md:w-max">
              {{ $t("footer.subscribe") }}
            </Base-button>
          </form>
        </div>
      </div>
      <div class="flex flex-col justify-between items-center mt-20 md:flex-row">
        <p class="text-sm text-[#757575]">
          {{ $t("footer.terms") }} | {{ $t("footer.privacy") }} | Global Art AI
          © 2024
        </p>
        <div class="hidden items-center">
          <GlobeAltIcon class="w-5 h-5"/>
          <select class="select max-w-xs w-16 border-none font-bold px-1">
            <option selected>ENG</option>
            <option>KZ</option>
            <option>RU</option>
          </select>
          <p class="font-bold">$ USD</p>
        </div>
      </div>
    </div>
  </div>
</template>
