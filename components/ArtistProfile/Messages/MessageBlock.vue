<script setup>
import {CircleStackIcon, PaperAirplaneIcon, PencilIcon} from "@heroicons/vue/24/outline";
import {useLanguagesStore} from "~/store/languages.js";
import {formatDate} from "~/utils/formatDate.js";
import {useChatRoomStore} from "~/store/chatRoom.js";
import {useMessagesStore} from "~/store/messages.js";
import sentAudio from "~/assets/sounds/sent.mp3";
import receivedAudio from "~/assets/sounds/received.mp3";

const runtimeConfig = useRuntimeConfig();

const loading = ref(false);

const languages = useLanguagesStore();
const {cur_lang} = storeToRefs(languages);

const route = useRoute();

const chatRoom = useChatRoomStore();
const messages = useMessagesStore();
const {messagesArray} = storeToRefs(messages);
const modals = useModalsStore()

const scrollContainer = ref(null);

const user = useUserStore();

const emits = defineEmits(["show-message"]);

const playSentMessage = () => {
  const audio = new Audio(sentAudio); // Use the imported path
  audio.play();
};

const playReceivedMessage = () => {
  const audio = new Audio(receivedAudio); // Use the imported path
  audio.play();
};

const props = defineProps(["element", "allMessages", "type"]);

const form = ref({
  chat_room_id: null,
  text: null,
  language: cur_lang,
  images: [],
});

const requestBody = ref({
  page_number: 1,
  show_by: 10,
  chat_room_id: null,
});

onMounted(async () => {
  if (route.query) {
    form.value.chat_room_id = route.query.id;
    requestBody.value.chat_room_id = route.query.id;
  }
  await nextTick();
  scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight;
});

const sendMessage = async () => {
  loading.value = true;
  console.log("test");
  form.value.chat_room_id = route.query.id;
  requestBody.value.chat_room_id = route.query.id;
  if (form.value.text) {
    await messages.sendChatMessage(form.value);
    form.value.text = null;
    form.value.images = [];
    playSentMessage();
    await chatRoom.getChatRoomList(requestBody.value);
    await nextTick();
    scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight;
  } else {
    form.value.text = "attachment";
    await messages.sendChatMessage(form.value);
    form.value.text = null;
    form.value.images = [];
    playSentMessage();
    await chatRoom.getChatRoomList(requestBody.value);
    await nextTick();
    scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight;
  }
  loading.value = false;
};

const setStatusLocal = async (item, state) => {
  await nextTick();
  if (state === true) {
    modals.showModal("AcceptCustomOrder", item)
  } else {
    modals.showModal("DeclineCustomOrder", item)
  }
};

watch(
    () => messagesArray.value,
    async (newMessagesArray) => {
      console.log("Array length:", newMessagesArray.length);
      playReceivedMessage();
      requestBody.value.chat_room_id = route.query.id
      await chatRoom.getChatRoomList(requestBody.value);
      await nextTick();
      scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight;
    },
);

const updateParamsCall = async (item) => {
  await nextTick();
  modals.showModal('UpdateCommissionParams', item)
};

const updatePriceCall = async (item) => {
  await nextTick();
  modals.showModal('UpdateCommissionPrice', item)
};

const setPhotoChat = async (photo) => {
  form.value.images.push(photo.temp_media_token);
  await nextTick();
  await sendMessage();
};
</script>

<template>
  <div class="block md:flex h-full">
    <div class="flex flex-col w-full md:w-2/3 border-r justify-between">
      <div v-if="element" class="w-full">
        <div class="w-full">
          <div class="flex items-center justify-between md:px-6 pb-6 border-b">
            <div class="flex items-center">
              <div class="flex items-center gap-2 pt-5">
                <div class="rounded-full bg-[#01188E33] w-10 min-w-10 min-h-10 h-10 relative">
                  <p
                      v-if="type !== 'artist'"
                      class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                  >
                    {{
                      element.custom_order_artist.artist_base_info.last_name[0]
                    }}{{
                      element.custom_order_artist.artist_base_info.first_name[0]
                    }}
                  </p>
                  <p
                      v-else
                      class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    {{ element.custom_order_app_user.app_user_full_name[0] }}
                  </p>
                </div>
                <p
                    v-if="type !== 'artist'"
                    class="font-bold text-primaryText ">
                  {{ element.custom_order_artist.artist_base_info.last_name }}
                  {{ element.custom_order_artist.artist_base_info.first_name }}
                </p>
                <p
                    v-else
                    class="font-bold text-primaryText ">
                  {{ element.custom_order_app_user.app_user_full_name }}
                </p>
              </div>
            </div>
          </div>
          <div
              class="flex items-center justify-between py-4 px-6 border-b "
          >
            <div class="flex gap-2">
              <img
                  :src="
                  runtimeConfig.public.ENDPOINTS_LINK +
                  element.custom_order_reference_images[0].full
                "
                  alt=""
                  class="w-10 h-10 object-cover"
              />
              <div class="text-sm text-primaryText ">
                <p>Commission details</p>
                <p class="font-bold">
                  {{ element.custom_order_art_category.art_category_title }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div v-if="user.result" class="relative py-4 px-6">
          <div
              class="w-full py-4 px-9 text-[#757575] bg-[#F7F7F7] rounded-2xl text-center text-sm mb-8"
          >
            To protect your payment, always communicate and pay through our
            platform
          </div>
          <div ref="scrollContainer" class="h-full overflow-y-auto">
            <div
                v-for="(item, index) of allMessages.slice().reverse()"
                :key="index"
                :class="{
                'justify-end':
                  user.result.data.app_user_login ===
                  item.sender.app_user_login,
              }"
                class="mb-8 mr-0 w-full flex"
            >
              <div
                  :class="[
                  {
                    'chat-bubble chat-bubble-info p-3 rounded-md !bg-opacity-20':
                      user.result.data.app_user_login ===
                      item.sender.app_user_login,
                  },
                  {
                    'chat-bubble chat-bubble-accent p-3 rounded-md !bg-opacity-20 bg-yellow-500':
                      user.result.data.app_user_login !==
                      item.sender.app_user_login,
                  },
                ]"
                  class="flex gap-2 w-max"
              >
                <div
                    class="rounded-full bg-[#01188E33] w-10 min-w-10 min-h-10 h-10 relative"
                >
                  <p
                      class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                  >
                    {{ item.sender.app_user_full_name[0] }}
                  </p>
                </div>
                <div>
                  <div class="flex gap-1 items-center">
                    <p class="font-bold text-sm">
                      {{ item.sender.app_user_full_name }}
                    </p>
                    <p class="text-xs">
                      {{ formatDate(item.created_at) }}
                    </p>
                  </div>
                  <div v-if="item.images.length > 0" class="h-[200px] w-auto">
<!--                    <img-->
<!--                        :src="-->
<!--                        runtimeConfig.public.ENDPOINTS_LINK +-->
<!--                        item.images[0].full-->
<!--                      "-->
<!--                        alt=""-->
<!--                        class="h-full w-auto object-cover rounded-lg"-->
<!--                    />-->
                    <ExpandableImage
                        :src="runtimeConfig.public.ENDPOINTS_LINK + item.images[0].full"
                        :title="item.images[0].full"
                        alt="Message"
                        class="h-full w-auto object-cover rounded-lg"
                    />
                  </div>
                  <p v-if="item.text !== 'attachment'" class="text-sm">
                    {{ item.translations[cur_lang] }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="py-4 px-6">
        <form
            class="flex items-center gap-7 w-full"
            @submit.prevent="sendMessage"
        >
          <UploadPhoto
              :button_type="true"
              :only_icon="true"
              :preview="false"
              @receive-photo="setPhotoChat"
          />
          <input
              v-model="form.text"
              class="px-4 py-2.5 border w-full rounded-lg"
              placeholder="Write text here..."
              type="text"
          />
          <button
              v-if="!loading"
              class="p-3 bg-[#F5F5F5] text-primaryText rounded-full"
              type="submit"
          >
            <PaperAirplaneIcon class="w-5 h-5"/>
          </button>
          <div v-else class="p-3 bg-[#F5F5F5] text-primaryText rounded-full">
            <div class="spinner"/>
          </div>
        </form>
      </div>
    </div>
    <div class="hidden md:flex flex-col w-full md:w-1/3 h-full">
      <div v-if="element" class="w-full h-full flex flex-col">
        <div class="px-6 pb-6 border-b text-xl font-bold  pt-5">
          <p class="h-10 min-h-10">Commission details</p>
          <div
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
              class="py-1 px-3 rounded-lg capitalize w-max  text-base"
          >
            {{ element.custom_order_status.title }}
          </div>
        </div>
        <div class="px-6 py-10 text-sm">
          <div
              v-if="
              element.custom_order_status.alias === 'new' &&
              route.fullPath.includes('/artistProfile')
            "
          >
            <p class="font-bold mb-2">
              {{ $t("artistProfile.comission.decision") }}
            </p>
            <p class="mb-4">
              {{ $t("artistProfile.comission.discussDetails") }}
            </p>
            <div class="block">
              <p
                  class="w-full mb-3 text-center py-3 px-6 border border-green-500 text-green-500 rounded-full cursor-pointer hover:bg-green-500 hover:text-white"
                  @click="setStatusLocal(element, true)"
              >
                {{ $t("artistProfile.comission.acceptCommission") }}
              </p>
              <p
                  class="w-full mb-3 text-center py-3 px-6 border border-red-500 text-red-500 rounded-full cursor-pointer hover:bg-red-500 hover:text-white"
                  @click="setStatusLocal(element, false)"
              >
                {{ $t("artistProfile.comission.decline") }}
              </p>
            </div>
          </div>
          <div class="mb-4">
            <p class="font-bold mb-2">Timeline:</p>
            <p>
              Requested by user: {{ element.custom_order_execution_days }} days
            </p>
            <p v-if="element.custom_order_final_execution_days">
              Final: {{ element.custom_order_final_execution_days }} days
            </p>
          </div>
          <div v-if="element.custom_order_price" class="mb-4">
            <p class="font-bold mb-2">Price:</p>
            <p>${{ element.custom_order_price }}</p>
          </div>
          <div class="mb-4">
            <p class="font-bold mb-2">Budget:</p>
            <p>${{ element.custom_order_budget }}</p>
          </div>
          <div class="pb-4 border-b mb-4">
            <div :class="{ 'mb-4' : element.custom_order_final_dimensions.length > 0 }">
              <p class="font-bold mb-2">Size:</p>
              <p>
              <span class="text-sm text-[#757575]"
              >{{ element.custom_order_dimensions.width }}x{{
                  element.custom_order_dimensions.height
                }}x{{ element.custom_order_dimensions.length }} ({{
                  element.custom_order_dimensions.weight
                }}kg)</span
              >
              </p>
            </div>
            <div
                v-if="element.custom_order_final_dimensions.length > 0"
                class="mb-4"
            >
              <p class="font-bold mb-2">Final size:</p>
              <p class="text-sm text-[#757575]">
                {{ element.custom_order_dimensions.width }}x{{
                  element.custom_order_dimensions.height
                }}x{{ element.custom_order_dimensions.length }} ({{
                  element.custom_order_dimensions.weight
                }}kg)
              </p>
            </div>
          </div>
          <div class="mb-4">
            <p class="font-bold mb-2">Media:</p>
            <div class="flex flex-wrap">
              <div
                  v-for="(image, index) in element.custom_order_reference_images"
                  :key="index"
                  class="w-full md:w-1/2"
              >
                <ExpandableImage
                    :src="runtimeConfig.public.ENDPOINTS_LINK + image.full"
                    alt="Media"
                    class="w-full h-full image-zoom"
                />
              </div>
            </div>
          </div>
          <div class="mb-4">
            <p class="font-bold mb-2">Category:</p>
            <p>{{ element.custom_order_art_category.translations[cur_lang].art_category_title }}</p>
          </div>
          <div class="mb-4">
            <p class="font-bold mb-2">Styles:</p>
            <div class="flex flex-wrap">
              <p
                  v-for="(item, index) of element.custom_order_reference_art_styles"
                  :key="index"
              >
                {{ item.translations[cur_lang].title }} <span
                  v-if="index + 1 !== element.custom_order_reference_art_styles.length">, </span>
              </p>
            </div>
          </div>
          <div
              v-if="
              element.custom_order_status.alias !== 'new' &&
              route.fullPath.includes('/artistProfile')
            "
              class="flex gap-3"
          >
            <button
                class="flex items-center gap-2 text-[#757575] hover:text-black"
                @click="updateParamsCall(element)"
            >
              <PencilIcon class="w-5 h-5"/>
              <p>{{ $t("artistProfile.comission.updateParams") }}</p>
            </button>
            <button
                v-if="
                element.custom_order_status.alias === 'pricing' ||
                element.custom_order_status.alias === 'on-review'
              "
                class="flex items-center gap-2 text-[#757575] hover:text-black"
                @click="updatePriceCall(element)"
            >
              <CircleStackIcon class="w-5 h-5"/>
              <p>{{ $t("artistProfile.comission.updatePrice") }}</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.chat-bubble::before {
  content: "";
  display: none;
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 10px 10px 0;
  border-color: #01188e transparent transparent transparent;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
}
</style>
