import axios from "axios";

declare global {
    interface Window {
        ENV: {
            VITE_API_URL: string;
            VITE_OLLAMA_API_URL: string;
            VITE_SSO_SERVER_URL: string;
            VITE_OAUTH_REALM: string;
            VITE_OAUTH_CLIENT_ID: string;
            VITE_IDENTITY_PROVIDER: string;
            VITE_AVAILABLE_MODELS: string;
        };
    }
}

const getApiUrl = (): string => window.ENV?.VITE_API_URL || import.meta.env.VITE_API_URL || '';

// Creating an instance for axios to be used by the token interceptor service
const instance = axios.create({
    baseURL: `${getApiUrl()}/`,
    headers: {
        "Content-Type": "application/json",
    },
});

export const portalApiClient = axios.create({
    baseURL: getApiUrl(),
    headers: {
        "Content-Type": "application/json",
    },
});

export default instance;