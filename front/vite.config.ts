import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import svgr from '@svgr/rollup';
import autoprefixer from 'autoprefixer';
import postcssNesting from 'postcss-nesting';

export default defineConfig({
    plugins: [svgr(), react()],
    base: '/',
    server: {
        proxy: {
            '/api': {
                target: 'http://http://43.201.202.138:8080',
                changeOrigin: true,
                secure: false,
                headers: {
                    Origin: 'https://mongle.xyz',
                },
            },
        },
    },
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
