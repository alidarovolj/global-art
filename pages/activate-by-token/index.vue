<script setup>
import {CheckIcon} from "@heroicons/vue/24/outline";
import {useUserStore} from "~/store/user.js";

const localePath = useLocalePath();

const route = useRoute();
const router = useRouter();

const user = useUserStore();

const pending = ref(true);

const links = [
  {
    title: "Home",
    link: "/",
  },
  {
    title: "Successful payment",
    link: "/payment-success",
  },
];

onMounted(async () => {
  if (route.query.token) {
    await user.activateAccount(route.query.token);
    pending.value = false;
  } else {
    router.push(localePath("/"));
  }
});
</script>

<template>
  <div class="">
    <div class="container mx-auto px-4 md:px-0">
      <Breadcrumbs :links="links"/>
      <div
          v-if="!pending"
          class="flex md:flex-row flex-col justify-between items-start pb-24 pt-12"
      >
        <div class="text-center w-full md:w-half md:mb-0 mb-8 mx-auto">
          <div
              class="mx-auto p-2 rounded-full border-4 w-max border-green-500 mb-6"
          >
            <CheckIcon class="text-green-500 w-10 h-10"/>
          </div>
          <h1 class="text-3xl font-bold">Thank you for your registration</h1>
          <p class="my-6">
            Your account has been successfully activated. You can now log in and
            start using your account.
          </p>
          <NuxtLink

              :to="localePath('/')"
              class="border  px-6 py-3 rounded-full hover:bg-black hover:text-white hover:border-black"
          >
            Back to the main page
          </NuxtLink>
        </div>
      </div>
      <div v-else class="flex md:flex-row flex-col justify-between w-full">
        <div
            v-for="_ in 2"
            class="skeleton h-[420px] max-h-[420px] w-full md:w-half mb-5"
        />
      </div>
    </div>
  </div>
</template>
