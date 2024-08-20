<script setup>
import {ArrowLongRightIcon, EnvelopeIcon} from "@heroicons/vue/24/outline"
import {useVuelidate} from "@vuelidate/core";
import {email, required} from "@vuelidate/validators";
import {useIntersectionObserver} from "~/composables/useIntersectionObserver.js";
import {useToastsStore} from "~/store/toastDropStore.js";

const toasts = useToastsStore()

const form = ref({
  waiting_list_item_email: "",
  waiting_list_item_full_name: "",
});

const v$ = useVuelidate(
    {
      waiting_list_item_email: {required, email},
      waiting_list_item_full_name: {required},
    },
    form,
);

const addToWaitingList = async () => {
  await v$.value.$validate();
  if (v$.value.$error) {
    return;
  }

  await api(`/api/company/waiting-list/add-to-waiting-list/`, {
    body: JSON.stringify(form.value),
  })
      .then((response) => {
        const data = response.data;
        if (data.success) {
          toasts.showToast("success", "You are joined to waiting list", "Thank you for subscribing!");
          v$.value.$reset();
          form.value.waiting_list_item_email = "";
          form.value.waiting_list_item_full_name = "";
        } else {
          toasts.showToast("error", "An error has occurred!", data.msg_txt);
        }
      })
      .catch((e) => {
        if (e.response.data.success === false) {
          toasts.showToast("error", "An error has occurred!", e.response.data.msg_txt);
        } else {
          toasts.showToast("error", "An error has occurred!", "Server Error! Please try again later.");
        }
      });
};

// Intersection Observer Logic - Сброс валидации формы при скрытии формы
const heroAiFormVisible = ref(true);
const {elementRef: heroAiFormRef, isVisible} = useIntersectionObserver(
    (isIntersecting) => {
      heroAiFormVisible.value = isIntersecting;
      if (!isIntersecting) {
        form.value.waiting_list_item_email = null;
        form.value.waiting_list_item_full_name = null;
        v$.value.$reset();
      }
    },
);
</script>

<template>
  <div>
    <div class="container mx-auto px-4 md:px-0">
      <div class="block md:flex items-center gap-10 mb-32 md:mb-16">
        <div class="w-full md:w-1/2">
          <h1
              class="text-3xl md:text-5xl xl:text-6xl 2xl:text-7xl font-bold mb-6 whitespace-nowrap"
          >
            {{ $t("aboutAI.create") }} <br/>
            <span class="PF italic"> {{ $t("aboutAI.authentic") }} </span>
          </h1>
          <p class="font-medium text-xl mb-12">
            {{ $t("aboutAI.collaboration") }}
          </p>
          <div class="mb-5 md:mb-3">
            <div ref="heroAiFormRef" class="flex gap-4 mb-4">
              <div class="w-full">
                <div>
                  <input
                      v-model="form.waiting_list_item_full_name"
                      :class="{
                      'border-red-500':
                        v$.waiting_list_item_full_name.$error &&
                        v$.waiting_list_item_full_name.$dirty,
                    }"
                      :placeholder="$t('aboutAI.fullNamePlaceholder')"
                      class="border py-3 px-6 rounded-full w-full"
                      type="text"
                  />
                </div>
                <span
                    v-if="
                    v$.waiting_list_item_full_name.$error &&
                    v$.waiting_list_item_full_name.$dirty
                  "
                    class="text-red-500 text-xs"
                >
                  {{ $t("aboutAI.value") }}</span
                >
              </div>
              <div class="w-full">
                <div class="relative">
                  <EnvelopeIcon
                      class="absolute top-1/2 w-5 h-5 -translate-y-1/2 left-6 text-[#757575]"
                  />
                  <input
                      v-model="form.waiting_list_item_email"
                      :class="{
                      'border-red-500':
                        v$.waiting_list_item_email.$error &&
                        v$.waiting_list_item_email.$dirty,
                    }"
                      :placeholder="$t('aboutAI.emailPlaceholder')"
                      class="border py-3 px-6 rounded-full w-full pl-14"
                      type="email"
                  />
                </div>
                <span
                    v-if="
                    v$.waiting_list_item_email.$error &&
                    v$.waiting_list_item_email.$dirty
                  "
                    class="text-red-500 text-xs"
                >
                  {{ $t("aboutAI.value") }}</span
                >
              </div>
            </div>
            <Base-button
                class="flex items-center font-semibold justify-center gap-2 w-full text-center py-3 md:py-4 px-8"
                type="button"
                @click="addToWaitingList"
            >
              <p>{{ $t("aboutAI.waitlist") }}</p>
              <ArrowLongRightIcon class="w-5 h-5"/>
            </Base-button>
          </div>
          <p class="text-sm text-[#757575] text-center">
            {{ $t("aboutAI.shareInfo") }}
          </p>
        </div>
        <div class="w-full md:w-1/2">
          <div class="flex justify-end relative">
            <img alt="" class="w-full" src="@/assets/img/aboutAI/browser.png"/>
            <div class="block w-full absolute right-0 top-[20%]">
              <div class="w-full md:w-4/5 block">
                <img
                    alt=""
                    class="w-full"
                    src="@/assets/img/aboutAI/toolbar.png"
                />
                <video
                    autoplay
                    class="w-full h-auto object-cover rounded-b-2xl"
                    loop
                    muted
                    playsinline
                >
                  <source
                      src="@/assets/img/aboutAI/mainPovComp.mp4"
                      type="video/mp4"
                  />
                  {{ $t("aboutAI.notSupport") }}
                </video>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
          class="w-full flex justify-between flex-wrap md:flex-nowrap"
      >
        <div class="w-full md:w-[14%] flex justify-center">
          <img
              alt=""
              class="w-auto h-8 mb-7 md:mb-0"
              src="@/assets/img/investors/1.png"
          />
        </div>
        <div class="w-full md:w-[14%] flex justify-center">
          <img
              alt=""
              class="w-auto h-8 mb-7 md:mb-0"
              src="@/assets/img/investors/2.png"
          />
        </div>
        <div class="w-full md:w-[14%] flex justify-center">
          <img
              alt=""
              class="w-auto h-8 mb-7 md:mb-0"
              src="@/assets/img/investors/3.png"
          />
        </div>
        <div class="w-full md:w-[14%] flex justify-center">
          <img
              alt=""
              class="w-auto h-8 mb-7 md:mb-0"
              src="@/assets/img/investors/4.png"
          />
        </div>
        <div class="w-full md:w-[14%] flex justify-center">
          <img
              alt=""
              class="w-auto h-8 mb-7 md:mb-0"
              src="@/assets/img/investors/5.png"
          />
        </div>
        <div class="w-full md:w-[14%] flex justify-center">
          <img
              alt=""
              class="w-auto h-8 mb-7 md:mb-0"
              src="@/assets/img/investors/6.png"
          />
        </div>
        <div class="w-full md:w-[14%] flex justify-center">
          <img
              alt=""
              class="w-auto h-8 mb-7 md:mb-0"
              src="@/assets/img/investors/7.png"
          />
        </div>
      </div>
      <div
          class="w-full hidden justify-between flex-wrap md:flex-nowrap"
      >
        <div class="w-full md:w-[14%] flex justify-center">
          <img
              alt=""
              class="w-auto h-8 mb-7 md:mb-0"
              src="@/assets/img/investors-dark/1.png"
          />
        </div>
        <div class="w-full md:w-[14%] flex justify-center">
          <img
              alt=""
              class="w-auto h-8 mb-7 md:mb-0"
              src="@/assets/img/investors-dark/2.png"
          />
        </div>
        <div class="w-full md:w-[14%] flex justify-center">
          <img
              alt=""
              class="w-auto h-8 mb-7 md:mb-0"
              src="@/assets/img/investors-dark/3.png"
          />
        </div>
        <div class="w-full md:w-[14%] flex justify-center">
          <img
              alt=""
              class="w-auto h-8 mb-7 md:mb-0"
              src="@/assets/img/investors-dark/4.png"
          />
        </div>
        <div class="w-full md:w-[14%] flex justify-center">
          <img
              alt=""
              class="w-auto h-8 mb-7 md:mb-0"
              src="@/assets/img/investors-dark/5.png"
          />
        </div>
        <div class="w-full md:w-[14%] flex justify-center">
          <img
              alt=""
              class="w-auto h-8 mb-7 md:mb-0"
              src="@/assets/img/investors-dark/6.png"
          />
        </div>
        <div class="w-full md:w-[14%] flex justify-center">
          <img
              alt=""
              class="w-auto h-8 mb-7 md:mb-0"
              src="@/assets/img/investors-dark/7.png"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.PF {
  font-family: "Playfair Display", cursive;
}
</style>
