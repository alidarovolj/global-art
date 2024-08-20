<script setup>
import {useUserStore} from "~/store/user.js";
import {CameraIcon} from "@heroicons/vue/24/outline";
import ConfirmDeleteProfileModal from "~/components/Modals/ConfirmDeleteProfileModal.vue";
import {useModalsStore} from "~/store/modals.js";

const user = useUserStore();
const router = useRouter();
const {t} = useI18n();
const runtimeConfig = useRuntimeConfig();
const modals = useModalsStore()
const isEdit = ref(false);
const isPasswordEdit = ref(false);
const name = ref("");
const surname = ref("");
const editName = () => {
  isEdit.value = !isEdit.value;
};
const passwordForm = ref({
  id: null,
  company_person_password: null,
});

const saveFullname = async () => {
  const fullName = name.value + " " + surname.value;
  const form = {
    id: user.result.data.id,
    app_user_full_name: fullName,
  };
  await user.editProfile(form);
  await user.getProfile();
  name.value = "";
  surname.value = "";
  editName();
};

const confirmEditPassword = async () => {
  isPasswordEdit.value = false;
};

onMounted(async () => {
  await nextTick();
  await user.getProfile();
  passwordForm.value.id = user.result.data.id;
});

useHead({
  title: t("headers.profile.pages.profile.title"),
  meta: [
    {
      property: "description",
      content: t("headers.profile.pages.profile.description"),
    },
    {
      property: "og:description",
      content: t("headers.profile.pages.profile.description"),
    },
    {
      property: "og:title",
      content: t("headers.profile.pages.profile.title"),
    },
    {
      property: "og:url",
      content: t("headers.profile.pages.profile.og_url"),
    },
  ],
  link: [
    {rel: "canonical", href: t("headers.profile.pages.profile.canonical")},
  ],
});
</script>

<template>
  <p class="text-2xl font-bold mb-10 ">
    {{ $t("profile.profile.title") }}
  </p>
  <div v-if="user.result" class="flex flex-col gap-3 justify-center mb-4">
    <div
        v-if="!user.result.data.params.photo"
        class="border h-32 w-32 text-center flex justify-center rounded-full font-bold bg-avaColor   relative"
    >
      <div class="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2">
        <span
            v-for="(word, index) in user.result.data.app_user_full_name.split(
            ' ',
          )"
            :key="index"
            class="text-xl"
        >
          {{ word.charAt(0) }}
        </span>
      </div>
      <button
          class="mt-24 absolute font-normal flex items-center bg-white gap-1 py-2 px-3 rounded-full border border-inner_head"
          onclick="setProfilePhoto.showModal()"
      >
        <CameraIcon class="w-5 h-5"/>
        {{ $t("profile.profile.edit") }}
      </button>
    </div>
    <button
        v-else
        class="flex items-center gap-3"
        onclick="setProfilePhoto.showModal()"
    >
      <img
          :src="
          runtimeConfig.public.ENDPOINTS_LINK +
          user.result.data.params.photo.thumb
        "
          alt=""
          class="h-14 w-14 rounded-full"
      />
      <p class="font-bold">
        {{ user.result.data.app_user_full_name }}
      </p>
    </button>
    <div class="w-1/2 mt-10 flex flex-col">
      <div v-if="!isEdit" class="flex flex-col gap-3 pb-6 border-b">
        <div class="flex justify-between">
          <p class="font-bold">
            {{ $t("profile.profile.name") }}
          </p>
          <button @click="editName()">
            {{ $t("profile.profile.edit") }}
          </button>
        </div>
        <p class="text-inner_head">
          {{ user.result.data.app_user_full_name }}
        </p>
      </div>

      <div v-if="isEdit">
        <div class="flex justify-between">
          <p>
            {{ $t("profile.profile.name") }}
          </p>
          <button class="underline" @click="editName()">
            {{ $t("profile.profile.cancel") }}
          </button>
        </div>
        <p class="text-sm text-inner_head mb-4">
          {{ $t("profile.profile.thisIs") }}
        </p>
        <div class="flex gap-2">
          <input
              v-model="name"
              :placeholder="$t('profile.profile.typeHere')"
              class="border w-full max-w-xs"
              type="text"
          />
          <input
              v-model="surname"
              :placeholder="$t('profile.profile.typeHere')"
              class="border w-full max-w-xs"
              type="text"
          />
        </div>
        <div class="flex justify-end mt-4">
          <button
              class="bg-black text-white py-2 px-4 rounded-full"
              @click="saveFullname()"
          >
            {{ $t("profile.profile.save") }}
          </button>
        </div>
      </div>

      <div class="mt-6 pb-6 border-b">
        <p class="mb-3 font-bold">
          {{ $t("profile.profile.email") }}
        </p>
        <p class="text-inner_head">
          {{ user.result.data.app_user_login }}
        </p>
      </div>
      <div class="mt-6 pb-6 border-b">
        <div class="flex justify-between">
          <p class="font-bold">
            {{ $t("profile.profile.password") }}
          </p>
          <button @click="isPasswordEdit = !isPasswordEdit">
            {{ $t("profile.profile.edit") }}
          </button>
        </div>
        <div v-if="isPasswordEdit" class="mt-4">
          <div class="flex justify-between items-end gap-2">
            <input
                v-model="passwordForm.company_person_password"
                :placeholder="$t('profile.profile.typeHere')"
                class="border w-full max-w-xs"
                type="text"
            />
            <button
                class="bg-black text-white py-2 px-4 rounded-full"
                @click="confirmEditPassword"
            >
              {{ $t("profile.profile.save") }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-20">
      <p class="text-2xl font-bold">
        {{ $t("profile.profile.accountDeactivation") }}
      </p>
      <div class="mt-4 flex flex-col items-start gap-6">
        <button @click="router.push('/profile/deactivate')">
          {{ $t("profile.profile.deactivate") }}
        </button>
        <span class="border-b w-1/2"/>
        <p
            class="text-red-500"
            @click="modals.showModal('ConfirmDeleteProfileModal')"
        >
          {{ $t("profile.profile.delete") }}
        </p>
      </div>
    </div>
  </div>
  <div v-else>
    <p>
      {{ $t("profile.profile.noData") }}
    </p>
  </div>
</template>
