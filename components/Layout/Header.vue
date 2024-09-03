<script setup>
import {
  Dialog,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
  TransitionRoot
} from '@headlessui/vue'
import {Bars3Icon, ChevronDownIcon, HeartIcon, ShoppingBagIcon, WalletIcon, XMarkIcon} from '@heroicons/vue/24/outline'
import {storeToRefs} from "pinia";
import {useAuthStore} from "~/store/auth.js";
import {useUserStore} from "~/store/user.js";
import {useToastsStore} from "~/store/toastDropStore.js";
import {ref} from "vue";
import {useModalsStore} from "~/store/modals.js";

const localePath = useLocalePath();
const toasts = useToastsStore()

const open = ref(false)

const menubarState = ref(false);
const {t} = useI18n();

const pending = ref(true);

const router = useRouter();
const runtimeConfig = useRuntimeConfig();

const modals = useModalsStore();

const user = useUserStore();

const auth = useAuthStore();
auth.initCookieToken();
const {token} = storeToRefs(auth);

const loading = ref(false);

const links = computed(() => [
  {
    title: t("header.links.artworks"),
    link: "/artworks",
    requiresAuth: false,
    children: []
  },
  {
    title: t("header.links.artists"),
    link: "/artists",
    requiresAuth: false,
    children: []
  },
  {
    title: t("header.links.order_cus_art"),
    link: "/commission",
    requiresAuth: true,
    children: []
  },
  {
    title: t("header.links.but_gift_card"),
    link: "/profile/buy-gift-card",
    requiresAuth: true,
    children: []
  },
  {
    title: t("header.links.about_us"),
    link: "/",
    requiresAuth: false,
    children: [
      {
        title: t("header.links.ai"),
        link: "/about-ai",
        requiresAuth: false,
        children: []
      },
      {
        title: t("header.links.marketplace"),
        link: "/marketplace",
        requiresAuth: false,
        children: []
      },
      {
        title: t("header.links.blog"),
        link: "/blog",
        requiresAuth: false,
        children: []
      }
    ]
  }
]);

async function logout() {
  loading.value = true;

  await api(`/api/company/app-user/logout-app-user/`, {
    body: JSON.stringify({app_user_token: token.value}),
  })
      .then(async (response) => {
        const data = response.data;
        if (data.success) {
          auth.token = null;
          await nextTick();
          loading.value = false;
          user.result = false;
          await nextTick();
          await router.push(localePath("/"));
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
}

onMounted(async () => {
  await nextTick();
  if (token.value) {
    await user.getProfile();
  } else {
    user.result = false;
  }
  pending.value = false;
});
</script>

<template>
  <div class="header_block w-full border-0 md:border-b border-[#E3E3E3] bg-white   ">
    <div class="w-full px-0 pb-0 md:pb-4">
      <div
          class="flex md:hidden justify-between md:justify-center w-full gap-6 text-sm text-black  px-4 md:px-0 pt-4">
        <div class="flex items-center gap-3">
          <LocaleSwitcher/>
        </div>
        <div class="gap-10 flex items-center justify-between w-max">
          <div
              v-if="user.result"
              class="flex w-max gap-5">
            <BecomeAnArtistButton/>
            <NuxtLink

                :to="localePath('/help')"
                class="hidden md:flex">
              {{ $t("header.inner_header_links.help") }}
            </NuxtLink>
            <p
                v-if="token"
                class="flex gap-2 items-center">
              <WalletIcon class="h-5 w-5"/>
              <span>{{ $t("header.balance") }}: {{ user.result.data.app_user_balance }}</span>
            </p>
          </div>
          <div
              v-else
              class="flex gap-10 items-center">
            <p
                class="flex cursor-pointer gap-2 items-center px-4 py-2 rounded-full border border-[#E3E3E3]"
                @click="modals.showModal('LoginModal')">
              {{ $t("header.becomeAnArtist") }}
            </p>
            <NuxtLink

                :to="localePath('/help')"
                class="hidden md:flex">
              {{ $t("header.inner_header_links.help") }}
            </NuxtLink>
          </div>
        </div>
      </div>
      <div class="border-b border-[#E3E3E3] py-4">
        <div
            class="container mx-auto px-4 md:px-0 flex items-center justify-between flex-nowrap gap-4 md:gap-16 text-sm">
          <div class="flex gap-3 items-center">
            <Bars3Icon
                aria-hidden="true"
                class="h-5 w-5 text-gray-400 block md:hidden cursor-pointer"
                @click="open = true"
            />
            <NuxtLink

                :to="localePath('/')"
                class="!no-underline block">
              <div class="flex items-center gap-3">
                <img
                    alt="Logo"
                    class="h-7 min-h-7 w-auto "
                    src="@/assets/img/logos/BuyerHorBlack.svg"
                />
              </div>
            </NuxtLink>
          </div>
          <div class="flex gap-2">
            <div class="hidden md:flex w-full gap-4 text-sm text-black ">
              <div class="flex items-center gap-3">
                <LocaleSwitcher/>
              </div>
              <div class="gap-10 flex items-center justify-between w-max">
                <div v-if="user.result" class="flex w-max gap-5">
                  <BecomeAnArtistButton/>
                  <p v-if="token" class="flex gap-2 items-center">
                    <WalletIcon class="h-5 w-5"/>
                    <p>{{ $t("header.balance") }}: {{ user.result.data.app_user_balance }}</p>
                  </p>
                </div>
                <div v-else class="flex gap-10 items-center">
                  <p
                      class="flex cursor-pointer gap-2 items-center px-4 py-2 rounded-full border border-[#E3E3E3]"
                      @click="modals.showModal('LoginModal')">
                    {{ $t("header.becomeAnArtist") }}
                  </p>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <NotificationsButton class="hidden md:block"/>
              <NuxtLink v-if="token" :to="localePath('/wishlist')" class="hidden md:block p-3 relative cart">
                <div v-if="user.result">
                  <div v-if="user.result.data.whishlist_count !== 0"
                       class="w-5 h-5 bg-red-500 rounded-full absolute right-0 -translate-y-1/2 -translate-x-1/5 flex items-center justify-center text-white">
                    {{ user.result.data.whishlist_count }}
                  </div>
                </div>
                <HeartIcon class="h-5 w-5"/>
              </NuxtLink>
              <NuxtLink v-if="token" :to="localePath('/cart')" class="hidden md:block p-3 relative cart">
                <div v-if="user.result">
                  <div v-if="user.result.data.basket_item_count !== 0"
                       class="w-5 h-5 bg-red-500 rounded-full absolute right-0 -translate-y-1/2 -translate-x-1/5 flex items-center justify-center text-white">
                    {{ user.result.data.basket_item_count }}
                  </div>
                </div>
                <ShoppingBagIcon class="h-5 w-5"/>
              </NuxtLink>

              <div class="flex items-center gap-4">
                <div class="flex md:hidden items-center">
                  <NuxtLink v-if="token" :to="localePath('/wishlist')"
                            class="block md:hidden p-3 relative cart">
                    <div v-if="user.result">
                      <div v-if="user.result.data.whishlist_count !== 0"
                           class="w-5 h-5 bg-red-500 rounded-full absolute right-0 -translate-y-1/2 -translate-x-1/5 flex items-center justify-center text-white">
                        {{ user.result.data.whishlist_count }}
                      </div>
                    </div>
                    <HeartIcon class=" w-5 h-5"/>
                  </NuxtLink>
                  <NotificationsButton/>
                  <NuxtLink v-if="token" :to="localePath('/cart')" class="block p-3 relative cart">
                    <div v-if="user.result">
                      <div v-if="user.result.data.basket_item_count !== 0"
                           class="w-5 h-5 bg-red-500 rounded-full absolute right-0 -translate-y-1/2 -translate-x-1/5 flex items-center justify-center text-white">
                        {{ user.result.data.basket_item_count }}
                      </div>
                    </div>
                    <ShoppingBagIcon class="h-5 w-5"/>
                  </NuxtLink>
                </div>
                <div v-if="user.result" class="dropdown dropdown-end w-max">
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
                        <div class="py-1">
                          <MenuItem v-slot="{ active }">
                            <NuxtLink

                                :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']"
                                :to="localePath('/profile')">
                              {{ $t("header.myProfile") }}
                            </NuxtLink>
                          </MenuItem>
                          <MenuItem v-slot="{ active }">
                            <NuxtLink

                                :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']"
                                :to="localePath('/profile/orders')">
                              {{ $t("header.orders") }}
                            </NuxtLink>
                          </MenuItem>
                        </div>
                        <div class="py-1">
                          <MenuItem v-slot="{ active }">
                            <NuxtLink
                                :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']"
                                :to="localePath('/profile/commissions')">
                              {{ $t("profile.links.commissions") }}
                            </NuxtLink>
                          </MenuItem>
                          <MenuItem v-slot="{ active }">
                            <NuxtLink
                                :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']"
                                :to="localePath('/profile/buy-gift-card')">
                              {{ $t("giftCard.title") }}
                            </NuxtLink>
                          </MenuItem>
                        </div>
                        <div v-if="!user.result.data.app_user_is_artist" class="py-1">
                          <MenuItem v-slot="{ active }">
                            <NuxtLink
                                v-if="token && user.result.data.app_user_is_artist === true && user.result.data.artist_profile_is_verified === true"
                                :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']"
                                :to="localePath('/artistProfile')">
                              {{ $t("header.artistProfile") }}
                            </NuxtLink>
                            <div
                                v-else-if="token && user.result.data.app_user_is_artist === true && user.result.data.artist_profile_is_verified === false"
                                :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']"
                                @click="toasts.showToast('success', 'Your account is on verification', 'Please wait until we check your information');">
                              {{ $t("header.verifyingProfile") }}
                            </div>
                            <NuxtLink
                                v-else-if="token && user.result.data.app_user_is_artist === false && user.result.data.artist_profile_is_verified === false"
                                :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']"
                                :to="localePath('/artistRegistration')">
                              {{ $t("header.becomeAnArtist") }}
                            </NuxtLink>
                          </MenuItem>
                        </div>
                        <div class="py-1">
                          <MenuItem v-slot="{ active }">
                            <NuxtLink

                                :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']"
                                :to="localePath('/help')">
                              {{ $t("header.helpCenter") }}
                            </NuxtLink>
                          </MenuItem>
                        </div>
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
                <div v-else class="flex gap-2 md:gap-4 text-xs md:text-base">
                  <Base-button
                      class="py-2 px-4 !font-normal"
                      variant=""
                      @click="modals.showModal('LoginModal')">
                    {{ $t("header.login") }}
                  </Base-button>
                  <Base-button
                      class="py-2 px-4 md:px-6"
                      @click="modals.showModal('RegistrationModal')">
                    {{ $t("header.registration") }}
                  </Base-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="container mx-auto px-4 md:px-0">
        <div class="hidden md:flex items-center mt-4 links_nav">
          <div v-for="(item, index) of links" :key="index">
            <NuxtLink v-if="item.children.length === 0 && item.requiresAuth === false" :class="{ 'ml-0': index === 0 }"
                      :to="localePath(item.link)"
                      class="mx-5 relative  block text-base ">
              {{ item.title }}
            </NuxtLink>
            <NuxtLink
                v-else-if="item.children.length === 0 && item.requiresAuth === true && token"
                :class="{ 'ml-0': index === 0 }"
                :to="localePath(item.link)"
                class="mx-5 relative  block text-base ">
              {{ item.title }}
            </NuxtLink>
            <button
                v-else-if="item.children.length === 0 && item.requiresAuth === true && !token"
                :class="{ 'ml-0': index === 0 }"
                class="mx-5 relative  block text-base "
                @click="modals.showModal('LoginModal')">
              {{ item.title }}
            </button>
            <div v-else>
              <client-only>
                <Menu as="div" class="relative inline-block text-left">
                  <div>
                    <MenuButton
                        class="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-gray-900">
                      {{ item.title }}
                      <ChevronDownIcon aria-hidden="true" class="-mr-1 h-5 w-5 text-gray-400"/>
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
                      <div class="py-1">
                        <MenuItem v-for="(it, ind) of item.children" :key="ind" v-slot="{ active }">
                          <NuxtLink
                              :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']"
                              :to="localePath(it.link)">
                            {{ it.title }}
                          </NuxtLink>
                        </MenuItem>
                      </div>
                    </MenuItems>
                  </transition>
                </Menu>
              </client-only>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <TransitionRoot :show="open" as="template">
    <Dialog class="relative z-10" @close="open = false">
      <TransitionChild as="template" enter="ease-in-out duration-500" enter-from="opacity-0" enter-to="opacity-100"
                       leave="ease-in-out duration-500" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
      </TransitionChild>

      <div class="fixed inset-0 overflow-hidden">
        <div class="absolute inset-0 overflow-hidden">
          <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <TransitionChild as="template" enter="transform transition ease-in-out duration-500 sm:duration-700"
                             enter-from="translate-x-full" enter-to="translate-x-0"
                             leave="transform transition ease-in-out duration-500 sm:duration-700"
                             leave-from="translate-x-0" leave-to="translate-x-full">
              <DialogPanel class="pointer-events-auto relative w-screen max-w-md">
                <TransitionChild as="template" enter="ease-in-out duration-500" enter-from="opacity-0"
                                 enter-to="opacity-100" leave="ease-in-out duration-500" leave-from="opacity-100"
                                 leave-to="opacity-0">
                  <div class="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
                    <button
                        class="relative rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                        type="button"
                        @click="open = false">
                      <span class="absolute -inset-2.5"/>
                      <span class="sr-only">Close panel</span>
                      <XMarkIcon aria-hidden="true" class="h-6 w-6"/>
                    </button>
                  </div>
                </TransitionChild>
                <div class="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                  <div class="relative flex-1 px-4 sm:px-6">
                    <div class="w-full text-base-content flex flex-col justify-between relative">
                      <div>
                        <NuxtLink :to="localePath('/')" class="!no-underline mb-10 block">
                          <div class="flex items-center gap-3">
                            <img alt="Logo" class="h-7 min-h-7 w-auto "
                                 src="@/assets/img/logos/BuyerHorBlack.svg"/>
                          </div>
                        </NuxtLink>
                        <div>
                          <div v-if="user.result">
                            <NuxtLink
                                :to="localePath('/profile')"
                                class="flex items-center gap-2"
                                @click="menubarState = false">
                              <img
                                  v-if="user.result.data.params.photo"
                                  :src="runtimeConfig.public.ENDPOINTS_LINK + user.result.data.params.photo.thumb"
                                  alt=""
                                  class="w-10 h-10 rounded-full block"
                              />
                              <p class=" whitespace-nowrap">
                                {{ $t("header.myProfile") }}
                              </p>
                            </NuxtLink>
                          </div>
                          <div v-else-if="user.result === null">
                            <div class="skeleton w-10 h-2"/>
                          </div>
                          <div v-else class="flex gap-3 mb-6">
                            <Base-button
                                class="py-[6px] px-4 w-full"
                                @click="modals.showModal('LoginModal')">
                              {{ $t("header.registration") }}
                            </Base-button>
                            <Base-button
                                class="py-[6px] px-4 w-full"
                                variant="outlined"
                                @click="modals.showModal('RegistrationModal')">
                              {{ $t("header.login") }}
                            </Base-button>
                          </div>
                        </div>
                        <div class="my-6">
                          <NuxtLink
                              v-if="token"
                              :to="localePath('/cart')"
                              class="relative cart"
                              @click="menubarState = false">
                            <div v-if="user.result">
                              <div v-if="user.result.data.basket_item_count !== 0"
                                   class="w-5 h-5 bg-red-500 rounded-full absolute right-0 -translate-y-1/2 -translate-x-1/5 flex items-center justify-center text-white">
                                {{ user.result.data.basket_item_count }}
                              </div>
                            </div>
                            <p class="flex items-center gap-2">
                              <ShoppingBagIcon class=" w-5 h-5"/>
                              {{ $t("headers.cart.title") }}
                            </p>
                          </NuxtLink>
                        </div>
                        <div class="mb-6">
                          <NuxtLink v-if="token" :to="localePath('/wishlist')"
                                    class="relative cart"
                                    @click="menubarState = false">
                            <div v-if="user.result">
                              <div v-if="user.result.data.whishlist_count !== 0"
                                   class="w-5 h-5 bg-red-500 rounded-full absolute right-0 -translate-y-1/2 -translate-x-1/5 flex items-center justify-center text-white">
                                {{ user.result.data.whishlist_count }}
                              </div>
                            </div>
                            <p class="flex items-center gap-2">
                              <HeartIcon class=" h-5 w-5"/>
                              {{ $t("headers.wishlist.title") }}
                            </p>
                          </NuxtLink>
                        </div>
                        <hr class="mb-6"/>
                        <div class="flex flex-col gap-6">
                          <div v-for="(item, index) of links" :key="index">
                            <NuxtLink v-if="item.children.length === 0 && item.requiresAuth === false"
                                      :class="{ 'ml-0': index === 0 }"
                                      :to="localePath(item.link)"
                                      class="relative  block text-base ">
                              {{ item.title }}
                            </NuxtLink>
                            <NuxtLink
                                v-else-if="item.children.length === 0 && item.requiresAuth === true && token"
                                :class="{ 'ml-0': index === 0 }"
                                :to="localePath(item.link)"
                                class="relative  block text-base "
                                @click="open = false">
                              {{ item.title }}
                            </NuxtLink>
                            <button
                                v-else-if="item.children.length === 0 && item.requiresAuth === true && !token"
                                :class="{ 'ml-0': index === 0 }" class="relative  block text-base "
                                @click="modals.showModal('LoginModal')">
                              {{ item.title }}
                            </button>
                            <Menu v-else as="div" class="relative inline-block text-left">
                              <div>
                                <MenuButton
                                    class="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white text-gray-900">
                                  {{ item.title }}
                                  <ChevronDownIcon aria-hidden="true" class="-mr-1 h-5 w-5 text-gray-400"/>
                                </MenuButton>
                              </div>

                              <transition enter-active-class="transition ease-out duration-100"
                                          enter-from-class="transform opacity-0 scale-95"
                                          enter-to-class="transform opacity-100 scale-100"
                                          leave-active-class="transition ease-in duration-75"
                                          leave-from-class="transform opacity-100 scale-100"
                                          leave-to-class="transform opacity-0 scale-95">
                                <MenuItems
                                    class="absolute left-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                  <div class="py-1">
                                    <MenuItem
                                        v-for="(it, ind) of item.children"
                                        :key="ind" v-slot="{ active }"
                                        @click="open = false">
                                      <NuxtLink
                                          :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']"
                                          :to="localePath(it.link)">
                                        {{ it.title }}
                                      </NuxtLink>
                                    </MenuItem>
                                  </div>
                                </MenuItems>
                              </transition>
                            </Menu>
                          </div>
                        </div>
                        <hr class="my-6"/>
                        <div v-if="user.result" class="flex flex-col w-full gap-3 mb-5">
                          <BecomeAnArtistButton/>
                          <p v-if="token" class="flex gap-2 items-center">
                            <WalletIcon class="w-5 h-5"/>
                            <p>{{ $t("header.balance") }}: {{ user.result.data.app_user_balance }}</p>
                          </p>
                        </div>
                      </div>
                      <div class="text-sm ">
                        <div
                            v-if="user.result"
                            class="hidden md:flex gap-10 items-center">
                          <BecomeAnArtistButton/>
                          <p
                              class="flex cursor-pointer gap-2 items-center px-4 py-2 rounded-full border border-[#E3E3E3]"
                              @click="modals.showModal('LoginModal')">
                            {{ $t("header.becomeAnArtist") }}
                          </p>
                          <NuxtLink :to="localePath('/help')">
                            {{ $t("header.inner_header_links.help") }}
                          </NuxtLink>
                          <p
                              v-if="token"
                              class="flex gap-2 items-center">
                            <WalletIcon class="w-5 h-5"/>
                            {{ $t("header.balance") }}: {{ user.result.data.app_user_balance }}
                          </p>
                        </div>
                        <NuxtLink :to="localePath('/help')" class="block mb-3">
                          {{ $t("header.inner_header_links.help") }}
                        </NuxtLink>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
  <div
      v-if="!token"
      class="bg-[#F7F7F7]">
    <div class="container mx-auto">
      <div class="flex items-center gap-2 justify-center py-3">
        <p>{{ $t('discount.title') }}</p>
        <p
            @click="modals.showModal('LoginModal')"
            class="text-[#0317CC] underline hover:no-underline cursor-pointer">
          {{ $t('discount.button') }}
        </p>
      </div>
    </div>
  </div>
</template>
