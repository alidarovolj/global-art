import {defineStore} from "pinia";

export const useNotificationStore = defineStore("notification", () => {
    const notificationList = ref(null);
    const notificationRemove = ref(null);
    const notificationRemoveAll = ref(null);

    const toasts = useToastsStore()

    return {
        notificationList,
        notificationRemove,
        notificationRemoveAll,
        async getNotificationList() {
            await api(`/api/company/app-user-notification/list-my-notifications/`)
                .then((response) => {
                    const data = response.data;
                    if (data.success) {
                        notificationList.value = data;
                    } else {
                        notificationList.value = false;
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
        async removeNotification(id) {
            await api(`/api/company/app-user-notification/delete-notification/`, {
                body: JSON.stringify({
                    id: id,
                }),
            })
                .then((response) => {
                    const data = response.data;
                    if (data.success) {
                        notificationRemove.value = data;
                        this.getNotificationList();
                    } else {
                        notificationRemove.value = false;
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
        async removeAllNotifications() {
            await api(`/api/company/app-user-notification/delete-all-notifications/`)
                .then((response) => {
                    const data = response.data;
                    if (data.success) {
                        notificationRemoveAll.value = data;
                        this.getNotificationList();
                    } else {
                        notificationRemoveAll.value = false;
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
    };
});
