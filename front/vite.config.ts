import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import autoprefixer from 'autoprefixer';
import postcssNesting from 'postcss-nesting';

export default defineConfig({
    plugins: [react()],
    // server: {
    //     proxy: {
    //         '/api': {
    //             target: 'http://localhost:8080',
    //             changeOrigin: true,
    //             secure: false,
    //             headers: {
    //                 Origin: 'http://localhost:8080',
    //             },
    //         },
    //     },
    // },
    resolve: {
        alias: {
            '@': '/src',
        },
    },
    css: {
        postcss: {
            plugins: [autoprefixer({}), postcssNesting],
        },
        modules: {
            localsConvention: 'camelCaseOnly',
        },
    },
});
