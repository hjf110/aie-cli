const { Command } = require('commander');
const program = new Command();

program.version('0.0.1')


program
    .command('create <name>')
    .option('-f, --force', '是否强制覆盖')
    .description('创建项目')
    .action(require('./create.js'))


// program
//     .command('del <name>')
//     .option('-f, --force', '是否强制覆盖')
//     .description('创建项目')
//     .action((name,options)=>{
//         console.log(name,options,22222)
//         // require('./create.js')(name, options)
//     })


program.parse(process.argv);
