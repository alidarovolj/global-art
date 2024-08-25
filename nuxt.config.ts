// https://nuxt.com/docs/api/configuration/nuxt-config
import axios from 'axios'

async function getArtworksRoutes() {
    const { data } = await axios.post('https://api.globalart.ai/api/art/art-item/list-art-items/', {
        page_number: 1,
        show_by: 100,
        only_ids: [],
        exclude_ids: [],
        category_ids: [],
        search_text: null,
        movement_and_style: [],
        year_from: null,
        year_to: null,
        price_from: null,
        price_to: null,
        artist_ids: [],
        art_item_is_for_sale: null,
        art_item_is_sold: null,
        art_item_is_validated: null,
        rarity: [],
        signature: [],
        cert: [],
        art_item_material: [],
        art_item_style: [],
        art_item_subject: [],
    })

    return data.data.objects_list.map(artwork => `/artworks/${artwork.id}`)
}

async function getArtistsRoutes() {
    const { data } = await axios.post('https://api.globalart.ai/api/art/art-item/list-art-items/', {
        page_number: 1,
        show_by: 100,
        artist_is_available: null,
        artist_art_categories: [],
        artist_material: [],
        artist_art_style: [],
        artist_art_subjects: [],
    })

    return data.data.objects_list.map(artist => `/artists/${artist.id}`)
}
export default defineNuxtConfig({
    hooks: {
        async 'nitro:config'(nitroConfig) {
            if (nitroConfig.dev) return

            let slugs = await getArtworksRoutes();
            let artistSlugs = await getArtistsRoutes();
            nitroConfig.prerender.routes.push(...slugs);
            nitroConfig.prerender.routes.push(...artistSlugs);
            return
        },
    },

    app: {
        head: {
            charset: "utf-8",
            viewport: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
            meta: [
                {property: "og:type", content: "page"},
                {property: "og:image", content: "/favicon.ico"},
                {name: "yandex-verification", content: "a4ed7fd57549c711"},
                {"http-equiv": "Cache-Control", content: "no-cache, no-store, must-revalidate"},
                {"http-equiv": "Pragma", content: "no-cache"},
                {"http-equiv": "Expires", content: "0"},
                {"http-equiv": "Content-Security-Policy", content: "upgrade-insecure-requests"},
            ],
            link: [
                {rel: "icon", type: "image/x-icon", sizes: "32x32", href: "/favicon/favicon-32x32.png"},
                {rel: "icon", type: "image/x-icon", sizes: "16x16", href: "/favicon/favicon-16x16.png"},
                {rel: "apple-touch-icon", sizes: "180x180", href: "/favicon/apple-touch-icon.png"},
                {rel: "apple-touch-icon", sizes: "192x192", href: "/favicon/android-chrome-192x192.png"},
                {rel: "apple-touch-icon", sizes: "512x512", href: "/favicon/android-chrome-512x512.png"},
                {rel: "mask-icon", href: "/favicon/safari-pinned-tab.svg", color: "#5bbad5"},
            ],
            script: [
                {src: "https://www.googletagmanager.com/gtag/js?id=G-6995B2PCXE", async: true},
                {
                    hid: "gtag-config",
                    innerHTML: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'G-6995B2PCXE');
                    `,
                    type: "text/javascript",
                },
            ],
            __dangerouslyDisableSanitizers: ["script"],
        },
    },
    compatibilityDate: '2024-04-03',
    devtools: {enabled: true},

    // routeRules: {
    //     '/:locale(en-US|ko-KR|ar-AR|de-DE|es-ES|fr-FR|ja-JA|kz-KZ|ru-RU|tr-TR|zh-CN)/profile/**': {
    //         ssr: false
    //     },
    //     '/:locale(en-US|ko-KR|ar-AR|de-DE|es-ES|fr-FR|ja-JA|kz-KZ|ru-RU|tr-TR|zh-CN)/artistProfile/**': {
    //         ssr: false
    //     }
    // },

    routeRules: {
        '/profile/**': {
            ssr: false
        },
        '/artistProfile/**': {
            ssr: false
        },
        '/:locale/profile/**': {
            ssr: false
        },
        '/:locale/artistProfile/**': {
            ssr: false
        }
    },

    modules: [
        "@pinia/nuxt",
        "@nuxtjs/i18n",
        "vue3-carousel-nuxt",
        "nuxt-vue3-google-signin",
        "nuxt-simple-sitemap",
        [
            "yandex-metrika-module-nuxt3",
            {
                id: process.env.YANDEX_METRIKA_ID,
                webvisor: false,
                consoleLog: false,
            },
        ],
        "@nuxtjs/robots"
    ],
    css: [
        "assets/css/style.css",
        "assets/css/fonts.css",
    ],

    imports: {
        dirs: ["store", "composables", "composables/*/index.{ts,js,mjs,mts}", "composables/**",],
    },

    components: [{path: "~/components", pathPrefix: false}],

    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },

    site: {
        url: process.env.NUXT_PUBLIC_SITE_URL,
        trailingSlash: true,
    },
    carousel: {prefix: "MyCarousel"},

    googleSignIn: {
        clientId: "255282073684-g1kec2vd94ph5fbp1ivkj5771tib1aaq.apps.googleusercontent.com",
    },

    plugins: [
        "~/plugins/maska.ts",
        "~/plugins/vue3-toastify.ts"
    ],

    runtimeConfig: {
        public: {
            APP_VERSION: process.env.npm_package_version,
            ENDPOINTS_LINK: process.env.ENDPOINTS_LINK,
            GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
            NUXT_PUBLIC_SITE_URL: process.env.NUXT_PUBLIC_SITE_URL,
            INIT_GOOGLE_MAPS: process.env.INIT_GOOGLE_MAPS || false,
        },
    },

    i18n: {
        lazy: true,
        langDir: "locales/",
        strategy: "prefix_except_default",
        defaultLocale: "en-US",
        locales: [
            {code: "en-US", iso: "en-US", name: "English", sh_name: "en", file: "en-US.json"},
            {code: "ko-KR", iso: "ko-KR", name: "한국어", sh_name: "ko", file: "ko-KR.json"},
            {code: "tr-TR", iso: "tr-TR", name: "Türkçe", sh_name: "tr", file: "tr-TR.json"},
            {code: "kz-KZ", iso: "kz-KZ", name: "Қазақ", sh_name: "kk", file: "kz-KZ.json"},
            {code: "zh-CN", iso: "zh-CN", name: "中文", sh_name: "zh", file: "zh-CN.json"},
            {code: "ar-AR", iso: "ar-AR", name: "عربى", sh_name: "ar", file: "ar-AR.json"},
            {code: "ja-JA", iso: "ja-JA", name: "日本語", sh_name: "ja", file: "ja-JA.json"},
            {code: "ru-RU", iso: "ru-RU", name: "Русский", sh_name: "ru", file: "ru-RU.json"},
            {code: "es-ES", iso: "es-ES", name: "Español", sh_name: "es", file: "es-ES.json"},
            {code: "fr-FR", iso: "fr-FR", name: "Français", sh_name: "fr", file: "fr-FR.json"},
            {code: "de-DE", iso: "de-DE", name: "Deutsch", sh_name: "de", file: "de-DE.json"},
        ],
        detectBrowserLanguage: false,
        vueI18n: "./i18n.config.ts",
    },
})