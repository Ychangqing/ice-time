
const { adddata, finddata, findone, deleone, deleall } = require('../db/operationalData').default
const projectProcess = {}
const projectStatus = {}
const execa = require('execa')
const terminate = require('terminate')



export default {
  Mainfunc(ipc, mainWindow, IsUseSysTitle) {
    ipc.on('IsUseSysTitle', (event) => {
      const data = IsUseSysTitle
      event.reply('CisUseSysTitle', data)
    })

    ipc.on('windows-mini', () => {
      mainWindow.minimize()
    })

    ipc.on('window-max', (event) => {
      if (mainWindow.isMaximized()) {
        event.reply('window-confirm', false)
        mainWindow.restore()
      } else {
        event.reply('window-confirm', true)
        mainWindow.maximize()
      }
    })

    ipc.on('window-close', () => {
      mainWindow.close()
    })

    ipc.handle('getProjectsStatu', async (event, arg) => {
      return projectStatus
    })

    ipc.handle('stopProject', async (event, arg) => {
      const { pid } = projectProcess[arg]
      terminate(pid, err => {
        if (err) {
          console.log('stopProject error: ', err)
        }
        projectProcess[arg] = null;
        projectStatus[arg] = false;
      })
      return projectStatus
    })

    ipc.handle('runProject', async (event, arg) => {

      try {
        projectProcess[arg] = execa(
          'npm',
          ['run', 'dev'],
          {
            cwd: arg,
            stdio: ['inherit', 'pipe', 'pipe']
          },
        )

        projectProcess[arg].stdout.on('data', buffer => {
          projectStatus[arg] = true;
        });
        projectProcess[arg].on('close', () => {
          projectProcess[arg] = null;
          projectStatus[arg] = false;
        });

        projectProcess[arg].on('error', error => {
          projectProcess[arg] = null;
          projectStatus[arg] = false;
        });
      } catch (error) {
        projectProcess[arg] = null
        projectStatus[arg] = false
      }
    })

    ipc.handle('openWithVSCode', async (event, arg) => {
      var openInEditor = require('open-in-editor');
      var editor = openInEditor.configure({
        editor: 'code',
      }, function (err) {
        console.error('openInEditor configure error: ' + err);
      });

      editor.open(arg)
        .then(function () {
        }, function (err) {
          console.error('editor open error: ' + err);
        });
      return true
    })

    ipc.handle('gitStatus', async (event, arg) => {
      const { gitStatus } = require('./services')
      let statusSummary = await gitStatus(arg.workingDir)
      return statusSummary
    })

    ipc.handle('gitDiff', async (event, arg) => {
      const { gitDiff } = require('./services')
      let diffSummary = await gitDiff(arg)
      return diffSummary
    })

    ipc.handle('gitProjectName', async (event, arg) => {
      const { gitProjectName } = require('./services')
      return gitProjectName(arg)
    })

    ipc.handle('gitUtils', async (event, arg) => {
      const { gitStatus, gitDiff, gitProjectName } = require('./services')
      let statusSummary = await gitStatus(arg.workingDir)

      let diffMasterSummary = await gitDiff(arg)

      let projectName = gitProjectName(arg.workingDir)

      return { statusSummary: statusSummary.files, diffSummary: diffMasterSummary.files, projectName: projectName }
    })

    ipc.handle('getPropsDictObject', (event, arg) => {
      const { getPropsDictObject } = require('./services')
      return getPropsDictObject(arg.propsDictPath, arg.props, arg.type, arg.key)
    })

    ipc.handle('getLanguage', (event, arg) => {
      const { getLanguage } = require('./services')
      return getLanguage(arg.workingDir, arg.props, arg.targetDir)
    })

    ipc.handle('DB_deleall', async (event, arg) => {
      try {
        await deleall({})
        return true
      } catch (error) {
        console.log(error)
      }
    })

    ipc.handle('DB_delWithID', async (event, arg) => {
      try {
        const project = await findone({ _id: arg })
        if (project && projectProcess[project.path]) {
          const { pid } = projectProcess[project.path]
          terminate(pid, err => {
            if (err) {
              console.log('stopProject error: ', err)
            }
          })
          projectProcess[project.path] = null;
          projectStatus[project.path] = false;
        }
        await deleone({ _id: arg })
        return { projectProcess, projectStatus }
      } catch (error) {
        console.log(error)
      }
    })

    ipc.handle('DB_getAll', async (event, arg) => {
      try {
        const res = await finddata({})
        return res
      } catch (error) {
        console.log(error)
      }
    })

    ipc.handle('importPro', async (event, arg) => {
      const { dialog } = require('electron')
      const fs = require('fs');
      const uuid = require('node-uuid');

      const LineByLine = require('./readlinesyn')
      let port = null

      try {
        const filePaths = await dialog.showOpenDialogSync({ properties: ['openDirectory'], message: '导入项目' })
        if (!filePaths || filePaths.length === 0) {
          return
        }
        const filePath = filePaths[0]
        let stat = fs.lstatSync(filePath)
        if (!stat.isDirectory()) {
          return
        }

        try {
          stat = fs.lstatSync(filePath + '/package.json')
          if (!stat.isFile()) {
            return
          }
          stat = fs.lstatSync(filePath + '/config/index.js')
          if (!stat.isFile()) {
            return
          }
        } catch (error) {
          console.log('error', error)
          return
        }

        let liner = new LineByLine();
        liner.open(filePath + '/config/index.js');
        while (!liner._EOF) {
          let theline = liner.next();
          if (!theline) {
            continue;
          }
          if (theline.indexOf('port:') > 0) {
            port = parseInt(theline.split('port:')[1])
            liner.close();
          }
        }
        liner.close();
        const packageFile = JSON.parse(fs.readFileSync(filePath + '/package.json'));
        if (!packageFile.zenlayerWork) {
          return
        }

        const { gitBranch } = require('./services')
        let statusSummary = await gitBranch(filePath)
        let branchName = statusSummary.current

        const dupPro = await findone({ path: filePath })
        if (dupPro) {
          return
        }


        const id = uuid.v1()
        await adddata({
          _id: id,
          path: filePath,
          port: port,
          name: packageFile.name,
          barnch: branchName
        })
        let res = await finddata({})
        return res
      } catch (error) {
        console.log(error)
      }
    })

    ipc.handle('updateZenUI', async (event, path) => {
      let res = new Promise(async (resolve, reject) => {
        const { gitStatus, gitDiff, gitAddPush } = require('./services')
        let statusSummary = await gitStatus(path)
        if (statusSummary && statusSummary.files.length > 0) {
          reject('有未提交的代码')
        }

        let diffSummary = await gitDiff({ workingDir: path })
        if (diffSummary && diffSummary.files.length > 0) {
          reject('和主分支代码不一致，需要先pull')
        }
        let updateExeca = execa(
          'npm',
          ['update', '@zenlayer/zen-ui'],
          {
            cwd: path,
            stdio: ['inherit', 'pipe', 'pipe']
          },
        )

        updateExeca.on('close', async (res) => {
          if (res !== 0) {
            return
          }
          try {
            let pushRes = await gitAddPush(path)
            console.log('pushRes', pushRes)
            resolve(true)
          } catch (error) {
            reject(error)
          }
        });

        updateExeca.on('error', error => {
          console.log('error', error)
          reject(error)
        });
      })
      return res
    })

  }
}
