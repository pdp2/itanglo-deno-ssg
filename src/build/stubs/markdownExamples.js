const h1Md = '# An example of an h1 heading';
const h1Html = '<h1>An example of an h1 heading</h1>';

const h2Md = '## An exmple of an h2 heading';
const h2Html = '<h2>An exmple of an h2 heading</h2>';

const h3Md = '### An example of an h3 heading';
const h3Html = '<h3>An example of an h3 heading</h3>';

const pMd = 'A line of a paragraph.';
const pHtml = '<p>A line of a paragraph.</p>';

const aMd = '[Link text](https://linkurl.com)';
const aHtml = '<p><a href="https://linkurl.com">Link text</a></p>';

const codeMd = 'An example of some `inline code`';
const codeHtml = '<p>An example of some <code>inline code</code></p>';

const codeBlockMd = '```\nconst codeBlock = true;\nconst multiLine=true;\n// should be inside pre and code tags\n```';
const codeBlockHtml = '<pre><code>const codeBlock = true;\nconst multiLine=true;\n// should be inside pre and code tags\n</code></pre>';

const imgMd = '![Alt text](/path/to/img.jpg)';
const imgHtml = '<p><img src="/path/to/img.jpg" alt="Alt text"></p>';

export default {
    h1Md, h1Html, h2Md, h2Html, h3Md, h3Html, pMd, pHtml, aMd, aHtml, codeMd, codeHtml, codeBlockMd, codeBlockHtml, imgMd, imgHtml
}