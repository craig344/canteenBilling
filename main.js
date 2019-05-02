const electron = require('electron');
const url = require('url');
const path = require('path');
const user = require('./models/user.js');

const { app, BrowserWindow, Menu, ipcMain } = electron;

//set environment
process.env.NODE_ENV = 'development';

let mainWindow;
let addWindow;
let dashboardWindow;

//Listen for app ready
app.on('ready', function () {
    createMainWindow();
});

function createMainWindow() {
    //create new window
    mainWindow = new BrowserWindow({});
    //Load html into window

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, './pages/login.html'),
        protocol: 'file:',
        slashes: true
    }));


    mainWindow.maximize();


    //Build Menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

    //Insert menu
    Menu.setApplicationMenu(mainMenu);
}

//Handle createAddWindow
function createDashWindow(item) {
    //create new window
    dashboardWindow = new BrowserWindow({
        title: 'Add Shopping List Item'
    });
    //Load html into window

    dashboardWindow.loadURL(url.format({
        pathname: path.join(__dirname, './pages/blank.html'),
        protocol: 'file:',
        slashes: true
    }));
    dashboardWindow.maximize();
    dashboardWindow.webContents.on('did-finish-load', () => {
        dashboardWindow.webContents.send('data', item)
      })
    //Quit app when closed
    dashboardWindow.on('closed', function () {
       // app.quit();
    });
    //Garbage collection handle
    dashboardWindow.on('close', function () {
        dashboardWindow = null;
    });
}

//catch item:add
ipcMain.on('item:add', function (event, item) {
    mainWindow.webContents.send('item:add', item);
    addWindow.close();
});


//catch item:login
ipcMain.on('item:login', function (event, item) {
    createDashWindow(item);
    mainWindow.close();

});
//catch item:logout
ipcMain.on('item:logout', function (event, item) {
    createMainWindow();
    dashboardWindow.close();

});

//create menu template

const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Add Item',
                click() {
                    createAddWindow();
                }
            },
            {
                label: 'Clear Items',
                click() {
                    mainWindow.webContents.send('item:clear');
                }
            },
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    app.quit();
                }
            }
        ]
    }
];

//If mac, add empty object to menu
if (process.platform == 'darwin') {
    mainMenuTemplate.unshift({});
}

//add developer tools item if  not in production
if (process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle Dev Tools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',

                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    });
}