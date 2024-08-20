import {defineStore} from "pinia";

export const useFramesStore = defineStore("frames", () => {
    const result = ref(null);

    const toasts = useToastsStore()

    return {
        result,
        async getFramesList() {
            await api(`/api/art/painting-frame/list-painting-frames/`)
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
