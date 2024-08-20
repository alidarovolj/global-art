export default {
    content: [
        "./components/**/*.{js,vue,ts}",
        "./layouts/**/*.vue",
        "./pages/**/*.vue",
        "./plugins/**/*.{js,ts}",
        "./app.vue",
        "./error.vue",
    ],
    theme: {
        extend: {
            colors: {
                cardBg: "#F7F7F7",
                primaryText: "#1A1A1A",
                secondaryText: "#808080",
                inner_head: "#757575",
                searchColor: "#056F0F",
                avaColor: "#B9C3DD",
                statusDelivered: "#058B33",
                statusDeliveredBg: "#D9F2E2",
                statusCanceled: "#7D4605",
                statusCanceledBg: "#F2E5D9",
                buyerMenuBg: "#F0F0F0",
                dText: "#dedede",
                dBg: "#171717",
                dElement: "#303134",
                linkColor: "#0000EE",
            },
            borderColor: {
                bColor: "#cccccc",
                bSelected: "#1A1A1A",
            },
            width: {
                sixth: "15.5%",
                third: "32.6%",
                fourth: "24%",
                fifth: "19%",
                half: "49%",
                custom: "calc(100% - 200px)",
            },
        },
    },
    plugins: []
};
