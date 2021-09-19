import { assertEquals } from 'https://deno.land/std@0.106.0/testing/asserts.ts';
import tmplParser from '../templateParser.js';

Deno.test('should render a template with data', async () => {
    const expected = 'Hello itanglo!';
    const result = await tmplParser.parse('Hello {{name}}!', { name:'itanglo' });
    assertEquals(result, expected);
});

Deno.test('should render a basic include', async () => {
    const expected = 'This is a basic include.';
    const result = await tmplParser.parse('<include src="./src/build/tests/templates/basic-include.tmpl.html">');
    assertEquals(result, expected)
});

Deno.test('should render a for loop', async () => {
    const expected = '<div>Uno</div><div>Due</div><div>Tre</div>';
    let result = await tmplParser.parse('<div for="item in items">{{item.text}}</div>', { items: [{text: 'Uno'}, {text: 'Due'}, {text: 'Tre'}] });
    
    assertEquals(result, expected);

    result = await tmplParser.parse('<div for="item in items">{{item}}</div>', { items: ['Uno', 'Due', 'Tre'] });

    assertEquals(result, expected);
});