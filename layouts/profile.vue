<script setup>
import {Dialog, DialogPanel, TransitionChild, TransitionRoot,} from '@headlessui/vue'
import {
  Bars3Icon,
  CheckIcon,
  FolderIcon,
  GiftIcon,
  HomeIcon,
  InformationCircleIcon,
  MapPinIcon,
  PaintBrushIcon,
  PencilIcon,
  UserGroupIcon,
  UserIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

const sidebarOpen = ref(false)

const localePath = useLocalePath();
const route = useRoute()
const {t} = useI18n();

const links = computed(() => [
  {
    title: t("profile.links.dashboard"),
    link: `/profile`,
    icon: HomeIcon
  },
  {
    title: t("profile.links.commissions"),
    link: `/profile/commissions`,
    icon: FolderIcon
  },
  {
    title: t("profile.links.savedArtworks"),
    link: "/profile/saved-artworks",
    icon: PaintBrushIcon
  },
  {
    title: t("profile.links.orders"),
    link: "/profile/orders",
    icon: CheckIcon
  },
  {
    title: t("profile.links.followingArtists"),
    link: "/profile/following-artists",
    icon: UserGroupIcon
  },
  {
    title: t("profile.links.reviews"),
    link: "/profile/review",
    icon: PencilIcon
  },
  {
    title: t("profile.links.giftCard"),
    link: "/profile/buy-gift-card",
    icon: GiftIcon
  },
]);

const settingLinks = computed(() => [
  {
    title: t("profile.settingLinks.profile"),
    link: "/profile/profile",
    icon: UserIcon
  },
  {
    title: t("profile.settingLinks.addressBook"),
    link: "/profile/addresses",
    icon: MapPinIcon
  },
  {
    title: t("profile.settingLinks.help"),
    link: "/help",
    icon: InformationCircleIcon
  },
]);
</script>

<template>
  <div>
    <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 w-full">
      <Header/>
    </div>
    <div class="block lg:flex container mx-auto px-0">
      <TransitionRoot v-if="!route.fullPath.includes('profile/commissions/messages')" :show="sidebarOpen" as="template">
        <Dialog class="relative lg:hidden" @close="sidebarOpen = false">
          <TransitionChild as="template" enter="transition-opacity ease-linear duration-300" enter-from="opacity-0"
                           enter-to="opacity-100" leave="transition-opacity ease-linear duration-300"
                           leave-from="opacity-100" leave-to="opacity-0">
            <div class="fixed inset-0 bg-gray-900/80"/>
          </TransitionChild>

          <div class="fixed inset-0 flex">
            <TransitionChild as="template" enter="transition ease-in-out duration-300 transform"
                             enter-from="-translate-x-full" enter-to="translate-x-0"
                             leave="transition ease-in-out duration-300 transform" leave-from="translate-x-0"
                             leave-to="-translate-x-full">
              <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
                <TransitionChild as="template" enter="ease-in-out duration-300" enter-from="opacity-0"
                                 enter-to="opacity-100" leave="ease-in-out duration-300" leave-from="opacity-100"
                                 leave-to="opacity-0">
                  <div class="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button class="-m-2.5 p-2.5" type="button" @click="sidebarOpen = false">
                      <span class="sr-only">Close sidebar</span>
                      <XMarkIcon aria-hidden="true" class="h-6 w-6 text-white"/>
                    </button>
                  </div>
                </TransitionChild>

                <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2">
                  <div class="flex h-16 shrink-0 items-center">
                    <img alt="Logo" class="h-7 min-h-7 w-auto "
                         src="@/assets/img/logos/BuyerHorBlack.svg"/>
                  </div>
                  <nav class="flex flex-1 flex-col sticky top-5">
                    <ul class="flex flex-1 flex-col gap-y-7" role="list">
                      <li>
                        <div class="text-xs font-semibold leading-6 text-gray-400">
                          {{ $t('profile.links.title') }}
                        </div>
                        <ul class=" space-y-1" role="list">
                          <li v-for="(item, index) of links" :key="index">
                            <NuxtLink
                                :class="[localePath(item.link) === route.fullPath ? 'bg-gray-50 font-semibold' : 'text-gray-700 hover:bg-gray-50600', 'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6']"
                                :to="localePath(item.link)"
                                @click="sidebarOpen = false">
                              <component :is="item.icon"
                                         :class="[localePath(item.link) === route.fullPath ? 'bg-gray-50 font-semibold' : 'text-gray-400', 'h-6 w-6 shrink-0']"
                                         aria-hidden="true"/>
                              {{ item.title }}
                            </NuxtLink>
                          </li>
                        </ul>
                      </li>
                      <li>
                        <ul class=" space-y-1" role="list">
                          <div class="text-xs font-semibold leading-6 text-gray-400">
                            {{ $t('profile.settingLinks.title') }}
                          </div>
                          <li v-for="(item, index) of settingLinks" :key="index">
                            <NuxtLink
                                :class="[localePath(item.link) === route.fullPath ? 'bg-gray-50 font-semibold' : 'text-gray-700 hover:bg-gray-50', 'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6']"
                                :to="localePath(item.link)"
                                @click="sidebarOpen = false">
                              <component :is="item.icon"
                                         :class="[localePath(item.link) === route.fullPath ? 'bg-gray-50 font-semibold' : 'text-gray-400', 'h-6 w-6 shrink-0']"
                                         aria-hidden="true"/>
                              {{ item.title }}
                            </NuxtLink>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </nav>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </TransitionRoot>

      <div v-if="!route.fullPath.includes('profile/commissions/messages')"
           class="hidden lg:relative lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">

        <div class="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white pr-6 pt-10">
          <nav class="flex flex-1 flex-col">
            <ul class="flex flex-1 flex-col gap-y-7" role="list">
              <li>
                <div class="text-xs font-semibold leading-6 text-gray-400">
                  {{ $t('profile.links.title') }}
                </div>
                <ul class=" space-y-1" role="list">
                  <li v-for="(item, index) of links" :key="index">
                    <NuxtLink
                        :class="[localePath(item.link) === route.fullPath ? 'bg-gray-50 font-semibold' : 'text-gray-700 hover:bg-gray-50', 'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6']"
                        :to="localePath(item.link)">
                      <component
                          :is="item.icon"
                          :class="[localePath(item.link) === route.fullPath ? 'bg-gray-50 font-semibold' : 'text-gray-400', 'h-6 w-6 shrink-0']"
                          aria-hidden="true"
                      />
                      {{ item.title }}
                    </NuxtLink>
                  </li>
                </ul>
              </li>
              <li>
                <ul class=" space-y-1" role="list">
                  <div class="text-xs font-semibold leading-6 text-gray-400">
                    {{ $t('profile.settingLinks.title') }}
                  </div>
                  <li
                      v-for="(item, index) of settingLinks"
                      :key="index">
                    <NuxtLink
                        :class="[localePath(item.link) === route.fullPath ? 'bg-gray-50 font-semibold' : 'text-gray-700 hover:bg-gray-50', 'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6']"
                        :to="localePath(item.link)">
                      <component
                          :is="item.icon"
                          :class="[localePath(item.link) === route.fullPath ? 'bg-gray-50 font-semibold' : 'text-gray-400', 'h-6 w-6 shrink-0']"
                          aria-hidden="true"
                      />
                      {{ item.title }}
                    </NuxtLink>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div class="w-full">
        <div
            v-if="!route.fullPath.includes('profile/commissions/messages')"
            class="w-full flex justify-between h-max shrink-0 items-center gap-x-4 bg-white shadow-sm sm:gap-x-6 py-2 md:py-0 px-4">
          <button class="-m-2.5 p-2.5 text-gray-700 lg:hidden" type="button" @click="sidebarOpen = true">
            <span class="sr-only">Open sidebar</span>
            <Bars3Icon aria-hidden="true" class="h-5 w-5 text-gray-400 block md:hidden cursor-pointer"/>
          </button>
        </div>

        <main>
          <div
              :class="{ '!px-0' : route.fullPath.includes('profile/commissions/messages') }"
              class="px-4 sm:px-6 lg:px-8">
            <div
                :class="{ '!pt-0 !pb-0' : route.fullPath.includes('profile/commissions/messages') }"
                class="pt-10 pb-[70px] ">
              <slot/>
            </div>
          </div>
          <Footer class="px-4 sm:px-6 lg:px-8"/>
        </main>
      </div>
    </div>
  </div>
</template>

