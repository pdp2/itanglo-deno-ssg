// File paths assume that CWD is the root of the project
const indexTmplPath = './src/templates/index.tmpl.html';

console.log('Reading', indexTmplPath);
const indexTmpl = await Deno.readTextFile(indexTmplPath);

const includeMatches = indexTmpl.matchAll(/<include src="([./\w-]+.tmpl.html)">/g);

let output = indexTmpl;

for (const matchArray of includeMatches) {
	const [match, path] = matchArray;
	
	console.log('Reading', path);
	const includeTmpl = await Deno.readTextFile(path);

	output = output.replace(match, includeTmpl);
}

const outputPath = './docs/index.html';

console.log('Writing', outputPath);
await Deno.writeTextFile(outputPath, output);