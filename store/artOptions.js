import {defineStore} from "pinia";

export const useArtOptions = defineStore("artStyles", () => {
    const result = ref(null);
    const resultMaterials = ref(null);
    const resultRarity = ref(null);
    const resultCerts = ref(null);
    const resultSignatures = ref(null);
    const resultSubjects = ref(null);
    const resultCreateMaterials = ref(null);
    const resultCreateSubjects = ref(null);
    const resultCreateStyles = ref(null);

    const toasts = useToastsStore()

    return {
        result,
        resultMaterials,
        resultRarity,
        resultCerts,
        resultSignatures,
        resultSubjects,
        resultCreateMaterials,
        resultCreateSubjects,
        resultCreateStyles,
        async getArtStyles() {
            await api(`/api/art/art-item-style/list-items/`)
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
        async getArtMaterials() {
            await api(`/api/art/art-item-material/list-items/`)
                .then((response) => {
                    const data = response.data;
                    if (data.success) {
                        resultMaterials.value = data;
                    } else {
                        resultMaterials.value = false;
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
        async getArtRarity() {
            await api(`/api/art/art-item-rarity/list-items/`)
                .then((response) => {
                    const data = response.data;
                    if (data.success) {
                        resultRarity.value = data;
                    } else {
                        resultRarity.value = false;
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
        async getAuthCerts() {
            await api(`/api/art/art-item-auth-cert/list-items/`)
                .then((response) => {
                    const data = response.data;
                    if (data.success) {
                        resultCerts.value = data;
                    } else {
                        resultCerts.value = false;
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
        async getSignatures() {
            await api(`/api/art/art-item-signature/list-items/`)
                .then((response) => {
                    const data = response.data;
                    if (data.success) {
                        resultSignatures.value = data;
                    } else {
                        resultSignatures.value = false;
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
        async getSubjects() {
            await api(`/api/art/art-item-subject/list-items/`)
                .then((response) => {
                    const data = response.data;
                    if (data.success) {
                        resultSubjects.value = data;
                    } else {
                        resultSubjects.value = false;
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
        async createArtSubjects(form) {
            await api(`/api/art/art-item-subject/create-item/`, {
                body: JSON.stringify(form),
            })
                .then((response) => {
                    const data = response.data;
                    if (data.success) {
                        resultCreateSubjects.value = data;
                    } else {
                        resultCreateSubjects.value = false;
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
