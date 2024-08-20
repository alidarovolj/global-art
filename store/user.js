import {defineStore} from "pinia";

export const useUserStore = defineStore("users", () => {
    const editResult = ref(null);
    const result = ref(null);
    const resultList = ref(null);
    const resultProfilePhoto = ref(null);
    const activationResult = ref(null);
    const subscriptions = ref(null);

    const toasts = useToastsStore()

    return {
        result,
        resultList,
        editResult,
        resultProfilePhoto,
        subscriptions,
        activationResult,
        async getProfile() {
            await api(`/api/company/app-user/get-my-profile/`)
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
                    if (e.response.data.success === false) {
                        result.value = false;
                    } else {
                        result.value = false;
                        toasts.showToast("error", "An error has occurred!", "Server Error! Please try again later.");
                    }
                });
        },
        async activateAccount(form) {
            await api(`/api/company/app-user/activate-app-user-by-token/`, {
                body: JSON.stringify(form),
            })
                .then((response) => {
                    const data = response.data;
                    if (data.success) {
                        activationResult.value = data;
                    } else {
                        activationResult.value = false;
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
        async editProfile(item) {
            await api(`/api/company/app-user/update-my-profile/`, {
                body: JSON.stringify(item),
            })
                .then((response) => {
                    const data = response.data;
                    if (data.success) {
                        editResult.value = data;
                    } else {
                        editResult.value = false;
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
        async setProfilePhoto(item) {
            await api(`/api/company/app-user/set-profile-photo/`, {
                body: JSON.stringify(item),
            })
                .then((response) => {
                    const data = response.data;
                    if (data.success) {
                        resultProfilePhoto.value = data;
                    } else {
                        resultProfilePhoto.value = false;
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
        async getSubscriptions() {
            await api(`/api/artist/artist-subscription/list-my-artist-subscriptions/`)
                .then((response) => {
                    const data = response.data;
                    if (data.success) {
                        subscriptions.value = data;
                    } else {
                        subscriptions.value = false;
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
        async deactivateUser(item) {
            await api(`/api/company/company-person/enable-disable-company-person/`, {
                body: JSON.stringify(item),
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
