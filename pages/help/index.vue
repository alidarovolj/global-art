<script setup>
const {t} = useI18n();
const activeTab = ref(1);

const tabs = ref([
  {id: 1, name: t("help.tabs.general")},
  // { id: 2, name: t("help.tabs.artist") },
  // { id: 3, name: t("help.tabs.designer") },
]);

useHead({
  title: t("headers.help.title"),
  meta: [
    {
      property: "description",
      content: t("headers.help.description"),
    },
    {
      property: "og:description",
      content: t("headers.help.description"),
    },
    {
      property: "og:title",
      content: t("headers.help.title"),
    },
    {
      property: "og:url",
      content: t("headers.help.og_url"),
    },
  ],
  link: [{rel: "canonical", href: t("headers.help.canonical")}],
});
</script>
<template>
  <div class="container mx-auto px-4 md:px-0 pt-4">
    <div class="flex flex-col items-center">
      <div class="md:w-1/3 w-1/2 text-center mt-10 mb-6">
        <p class="text-3xl font-bold mb-8  ">
          {{ $t("help.search.title") }}
        </p>
      </div>
      <div class="w-full flex flex-col mt-3">
        <div class="flex gap-8 mb-2 w-full border-b ">
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
          <div class="mb-20">
            <HelpFAQ/>
          </div>
        </div>
        <div v-if="activeTab === 2"/>
        <div v-if="activeTab === 3"/>
      </div>
    </div>
  </div>
</template>
