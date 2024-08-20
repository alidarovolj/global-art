import {defineStore} from "pinia";

export const useDeliveryAddressStore = defineStore("deliveryAddress", () => {
    const result = ref(null);
    const createDeliveryAddressData = ref(null);
    const deleteDeliveryAddressData = ref(null);
    const editDeliveryAddressData = ref(null);

    const toasts = useToastsStore()

    return {
        result,
        createDeliveryAddressData,
        deleteDeliveryAddressData,
        editDeliveryAddressData,
        async getDeliveryAddress() {
            await api(`/api/order/deliver-address/list-my-delivery-addresses/`)
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
        async createDeliveryAddress(form) {
            await api(`/api/order/deliver-address/create-delivery-address/`, {
                body: JSON.stringify(form),
            })
                .then((response) => {
                    const data = response.data;
                    if (data.success) {
                        createDeliveryAddressData.value = data;
                    } else {
                        createDeliveryAddressData.value = false;
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
        async deleteDeliveryAddress(id) {
            await api(`/api/order/deliver-address/delete-delivery-address/`, {
                body: JSON.stringify({id: id}),
            })
                .then((response) => {
                    const data = response.data;
                    if (data.success) {
                        deleteDeliveryAddressData.value = data;
                    } else {
                        deleteDeliveryAddressData.value = false;
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
        async editDeliveryAddress(form) {
            await api(`/api/order/deliver-address/edit-delivery-address/`, {
                body: JSON.stringify(form),
            })
                .then((response) => {
                    const data = response.data;
                    if (data.success) {
                        editDeliveryAddressData.value = data;
                    } else {
                        editDeliveryAddressData.value = false;
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
