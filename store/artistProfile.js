import {defineStore} from "pinia";

export const useArtistProfileStore = defineStore("artistProfile", () => {
    const result = ref(null);
    const resultOrders = ref(null);
    const toasts = useToastsStore();

    const form = ref({
        id: null,
        language: null,
        artist_about: null,
        artist_credo: null,
        artist_achievement: null,
        artist_base_info: {
            first_name: null,
            last_name: null,
            country: null,
            state: null,
            city: null,
            address: null,
            phone_number: null,
            zipcode: null,
            translations: {}
        },
        artist_art_categories: [],
        artist_art_materials: [],
        artist_art_styles: [],
        artist_art_subjects: []
    })

    return {
        result,
        resultOrders,
        form,
        async getArtistData() {
            await api(`/api/artist/artist/get-my-artist-profile/`, {
                body: JSON.stringify({id: null}),
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
        async editArtistData() {
            await api(`/api/artist/artist/edit-artist-profile/`, {
                body: JSON.stringify(form.value)
            })
                .then((response) => {
                    const data = response.data;
                    if (data.success) {
                        toasts.showToast("success", data.msg_txt, "Artist profile has been updated successfully!");
                    } else {
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
        async artistOrders() {
            await api(`/api/order/app-user-order/artist-list-app-user-order-items/`, {
                body: JSON.stringify(form.value)
            })
                .then((response) => {
                    const data = response.data;
                    if (data.success) {
                        resultOrders.value = data;
                    } else {
                        resultOrders.value = false;
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
        }
    };
});
