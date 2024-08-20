<script setup>
import {storeToRefs} from "pinia";

const route = useRoute();

const artistProfileStore = useArtistProfileStore();
const {getArtistData} = artistProfileStore;

const auth = useAuthStore();
auth.initCookieToken();
const {token} = storeToRefs(auth);

const router = useRouter();

onMounted(async () => {
  await nextTick();
  await getArtistData();
});

watch(
    token.value,
    async () => {
      if (!token.value) {
        await router.push(localePath("/"));
      }
    },
    {immediate: true},
);
</script>

<template>
  <div class="block">
    <ArtistSidebar/>
    <div
        :class="{ '!p-0': route.fullPath.includes('/messages') }"
        class="container mx-auto px-4 md:px-0 w-full p-4 md:p-10"
    >
      <slot/>
    </div>
  </div>
</template>
