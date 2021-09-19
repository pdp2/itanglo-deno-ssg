import mdParser from './markdownParser.js';
import tmplParser from './templateParser.js';
import log from './logger.js';

await buildIndexPage();
await buildPages();
await buildPosts();

// To do: build post pages

async function buildIndexPage() {
    return new Promise(async resolve => {
        log('Starting buildIndexPage');
        
        const indexTmplPath = './src/templates/index.tmpl.html';

        log('Reading', indexTmplPath);
        const indexTmpl = await Deno.readTextFile(indexTmplPath);
        const articles = await getPosts();
        const output = await tmplParser.parse(indexTmpl, {
            articles
        });
        const outputPath = './docs/index.html';
        
        log('Writing', outputPath);
        await Deno.writeTextFile(outputPath, output);
        
        log('Finished buildIndexPage');
        resolve();
    });
}

async function buildPages() {
    return new Promise(async resolve => {
        log('Starting buildPages');
        
        const pagesDirPath = './content/pages/';
        const pagesDirIter = await Deno.readDir(pagesDirPath);
        const destinationPath = './docs/';
        
        for await (const dirEntry of pagesDirIter) {
            const pageName = dirEntry.name;
            const pageFile = await Deno.readTextFile(`${pagesDirPath}${pageName}`);
            const pageTmpl = await Deno.readTextFile('./src/templates/page.tmpl.html');
            const pageContent = mdParser.parse(pageFile);
            const output = await tmplParser.parse(pageTmpl, { content: pageContent }, destinationPath);
            const outputPath = `${destinationPath}${pageName.replace('.md', '.html')}`;
            
            log('Writing', outputPath);
            await Deno.writeTextFile(outputPath, output);
        }

        log('Finished buildPages');
        resolve();
    });
}

async function buildPosts() {
    return new Promise(async resolve => {
        log('Starting buildPosts');
        
        const pagesDirPath = './content/posts/';
        const pagesDirIter = await Deno.readDir(pagesDirPath);
        const destinationPath = './docs/posts/';
        
        for await (const dirEntry of pagesDirIter) {
            const postName = dirEntry.name;
            const postFile = await Deno.readTextFile(`${pagesDirPath}${postName}`);
            const pageTmpl = await Deno.readTextFile('./src/templates/page.tmpl.html');
            const postContent = mdParser.parse(postFile);
            const output = await tmplParser.parse(pageTmpl, { content: postContent }, destinationPath);
            // Create output file
            const outputPath = `${destinationPath}${postName.replace('.md', '.html')}`;
            
            log('Writing', outputPath);
            await Deno.writeTextFile(outputPath, output);
        }

        log('Finished buildPosts');
        resolve();
    });
}

async function getPosts() {
    return new Promise(async resolvePromise => {
        let articles = [];

        const postsDirPath = './content/posts/';
        const postsDirIter = await Deno.readDir(postsDirPath);
        
        for await (const dirEntry of postsDirIter) {
            const postName = dirEntry.name;
            const postFile = await Deno.readTextFile(`${postsDirPath}${postName}`);
            const postContent = mdParser.parse(postFile);
            const postDateMatch = postContent.match(/<\s+postedOn:\s*([^\n]+)/);
            const postTitleMatch = postContent.match(/<h2>(.+)<\/h2>/);
            let postDateTime = 0;
            let postedDate = 'No date set';
            let title = 'No title set';
            let content = postContent;

            if (postDateMatch && postDateMatch.length === 2) {
                const postDate = new Date(postDateMatch[1]);
                postDateTime = postDate.getTime();
                postedDate = postDate.toDateString();
            }

            if (postTitleMatch && [postTitleMatch.length === 2]) {
                title = postTitleMatch[1];
                content = content.replace(postTitleMatch[0], '');
            }

            articles.push({
                content,
                postDateTime,
                postedDate,
                title,
                postUrl: getPostUrl(title),
                author: 'Paolo'
            });

        }

        // sort in reverse chronological order
        articles.sort((a, b) => {
            return b.postDateTime - a.postDateTime;
        });

        resolvePromise(articles);
    });
}

function getPostUrl(title) {
    // relative to root folder
    return `./docs/posts/${title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, '')}.html`;
}