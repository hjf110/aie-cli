const {version} = require("../package.json");
module.exports = {
    version,
    create:{
        template:[
            {
                title:'vite 社区模板',
                value:'vite',
                choose:'请选择一个vite社区模版进行创建',
                list:[
                    {
                        git_user:'pohunchn',
                        template_name:['vite-ts-quick']
                    },
                    {
                        git_user:'snowdreamtech',
                        template_name:['vite-vue3-tsx-starter']
                    },
                    {
                        git_user:'parajs',
                        template_name:['vue3-mobile-template','vue3-pc-template']
                    },
                ]
            },
            {
                title:'vue 后台管理',
                value:'vue-management',
                choose:'请选择一个vue 后台管理社区模版进行创建',
                list:[
                    {
                        git_user:'pohunchn',
                        template_name:['vite-ts-quick']
                    }
                ]
            }
        ]
    }
}
