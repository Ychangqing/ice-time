import { BrowserWindow, ipcMain } from 'electron'
import config from '@config'
import setIpc from './ipcMain'
import electronDevtoolsInstaller, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import upload from './checkupdate'
import path from 'path'
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
// 这个瓜皮全局变量只能在单个js中生效，而并不是整个主进程中
if (process.env.NODE_ENV !== 'development') {
  global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\')
}
// 将文件地址挪到这里
const winURL = process.env.NODE_ENV === 'development' ? 'http://localhost:9081/' : `file://${__dirname}/index.html`
const loadingURL = process.env.NODE_ENV === 'development' ? 'http://localhost:9081/static/loader.html' : `file://${__static}/loader.html`
var loadWindow = null
var mainWindow = null

function createMainWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 800,
    useContentSize: true,
    width: 1700,
    minWidth: 1366,
    show: false,
    frame: config.IsUseSysTitle,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      // 如果是开发模式可以使用devTools
      devTools: process.env.NODE_ENV === 'development',
      // 在macos中启用橡皮动画
      scrollBounce: process.platform === 'darwin'
    }
  })

  mainWindow.loadURL(winURL)

  setIpc.Mainfunc(ipcMain, mainWindow, config.IsUseSysTitle)
  upload.Update(mainWindow)

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.once('dom-ready', () => {
      mainWindow.show()
      electronDevtoolsInstaller(VUEJS_DEVTOOLS)
        .then((name) => console.log(`installed: ${name}`))
        .catch(err => console.log('Unable to install `vue-devtools`: \n', err))
      loadWindow.destroy()
    })
  } else {
    mainWindow.webContents.once('dom-ready', () => {
      mainWindow.show()
      loadWindow.destroy()
    })
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

function loadindWindow() {
  loadWindow = new BrowserWindow({
    width: 400,
    height: 600,
    frame: false,
    backgroundColor: '#222428',
    transparent: true,
    webPreferences: { experimentalFeatures: true }
  })

  loadWindow.loadURL(loadingURL)

  loadWindow.show()

  setTimeout(() => {
    createMainWindow()
  }, 2000)
}

function initWindow() {
  if (config.UseStartupChart) {
    return loadindWindow()
  } else {
    return createMainWindow()
  }
}
export default initWindow
