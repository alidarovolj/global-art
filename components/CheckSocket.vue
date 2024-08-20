<script setup>
import {onMounted, ref, watch} from "vue";
import * as eio from "engine.io-client";
import receivedAudio from "~/assets/sounds/received.mp3";
import {useMessagesStore} from "~/store/messages";
import {useNotificationStore} from "~/store/notification";
import {useAuthStore} from "~/store/auth";

const messagesStore = useMessagesStore();
const notification = useNotificationStore();
const auth = useAuthStore();

const message = ref("");
const eioClientConnected = ref(false);
let eioClient;

const hostname = "socket.globalart.ai";
const ws_protocol = "wss://";

// Инициализация токена и подключения к сокету при монтировании
onMounted(() => {
  if (process.client) {
    auth.initCookieToken();
    serverSocketConnected();
  }
});

// Слежение за изменением состояния подключения и токена
watch(
    () => [eioClientConnected.value, auth.token],
    ([isConnected, token]) => {
      if (isConnected && token) {
        bindUser(token);
      }
    },
    {immediate: true},
);

// Функция для воспроизведения звука при получении сообщения
const playReceivedMessage = () => {
  const audio = new Audio(receivedAudio);
  audio.play();
};

// Функция для подключения к серверу через сокет
function serverSocketConnected() {
  if (!eioClientConnected.value && !eioClient) {
    eioClient = new eio.Socket(ws_protocol + hostname);

    eioClient.on("open", () => {
      eioClientConnected.value = true;
    });

    eioClient.on("message", (__data) => {
      processMessage(__data);
    });

    eioClient.on("close", () => {
      eioClientConnected.value = false;
      eioClient = null; // сброс клиента для новой попытки подключения
      setTimeout(serverSocketConnected, 10000); // Переподключение через 10 секунд
    });

    eioClient.on("error", () => {
      console.log("Server disconnected. Event name 'error'.");
    });
  }
}

// Обработка полученных сообщений
function processMessage(__data) {
  let data = {};
  try {
    data = JSON.parse(__data);
    messagesStore.getNewChatMessage(data);
    if (data.msg_type !== "remove_notification") {
      playReceivedMessage();
    }
    notification.getNotificationList();
  } catch (error) {
    console.error("Error parsing message data:", error);
  }
}

// Функция для отправки сообщений
function sendMes() {
  if (eioClientConnected.value) {
    eioClient.send(
        JSON.stringify({msg_type: "message", message: message.value}),
    );
    message.value = "";
  } else {
    console.log("Cannot send message: socket is not connected.");
  }
}

// Функция для привязки пользователя
function bindUser(token) {
  if (eioClient && eioClientConnected.value) {
    eioClient.send(JSON.stringify({msg_type: "bind", app_user_token: token}));
  }
}
</script>

<template>
  <div>
  </div>
</template>
