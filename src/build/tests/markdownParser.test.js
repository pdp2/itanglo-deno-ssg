import { assertEquals } from "https://deno.land/std@0.106.0/testing/asserts.ts";
import mdParser from '../markdownParser.js';
import mdExamples from './stubs/markdownExamples.js';


Deno.test('should parse an h1 heading', () => {
  const h1 = mdParser.parse(mdExamples.h1Md);
  assertEquals(h1, mdExamples.h1Html);
});

Deno.test('should parse an h2 heading', () => {
  const h2 = mdParser.parse(mdExamples.h2Md);
  assertEquals(h2, mdExamples.h2Html);
});

Deno.test('should parse an h3 heading', () => {
  const h3 = mdParser.parse(mdExamples.h3Md);
  assertEquals(h3, mdExamples.h3Html);
});

Deno.test('should parse a paragraph', () => {
  const p = mdParser.parse(mdExamples.pMd);
  assertEquals(p, mdExamples.pHtml);
});

Deno.test('should parse a link', () => {
  const a = mdParser.parse(mdExamples.aMd);
  assertEquals(a, mdExamples.aHtml);
});

Deno.test('should parse inline code', () => {
  const code = mdParser.parse(mdExamples.codeMd);
  assertEquals(code, mdExamples.codeHtml);
});

Deno.test('should parse a code block', () => {
  const codeBlock = mdParser.parse(mdExamples.codeBlockMd);
  assertEquals(codeBlock, mdExamples.codeBlockHtml);
});

Deno.test('should parse an image', () => {
  const img = mdParser.parse(mdExamples.imgMd);
  assertEquals(img, mdExamples.imgHtml);
});