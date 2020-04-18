'use strict';

import { app, BrowserWindow, dialog, Menu, protocol, screen } from 'electron';
import { createProtocol, installVueDevtools } from 'vue-cli-plugin-electron-builder/lib';

const isDevelopment = process.env.NODE_ENV !== 'production';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
let win2;

let loadingResolver;
let finishedLoadingPromise = new Promise(resolve => {
    loadingResolver = resolve;
});

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }]);

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        fullscreenable: true,
        webPreferences: {
            nodeIntegration: true,
        },
    });

    win.webContents.addListener('did-finish-load', () => {
        loadingResolver();
    });

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        win.loadURL(process.env.WEBPACK_DEV_SERVER_URL + 'first');
        if (!process.env.IS_TEST) win.webContents.openDevTools();
    } else {
        createProtocol('app');
        // Load the index.html when not in development
        win.loadURL('app://./first.html');
    }

    win.on('closed', () => {
        win = null;

        win2.close();
        win2 = null;
    });

    createSecondWindow();
}

function createSecondWindow() {
    let displays = screen.getAllDisplays();
    let externalDisplay = displays.find(display => {
        return display.bounds.x !== 0 || display.bounds.y !== 0;
    });

    if (externalDisplay) {
        finishedLoadingPromise.then(() => {
            win.webContents.send('set-active-displays', 2);
        });

        win2 = new BrowserWindow({
            fullscreen: true,
            fullscreenable: true,
            webPreferences: {
                nodeIntegration: true,
            },
            x: externalDisplay.bounds.x,
            y: externalDisplay.bounds.y,
        });

        if (process.env.WEBPACK_DEV_SERVER_URL) {
            // Load the url of the dev server if in development mode
            win2.loadURL(process.env.WEBPACK_DEV_SERVER_URL + 'second');

            if (!process.env.IS_TEST) win2.webContents.openDevTools();
        } else {
            createProtocol('app');
            // Load the index.html when not in development
            win2.loadURL('app://./second.html');
        }

        win2.on('closed', () => {
            win2 = null;

            if (win) {
                win.webContents.send('set-active-displays', 1);
            }
        });
    }
}

app.on('open-file', (event, path) => {
    finishedLoadingPromise.then(() => {
        win.webContents.send('load-file-event', { path: filePaths[0] });
    });
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow();
    }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        // Devtools extensions are broken in Electron 6.0.0 and greater
        // See https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/378 for more info
        // Electron will not launch with Devtools extensions installed on Windows 10 with dark mode
        // If you are not using Windows 10 dark mode, you may uncomment these lines
        // In addition, if the linked issue is closed, you can upgrade electron and uncomment these lines
        try {
            await installVueDevtools();
        } catch (e) {
            console.error('Vue Devtools failed to install:', e.toString());
        }
    }
    createWindow();
});

const isMac = process.platform === 'darwin';

const template = [
    ...(isMac
        ? [
              {
                  label: app.name,
                  submenu: [
                      { role: 'about' },
                      { type: 'separator' },
                      { role: 'services' },
                      { type: 'separator' },
                      { role: 'hide' },
                      { role: 'hideothers' },
                      { role: 'unhide' },
                      { type: 'separator' },
                      { role: 'quit' },
                  ],
              },
          ]
        : []),
    {
        label: 'File',
        submenu: [
            {
                label: 'Open File',
                click() {
                    dialog
                        .showOpenDialog({
                            filters: [{ name: 'PDF', extensions: ['pdf'] }],

                            properties: ['openFile'],
                        })
                        .then(({ filePaths }) => {
                            win.webContents.send('load-file-event', { path: filePaths[0] });
                        });
                },
            },
            isMac ? { role: 'close' } : { role: 'quit' },
        ],
    },

    {
        label: 'View',
        submenu: [
            { role: 'reload' },
            { role: 'forcereload' },
            { role: 'toggledevtools' },
            { type: 'separator' },
            { role: 'resetzoom' },
            { role: 'zoomin' },
            { role: 'zoomout' },
            { type: 'separator' },
            { role: 'togglefullscreen' },
        ],
    },
    {
        label: 'Window',
        submenu: [
            { role: 'minimize' },
            { role: 'zoom' },
            ...(isMac ? [{ type: 'separator' }, { role: 'front' }, { type: 'separator' }, { role: 'window' }] : [{ role: 'close' }]),
        ],
    },
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', data => {
            if (data === 'graceful-exit') {
                app.quit();
            }
        });
    } else {
        process.on('SIGTERM', () => {
            app.quit();
        });
    }
}
