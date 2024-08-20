import {defineStore} from "pinia";

export const usePromocodeStore = defineStore("Promocode", () => {
    const toasts = useToastsStore()

    const promocodeList = ref(null);
    const promocodeCreate = ref(null);
    const promocodeRemove = ref(null);

    return {
        promocodeList,
        promocodeCreate,
        promocodeRemove,
        async getPromocodeList(form) {
            await api(`/api/order/promo-code/list-my-promo-codes/`, {
                body: JSON.stringify(form),
            })
                .then((response) => {
                    const data = response.data;
                    if (data.success) {
                        promocodeList.value = data;
                    } else {
                        promocodeList.value = false;
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
        async createPromocode(form) {
            await api(`/api/order/promo-code/create-promo-code/`, {
                body: JSON.stringify(form),
            })
                .then((response) => {
                    const data = response.data;
                    if (data.success) {
                        promocodeCreate.value = data;
                    } else {
                        promocodeCreate.value = false;
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
        async removePromocode(id) {
            await api(`/api/order/promo-code/delete-promo-code/`, {
                body: JSON.stringify({
                    id: id,
                }),
            })
                .then((response) => {
                    const data = response.data;
                    if (data.success) {
                        promocodeRemove.value = data;
                    } else {
                        promocodeRemove.value = false;
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
