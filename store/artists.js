import {defineStore} from "pinia";
import {ref} from "vue";

export const useArtistsStore = defineStore("artists", () => {
    const artistList = ref(null);
    const detailArtist = ref(null);
    const detailArtistArtwork = ref(null);
    const toggleSubscribeResponse = ref(null);
    const newPortfolio = ref(null);
    const newExhibitions = ref(null);
    const removePortfolioResult = ref(null);
    const editPortfolioResult = ref(null);
    const removeExhibitionResult = ref(null);
    const editExhibitionResult = ref(null);

    const toasts = useToastsStore()

    return {
        artistList,
        detailArtist,
        detailArtistArtwork,
        toggleSubscribeResponse,
        newPortfolio,
        newExhibitions,
        removePortfolioResult,
        editPortfolioResult,
        removeExhibitionResult,
        editExhibitionResult,
        async getArtistList(form) {
            await api(`/api/artist/artist/list-artists/`, {
                body: JSON.stringify(form),
            })
                .then((response) => {
                    const data = response.data;
                    if (data.success) {
                        artistList.value = data;
                    } else {
                        artistList.value = false;
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
        async getDetailArtist(id) {
            await api(`/api/artist/artist/get-artist/`, {
                body: JSON.stringify({id: id}),
            })
                .then((response) => {
                    const data = response.data;
                    if (data.success) {
                        detailArtist.value = data;
                    } else {
                        detailArtist.value = false;
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
        async getDetailArtistArtworks(filters) {
            await api(`/api/art/art-item/list-art-items/`, {
                body: JSON.stringify(filters),
            })
                .then((response) => {
                    const data = response.data;
                    if (data.success) {
                        detailArtistArtwork.value = data;
                    } else {
                        detailArtistArtwork.value = false;
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
        async addExcludeArtistSubscription(id) {
            await api(
                `/api/artist/artist-subscription/add-exclude-artist-subscription/`,
                {
                    body: JSON.stringify({id: id}),
                },
            )
                .then((response) => {
                    const data = response.data;
                    if (data.success) {
                        toggleSubscribeResponse.value = data;
                    } else {
                        toggleSubscribeResponse.value = false;
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
        async addPortfolio(form) {
            await api(
                `/api/artist/artist-portfolio/add-artist-portfolios/`,
                {
                    body: JSON.stringify(form),
                },
            )
                .then((response) => {
                    const data = response.data;
                    if (data.success) {
                        newPortfolio.value = data;
                    } else {
                        newPortfolio.value = false;
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
        async addExhibitions(form) {
            await api(
                `/api/artist/artist-exhibition/add-artist-exhibitions/`,
                {
                    body: JSON.stringify(form),
                },
            )
                .then((response) => {
                    const data = response.data;
                    if (data.success) {
                        newExhibitions.value = data;
                    } else {
                        newExhibitions.value = false;
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
        async removePortfolio(form) {
            await api(
                `/api/artist/artist-portfolio/delete-artist-portfolio/`,
                {
                    body: JSON.stringify(form),
                },
            )
                .then((response) => {
                    const data = response.data;
                    if (data.success) {
                        removePortfolioResult.value = data;
                    } else {
                        removePortfolioResult.value = false;
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
        async editPortfolio(form) {
            await api(
                `/api/artist/artist-portfolio/edit-artist-portfolio/`,
                {
                    body: JSON.stringify(form),
                },
            )
                .then((response) => {
                    const data = response.data;
                    if (data.success) {
                        editPortfolioResult.value = data;
                    } else {
                        editPortfolioResult.value = false;
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
        async removeExhibition(form) {
            await api(
                `/api/artist/artist-exhibition/delete-artist-exhibition/`,
                {
                    body: JSON.stringify(form),
                },
            )
                .then((response) => {
                    const data = response.data;
                    if (data.success) {
                        removeExhibitionResult.value = data;
                    } else {
                        removeExhibitionResult.value = false;
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
        async editExhibition(form) {
            await api(
                `/api/artist/artist-exhibition/edit-artist-exhibition/`,
                {
                    body: JSON.stringify(form),
                },
            )
                .then((response) => {
                    const data = response.data;
                    if (data.success) {
                        editExhibitionResult.value = data;
                    } else {
                        editExhibitionResult.value = false;
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
