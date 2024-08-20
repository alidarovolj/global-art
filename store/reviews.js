import {defineStore} from "pinia";

export const useReviewsStore = defineStore("reviews", () => {
    const result = ref(null);
    const resultCreate = ref(null);
    const resultArtistReviews = ref(null);
    const resultMyReviews = ref(null);

    const toasts = useToastsStore()

    return {
        result,
        resultCreate,
        resultArtistReviews,
        resultMyReviews,
        async getReviews() {
            await api(`/api/art/art-item-review/show-available-reviews/`)
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
        async myReviews() {
            await api(`/api/art/art-item-review/list-my-reviews/`)
                .then((response) => {
                    const data = response.data;
                    if (data.success) {
                        resultMyReviews.value = data;
                    } else {
                        resultMyReviews.value = false;
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
        async createReview(form) {
            await api(`/api/art/art-item-review/create-art-item-review/`, {
                body: JSON.stringify(form),
            })
                .then((response) => {
                    const data = response.data;
                    if (data.success) {
                        resultCreate.value = data;
                    } else {
                        resultCreate.value = false;
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
        async artistsReviews(id) {
            await api(`/api/art/art-item-review/list-art-item-reviews-by-artist/`, {
                body: JSON.stringify({id: id}),
            })
                .then((response) => {
                    const data = response.data;
                    if (data.success) {
                        resultArtistReviews.value = data;
                    } else {
                        resultArtistReviews.value = false;
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
