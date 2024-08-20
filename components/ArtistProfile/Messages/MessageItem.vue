<script setup>
const props = defineProps(["isMessageShown", "element", 'type']);
</script>

<template>
  <div
      :class="{
      '!bg-[#F7F7F7]  ':
        isMessageShown === element.custom_order_chat_room_id,
    }"
      class="py-4 px-6 bg-white flex items-start gap-2 cursor-pointer "
  >
    <div
        class="rounded-full bg-[#01188E33] w-10 min-w-10 min-h-10 h-10 relative"
    >
      <p v-if="type !== 'artist'" class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {{
          element.custom_order_artist.artist_base_info.last_name[0]
        }}{{ element.custom_order_artist.artist_base_info.first_name[0] }}
      </p>
      <p v-else class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {{ element.custom_order_app_user.app_user_full_name[0] }}
      </p>
    </div>
    <div class="w-full">
      <div class="flex items-center justify-between">
        <p v-if="type !== 'artist'">
          {{ element.custom_order_artist.artist_base_info.last_name }}
          {{ element.custom_order_artist.artist_base_info.first_name }}
        </p>
        <p v-else>
          {{ element.custom_order_app_user.app_user_full_name }}
        </p>
        <p class="text-sm text-secondaryText">11:46</p>
      </div>
      <div class="mb-3">
        <p
            :class="{
            '':
              isMessageShown === element.custom_order_chat_room_id,
          }"
            class="font-bold text-primaryText "
        >
          {{ element.custom_order_art_category.art_category_title }}
        </p>
      </div>
      <p
          :class="[
          {
            'bg-[#EDE4F6] text-[#48058B]':
              element.custom_order_status.alias === 'new',
          },
          {
            'bg-orange-200 text-orange-500':
              element.custom_order_status.alias === 'on-review',
          },
          {
            'bg-blue-200 text-blue-500':
              element.custom_order_status.alias === 'pricing',
          },
          {
            'bg-cyan-200 text-cyan-500':
              element.custom_order_status.alias === 'waiting-for-payment',
          },
          {
            'bg-green-200 text-green-500':
              element.custom_order_status.alias === 'paid',
          },
          {
            'bg-slate-200 text-slate-500':
              element.custom_order_status.alias === 'in-process',
          },
          {
            'bg-yellow-200 text-yellow-500':
              element.custom_order_status.alias === 'waiting-for-delivery',
          },
          {
            'bg-green-200 text-green-500':
              element.custom_order_status.alias === 'completed',
          },
        ]"
          class="py-1 px-3 rounded-lg capitalize w-max  font-bold"
      >
        {{ element.custom_order_status.title }}
      </p>
    </div>
  </div>
</template>
