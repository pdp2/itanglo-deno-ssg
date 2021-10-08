export default {
    parse(fileContent) {
        // first match is for code blocks
        const lines = fileContent.matchAll(/```[^`]+```|.+/g);
        let output = [];
        
        for (const line of lines) {
            output.push(parseLine(line[0]));
        }
        
        return output.join('\n');
    }
}

function parseLine(line) {
    let output = line;

    if (isHeading(line)) {
        output = parseHeading(line);
    }
    else if (isCodeBlock(line)) {
        output = parseCodeBlock(line);
    }
    else if (canBeParagraph(line)){
        output = parseParagraph(line);
    }

    output = parseInlineCode(output);
    output = parseImg(output);
    output = parseLinks(output);

    return output;
}

function isHeading(line) {
    const headingSyntax = ['#', '##', '###'];

    return headingSyntax.some(syntax => {
        return line.indexOf(syntax) === 0;
    });
}

function canBeParagraph(line) {
    return line.charAt(0) !== '<' && line.charAt(line.length-1) !== '>';
}

function isCodeBlock(line) {
    const codeBlockRegEx = /```([^`]+)```/g;
    return codeBlockRegEx.test(line);
}

function parseHeading(line) {
    const h1RegEx = /(?<!#)#\s(.+)/g;
    const h2RegEx = /(?<!#)##\s(.+)/g;
    const h3RegEx = /(?<!#)###\s(.+)/g;

    if (h1RegEx.test(line)) {
        return line.replace(h1RegEx, '<h1>$1</h1>');
    }
    else if (h2RegEx.test(line)) {
        return line.replace(h2RegEx, '<h2>$1</h2>');
    }
    else if (h3RegEx.test(line)) {
        return line.replace(h3RegEx, '<h3>$1</h3>');
    }
}

function parseParagraph(line) {
    return `<p>${line}</p>`;
}

function parseLinks(content) {
    const linkRegEx = /\[([^\]]+)\]\(([^\)]+)\)/g;
    const matches = content.matchAll(linkRegEx);

    let output = content;

    for (const matchArray of matches) {
        const [match, text, url] = matchArray;
        output = output.replace(match, `<a href="${url}">${text}</a>`);
    }

    return output;
}

function parseInlineCode(content) {
    const codeRegEx = /`([^`]+)`/g;
    const matches = content.matchAll(codeRegEx);
    let output = content;

    for (const matchArray of matches) {
        const [match, inlineCode] = matchArray;
        output = output.replace(match, `<code>${inlineCode}</code>`);
    }

    return output;
}

function parseCodeBlock(content) {
    const codeBlockRegEx = /```([^`]+)```/;
    const match = content.match(codeBlockRegEx);
    let output = `<pre><code>${match[1].replace(/\n*/, '')}</code></pre>`;
    return output;
}

function parseImg(content) {
    const imgRegEx = /!\[([^\]]+)\]\(([^\)]+)\)/g;
    const matches = content.matchAll(imgRegEx);
    let output = content;

    for (const matchArray of matches) {
        const [match, altText, imgPath] = matchArray;
        output = output.replace(match, `<img src="${imgPath}" alt="${altText}">`);
    }

    return output;
}