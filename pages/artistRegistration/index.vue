<script setup>
import {useAuthStore} from "~/store/auth.js";
import {useLoadingStore} from "~/store/loading.js";

const localePath = useLocalePath();
const {t} = useI18n();
const router = useRouter();

const toasts = useToastsStore();

const loadingStore = useLoadingStore();
const currentStep = ref(1);
const isFormFilled = ref(false);

const user = useUserStore();
const {result} = storeToRefs(user);

const auth = useAuthStore();
auth.initCookieToken();
const {token} = storeToRefs(auth);

if (!token.value) {
  navigateTo(localePath("/"));
}

const photoData = ref(null);

const artistRegistrationStore = useArtistRegistrationStore();
const {form, cookie} = storeToRefs(artistRegistrationStore);
const {saveToCookie} = artistRegistrationStore;
artistRegistrationStore.initCookieRegistration();

watch(
    form.value,
    (newValue) => {
      isFormFilled.value = isStepFormFilled(currentStep.value, newValue);
    },
    {deep: true},
);

watch(currentStep, (newValue) => {
  isFormFilled.value = isStepFormFilled(newValue, form.value);
});

const isEveryTitleFilled = computed(() => {
  return form.value.artist_exhibition.every(
      (exhibition) => exhibition.title !== null && exhibition.title.length > 0,
  );
});

const isPhotoAvailable = computed(() => {
  const userData = result.value?.data?.params;
  return userData?.photo || false;
});

const getWidth = computed(() => {
  return (100 / 6) * currentStep.value;
});

const test = ref(true)

const isStepFormFilled = (step, form) => {
  switch (step) {
    case 1:
      return (
          !!form.artist_base_info.first_name &&
          !!form.artist_base_info.last_name &&
          !!form.artist_base_info.city &&
          !!form.artist_base_info.country &&
          !!form.artist_base_info.state &&
          !!form.artist_base_info.address &&
          !!form.artist_base_info.zipcode &&
          !!form.artist_base_info.phone_number
      );
    case 2:
      return (
          form.artist_about?.length >= 40 &&
          form.artist_about?.length <= 1500 &&
          form.artist_credo?.length >= 40 &&
          form.artist_credo?.length <= 1500 &&
          form.artist_exhibition?.length >= 1 &&
          isEveryTitleFilled.value
      );
    case 3:
      return form.artist_is_available || form.artist_is_available === false;
    case 4:
      return (
          !!form.artist_art_categories?.length > 0 &&
          !!form.artist_art_materials?.length > 0 &&
          !!form.artist_art_styles?.length > 0 &&
          !!form.artist_art_subjects?.length > 0
      );
    case 5:
      return test.value;
    case 6:
      return form.artist_references.every((item) => {
        return !!item.full_name && !!item.contact_info;
      });
  }
};

const nextStep = () => {
  if (isFormFilled.value) {
    saveToCookie();
  }
  if (currentStep.value === 7) {
    return;
  }
  if (currentStep.value !== 5) {
    currentStep.value++;
  } else {
    currentStep.value = currentStep.value + 2;
  }
};

const prevStep = () => {
  if (currentStep.value === 1) {
    navigateTo(localePath("/"));
    return;
  }
  if (currentStep.value === 7) {
    currentStep.value = 5;
    return;
  }
  currentStep.value--;
};

const toMainPage = async () => {
  await navigateTo(localePath("/"));
  await router.go();
};

async function sendForm() {
  await loadingStore.setLoading(true, t("preloader.createProfile"));

  form.value.artist_education = form.value.artist_education.filter(
      (education) => {
        return Object.values(education).every((value) => value !== null);
      },
  );

  form.value.artist_exhibition = form.value.artist_exhibition.filter(
      (exhibition) => {
        return Object.values(exhibition).every((value) => value !== null);
      },
  );

  form.value.artist_references = form.value.artist_references.filter(
      (reference) => {
        return Object.values(reference).every((value) => value !== null);
      },
  );

  await api(`/api/artist/artist/create-artist-profile/`, {
    body: JSON.stringify(form.value),
  })
      .then(async (response) => {
        const data = response.data;
        if (data.success) {
          await loadingStore.setLoading(false, null);
          await user.getProfile();
          toasts.showToast("success", "Thank you for registration!", "Your profile is successfully created.");
          await navigateTo(localePath("/artistProfile"));
          await router.go();
        } else {
          await loadingStore.setLoading(false, null);
          toasts.showToast("error", "An error has occurred!", data.msg_txt);
        }
      })
      .catch(async (e) => {
        if (e.response.data.success === false) {
          toasts.showToast("error", "An error has occurred!", e.response.data.msg_txt);
        } else {
          toasts.showToast("error", "An error has occurred!", "Server Error! Please try again later.");
        }
        await loadingStore.setLoading(false, null);
      });
  await loadingStore.setLoading(false, null);
}

onMounted(async () => {
  await nextTick();
  isFormFilled.value = isStepFormFilled(currentStep.value, form.value);
  await loadingStore.setLoading(true, t("preloader.pleaseWait"));
  await user.getProfile();
  artistRegistrationStore.form.artist_app_user_id = result.value.data.id;
  await loadingStore.setLoading(false, null);
});

useHead({
  title: t("headers.mainPage.title"),
  meta: [
    {
      property: "description",
      content: t("headers.mainPage.description"),
    },
    {
      property: "og:description",
      content: t("headers.mainPage.description"),
    },
    {
      property: "og:title",
      content: t("headers.mainPage.title"),
    },
    {
      property: "og:url",
      content: t("headers.mainPage.og_url"),
    },
  ],
  link: [{rel: "canonical", href: t("headers.mainPage.canonical")}],
});
</script>

<template>
  <div v-if="form" class="flex flex-col justify-between h-screen">
    <div class="border-b  ">
      <div
          class="flex items-center container mx-auto px-4 md:px-0 justify-between py-[18px]"
      >
        <div class="flex items-center gap-5">
          <div
              class="text-xl font-bold flex gap-2 items-center !no-underline"
              @click="toMainPage"
          >
            <img
                alt=""
                class="w-auto h-7 min-h-7"
                src="@/assets/img/logos/ArtistHorBlack.svg"
            />
          </div>
        </div>
        <form
            class="flex gap-2 items-center md:gap-6"
            @submit.prevent="sendForm"
        >
          <LocaleSwitcher/>
          <div
              v-if="currentStep !== 7"
              class="block w-max py-3 px-6 border border-gray-200 transition-all rounded-3xl text-center justify-center bg-white"
              @click="toMainPage"
          >
            {{ $t("artistRegistration.buttons.goBack") }}
          </div>
          <button
              v-if="currentStep === 7 && !loadingStore.loading"
              class="block w-max py-3 px-6 bg-black rounded-3xl transition-all text-white justify-center"
              type="submit"
          >
            {{ $t("artistRegistration.buttons.publish") }}
          </button>
          <div
              v-if="loadingStore.loading"
              class="block w-max py-3 px-6 bg-black rounded-3xl transition-all text-white justify-center"
              type="submit"
          >
            <div class="spinner"/>
          </div>
        </form>
      </div>
    </div>
    <div
        v-if="currentStep !== 7"
        class="container mx-auto px-4 md:px-0 pt-4 pb-16"
    >
      <div
          class="flex items-center justify-between w-full md:w-[672px] mx-auto text-sm gap-4 text-[#757575]"
      >
        <p
            :class="{
            'text-black  font-bold':
              currentStep === 1 ||
              currentStep === 2 ||
              currentStep === 3 ||
              currentStep === 4,
          }"
            class="whitespace-nowrap"
        >
          {{ $t("artistRegistration.profileSetup.tabs.artisticProfile") }}
        </p>
        <div class="h-[1px] bg-[#E3E3E3] w-full"/>
        <p
            :class="{ 'text-black  font-bold': currentStep === 5 }"
            class="whitespace-nowrap"
        >
          {{ $t("artistRegistration.profileSetup.tabs.pictures") }}
        </p>
        <div class="h-[1px] bg-[#E3E3E3] w-full"/>
        <p class="whitespace-nowrap">
          {{ $t("artistRegistration.profileSetup.tabs.preview") }}
        </p>
      </div>
    </div>
    <div class="container mx-auto px-4 md:px-0 pb-14">
      <div
          class="flex flex-col-reverse md:flex-row-reverse justify-between gap-4 py-5"
      >
        <section class="w-full md:w-[672px] mx-auto container overflow-y-auto">
          <ArtistRegistrationFirst v-if="currentStep === 1"/>
          <ArtistRegistrationSecond v-if="currentStep === 2"/>
          <ArtistRegistrationThird
              v-if="currentStep === 3"
              @next-step="currentStep++"
              @prev-step="currentStep--"
          />
          <ArtistRegistrationFourth
              v-if="currentStep === 4"
              @next-step="currentStep++"
              @prev-step="currentStep--"
              @add-later="currentStep++"
          />
          <ArtistRegistrationFifth
              v-if="currentStep === 5"
              @next-step="currentStep++"
              @prev-step="currentStep--"
              @add-later="currentStep++"
          />
          <ArtistRegistrationSixth
              v-if="currentStep === 6"
              @next-step="currentStep++"
              @prev-step="currentStep--"
              @add-later="currentStep++"
          />
        </section>
      </div>
      <ArtistRegistrationPreview
          v-if="currentStep === 7"
          @next-step="currentStep++"
          @prev-step="currentStep--"
          @add-later="currentStep++"
      />
    </div>
    <div class="">
      <div class="relative">
        <div
            v-if="currentStep !== 7"
            :style="{ width: getWidth + '%' }"
            class="bg-black h-[6px] rounded-r absolute top-0 left-0 z-20"
        />
        <div
            v-if="currentStep !== 7"
            class="bg-gray-400 absolute left-0 top-0  h-[6px] rounded-r"
            style="width: 100%"
        />
      </div>
      <div v-if="currentStep !== 7" class="container mx-auto px-4 md:px-0">
        <div class="flex justify-between items-center mt-auto pb-3 pt-4">
          <button class="underline " @click="prevStep">
            {{ $t("artistRegistration.buttons.back") }}
          </button>
          <div>
            <button
                v-if="currentStep !== 7"
                :class="{
                'text-white font-bold bg-black   cursor-pointer':
                  isFormFilled,
              }"
                :disabled="!isFormFilled"
                class="py-4 px-10 bg-[#F5F5F5] text-[#A8A8A8] cursor-not-allowed rounded-[120px]"
                @click="nextStep"
            >
              {{ $t("artistRegistration.buttons.next") }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
progress[value]::-webkit-progress-value {
  background-color: green;
}
</style>
