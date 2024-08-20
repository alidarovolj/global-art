<script setup>
import {Menu, MenuButton, MenuItem, MenuItems} from '@headlessui/vue';
import {BellIcon, TrashIcon} from '@heroicons/vue/24/outline';
import {useNotificationStore} from '@/store/notification'; // Assuming you have a notification store imported
import {useAuthStore} from '@/store/auth'; // Assuming you have an auth store imported
import {storeToRefs} from "pinia";

const notification = useNotificationStore();

const auth = useAuthStore();
auth.initCookieToken();
const {token} = storeToRefs(auth);

onMounted(async () => {
  await nextTick();
  if (token.value) {
    await notification.getNotificationList();
  }
});
</script>

<template>
  <div v-if="token && notification.notificationList">
    <Menu as="div" class="relative inline-block text-left">
      <div>
        <MenuButton
            class="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900"
        >
          <div
              v-if="notification.notificationList.data.length > 0"
              class="w-5 min-w-5 min-h-5 h-5 bg-red-500 rounded-full absolute right-0 -translate-y-1/2 -translate-x-1/5 flex items-center justify-center text-white text-xs"
          >
            {{ notification.notificationList.data.length }}
          </div>
          <BellIcon class="w-5 h-5"/>

        </MenuButton>
      </div>

      <transition
          enter-active-class="transition ease-out duration-100"
          enter-from-class="transform opacity-0 scale-95"
          enter-to-class="transform opacity-100 scale-100"
          leave-active-class="transition ease-in duration-75"
          leave-from-class="transform opacity-100 scale-100"
          leave-to-class="transform opacity-0 scale-95"
      >
        <MenuItems
            class=" overflow-y-auto h-[300px] absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
          <template v-if="notification.notificationList.data.length > 0">
            <MenuItem
                v-for="(item, index) in notification.notificationList.data"
                :key="index"
                v-slot="{ active }"
                as="div"
                class="flex items-start p-2">
              <NuxtLink
                  :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block text-sm']"
                  :to="item.app_user_notification_type === 'new_chat_room_message'
                  ? '/artistProfile/messages?id=' + item.params.chat_room_id
                  : '/profile/commissions/messages?id=' + item.params.chat_room_id"
              >
                <p class="mb-1">
                  <span class="text-blue-500">{{ item.params.sender.app_user_full_name }}</span>
                  отправил(-а) вам сообщение:
                </p>
                <p class="mb-1">{{ item.params.text }}</p>
                <p class="text-[#757575]">{{ formatDate(item.created_at) }}</p>
              </NuxtLink>
              <TrashIcon
                  class="hover:bg-white w-5 h-5 min-h-5 min-w-5 p-0"
                  @click="notification.removeNotification(item.id)"
              />
            </MenuItem>
          </template>
          <template v-else>
            <ul class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-full" tabindex="0">
              <li><a>{{ $t("header.noNotifications") }}</a></li>
            </ul>
          </template>
        </MenuItems>
      </transition>
    </Menu>
  </div>
</template>
