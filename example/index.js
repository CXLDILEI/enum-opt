import parser from '@babel/parser';
import traverse from '@babel/traverse';
import fs from 'fs';
import ejs from 'ejs';
import path from "path";
import * as process from "process";
let config = undefined;
function createAsset(entry) {
    const enumPath = path.resolve(process.cwd(), entry);
    const source = fs.readFileSync(enumPath, {
        encoding: "utf-8"
    });
    const ast = parser.parse(source, {
        sourceType: 'module',
        ranges: false,
        plugins: ['typescript']
    });
    let optionsData = [];
    traverse.default(ast, {
        TSEnumDeclaration({ node }) {
            optionsData.push({
                name: `${toLowerCaseFirstLetter(node.id.name)}Options`,
                options: getOptions(node.members, node.id.name),
                startLine: node.loc.start.line,
                sourceEnum: node.id.name,
                comments: findComments(ast.comments, node.loc.start.line)
            });
        },
    });
    return optionsData;
}
function simplifyLabel(label) {
    return label.replace(/(\*|\r|\n|\s)/g, '');
}
function getOptions(members, name) {
    return members.map((item) => {
        let label = '';
        if (Array.isArray(item.leadingComments)) {
            label = simplifyLabel(item.leadingComments[0].value);
        }
        let value = `${name}.${item.id.name}`;
        return {
            label,
            value
        };
    });
}
function generate(data, fileName, enumPath) {
    const template = fs.readFileSync('../template/options.ejs', {
        encoding: "utf-8"
    });
    const outputPath = path.resolve(process.cwd(), config?.outDir || '.', fileName);
    const code = ejs.render(template, { data, enumPath });
    fs.writeFileSync(outputPath, code, {
        encoding: "utf-8"
    });
}
function toLowerCaseFirstLetter(str) {
    return str.substring(0, 1).toLocaleLowerCase() + str.substring(1);
}
function findComments(comments, startLine) {
    const node = comments.find((item) => {
        return item.loc.end.line === (startLine - 1);
    });
    if (node) {
        return simplifyLabel(node.value);
    }
    else
        return '';
}
function readConfigFile() {
    const jsonConfigPath = path.join(process.cwd(), 'enumoptconfig.json');
    const hasJsonConfig = fs.existsSync(jsonConfigPath);
    // const jsConfigPath = path.join(process.cwd(), '.enumoptrc.js')
    // const hasJSConfigPath = fs.existsSync(jsConfigPath)
    if (hasJsonConfig) {
        const configJson = fs.readFileSync(jsonConfigPath, {
            encoding: 'utf-8'
        });
        return JSON.parse(configJson);
    }
    else {
        throw Error('config file not found please create enumoptconfig.json or .enumoptrc.js in the root directory');
    }
}
function transformToken(path) {
    return path.replace(/\\/, '/').replace(/\.ts/, '');
}
function analysisConfig(config) {
    if (typeof config.entry === "string") {
        const data = createAsset(config.entry);
        const fileName = path.parse(config.entry).name;
        const enumPath = transformToken(path.relative(config.outDir || process.cwd(), config.entry));
        generate(data, `${fileName}-opt.ts`, enumPath);
    }
    else if (config.entry && typeof config.entry === "object") {
        for (const key in config.entry) {
            const enumPath = transformToken(path.relative(config.outDir || process.cwd(), config.entry[key]));
            const data = createAsset(config.entry[key]);
            generate(data, `${key}.ts`, enumPath);
        }
    }
    else {
        throw Error('The entry attribute is missing from the configuration file');
    }
}
function main() {
    config = readConfigFile();
    analysisConfig(config);
}
main();
//# sourceMappingURL=index.js.map