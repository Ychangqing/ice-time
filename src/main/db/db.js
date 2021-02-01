import DataStore from 'nedb'
import path from 'path'
const { app } = require('electron')

export default new DataStore({
  autoload: true,
  filename: path.join(app.getPath('userData'), '/data.db')
})
