import test from 'node:test';import assert from 'node:assert/strict';import {contentTypeOf,sourceUrl,compactCard} from '../src/compact.js';
test('compact content slots classify existing metadata and explicit future types',()=>{
 assert.equal(contentTypeOf({kind:'news',audience:'professional'}),'news');
 assert.equal(contentTypeOf({audience:'patient'}),'patient');
 assert.equal(contentTypeOf({contentType:'patient'}),'patient');
 assert.equal(contentTypeOf({contentType:'unsupported'}),'knowledge');
});
test('compact cards link source first, keep details separate and escape metadata',()=>{
 const r={id:'a',title:'<script>bad</script>',url:'https://example.org/',owner:'Owner',specialties:[]};
 const html=compactCard(r,new Set(),{matched:1,total:2});
 assert.ok(html.indexOf('href=')<html.indexOf('data-open='));
 assert.ok(html.includes('rel="noopener noreferrer"'));assert.ok(html.includes('&lt;script&gt;'));assert.ok(!html.includes('<script>'));
 assert.ok(html.includes('1/2 trefwoorden'));assert.ok(!html.includes('Waarom gevonden'));
 assert.equal(sourceUrl({source:{url:r.url}}),r.url);assert.equal(sourceUrl({...r,demo:true}),null);
});