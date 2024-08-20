import {defineStore} from "pinia";
import {useLanguagesStore} from "~/store/languages.js";

export const useArtistRegistrationStore = defineStore(
    "artistRegistration",
    () => {
        const language = useLanguagesStore();
        const {cur_lang} = storeToRefs(language);
        const form = ref(null);

        // Инициализация куки
        const cookie = useCookie("artistRegistration", {
            default: () => ({
                language: cur_lang.value,
                artist_app_user: null,
                artist_about: null,
                artist_credo: null,
                artist_is_available: null,
                artist_art_categories: [],
                artist_art_materials: [],
                artist_art_styles: [],
                artist_base_info: {
                    first_name: null,
                    last_name: null,
                    country: null,
                    state: null,
                    city: null,
                    address: null,
                    zipcode: null,
                    phone_number: null,
                },
                artist_education: [],
                artist_achievement: null,
                artist_exhibition: [
                    {
                        title: null,
                        images: [],
                    },
                ],
                artist_references: [
                    {
                        full_name: "Alan Fears",
                        contact_info: "87777777777",
                    },
                ],
                artist_portfolio: [],
                artist_art_subjects: [],
            }),
            sameSite: "strict", // Исправлено значение sameSite
            maxAge: 60 * 60 * 24,
        });

        // Функция сохранения данных в куки
        const saveToCookie = () => {
            cookie.value = form.value;
        };

        // Инициализация формы на основе куки
        if (cookie.value) {
            form.value = cookie.value;
        } else {
            form.value = {
                language: cur_lang.value,
                artist_app_user: null,
                artist_about: null,
                artist_credo: null,
                artist_is_available: null,
                artist_art_categories: [],
                artist_art_materials: [],
                artist_art_styles: [],
                artist_base_info: {
                    first_name: null,
                    last_name: null,
                    country: null,
                    state: null,
                    city: null,
                    address: null,
                    zipcode: null,
                    phone_number: null,
                },
                artist_education: [],
                artist_achievement: null,
                artist_exhibition: [
                    {
                        title: null,
                        images: [],
                    },
                ],
                artist_references: [
                    {
                        full_name: "Alan Fears",
                        contact_info: "87777777777",
                    },
                ],
                artist_portfolio: [],
                artist_art_subjects: [],
            };
        }

        const portfolio_photos = ref([]);
        const artist_photo = ref("");

        return {
            form,
            portfolio_photos,
            artist_photo,
            saveToCookie,
            cookie,
            initCookieRegistration() {
                if (cookie.value) {
                    form.value = cookie.value;
                }
                watch(
                    form.value,
                    (newValue) => {
                        if (newValue) {
                            saveToCookie();
                        }
                    },
                    {deep: true},
                );
            },
        };
    },
);
