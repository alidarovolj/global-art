import {defineStore} from "pinia";

export const useMessagesStore = defineStore("messages", () => {
    const result = ref(null);
    const messagesArray = ref(null);
    const toasts = useToastsStore()

    return {
        result,
        messagesArray,
        async sendChatMessage(form) {
            await api(`/api/chat/chat-room-message/send-chat-room-message/`, {
                body: JSON.stringify(form),
            })
                .then((response) => {
                    const data = response.data;
                    if (data.success) {
                        result.value = data;
                    } else {
                        result.value = false;
                        toasts.showToast("error", "An error has occurred!", data.msg_txt);
                    }
                })
                .catch((e) => {
                    if (e.response && e.response.data.success === false) {
                        toasts.showToast("error", "An error has occurred!", e.response.data.msg_txt);
                    } else {
                        toasts.showToast("error", "An error has occurred!", "Server Error! Please try again later.");
                    }
                });
        },
        async getNewChatMessage(message) {
            messagesArray.value = message;
        },
    };
});
