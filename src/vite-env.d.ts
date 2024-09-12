/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly VITE_ORIGIN_URI: string;
    readonly VITE_IS_MOCK: string;

    readonly VITE_KAKAO_REST_API_KEY: string;
    readonly VITE_KAKAO_AUTHORIZE_URI: string;

    readonly VITE_GOOGLE_CLIENT_ID: string;
    readonly VITE_GOOGLE_AUTHORIZE_URI: string;
}
