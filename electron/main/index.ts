import { app, BrowserWindow } from 'electron'
import { join, resolve } from 'path'
import { startServer } from './server/index'

startServer()

function createWindow(): void {
  const rootDir = resolve(__dirname, '../../')
  const iconPath = resolve(rootDir, 'electron/assets/icon.png')
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    icon: iconPath,
    webPreferences: {
      preload: join(__dirname, '../preload/index.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  if (!app.isPackaged && process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  if (process.platform === 'darwin') {
    const rootDir = resolve(__dirname, '../../')
    app.dock.setIcon(resolve(rootDir, 'electron/assets/icon.png'))
  }
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
