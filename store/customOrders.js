import {defineStore} from "pinia";

export const useCustomOrdersStore = defineStore("customOrders", () => {
    const result = ref(null);
    const resultMyCusOrders = ref(null);
    const resultStatus = ref(null);
    const resultUpdateParams = ref(null);
    const resultUpdatePrice = ref(null);
    const resultPricing = ref(null);

    const toasts = useToastsStore()

    return {
        result,
        resultMyCusOrders,
        resultStatus,
        resultUpdateParams,
        resultUpdatePrice,
        resultPricing,
        async getCustomOrders(form) {
            await api(`/api/order/custom-order/show-my-custom-orders/`, {
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
        async getCustomOrderStatuses() {
            await api(`/api/order/custom-order-status/list-items/`)
                .then((response) => {
                    const data = response.data;
                    if (data.success) {
                        resultStatus.value = data;
                    } else {
                        resultStatus.value = false;
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
        async updateCustomOrderParams(form) {
            await api(`/api/order/custom-order/update-custom-order-params/`, {
                body: JSON.stringify(form),
            })
                .then((response) => {
                    const data = response.data;
                    if (data.success) {
                        resultUpdateParams.value = data;
                    } else {
                        resultUpdateParams.value = false;
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
        async updateCustomOrderPrice(form) {
            await api(`/api/order/custom-order/update-custom-order-price/`, {
                body: JSON.stringify(form),
            })
                .then((response) => {
                    const data = response.data;
                    if (data.success) {
                        resultUpdatePrice.value = data;
                    } else {
                        resultUpdatePrice.value = false;
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
        async setPricing(form) {
            await api(`/api/order/custom-order/accept-custom-order-price/`, {
                body: JSON.stringify(form),
            })
                .then((response) => {
                    const data = response.data;
                    if (data.success) {
                        resultPricing.value = data;
                    } else {
                        resultPricing.value = false;
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
        async getMyCustomOrders(form) {
            await api(`/api/order/custom-order/show-custom-orders-for-me/`, {
                body: JSON.stringify(form),
            })
                .then((response) => {
                    const data = response.data;
                    if (data.success) {
                        resultMyCusOrders.value = data;
                    } else {
                        resultMyCusOrders.value = false;
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
        async setStatus(form) {
            await api(`/api/order/custom-order/accept-decline-custom-order/`, {
                body: JSON.stringify(form),
            })
                .then((response) => {
                    const data = response.data;
                    if (data.success) {
                        resultStatus.value = data;
                    } else {
                        resultStatus.value = false;
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
