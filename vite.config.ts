import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import svgr from '@svgr/rollup';
import autoprefixer from 'autoprefixer';
import postcssNesting from 'postcss-nesting';

export default defineConfig({
    plugins: [svgr(), react()],
    server: {
        proxy: {
            '/api': {
                target: 'https://www.kmer.site',
                changeOrigin: true,
                secure: false,
                headers: {
                    Origin: 'https://app.mongle.xyz',
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
