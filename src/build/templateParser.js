import { relative } from "https://deno.land/std@0.106.0/path/mod.ts";

export default {
    async parse(tmplStr, data = {}, destinationPath = './docs') {
        return new Promise(async resolvePromise => {
            let output = tmplStr;
            output = await parseForLoops(output, data);
            output = await parseIncludes(output);

            // insert remaining data
            const dataKeys = Object.keys(data);

            dataKeys.forEach(key => {
                const regex = new RegExp(`{{(${key})}}`);
                const match = output.match(regex);
                
                if (match) {
                    output = output.replace(match[0], data[match[1]]);
                }
            });

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

                if (typeof dataItem === 'string') {
                    loopItemOutput = await parseIncludes(loopItemOutput, itemName, dataItem);

                    const refMatchRegEx = new RegExp(`{{${itemName}}}`, 'g');
                    const refMatches = loopTmplStr.matchAll(refMatchRegEx);

                    if (refMatches) {
                        for (const refMatchArray of refMatches) {
                            loopItemOutput = loopItemOutput.replace(refMatchArray[0], dataItem);
                        }
                    }
                }
                else {
                    loopItemOutput = await parseIncludes(loopItemOutput, itemName, dataItem);

                    const refMatchRegEx = new RegExp(`{{${itemName}\\.(\\w+)}}`, 'g');
                    const refMatches = [...loopTmplStr.matchAll(refMatchRegEx)];

                    for (const refMatchArray of refMatches) {
                        const [refMatch, dataKey] = refMatchArray;
                        const dataToInsert = dataItem[dataKey];

                        if (dataToInsert) {
                            loopItemOutput = loopItemOutput.replace(refMatch, dataToInsert);
                        }
                    }   
                }

                loopOutput += `<${tagName}>${loopItemOutput}</${tagName}>`;
            }

            output = output.replace(matchStr, loopOutput);
        }

        resolvePromise(output);
    });
}

async function parseIncludes(tmplStr, itemName, dataItem){
    return new Promise(async resolvePromise => {
        const includeMatches = [...tmplStr.matchAll(/<include src="([./\w-]+.tmpl.html)"\s*(?:data="(\w+)")?>/g)];
        let output = tmplStr;
    
        for (const match of includeMatches) {
            const [matchStr, path, key] = match;
            let includeTmplStr = await Deno.readTextFile(path);
            if (dataItem && key === itemName) {
                if (typeof dataItem === 'string') {
                    includeTmplStr = includeTmplStr.replace(new RegExp(`{{${key}}}`, 'g'), dataItem);
                }
                else {
                    includeTmplStr = includeTmplStr.replace(new RegExp(`{{${itemName}\\.(\\w+)}}`, 'g'), (match, p1) => {
                        return dataItem[p1];
                    });
                }
            }

            output = output.replace(matchStr, includeTmplStr);
        }
    
        resolvePromise(output);
    });
}