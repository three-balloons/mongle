import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import '@/style/index.css';
import * as serviceWorkerRegistration from '@/pwa/serviceWorkerRegistration.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <>
        <App />
    </>,
);
serviceWorkerRegistration.register();
