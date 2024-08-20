<script setup>
import {TrashIcon} from "@heroicons/vue/24/outline";
import {useArtistRegistrationStore} from "~/store/artistRegistration.js";

const emit = defineEmits(["addEducationData"]);

const artistRegistrationStore = useArtistRegistrationStore();
const {form} = storeToRefs(artistRegistrationStore);
const modals = useModalsStore()

const addAnotherSchool = () => {
  form.value.artist_education.push({
    school: "",
    faculty: "",
    degree: "",
    start_year: "",
    end_year: "",
  });
};
const currentYear = ref(new Date().getFullYear());
const maxEndYear = computed(() => currentYear.value);
const degrees = ref([
  {
    name: "Associate",
    value: "associate",
  },
  {
    name: "Bachelor's",
    value: "bachelor",
  },
  {
    name: "Master's",
    value: "master",
  },
  {
    name: "Doctoral",
    value: "doctoral",
  },
]);

const removeEducation = (index) => {
  form.value.artist_education.splice(index, 1);
};

const addEducationData = () => {
  emit("addEducationData", true);
  modals.modal.show = false;
};

const isEducationFormFilled = computed(() => {
  return form.value.artist_education.every((item) => {
    const isFilled =
        !!item.school &&
        !!item.faculty &&
        !!item.degree &&
        !!item.start_year &&
        !!item.end_year;
    const isValidYearRange =
        item.end_year <= currentYear.value && item.end_year >= item.start_year;
    return isFilled && isValidYearRange;
  });
});
</script>

<template>
  <div>
    <h2 class="text-center font-semibold border-grey border-b pb-4 mb-4">
      {{ $t("artistRegistration.modals.education.title") }}
    </h2>
    <div class="p-6 border-b  pb-24">
      <div v-for="(item, index) of form.artist_education" :key="index">
        <div class="flex justify-between">
          <h3 class="font-bold text-xl mb-6 ">
            {{ $t("artistRegistration.modals.education.title") }}
            {{ index + 1 }}
          </h3>
          <TrashIcon
              v-if="form.artist_education.length > 1"
              class="cursor-pointer w-6 h-6"
              @click="removeEducation(index)"
          />
        </div>
        <div class="flex flex-col mb-6">
          <label
              class="text-sm text-primaryText mb-1 "
              for="school"
          >{{ $t("artistRegistration.modals.education.school") }}</label
          >
          <input
              id="school"
              v-model="item.school"
              :placeholder="$t('artistRegistration.modals.education.school')"
              class="py-[14px] px-4 border border-bColor rounded-lg  "
              type="text"
          />
        </div>
        <div class="flex flex-col mb-6">
          <label
              class="text-sm text-primaryText mb-1 "
              for="faculty"
          >{{ $t("artistRegistration.modals.education.faculty") }}</label
          >
          <input
              id="faculty"
              v-model="item.faculty"
              :placeholder="$t('artistRegistration.modals.education.faculty')"
              class="py-[14px] px-4 border border-bColor rounded-lg  "
              type="text"
          />
        </div>
        <div class="flex gap-2 border-b pb-6 mb-6">
          <div class="flex flex-col w-third">
            <label
                class="text-sm text-primaryText mb-1 "
                for="degree"
            >{{ $t("artistRegistration.modals.education.degree") }}</label
            >
            <select
                id=""
                v-model="item.degree"
                class="py-[14px] px-4 border border-bColor rounded-lg  "
                name=""
            >
              <option :value="null">
                {{ $t("artistRegistration.modals.education.chooseDegree") }}
              </option>
              <option
                  v-for="(degree, ind) of degrees"
                  :key="ind"
                  :value="degree.value"
              >
                {{ degree.name }}
              </option>
            </select>
          </div>
          <div class="flex flex-col w-third">
            <label
                class="text-sm text-primaryText mb-1 "
                for="start_year"
            >{{
                $t("artistRegistration.modals.education.startYear")
              }}</label
            >
            <input
                id="start_year"
                v-model="item.start_year"
                :max="item.end_year || maxEndYear"
                class="py-[14px] px-4 border border-bColor rounded-lg  "
                min="1900"
                placeholder="YYYY"
                step="1"
                type="number"
            />
          </div>
          <div class="flex flex-col w-third">
            <label
                class="text-sm text-primaryText mb-1 "
                for="end_year"
            >{{
                $t("artistRegistration.modals.education.endYear")
              }}</label
            >
            <input
                id="end_year"
                v-model="item.end_year"
                :max="maxEndYear"
                :min="item.start_year"
                class="py-[14px] px-4 border border-bColor rounded-lg  "
                placeholder="YYYY"
                step="1"
                type="number"
            />
          </div>
        </div>
      </div>
      <button
          class="underline text-primaryText "
          @click="addAnotherSchool"
      >
        {{ $t("artistRegistration.modals.education.addAnotherSchool") }}
      </button>
    </div>
    <div class="mt-5">
      <div class="w-full flex justify-between gap-3">
        <form class="w-full" method="dialog">
          <button
              class="w-full bg-gray-200 py-2 rounded-xl"
              @click="modals.modal.show = false">
            {{ $t("artistRegistration.buttons.cancel") }}
          </button>
        </form>
        <button
            :class="{
              'text-white font-bold bg-black cursor-pointer':
                isEducationFormFilled,
            }"
            :disabled="!isEducationFormFilled"
            class="py-4 px-10 bg-[#F5F5F5] text-[#A8A8A8] cursor-not-allowed rounded-[120px] "
            @click="addEducationData"
        >
          {{ $t("artistRegistration.buttons.save") }}
        </button>
      </div>
    </div>
  </div>
</template>
