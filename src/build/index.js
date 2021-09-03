import mdParser from './markdownParser.js';
import tmplParser from './templateParser.js';

console.log('ARGS', Deno.args); // check for verbose flag for debugging
await buildIndexPage();
await buildPages();

async function buildIndexPage() {
    return new Promise(async resolve => {
        console.log('Starting buildIndexPage task');
        const indexTmplPath = './src/templates/index.tmpl.html';

        console.log('Reading', indexTmplPath);
        const indexTmpl = await Deno.readTextFile(indexTmplPath);
        const output = await tmplParser.parse(indexTmpl);
        const outputPath = './docs/index.html';
        
        console.log('Writing', outputPath);
        await Deno.writeTextFile(outputPath, output);
        
        console.log('Finished buildIndexPage task');
        resolve();
    });
}

async function buildPages() {
    return new Promise(async resolve => {
        console.log('Starting buildPages task');
        const pagesDirPath = './content/pages/';
        const pagesDirIter = await Deno.readDir(pagesDirPath);
        const destinationPath = './docs/pages/';
        
        for await (const dirEntry of pagesDirIter) {
            const pageName = dirEntry.name;
            // Get page file
            const pageFile = await Deno.readTextFile(`${pagesDirPath}${pageName}`);
            // Get page tmpl
            const pageTmpl = await Deno.readTextFile('./src/templates/page.tmpl.html');
            // Get page content
            const pageContent = mdParser.parse(pageFile);
            // Get output
            const output = await tmplParser.parse(pageTmpl, { content: pageContent }, destinationPath);
            // Create output file
            const outputPath = `${destinationPath}${pageName.replace('.md', '.html')}`;
            console.log('Writing', outputPath);
            await Deno.writeTextFile(outputPath, output);
        }

        console.log('Finished buildPages task');
        resolve();
    });
}