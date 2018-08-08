const { execSync } = require('child_process');
const { readdirSync } = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
const yargs = require('yargs');

const inputBasePath = '/defs';
const outDir = '/defs/gen/pb-js';
const pbjsPath = path.resolve(path.join(__dirname, 'node_modules/.bin/pbjs'));
const pbtsPath = path.resolve(path.join(__dirname, 'node_modules/.bin/pbts'));

const execOptions = {
    cwd: inputBasePath
};

const argv = yargs
    .options({
        'd': {
            alias: 'dir',
            array: true,
            default: [],
            describe: 'Causes all .proto files in the specified directory to be processed'
        },
        // 'f': {
        //     alias: 'file',
        //     array: true,
        //     describe: 'Indicates file(s) to be processed'
        // },
        'module-name': {
            demandOption: true,
            describe: 'The name to be used for the output JS/TS module files',
            type: 'string'
        }
    })
    .argv;

const {
    moduleName,
    _: untouchedArgs, // Args on the other side of -- will be passed directly to pbjs
    dir: processDirectories
} = argv;

const jsOutputPath = `${outDir}/${moduleName}.js`;
const tsOutputPath = `${outDir}/${moduleName}.d.ts`;

// Collect .proto files from specified directories
const isProtoFile = fileName => (fileName.substring(fileName.length - 6) === '.proto');
const fileList = processDirectories.reduce((out, dirName) => {
    const finalDir = path.resolve(path.join(inputBasePath,dirName));
    const files = readdirSync(finalDir)
        .filter(isProtoFile)
        .map(f => `${finalDir}/${f}`);
    return out.concat(files);
},[]);

// Ensure our output directory
mkdirp.sync(outDir);

const pbjsArgs = [
    `-o ${outDir}/${moduleName}.js`,
    ...untouchedArgs,
    ...fileList,
].join(' ');

console.log('Generating JS module...');
execSync(`${pbjsPath} ${pbjsArgs}`, execOptions);

const pbtsArgs = [`-o ${tsOutputPath}`, jsOutputPath].join(' ');
console.log('Generating TypeScript defintions...');
execSync(`${pbtsPath} ${pbtsArgs}`);
