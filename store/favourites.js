import {defineStore} from "pinia";

export const useFavouritesStore = defineStore("favourites", () => {
    const result = ref(null);
    const resultList = ref(null);

    const toasts = useToastsStore()

    return {
        result,
        resultList,
        async getFavourites() {
            await api(`/api/art/wish-list-item/list-my-wish-list-items/`)
                .then((response) => {
                    const data = response.data;
                    if (data.success) {
                        resultList.value = data;
                    } else {
                        resultList.value = false;
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
        async addToFavourites(id) {
            await api(`/api/art/wish-list-item/add-exclude-wish-list-item/`, {
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
    };
});
