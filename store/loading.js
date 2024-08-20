import {defineStore} from "pinia";

export const useLoadingStore = defineStore("loading", () => {
    const loading = ref(false);
    const text = ref(null);

    return {
        loading,
        text,
        async setLoading(state, newText) {
            text.value = newText;
            await nextTick();
            loading.value = state;
        },
    };
});
