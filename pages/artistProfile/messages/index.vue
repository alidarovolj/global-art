<script setup>
import {useChatRoomStore} from "~/store/chatRoom.js";
import {useCustomOrdersStore} from "~/store/customOrders.js";

const chatRoom = useChatRoomStore();
const {result} = storeToRefs(chatRoom);

const customOrders = useCustomOrdersStore();
const {resultMyCusOrders} = storeToRefs(customOrders);

const pickedOrder = ref(null);

const route = useRoute();
const router = useRouter();

const requestBody = ref({
  page_number: 1,
  show_by: 10,
  chat_room_id: null,
});

const reqBody = ref({
  page_number: 1,
  show_by: 10,
  custom_order_app_user_ids: [],
  custom_order_artist_ids: [],
  custom_order_art_category_ids: [],
  custom_order_status_ids: [],
  is_paid: null,
  created_at_from: null,
  created_at_to: null,
  updated_at_from: null,
  updated_at_to: null,
});

const isMessageShown = ref(true);

const showMessage = async (id) => {
  requestBody.value.chat_room_id = id;
  await router.push({query: {id}});
  await chatRoom.getChatRoomList(requestBody.value);
};
const {t} = useI18n();

onMounted(async () => {
  await nextTick();
  await customOrders.getMyCustomOrders(reqBody.value);
  if (
      resultMyCusOrders.value &&
      resultMyCusOrders.value.data &&
      resultMyCusOrders.value.data.objects_list &&
      route.query.id
  ) {
    pickedOrder.value = resultMyCusOrders.value.data.objects_list.find(
        (item) =>
            String(item.custom_order_chat_room_id) === String(route.query.id),
    );
    requestBody.value.chat_room_id = route.query.id;
  } else {
    console.log("Either resultMyCusOrders or route.query.id is undefined");
  }
  if (route.query.id) {
    await chatRoom.getChatRoomList(requestBody.value);
  } else {
    result.value = null;
  }
});

watch(
    () => route.query.id,
    async (id) => {
      if (
          resultMyCusOrders.value &&
          resultMyCusOrders.value.data &&
          resultMyCusOrders.value.data.objects_list &&
          id
      ) {
        pickedOrder.value = resultMyCusOrders.value.data.objects_list.find(
            (item) => String(item.custom_order_chat_room_id) === String(id),
        );
        requestBody.value.chat_room_id = id;
      } else {
        console.log("Either resultMyCusOrders or route.query.id is undefined");
      }
    },
);

useHead({
  title: t("headers.artist_profile.pages.messages.title"),
  meta: [
    {
      property: "description",
      content: t("headers.artist_profile.pages.messages.description"),
    },
    {
      property: "og:description",
      content: t("headers.artist_profile.pages.messages.description"),
    },
    {
      property: "og:title",
      content: t("headers.artist_profile.pages.messages.title"),
    },
    {
      property: "og:url",
      content: t("headers.artist_profile.pages.messages.og_url"),
    },
  ],
  link: [
    {
      rel: "canonical",
      href: t("headers.artist_profile.pages.messages.canonical"),
    },
  ],
});
</script>

<template>
  <div>

    <div class="block md:flex border-l border-r w-full h-full">
      <div
          :class="{ 'w-full md:!w-1/4 md:pr-4': isMessageShown }"
          class="p-5 h-full w-full overflow-y-auto"
      >
        <div class="flex md:flex-row flex-col gap-2 justify-between">
          <h1 class="text-3xl md:text-5xl font-bold  mb-5">
            {{ $t("artistProfile.message.title") }}
          </h1>
        </div>
        <div v-if="resultMyCusOrders">
          <div
              v-for="(item, index) of resultMyCusOrders.data.objects_list"
              :key="index"
              :class="{
              'hidden md:block':
                requestBody.chat_room_id === item.custom_order_chat_room_id,
            }"
              @click="showMessage(item.custom_order_chat_room_id)"
          >
            <MessageItem
                :element="item"
                :is-message-shown="parseInt(route.query.id)"
                type="artist"
            />
          </div>
        </div>
        <div v-else class="h-full overflow-y-auto">
          <div
              v-for="(item, index) of 10"
              class="flex items-start gap-2 cursor-pointer  py-4 px-6"
          >
            <div
                class="rounded-full bg-[#01188E33] w-10 min-w-10 min-h-10 h-10 relative"
            >
              <p
                  class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              />
            </div>
            <div class="w-full">
              <div class="w-full flex items-center gap-2 mb-2">
                <div class="h-2 skeleton w-10"/>
                <div class="text-sm text-secondaryText">
                  <div class="h-2 skeleton w-20"/>
                </div>
              </div>
              <div class="mb-3">
                <div class="font-bold text-primaryText ">
                  <div class="h-2 skeleton w-full"/>
                </div>
              </div>
              <div
                  class="py-1 px-3 rounded-lg capitalize w-max  font-bold bg-[#EDE4F6] text-[#48058B]"
              >
                <div class="h-2 skeleton w-10"/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="isMessageShown && result" class="w-full md:w-3/4">
        <div class="px-4 md:px-0 w-full md:border-l h-full py-5">
          <div :class="{ 'hidden md:block': !isMessageShown }">
            <MessageBlock
                :all-messages="result.data.objects_list"
                :element="pickedOrder"
                type="artist"
                @show-message="() => (isMessageShown = !isMessageShown)"
            />
          </div>
        </div>
      </div>
      <div v-else class="w-full md:w-3/4 h-full overflow-y-auto">
        <div
            v-for="(item, index) of 10"
            :key="index"
            :class="{ 'justify-end' : index % 2 === 0 }"
            class="flex items-start gap-2 cursor-pointer py-4 px-6 w-full"
        >
          <div
              class="rounded-full bg-[#01188E33] w-10 min-w-10 min-h-10 h-10 relative"
          >
            <p
                class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            />
          </div>
          <div class="w-full">
            <div class="w-full flex items-center gap-2 mb-2">
              <div class="h-2 skeleton w-10"/>
              <div class="text-sm text-secondaryText">
                <div class="h-2 skeleton w-20"/>
              </div>
            </div>
            <div class="mb-3">
              <div class="font-bold text-primaryText ">
                <div class="h-2 skeleton w-full"/>
              </div>
            </div>
            <div
                class="py-1 px-3 rounded-lg capitalize w-max  font-bold bg-[#EDE4F6] text-[#48058B]"
            >
              <div class="h-2 skeleton w-10"/>
            </div>
          </div>
        </div>
      </div>
      <div
          v-if="!result && !route.query.id"
          class="container mx-auto px-4 md:px-0 w-full md:border-l h-full py-5 flex items-center justify-center"
      >
        <div class="w-full flex flex-col">
          <div class="w-full">
            <div class="w-full">
              <div
                  class="flex items-center justify-between md:px-6 pb-6 border-b"
              >
                <div class="flex items-center">
                  <div class="flex items-center gap-2">
                    <div
                        class="rounded-full bg-[#01188E33] w-10 min-w-10 min-h-10 h-10 relative"
                    >
                      <div
                          class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                      >
                        <div class="h-2 skeleton w-full"/>
                      </div>
                    </div>
                    <div
                        class="font-bold text-primaryText  w-full"
                    >
                      <div class="h-2 skeleton w-full"/>
                    </div>
                  </div>
                </div>
              </div>
              <div
                  class="flex items-center justify-between py-4 px-6 border-b "
              >
                <div class="flex gap-2 w-full">
                  <div class="min-w-10 w-10 h-10 rounded-full skeleton"/>
                  <div class="text-sm text-primaryText  w-full">
                    <div class="mb-3 h-2 skeleton w-10"/>
                    <div class="font-bold">
                      <div class="h-2 skeleton w-20"/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="py-4 px-6 h-[600px] overflow-y-auto">
              <div
                  v-for="(item, index) of 10"
                  :key="index"
                  class="flex items-start gap-2 mb-8"
              >
                <div
                    class="rounded-full bg-[#01188E33] w-10 min-w-10 min-h-10 h-10 relative"
                >
                  <div
                      class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                  >
                    <div class="h-2 skeleton w-full"/>
                  </div>
                </div>
                <div class="w-full">
                  <div class="flex gap-1 items-center mb-2">
                    <div class="font-bold text-sm w-10">
                      <div class="h-2 skeleton w-full"/>
                    </div>
                    <div class="text-xs w-20">
                      <div class="h-2 skeleton w-full"/>
                    </div>
                  </div>
                  <div class="text-sm w-full">
                    <div class="h-2 skeleton w-full mb-1"/>
                    <div class="h-2 skeleton w-full"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="py-4 px-6">
            <div class="flex items-center gap-7 w-full">
              <div class="skeleton min-w-10 w-10 h-10 rounded-full"/>
              <div class="skeleton w-full h-10 rounded-full"/>
              <div class="skeleton min-w-10 w-10 h-10 rounded-full"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
