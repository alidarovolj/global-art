<script setup>
import {storeToRefs} from "pinia";
import {Menu, MenuButton, MenuItem, MenuItems} from '@headlessui/vue'

const localePath = useLocalePath();
const {t} = useI18n();

const loading = ref(false);

const router = useRouter();

const route = useRoute();

const runtimeConfig = useRuntimeConfig();

const user = useUserStore();
const auth = useAuthStore();
auth.initCookieToken();
const {token} = storeToRefs(auth);

const toasts = useToastsStore()

const links = computed(() => [
  {title: t("artistProfile.tabs.overview"), link: localePath("/artistProfile")},
  {title: t("artistProfile.tabs.artworks"), link: localePath("/artistProfile/artworks")},
  {
    title: t("artistProfile.tabs.promocode"),
    link: localePath("/artistProfile/promocode"),
  },
  {
    title: t("artistProfile.tabs.commissions"),
    link: localePath("/artistProfile/commissions"),
  },
  {
    title: t("header.orders"),
    link: localePath("/artistProfile/orders"),
  },
  // { title: t("artistProfile.tabs.messages"), link: "/artistProfile/messages" },
]);

async function logout() {
  loading.value = true;

  const {data} = await useFetch("/api/company/app-user/logout-app-user/", {
    method: "POST",
    baseURL: runtimeConfig.public.ENDPOINTS_LINK,
    body: JSON.stringify({
      app_user_token: token.value,
    }),
    lazy: true,
  });

  if (data.value) {
    auth.token = null;
    loading.value = false;
    user.result = false;
    router.push(localePath("/"));
  } else {
    toasts.showToast("error", "An error has occurred", "Please try again later.");
  }
}

onMounted(async () => {
  await nextTick();
  await user.getProfile();
});
</script>

<template>
  <div class="py-4 px-4 md:px-0 pb-0 border-b ">
    <div
        class="container mx-auto w-full h-full flex justify-between  mb-5"
    >
      <div
          class="w-full md:w-auto flex items-center justify-between md:justify-start gap-5"
      >
        <div>
          <NuxtLink

              :to="localePath('/artistProfile')"
              class="text-xl font-bold flex gap-2 items-center !no-underline"
          >
            <img
                alt=""
                class="w-auto h-7 min-h-7"
                src="@/assets/img/logos/ArtistHorBlack.svg"
            />
          </NuxtLink>
        </div>
        <LocaleSwitcher/>
      </div>
      <div class="hidden md:flex">
        <div class="flex items-center gap-16">
          <NuxtLink :to="localePath('/')" class="text-sm">
            {{ $t("general.mode") }}
          </NuxtLink>
          <div class="flex items-center gap-5">
            <NotificationsButton/>
            <div
                v-if="user.result"
                class="dropdown dropdown-end w-max text-sm">
              <Menu as="div" class="relative inline-block text-left">
                <div>
                  <MenuButton
                      class="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white text-sm font-semibold text-gray-900">
                    <div class="flex items-center gap-2">
                      <img v-if="user.result.data.params.photo" :src="runtimeConfig.public.ENDPOINTS_LINK +
                          user.result.data.params.photo.thumb
                          " alt="" class="w-10 h-10 rounded-full block"/>
                      <div v-else
                           class="bg-gray-200  flex items-center justify-center h-10 w-10 rounded-full">
                        <p v-for="(
                              word, index
                            ) in user.result.data.app_user_full_name.split(' ')" :key="index"
                           class="uppercase  whitespace-nowrap">
                          {{ word.charAt(0) }}
                        </p>
                      </div>
                    </div>
                  </MenuButton>
                </div>

                <transition enter-active-class="transition ease-out duration-100"
                            enter-from-class="transform opacity-0 scale-95"
                            enter-to-class="transform opacity-100 scale-100"
                            leave-active-class="transition ease-in duration-75"
                            leave-from-class="transform opacity-100 scale-100"
                            leave-to-class="transform opacity-0 scale-95">
                  <MenuItems
                      class="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div class="py-1" @click="logout">
                      <MenuItem v-slot="{ active }">
                        <p :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']">
                          {{ $t("header.logout") }}
                        </p>
                      </MenuItem>
                    </div>
                  </MenuItems>
                </transition>
              </Menu>
            </div>
            <div v-else-if="user.result === null">
              <div class="skeleton w-10 h-2"/>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container mx-auto block md:hidden mb-4">
      <div class="flex items-center justify-between gap-16">
        <NuxtLink :to="localePath('/')" class="text-sm">
          {{ $t("general.mode") }}
        </NuxtLink>
        <div class="flex items-center gap-5">
          <NotificationsButton/>
          <div v-if="user.result">
            <Menu as="div" class="relative inline-block text-left">
              <div>
                <MenuButton
                    class="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white text-sm font-semibold text-gray-900">
                  <div class="flex items-center gap-2">
                    <img v-if="user.result.data.params.photo" :src="runtimeConfig.public.ENDPOINTS_LINK +
                          user.result.data.params.photo.thumb
                          " alt="" class="w-10 h-10 rounded-full block"/>
                    <div v-else
                         class="bg-gray-200  flex items-center justify-center h-10 w-10 rounded-full">
                      <p v-for="(
                              word, index
                            ) in user.result.data.app_user_full_name.split(' ')" :key="index"
                         class="uppercase  whitespace-nowrap">
                        {{ word.charAt(0) }}
                      </p>
                    </div>
                  </div>
                </MenuButton>
              </div>

              <transition enter-active-class="transition ease-out duration-100"
                          enter-from-class="transform opacity-0 scale-95"
                          enter-to-class="transform opacity-100 scale-100"
                          leave-active-class="transition ease-in duration-75"
                          leave-from-class="transform opacity-100 scale-100"
                          leave-to-class="transform opacity-0 scale-95">
                <MenuItems
                    class="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div class="py-1" @click="logout">
                    <MenuItem v-slot="{ active }">
                      <p :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']">
                        {{ $t("header.logout") }}
                      </p>
                    </MenuItem>
                  </div>
                </MenuItems>
              </transition>
            </Menu>
          </div>
          <div v-else-if="user.result === null">
            <div class="skeleton w-10 h-2"/>
          </div>
        </div>
      </div>
    </div>
    <div class="container mx-auto flex artistLinks gap-10 overflow-x-auto">
      <NuxtLink
          v-for="(link, index) in links"
          :key="index"
          :class="{ 'border-b border-black': route.fullPath === link.link }"
          :to="localePath(link.link)"
          class="whitespace-nowrap text-sm  block uppercase py-1 focus:border-b focus:border-black hover:border-b hover:border-black transition-all"
      >
        {{ link.title }}
      </NuxtLink>
    </div>
  </div>
</template>

<style>
.artistLinks a.router-link-active,
.artistLinks a.router-link-exact-active {
  text-decoration: none;
}

html.dark .artistLinks a.router-link-active,
html.dark .artistLinks a.router-link-exact-active {
  border-bottom: 1px solid #fff;
}
</style>
