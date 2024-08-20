import {defineStore} from "pinia";

export const useSocketStore = defineStore("sockets", () => {
    const result = ref(null);

    return {
        result,
        async connectSocket(form) {
            const {data} = await api(
                `/api/company/app-user/connect-app-user-socket/`,
                {
                    body: JSON.stringify(form),
                },
            );
            if (data.value) {
                result.value = data.value;
                console.log("socket connected", data.value);
            } else {
                result.value = false;
            }
        },
    };
});
