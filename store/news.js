import {defineStore} from "pinia";

export const useNewsStore = defineStore("news", () => {
    const resultCategories = ref(null);
    const result = ref(null);
    const newsItem = ref(null);
    const articleCategoriesByAlias = ref(null);

    const toasts = useToastsStore()

    return {
        resultCategories,
        result,
        newsItem,
        articleCategoriesByAlias,

        async getNewsListCategories(request) {
            await api(`/api/blog/article-category/list-categories/`, {
                body: JSON.stringify(request),
            })
                .then((response) => {
                    const data = response.data;
                    if (data.success) {
                        resultCategories.value = data;
                    } else {
                        resultCategories.value = false;
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
        async getNewsList(request) {
            await api(`/api/blog/article/list-articles/`, {
                body: JSON.stringify(request),
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
        async getArticleCategoriesByAlias(request) {
            await api(
                `/api/blog/article-category/list-article-categories-by-alias/`,
                {
                    body: JSON.stringify(request),
                },
            )
                .then((response) => {
                    const data = response.data;
                    if (data.success) {
                        articleCategoriesByAlias.value = data;
                    } else {
                        articleCategoriesByAlias.value = false;
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
        async getNewsItem(request) {
            await api(`/api/blog/article/get-article/`, {
                body: JSON.stringify(request),
            })
                .then((response) => {
                    const data = response.data;
                    if (data.success) {
                        newsItem.value = data;
                    } else {
                        newsItem.value = false;
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
