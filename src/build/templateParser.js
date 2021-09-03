import { relative } from "https://deno.land/std@0.106.0/path/mod.ts";

export default {
    async parse(fileContent, data = {}, destinationPath = './docs') {
        return new Promise(async resolvePromise => {
            let output = await parseIncludes(fileContent);

            // insert data
            const dataKeys = Object.keys(data);

            dataKeys.forEach(key => {
                const regex = new RegExp(`{{(${key})}}`);
                const match = output.match(regex);
                output = output.replace(match[0], data[match[1]]);
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