import {defineStore} from "pinia";

export const useCartStore = defineStore("cart", () => {
    const result = ref(null);
    const resultItem = ref(null);
    const resultCheckout = ref(null);
    const toasts = useToastsStore()

    return {
        result,
        resultItem,
        resultCheckout,
        async getCart(form) {
            await api(`/api/order/basket-item/list-my-basket/`, {
                body: JSON.stringify(form),
            })
                .then((response) => {
                    const data = response.data;
                    if (data.success) {
                        result.value = data;

                        if (data) {
                            data.totalPrice = data.data.reduce(
                                (total, item) =>
                                    total + item.basket_item_art_item.art_item_price,
                                0,
                            );
                            result.value = data;
                        }
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
        async createCheckout(form) {
            await api(`/api/order/app-user-order/create-checkout-session/`, {
                body: JSON.stringify(form),
            })
                .then((response) => {
                    const data = response.data;
                    if (data.success) {
                        resultCheckout.value = data;
                    } else {
                        resultCheckout.value = false;
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
        async addOrRemoveItem(form) {
            await api(`/api/order/basket-item/add-remove-basket-item/`, {
                body: JSON.stringify(form),
            })
                .then((response) => {
                    const data = response.data;
                    if (data.success) {
                        resultItem.value = data;
                    } else {
                        resultItem.value = false;
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
