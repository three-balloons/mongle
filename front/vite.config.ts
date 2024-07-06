import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import autoprefixer from 'autoprefixer';
import postcssNesting from 'postcss-nesting';

export default defineConfig({
    plugins: [react()],
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
