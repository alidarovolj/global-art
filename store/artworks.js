import {defineStore} from "pinia";

export const useArtworksStore = defineStore("artworks", () => {
    const artworksList = ref(null);
    const result = ref(null);
    const readyToShipment = ref(null);

    const toasts = useToastsStore()

    return {
        artworksList,
        result,
        readyToShipment,
        async getArtworks(form) {
            await api(`/api/art/art-item/list-art-items/`, {
                body: JSON.stringify(form),
            })
                .then((response) => {
                    const data = response.data;
                    if (data.success) {
                        artworksList.value = data;
                    } else {
                        artworksList.value = false;
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
        async getArtwork(id) {
            await api(`/api/art/art-item/get-art-item/`, {
                body: JSON.stringify({id: id}),
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
        async setReadyToShipment(form) {
            await api(`/api/order/app-user-order/artist-create-shipment-for-app-user-order-item/`, {
                body: JSON.stringify(form),
            })
                .then((response) => {
                    const data = response.data;
                    if (data.success) {
                        readyToShipment.value = data;
                    } else {
                        readyToShipment.value = false;
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
