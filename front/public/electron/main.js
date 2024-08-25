import { app, BrowserWindow } from 'electron';
import path, { dirname } from 'path';
import url, { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ORIGIN_URI = 'http://localhost:5173';

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    const startUrl = url.format({
        pathname: path.join(__dirname, '/../../dist/index.html'),
        protocol: 'file:',
        slashes: true,
    });
    console.log(startUrl);
    win.loadURL('http://localhost:5173');
};

app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    // if (process.platform !== 'darwin')
    app.quit();
});
