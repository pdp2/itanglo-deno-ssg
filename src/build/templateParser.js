import { relative } from "https://deno.land/std@0.106.0/path/mod.ts";

export default {
    async parse(tmplStr, data = {}, destinationPath = './docs') {
        return new Promise(async resolvePromise => {
            let output = tmplStr;
            output = await parseForLoops(output, data);
            output = await parseIncludes(output, data);

            // insert remaining data
            const dataKeys = Object.keys(data);

            for (const key of dataKeys) {
                if (typeof data[key] === 'string') {
                    const regex = new RegExp(`{{(${key})}}`);
                    
                    output = output.replace(regex, () => {
                        return data[key];
                    });
                }
                else if (typeof data[key] === 'object') {
                    const objName = key;
                    const objProps = Object.keys(data[key]);

                    for (const prop of objProps) {
                        output = output.replace(new RegExp(`{{${objName}\\.${prop}}}`, 'g'), () => {
                            return data[objName][prop];
                        });
                    }
                }
            }

            // update resource paths
            const pathMatches = output.matchAll(/href="(\.\/[a-zA-Z0-9\-\/\.]+)"/g);

            for (const match of pathMatches) {
                const path = match[1];
                output = output.replace(path, relative(destinationPath, path));
            }

            resolvePromise(output);
        });
    }
}

async function parseForLoops(tmplStr, data) {
    return new Promise(async resolvePromise => {
        const forLoopMatches = [...tmplStr.matchAll(/\<(\w+)\s+for="(\w+)\s+in\s+(\w+)"\>\s*([\s\S]+)\<\/\1\>/g)];
        let output = tmplStr;

        for (const match of forLoopMatches) {
            const [matchStr, tagName, itemName, arrayName, loopTmplStr] = match;
            const loopData = data[arrayName] || [];
            let loopOutput = '';

            for (const dataItem of loopData) {
                let loopItemOutput = loopTmplStr;
                loopItemOutput = await parseIncludes(loopItemOutput, dataItem, itemName);

                if (typeof dataItem === 'string') {
                    loopItemOutput = loopItemOutput.replace(new RegExp(`{{${itemName}}}`, 'g'), dataItem);
                }
                else {
                    loopItemOutput = loopItemOutput.replace(new RegExp(`{{${itemName}\\.(\\w+)}}`, 'g'), (match, key) => {
                        return dataItem[key];
                    });
                }

                loopOutput += `<${tagName}>${loopItemOutput}</${tagName}>`;
            }

            output = output.replace(matchStr, loopOutput);
        }

        resolvePromise(output);
    });
}

async function parseIncludes(tmplStr, dataItem, itemName ){
    return new Promise(async resolvePromise => {
        const includeMatches = [...tmplStr.matchAll(/<include src="([./\w-]+.tmpl.html)"\s*(?:data="(\w+)")?>/g)];
        let output = tmplStr;
    
        for (const match of includeMatches) {
            const [matchStr, path, key] = match;

            let includeTmplStr = await Deno.readTextFile(path);

            if (typeof dataItem === 'string' && key === itemName) {
                includeTmplStr = includeTmplStr.replace(new RegExp(`{{${key}}}`, 'g'), dataItem);
            }
            else if (typeof dataItem === 'object') {
                const dataKeys = Object.keys(dataItem);

                for (const key of dataKeys) {
                    includeTmplStr = includeTmplStr.replace(new RegExp(`{{(${key})\\.(\\w+)}}`, 'g'), (match, key, prop) => {
                        return dataItem[key][prop];
                    });
                }
            }

            output = output.replace(matchStr, includeTmplStr);
        }
    
        resolvePromise(output);
    });
}