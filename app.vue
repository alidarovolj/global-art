<script setup>
import ToastsDrop from "~/components/General/ToastsDrop.vue";
import PagePreloader from "~/components/General/PagePreloader.vue";
import ModalDialog from "~/components/General/ModalDialog.vue";

const route = useRoute();
const pending = ref(true);
const techJobs = ref(false);

const layoutName = computed(() => {
  if (
      ["/artistProfile", "/condition"].some((path) =>
          route.fullPath.includes(path),
      )
  ) {
    return "artist";
  } else if (
      ["/artistRegistration"].some((path) => route.fullPath.includes(path))
  ) {
    return "";
  } else if (["/profile"].some((path) => route.fullPath.includes(path))) {
    return "profile";
  } else {
    return "default";
  }
});

onMounted(() => {
  setTimeout(() => {
    pending.value = false;
  }, 1000);
});

onBeforeMount(() => {
  if (
      localStorage.getItem("nuxt-color-mode") === "dark" ||
      localStorage.getItem("nuxt-color-mode") === "system"
  ) {
    localStorage.clear();
    localStorage.setItem("nuxt-color-mode", "light");
  }
});

useHead({
  htmlAttrs: {
    "data-theme": "light",
    class: "light",
  },
});
</script>

<template>
  <div>
    <div v-if="!techJobs">
      <NuxtLayout :name="layoutName">
        <NuxtPage/>
      </NuxtLayout>
      <CheckSocket/>
    </div>
    <div v-else class="w-full h-full fixed bg-white left-0 top-0 z-[100]">
      <div
          class="flex items-center justify-center h-full container mx-auto px-4 md:px-0"
      >
        <div class="text-center text-lg font-bold">
          <img
              alt=""
              class="w-72 mb-5 mx-auto"
              src="@/assets/img/logos/BuyerHorBlack.svg"
          />
          <p class="mb-3">
            Сайт находится на техническом обслуживании. Приносим извинения за
            временные неудобства.
          </p>
        </div>
      </div>
    </div>
    <PagePreloader/>
    <ToastsDrop/>
    <ModalDialog/>
  </div>
</template>
