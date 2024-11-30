#!/usr/bin/env node

import prompts from 'prompts'
import { execSync } from "child_process"
import fs from 'fs';
import path from 'path';

const runCommand = (cmd) => {
    try {
        execSync(cmd, { stdio: 'inherit' })
    } catch (error) {
        console.log(`Failed to execute ${cmd}`, error)
        return false
    }
    return true
}

const isDirectoryExists = (dirName) => {
    const dirPath = path.join(process.cwd(), dirName)
    return fs.existsSync(dirPath) && fs.lstatSync(dirPath).isDirectory()
};

prompts([
    {
        type: 'text',
        name: 'name',
        message: 'What is your project named',
        initial: 'myapp'
    },
    {
        type: 'select',
        name: 'project',
        message: 'What type of project you want to create',
        choices: [
            'NodeJs',
            'ReactJs',
            'NextJs'
        ],
        initial: 0
    },
    {
        type: 'toggle',
        name: 'language',
        message: 'Would you like to use TypeScript',
        initial: true,
        active: 'yes',
        inactive: 'no'
    }
]).then((answer) => {

    if (!answer.name || (answer.project === undefined) || (answer.language === undefined)) {
        console.log("Failed to execute, select all options!")
        process.exit(-1)
    }

    if(isDirectoryExists(answer.name)) {
        console.log("Failed to execute, Folder already exist!")
        process.exit(-1)
    }

    const { name, project, language } = answer

    const afterInstallationCmd = `cd ${name} && npm i -g yarn && yarn`
    const repoForNodejsInJs = `git clone --depth 1 https://github.com/Ramkrishnamaity/node-starter-js.git ${name}`
    const repoForNodejsInTs = `git clone --depth 1 https://github.com/Ramkrishnamaity/node-starter-ts.git ${name}`
    const repoForReactjsInJs = `git clone --depth 1 https://github.com/Ramkrishnamaity/react-starter-js.git ${name}`
    const repoForReactjsInTs = `git clone --depth 1 https://github.com/Ramkrishnamaity/react-starter-ts.git ${name}`
    const repoForNextjsInJs = `git clone --depth 1 https://github.com/Ramkrishnamaity/next-starter-js.git ${name}`
    const repoForNextjsInTs = `git clone --depth 1 https://github.com/Ramkrishnamaity/next-starter-ts.git ${name}`

    let cmd = ''
    if (project === 0) {
        if (!language) {
            cmd = repoForNodejsInJs
        } else {
            cmd = repoForNodejsInTs
        }
    } else if (project === 1) {
        if (!language) {
            cmd = repoForReactjsInJs
        } else {
            cmd = repoForReactjsInTs
        }
    } else {
        if (!language) {
            cmd = repoForNextjsInJs
        } else {
            cmd = repoForNextjsInTs
        }
    }
    const clone = runCommand(cmd)
    if (!clone) process.exit(-1)

    console.log(`Installing Dependecies for ${name}`)

    const installDep = runCommand(afterInstallationCmd)
    if (!installDep) process.exit(-1)

    console.log("Congratulations! you are ready. Folow the following commands to start")
    console.log(`cd ${name} && yarn dev`)

}).catch(error => {
    console.log("Failed to execute while creating your project!", error)
})