import {defineStore} from "pinia";

export const useArtistArtworksStore = defineStore("artistArtworks", () => {
    const artistArtworks = ref(null);
    const artistArtwork = ref(null);
    const artistProfileArtwork = ref(null);
    const dimensionType = ref("cm");
    const form = ref({
        language: null,
        art_item_artist_id: null,
        art_item_category_id: null,
        art_item_title: "",
        art_item_description: "",
        art_item_base_price: null,
        art_item_materials: [],
        art_item_styles: [],
        art_item_images: [],
        art_item_subjects: [],
        art_item_params: {
            size: {
                length: null,
                width: null,
                height: null,
                weight: null,
            },
            year: null,
            location: null,
            rarity_id: null,
            signature_id: null,
            auth_cert_id: null,
            frame: true,
            rights: null,
        },
    });
    const artworkImages = ref([]);
    const editArtworkImages = ref([]);
    const changeArtItemAvailability = ref(null);

    const formEdit = ref({
        id: null,
        art_item_artist_id: null,
        art_item_category_id: null,
        art_item_title: null,
        art_item_description: null,
        art_item_base_price: null,
        art_item_price: null,
        art_item_materials: [],
        art_item_styles: [],
        art_item_tags: [],
        art_item_subjects: [],
        art_item_params: {
            size: {
                length: null,
                width: null,
                height: null,
                weight: null,
            },
            year: null,
            location: null,
            rarity_id: null,
            signature_id: null,
            auth_cert_id: null,
            frame: true,
            rights: null,
        },
        new_art_item_images: [],
        delete_art_item_images: []
    });

    const toasts = useToastsStore()

    return {
        form,
        artworkImages,
        artistArtworks,
        artistArtwork,
        artistProfileArtwork,
        formEdit,
        editArtworkImages,
        changeArtItemAvailability,
        dimensionType,

        async getArtistArtworks(form) {
            await api(`/api/art/art-item/list-my-art-items/`, {
                body: JSON.stringify(form),
            })
                .then((response) => {
                    const data = response.data;
                    if (data.success) {
                        artistArtworks.value = data;
                    } else {
                        artistArtworks.value = false;
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
        async getArtistArtwork(id) {
            await api(`/api/art/art-item/get-art-item/`, {
                body: JSON.stringify({id: id}),
            })
                .then((response) => {
                    const data = response.data;
                    if (data.success) {
                        artistArtwork.value = data;
                        formEdit.value.art_item_artist_id = data.data.art_item_artist_id
                        formEdit.value.art_item_category_id = data.data.art_item_category.id;
                        formEdit.value.art_item_title = data.data.art_item_title;
                        formEdit.value.art_item_description = data.data.art_item_description;
                        formEdit.value.art_item_params.year = data.data.art_item_params.year;
                        formEdit.value.art_item_params.location = data.data.art_item_params.location;
                        formEdit.value.art_item_params.signature = data.data.art_item_params.signature;
                        formEdit.value.art_item_params.rights = data.data.art_item_params.rights;
                        formEdit.value.art_item_materials = data.data.art_item_materials?.map((item) => item.id);
                        formEdit.value.art_item_params.rarity_id = data.data.art_item_params.rarity_id;
                        formEdit.value.art_item_params.auth_cert_id = data.data.art_item_params.auth_cert_id;
                        formEdit.value.art_item_params.movement_and_style = data.data.art_item_params.movement_and_style;
                        formEdit.value.art_item_styles = data.data.art_item_styles?.map((item) => item.id);
                        formEdit.value.art_item_params.frame = data.data.art_item_params.frame;
                        formEdit.value.art_item_params.size.height = data.data.art_item_params.size.height;
                        formEdit.value.art_item_params.size.width = data.data.art_item_params.size.width;
                        formEdit.value.art_item_params.size.length = data.data.art_item_params.size.length;
                        formEdit.value.art_item_base_price = data.data.art_item_base_price;
                        formEdit.value.art_item_price = data.data.art_item_price;
                        formEdit.value.art_item_images = data.data.art_item_images;
                        formEdit.value.art_item_tags = data.data.art_item_tags?.map((item) => item.id);
                    } else {
                        artistArtworks.value = false;
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
        async getArtistProfileArtwork(id) {
            await api(`/api/art/art-item/get-my-art-item/`, {
                body: JSON.stringify({id: id}),
            })
                .then((response) => {
                    const data = response.data;
                    if (data.success) {
                        artistProfileArtwork.value = data
                        formEdit.value.id = data.data.id
                        formEdit.value.art_item_artist_id = data.data.art_item_artist_id
                        formEdit.value.art_item_category_id = data.data.art_item_category.id;
                        formEdit.value.art_item_title = data.data.art_item_title;
                        formEdit.value.art_item_description = data.data.art_item_description;
                        formEdit.value.art_item_base_price = data.data.art_item_base_price;
                        formEdit.value.art_item_price = data.data.art_item_price;
                        formEdit.value.art_item_materials = data.data.art_item_materials?.map((item) => item.id);
                        formEdit.value.art_item_styles = data.data.art_item_styles?.map((item) => item.id);
                        editArtworkImages.value = data.data.art_item_images;
                        formEdit.value.art_item_tags = data.data.art_item_tags?.map((item) => item.id);
                        formEdit.value.art_item_subjects = data.data.art_item_subjects?.map((item) => item.id);
                        formEdit.value.art_item_params.size.length = data.data.art_item_params.size.length;
                        formEdit.value.art_item_params.size.width = data.data.art_item_params.size.width;
                        formEdit.value.art_item_params.size.height = data.data.art_item_params.size.height;
                        formEdit.value.art_item_params.size.weight = data.data.art_item_params.size.weight;
                        formEdit.value.art_item_params.year = data.data.art_item_params.year;
                        formEdit.value.art_item_params.location = data.data.art_item_params.location;
                        formEdit.value.art_item_params.rarity_id = data.data.art_item_params.rarity_id;
                        formEdit.value.art_item_params.signature_id = data.data.art_item_params.signature_id;
                        formEdit.value.art_item_params.auth_cert_id = data.data.art_item_params.auth_cert_id;
                        formEdit.value.art_item_params.frame = data.data.art_item_params.frame;
                        formEdit.value.art_item_params.rights = data.data.art_item_params.rights;
                    } else {
                        artistProfileArtwork.value = false;
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
        async getChangeArtItemAvailability(form) {
            await api(`/api/art/art-item/change-art-item-sale-availability/`, {
                body: JSON.stringify(form),
            })
                .then((response) => {
                    const data = response.data;
                    if (data.success) {
                        changeArtItemAvailability.value = data;
                    } else {
                        changeArtItemAvailability.value = false;
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
