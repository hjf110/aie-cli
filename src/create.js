const path = require('path');
const fs = require('fs-extra');
const inquirer = require('inquirer');

const Generator = require('./generator')
const {create:{template}} = require('./config')


const ask = () => {
    return new Promise(async (resolve, reject) => {
        //询问用户
        let {value} = await inquirer.prompt([
            {
                name: 'value',
                type: 'list',
                message: '目录已存在 , 请选择一项进行操作:',
                choices: [
                    {name: '覆盖', value: 'overwrite'},
                    {name: '取消', value: false},
                ]
            }
        ])

        if (!value) {
            reject();
        } else {
            resolve(value)
        }
    })
}

const creatingFolder = async (targetDir = '',name, force = false) => {
    if (force) {
        //先删除文件
        fs.removeSync(targetDir);
        //在创建文件夹
        fs.ensureDirSync(targetDir);
    }

    const { templateType } = await inquirer.prompt({
        name: 'templateType',
        type: 'list',
        choices: template.map(i=>({
            name:i.title,
            value:i.value,
        })),
        message: '请选择一个模版进行创建'
    })

    const generator = new Generator(name, targetDir,templateType)
    await generator.create()


}

module.exports = async function (name, options) {
    try {
        // 获取当前目录
        const cwd = process.cwd();
        // 获取目标文件夹地址
        const targetDir = path.join(cwd, name);

        let is_have = !!!fs.ensureDirSync(targetDir);
        if (is_have) {//存在

            if (options.force) {//如果是强制创建
               await creatingFolder(targetDir,name, true);
            } else {
                //询问客户
                let action = await ask();
                if (action === 'overwrite') {
                    // 移除已存在的目录
                    await creatingFolder(targetDir,name, true);
                }

            }

        } else {//不存在的但是文件夹已经是创建了
            await creatingFolder(targetDir,name)
        }


    } catch (e) {
        !!e && console.error(e)
    }


}
