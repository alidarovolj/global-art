export const useCookieStore = defineStore("cookie", () => {
    const savedCookie = ref();
    return {
        savedCookie,
        initCookieSave() {
            const cookie = useCookie("savedCookie", {
                sameSite: true,
                maxAge: 60 * 60 * 24,
            });
            savedCookie.value = cookie.value;
            watch(savedCookie, () => (cookie.value = savedCookie.value));
        },
    };
});
