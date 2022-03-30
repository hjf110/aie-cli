// 远程下载模版
const axios = require('axios')


// const templateUrl = [
//     {
//         git_user:'pohunchn',
//         template_name:['vite-ts-quick']
//     },
//     {
//         git_user:'snowdreamtech',
//         template_name:['vite-vue3-tsx-starter']
//     },
//     {
//         git_user:'parajs',
//         template_name:['vue3-mobile-template','vue3-pc-template']
//     },
// ]


axios.interceptors.response.use(res => {
    return res.data;
})





/**
 * 获取模板列表
 * @returns Promise
 */
async function getRepoListVite(templateUrl) {

    try {
        let vList = [];
        for (let i = 0; i < templateUrl.length; i++) {
            let _info = templateUrl[i];
            let v = [] = await axios.get(`https://api.github.com/users/${_info.git_user}/repos`);
            let _v = [];
            for (let j = 0; j < _info.template_name.length; j++) {
                let _name = _info.template_name[j];
                let __v = v.filter(g=>g.name===_name);
                _v = [..._v,...__v];
            }
            let _vv =  _v.map(i=>({...i,git_user:_info.git_user}));
            vList = [...vList,..._vv];
        }
        return Promise.resolve(vList)
    } catch (e) {
        console.error(e);
        return Promise.reject(false)
    }


}

module.exports = {
    getRepoListVite
}
