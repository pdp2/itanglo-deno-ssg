import { relative } from "https://deno.land/std@0.106.0/path/mod.ts";

export default {
    async parse(fileContent, data = {}, destinationPath = './docs') {
        return new Promise(async resolvePromise => {
            let output = await parseIncludes(fileContent);
            output = await parseForLoops(output, data);

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

async function parseIncludes(fileContent){
	return new Promise(async resolvePromise => {
		// matchAll returns a RegExp iterator
		const includeMatches = fileContent.matchAll(/<include src="([./\w-]+.tmpl.html)">/g);
	
		let output = fileContent;
	
		for (const matchArray of includeMatches) {
			const [match, path] = matchArray;
			const includeTmpl = await Deno.readTextFile(path);
			output = output.replace(match, includeTmpl);
		}
	
		resolvePromise(output);
	});
}

async function parseForLoops(fileContent, data) {
    return new Promise(async resolvePromise => {
        const forLoopMatches = fileContent.matchAll(/\<(\w+)\s+for="(\w+)\s+in\s+(\w+)"\>\s*([\s\S]+)\<\/\1\>/g);
        let output = fileContent;

        for (const matchArray of forLoopMatches) {
            const [match, tagName, itemName, arrayName, tmplExpression] = matchArray;
            const loopData = data[arrayName];
            let loopOutput = '';

            if (loopData) {
                loopData.forEach(dataItem => {
                    const refMatchRegEx = new RegExp(`{{${itemName}\\.(\\w+)}}`, 'g');
                    const refMatches = tmplExpression.matchAll(refMatchRegEx);
                    let content = tmplExpression;
                    
                    for (const refMatchArray of refMatches) {
                        const [refMatch, dataKey] = refMatchArray;
                        const dataToInsert = dataItem[dataKey];

                        if (dataToInsert) {
                            content = content.replace(refMatch, dataItem[dataKey]);
                        }
                    }

                    loopOutput += `<${tagName}>${content}</${tagName}>`;
                });
            }

            output = output.replace(match, loopOutput);
        }

        resolvePromise(output);
    });
}