import {useAuthStore} from "~/store/auth";
import axios from "axios";
import {removeCookie} from "~/utils/removeCookie";
import {navigateTo} from "nuxt/app";

export async function api(url, options = {}) {
    const auth = useAuthStore();
    auth.initCookieToken();
    const {token} = storeToRefs(auth);

    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value}`,
    };

    const defaults = {
        baseURL: "https://api.globalart.ai",
        headers: headers,
        method: "POST",
        url: url,
    };

    const queryString = (params) => {
        return Object.keys(params)
            .map((key) => {
                const value = params[key];
                if (Array.isArray(value)) {
                    return value.map((val) => `${encodeURIComponent(key)}[]=${encodeURIComponent(val)}`).join('&');
                }
                return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
            })
            .join('&');
    };

    if (options.params) {
        options.params = queryString(options.params);
    }

    if (options.body) {
        defaults.data = JSON.parse(options.body);
    }

    const config = {...defaults, ...options};

    try {
        const response = await axios(config);
        return response;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.log("Unauthorized access - removing token and redirecting");
            token.value = null;
            removeCookie("token");
            navigateTo("/");
        } else {
            throw error;
        }
    }
}
