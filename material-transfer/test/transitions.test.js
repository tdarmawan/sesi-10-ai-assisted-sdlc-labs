import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createTransferService } from '../src/service.js';
import { createApp } from '../src/app.js';
import { httpServer } from '../../material-request/src/http.js';
function setup(qty=5){const s=createTransferService();s.create({id:'T1',part:'FLT-01',qty});return s}
test('pending does not mutate stock; resolve decreases once; reverse restores once',()=>{
 const s=setup();assert.equal(s.markPending('T1',{actor:'Rina',reason:'timeout'}).status,'PENDING');assert.equal(s.stock(),100);
 assert.equal(s.resolve('T1',{actor:'Dewi',transferRef:'SCAN-1'}).status,'CONFIRMED');assert.equal(s.stock(),95);
 s.resolve('T1',{actor:'Dewi',transferRef:'SCAN-1'});assert.equal(s.stock(),95);
 s.reverse('T1',{actor:'Dewi',reason:'wrong line'});s.reverse('T1',{actor:'Dewi',reason:'retry'});assert.equal(s.stock(),100);
 const events=s.get('T1').audit;assert.equal(events.length,4);assert.deepEqual(events.map(e=>e.to),['NEW','PENDING','CONFIRMED','REVERSED']);
});
test('invalid transitions reject without changing stock or audit',()=>{
 const s=setup();assert.throws(()=>s.resolve('T1',{actor:'a',transferRef:'r'}),{status:409});assert.throws(()=>s.reverse('T1',{actor:'a',reason:'r'}),{status:409});
 s.markPending('T1',{actor:'a',reason:'timeout'});assert.throws(()=>s.confirm('T1',{actor:'a'}),{status:409});assert.equal(s.stock(),100);assert.equal(s.get('T1').audit.length,2);
});
test('pending retry is idempotent; conflicting resolve retry is 409',()=>{
 const s=setup();s.markPending('T1',{actor:'a',reason:'timeout'});s.markPending('T1',{actor:'a',reason:'retry'});assert.equal(s.get('T1').audit.length,2);
 s.resolve('T1',{actor:'a',transferRef:'r1'});assert.throws(()=>s.resolve('T1',{actor:'a',transferRef:'r2'}),{status:409});assert.equal(s.stock(),95);
});
test('whitespace actors, invalid reasons and numeric transferRef fail validation',()=>{
 const s=setup();assert.throws(()=>s.markPending('T1',{actor:' ',reason:'timeout'}),{status:400});assert.throws(()=>s.markPending('T1',{actor:'a',reason:''}),{status:400});
 s.markPending('T1',{actor:'a',reason:'timeout'});assert.throws(()=>s.resolve('T1',{actor:'a',transferRef:123}),{status:400});assert.equal(s.stock(),100);
});
test('insufficient stock while resolving leaves pending intact',()=>{
 const s=setup(101);s.markPending('T1',{actor:'a',reason:'timeout'});assert.throws(()=>s.resolve('T1',{actor:'a',transferRef:'r'}),{status:409});assert.equal(s.get('T1').status,'PENDING');assert.equal(s.get('T1').audit.length,2);assert.equal(s.stock(),100);
});
test('returned records are isolated; SKU, invalid ID and unsafe qty rejected',()=>{
 const s=setup();const r=s.get('T1');r.audit.length=0;r.qty=100;
 assert.equal(s.get('T1').qty,5);assert.equal(s.get('T1').audit.length,1);
 for(const input of [{id:'bad/id',part:'FLT-01',qty:1},{id:'T2',part:'OTHER',qty:1},{id:'T2',part:'FLT-01',qty:Number.MAX_SAFE_INTEGER+1}])assert.throws(()=>s.create(input),{status:400});
});
test('NEW direct confirmation may reverse; reversal forbids confirmation and pending',()=>{
 const s=setup();s.confirm('T1',{actor:'a'});s.reverse('T1',{actor:'a',reason:'correction'});assert.equal(s.stock(),100);
 assert.throws(()=>s.confirm('T1',{actor:'a'}),{status:409});assert.throws(()=>s.markPending('T1',{actor:'a',reason:'timeout'}),{status:409});
});
test('real HTTP covers pending/resolve/reverse and duplicate ID errors',async(t)=>{
 const server=httpServer(createApp());await new Promise(r=>server.listen(0,'127.0.0.1',r));t.after(()=>new Promise(r=>server.close(r)));
 const base='http://127.0.0.1:'+server.address().port;
 const post=(path,body)=>fetch(base+path,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});
 assert.equal((await post('/api/transfers',{id:'T1',part:'FLT-01',qty:5})).status,201);
 assert.equal((await post('/api/transfers',{id:'T1',part:'FLT-01',qty:5})).status,409);
 for(const [action,body,status] of [['pending',{actor:'Rina',reason:'timeout'},'PENDING'],['resolve',{actor:'Dewi',transferRef:'SC-1'},'CONFIRMED'],['reverse',{actor:'Dewi',reason:'wrong line'},'REVERSED']])assert.equal((await(await post('/api/transfers/T1/'+action,body)).json()).status,status);
 assert.equal((await(await fetch(base+'/api/stock')).json()).warehouse,100);
 assert.equal((await post('/api/transfers/missing/reverse',{actor:'Dewi',reason:'x'})).status,404);
});
