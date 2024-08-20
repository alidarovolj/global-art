export const useCartCookieStore = defineStore("cartProducts", () => {
    const cartProducts = ref();
    return {
        cartProducts,
        initCookieProducts() {
            const cookie = useCookie("cartProducts", {
                sameSite: true,
                maxAge: 60 * 60 * 24,
            });
            cartProducts.value = cookie.value;
            watch(cartProducts, () => (cookie.value = cartProducts.value));
        },
    };
});
