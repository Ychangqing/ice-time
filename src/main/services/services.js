let path = require("path")

export async function gitBranch(workingDir) {
    const gitP = require('simple-git/promise')(workingDir)
    let branchSummary = null;
    try {
        branchSummary = await gitP.branchLocal();
    }
    catch (e) {
        console.error('gitBranch:', e)
    }
    return branchSummary;
}


export async function gitStatus(workingDir) {
    const gitP = require('simple-git/promise')(workingDir)
    let statusSummary = null;
    try {
        statusSummary = await gitP.status();
    }
    catch (e) {
        console.error('gitStatus_:', e)
    }
    return statusSummary;
}

export async function gitAddPush(workingDir) {
    // const gitP = require('simple-git/promise')(workingDir)
    let res = new Promise(async (resolve, reject) => {
        let git = require('simple-git')(workingDir)
        git.add('./*')
            .commit("Electron auto commit!", (err, res) => {
                git.push(['origin', 'master'], (err, res) => {
                    if (err) {
                        return reject(err)
                    }
                    resolve(true)
                })
            })

    })
    return await res
}

export async function gitDiff(arg) {
    console.log(arg)
    const gitP = require('simple-git/promise')(arg.workingDir)
    try {
        await gitP.fetch('origin')
    }
    catch (e) {
        console.error('gitFetch_:', e)
    }

    let diffSummary = null;
    let diffSummaryArg = arg.diffArg || 'origin/master'
    try {
        diffSummary = await gitP.diffSummary(diffSummaryArg)
    }
    catch (e) {
        console.error('gitDiff_:', e)
    }
    return diffSummary;
}

export function gitProjectName(workingDir) {
    let splited = workingDir.split('/')
    let projectName = splited[splited.length - 1]
    return projectName
}

export function getPropsDictObject(filePath, props, type, findKey) {
    const LineByLine = require('./readlinesyn');
    let liner = new LineByLine();
    liner.open(filePath);
    let theline;
    let openingBrace = 0;
    let closeBrace = 0;
    let start = false
    let key = findKey || 'props'
    let res = ''
    while (!liner._EOF) {
        theline = liner.next();
        if (!theline) {
            continue
        }
        console.log(theline, key + ": '" + props + "',", theline.indexOf(key + ": '" + props + "',"))
        if (theline.indexOf(key + ": '" + props + "',") > 0) {
            start = true
            continue
        }
        if (!start) {
            continue
        }
        if (theline.indexOf(type + ': {') > 0) {
            openingBrace += 1
            res = theline + '\n'
            continue
        }
        if (!res) {
            continue
        }

        let openingBraceLen = theline.split("{").length - 1
        let closeBraceLen = theline.split("}").length - 1

        openingBrace = openingBraceLen > 0 ? openingBrace + openingBraceLen : openingBrace
        closeBrace = closeBraceLen > 0 ? closeBrace + closeBraceLen : closeBrace

        res = res ? res + theline + '\n' : res

        if (openingBrace === closeBrace) {
            break
        }
    }
    liner.close();
    return res
}
