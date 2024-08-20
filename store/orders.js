import {defineStore} from "pinia";

export const useOrdersStore = defineStore("orders", () => {
    const result = ref(null);
    const orderDetail = ref(null);

    const toasts = useToastsStore()

    return {
        result,
        orderDetail,
        async ordersList(form) {
            await api(`/api/order/app-user-order/my-orders/`, {
                body: JSON.stringify(form),
            })
                .then((response) => {
                    const data = response.data;
                    if (data.success) {
                        result.value = {
                            ...data,
                            data: {
                                ...data.data,
                                objects_list: data.data.objects_list.map((obj) => ({
                                    ...obj,
                                    created_at: new Date(obj.created_at).toLocaleDateString(
                                        "en-GB",
                                        {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        },
                                    ),
                                    app_user_order_summary: {
                                        ...obj.app_user_order_summary,
                                        total: (obj.app_user_order_summary.total / 100).toFixed(2),
                                    },
                                })),
                            },
                        };
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
        async getOrderDetail(form) {
            await api(`/api/order/app-user-order/list-app-user-order-items/`, {
                body: JSON.stringify(form),
            })
                .then((response) => {
                    const data = response.data;
                    if (data.success) {
                        orderDetail.value = data;
                    } else {
                        orderDetail.value = false;
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
