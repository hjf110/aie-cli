const ora = require('ora')
const {getRepoListVite} = require('./https')
const inquirer = require('inquirer')
const downloadGitRepo = require('download-git-repo')
const util = require('util')
const path = require("path");
const logSymbols = require('log-symbols');
const {create:{template}} = require('./config')
let timer;


class Generator {
    constructor(name, targetDir, templateType) {
        // 文件夹名称
        this.name = name;

        // 位置
        this.targetDir = targetDir;

        //模板类型
        this.templateType = templateType;

        this.downloadGitRepo = util.promisify(downloadGitRepo);

        this.chooseObj = {};
    }

    async create() {
        // 1）异步获取模板名称
        this.chooseObj = template.find(i => i.value === this.templateType);


        // switch (this.templateType) {
        //     case 'vite':
        //         let repo = await this.getRepo();
        //         // 同步对指定模版进行下载
        //         await this.download(repo)
        //         console.log(logSymbols.success, '模版安装成功！');
        //         clearTimeout(timer)
        //         break;
        // }

        let repo = await this.getRepo();
        // 同步对指定模版进行下载
        await this.download(repo)
        console.log(logSymbols.success, '模版安装成功！');
        clearTimeout(timer)

        // const repo = await this.getRepo()
        // console.log(repo);

    }

    async download({name, branch, git_user}) {
        // 拼接链接
        const requestUrl = `direct:https://github.com/${git_user}/${name}/archive/refs/heads/${branch}.zip`

        // 2min 之后弹出，显示超时
        timer = setTimeout(() => {
            clearTimeout(timer)
            throw ('模版下载超时，请重试！')
        }, 1000 * 60 * 2);
        // 调用下载方法，进行远程下载
        await wrapLoading(
            this.downloadGitRepo,
            '正在下载目标模版中...',
            requestUrl,
            path.resolve(process.cwd(), this.targetDir)
        )
    }

    /**
     *  获取用户选择的模版
     *       1.远程拉取模版数据
     *       2.用户选择所要下载的模版名称
     *       3.return用户选择的名称
     * @return {Promise<{git_user: (string|*), name, branch: *}>}
     */
    async getRepo() {
        const repoList = await wrapLoading(()=>getRepoListVite(this.chooseObj.list), '获取目标模版中...')
        // 空则终止执行
        if (!repoList) return
        // 筛选指定项目，只要目标模版系列
        // const repos = repoList.filter(item => item.name.indexOf('zzy-react-project') !== -1)

        // 2）用户选择需要下载的模板名称
        const {repo} = await inquirer.prompt({
            name: 'repo',
            type: 'list',
            choices: repoList.map(item => ({
                name: `${item.name} ( ${item.description} )`,
                value: item.name
            })),
            message: this.chooseObj.choose
        })
        //
        // 3. return用户选择
        const selectRepos = repoList.find(item => item.name === repo);
        return {name: selectRepos.name, branch: selectRepos.default_branch, git_user: selectRepos.git_user};
    }
}

// 添加加载动画
async function wrapLoading(fn, message, ...args) {
    // ora初始化，传入提示 message
    const spinner = ora(message)
    // 开始
    spinner.start()
    try {
        // 执行fn
        const result = await fn(...args)
        // 成功
        spinner.succeed()
        return result
    } catch (e) {
        console.error(e)
        // 失败
        spinner.fail('请求失败，请重试...')
        return null
    }
}

module.exports = Generator;
