const {app, BrowserWindow, Menu, ipcMain} = require('electron');
var mysql = requiere('mysql');
const url = require('url');
const path = require('path');
if(process.env.NODE_ENV !== 'production'){
    require('electron-reload')(__dirname,{
        electron: path.join(__dirname, '../node_modules','.bin','electron')
    })
}
var cxn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: null,
    database:'reycell'
});

cxn.connect(function(err){
    if(err){
        console.log(err.code);
        console.log(err.fatal);
    }
});

let mainWindow
let newClientWindow
let newProductWindow
let searchWindow
app.on('ready', ()=>{
    mainWindow = new BrowserWindow({});
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname,'views/index.html'),
        protocol: 'file',
        slashes: true
    }));

    const mainMenu = Menu.buildFromTemplate(templateMenu);
    Menu.setApplicationMenu(mainMenu);
    
    mainWindow.on('closed',()=>{
        app.quit();
    })
});
function createNewClientWindow(){
    newClientWindow = new BrowserWindow({
        width: 400,
        heigth:330,
        title:'Nuevo Cliente'
    });
    newClientWindow.setMenu(null);
    newClientWindow.loadURL(url.format({
        pathname: path.join(__dirname,'views/new_client.html'),
        protocol: 'file',
        slashes: true
    }));
    newClientWindow.on('closed',()=>{
        newClientWindow=null;
    })
}

ipcMain.on('client:new', (e, newClient)=>{
    mainWindow.webContents.send('client:new', newClient);
    newClientWindow.close();
});

function createNewProducttWindow(){
    newProductWindow = new BrowserWindow({
        width: 400,
        heigth:330,
        title:'Agregar dispositivo'
    });
    newProductWindow.setMenu(null);
    newProductWindow.loadURL(url.format({
        pathname: path.join(__dirname,'views/new_product.html'),
        protocol: 'file',
        slashes: true
    }));
    newProductWindow.on('closed',()=>{
        newProductWindow=null;
    })
}

ipcMain.on('product:new', (e, newProduct)=>{
    mainWindow.webContents.send('product:new', newProduct);
    newProductWindow.close();
});

const templateMenu = [
    {
        label:'Archivo',
        submenu: [
            {
                label: 'Nuevo Cliente',
                accelerator: 'Ctrl+N',
                click(){
                    createNewClientWindow();
                }   
            },
            {
                label:'Buscar',
                accelerator:'Ctrl+B',
                click(){
                    createNewProducttWindow();
                }
            },
            {
                label:'Salir',
                accelerator:'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    },
    
];