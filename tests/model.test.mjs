import test from 'node:test';import assert from 'node:assert/strict';import{safeUrl,validateAnswer,csvCell,budget}from'../web/model.js';import{missions}from'../web/data.js';
test('known bounded mission set',()=>{assert.equal(missions.length,19);assert.equal(new Set(missions.map(m=>m.id)).size,19);});
test('reject script, data, credentials and excessive text',()=>{for(const u of ['javascript:alert(1)','data:image/png,xxx','http://example.com','https://user:pass@example.com'])assert.equal(safeUrl(u),'');assert.throws(()=>validateAnswer({title:'a',body:'가'.repeat(2001),url:'',photoClaim:false}));});
test('formula injection cannot become spreadsheet formula',()=>{assert.equal(csvCell('=1+1'),'"\'=1+1"');assert.equal(csvCell('a"b'),'"a""b"');});
test('budget has generous margin',()=>{assert.ok(budget().storageMiB<40);assert.ok(budget().readsPerDay<=20000);});
