import { assertEquals } from "https://deno.land/std@0.106.0/testing/asserts.ts";
import mdParser from '../markdownParser.js';

Deno.test('should parse an h1 heading', () => {
    const h1 = mdParser.parse('# An example of an h1 heading');
    assertEquals(h1, '<h1>An example of an h1 heading</h1>');
});

Deno.test('should parse an h2 heading', () => {
    const h2 = mdParser.parse('## An exmple of an h2 heading');
    assertEquals(h2, '<h2>An exmple of an h2 heading</h2>');
});

Deno.test('should parse an h3 heading', () => {
    const h3 = mdParser.parse('### An example of an h3 heading');
    assertEquals(h3, '<h3>An example of an h3 heading</h3>');
});

Deno.test('should parse a paragraph', () => {
    const p = mdParser.parse('A line of a paragraph.');
    assertEquals(p, '<p>A line of a paragraph.</p>');
});

Deno.test('should parse a link', () => {
    const a = mdParser.parse('[Link text](https://linkurl.com)');
    assertEquals(a, '<p><a href="https://linkurl.com">Link text</a></p>');
});

Deno.test('should parse inline code', () => {
    let code = mdParser.parse('An example of some `inline code`');
    assertEquals(code, '<p>An example of some <code>inline code</code></p>');

    code = mdParser.parse('Some inline code with `&lt;p&gt;HTML tags&lt;/p&gt;`');
    assertEquals(code, '<p>Some inline code with <code>&lt;p&gt;HTML tags&lt;/p&gt;</code></p>');
});

Deno.test('should parse a code block', () => {
    const codeBlock = mdParser.parse('```\nconst codeBlock = true;\nconst multiLine=true;\n// should be inside pre and code tags\n```');
    assertEquals(codeBlock, '<pre><code>const codeBlock = true;\nconst multiLine=true;\n// should be inside pre and code tags\n</code></pre>');
});

Deno.test('should parse an image', () => {
    const img = mdParser.parse('![Alt text](/path/to/img.jpg)');
    assertEquals(img, '<p><img src="/path/to/img.jpg" alt="Alt text"></p>');
});