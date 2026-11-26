import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/app.js';
import { httpServer } from '../src/http.js';

const record = (overrides={}) => ({part_number:'FLT-99',category:'filters',qty:10,owner:'Rina',status:'submitted',request_date:'2026-11-15',note:'Penggantian filter',...overrides});
test('list searches part and note case-insensitively, then filters owner', async()=>{
  const app=createApp();
  assert.equal((await app({method:'GET',url:'/api/requests?search=flt&owner=Rina'})).body.length,1);
  assert.equal((await app({method:'GET',url:'/api/requests?search=BAUT&owner=Rina'})).body.length,0);
  assert.equal((await app({method:'GET',url:'/api/requests?search=BAUT&owner=Budi'})).body[0].id,'MR-002');
});
test('CSV uses identical filters, quotes values and neutralizes formula cells',async()=>{
 const app=createApp({seed:[]});
 await app({method:'POST',url:'/api/requests',body:record({note:' =SUM(1,2) "x"'})});
 const res=await app({method:'GET',url:'/api/requests.csv?owner=Rina'});
 assert.match(res.body,/^id,request_date,part_number,category,qty,owner,status,note/);
 assert.ok(res.body.includes('"\' =SUM(1,2) ""x"""'));
 assert.equal((await app({method:'GET',url:'/api/requests.csv?owner=Budi'})).body.split('\r\n').length,1);
});
test('POST creates unique ID and PATCH preserves ID and unspecified fields',async()=>{
 const app=createApp();
 const res=await app({method:'POST',url:'/api/requests',body:record()});
 assert.equal(res.status,201); assert.equal(res.body.id,'MR-003');
 const edit=await app({method:'PATCH',url:'/api/requests/MR-003',body:{qty:12,id:'fake'}});
 assert.equal(edit.status,200);assert.equal(edit.body.id,'MR-003');assert.equal(edit.body.qty,12);assert.equal(edit.body.owner,'Rina');
});
test('invalid quantities, categories, dates, statuses and body return 400',async()=>{
 const app=createApp({seed:[]});
 for(const body of [null,[],record({qty:0}),record({qty:1.5}),record({qty:'5'}),record({category:'other'}),record({request_date:'2026-02-30'}),record({owner:' '}),record({status:'done'}),record({note:null})]) {
  assert.equal((await app({method:'POST',url:'/api/requests',body})).status,400);
 }
});
test('unknown routes and missing IDs return 404; returned records cannot mutate state',async()=>{
 const app=createApp();
 assert.equal((await app({method:'GET',url:'/missing'})).status,404);
 assert.equal((await app({method:'PATCH',url:'/api/requests/missing',body:{qty:2}})).status,404);
 const r=await app({method:'GET',url:'/api/requests'});r.body[0].qty=999999;
 assert.equal((await app({method:'GET',url:'/api/requests'})).body[0].qty,100);
});
test('real HTTP serves UI, JSON, CSV, PATCH and rejects malformed JSON',async(t)=>{
 const server=httpServer(createApp()); await new Promise(r=>server.listen(0,'127.0.0.1',r));t.after(()=>new Promise(r=>server.close(r)));
 const base='http://127.0.0.1:'+server.address().port;
 assert.match(await(await fetch(base)).text(),/Material Request/);
 assert.equal((await(await fetch(base+'/api/requests')).json()).length,2);
 assert.match((await fetch(base+'/api/requests.csv')).headers.get('content-type'),/text\/csv/);
 assert.equal((await fetch(base+'/api/requests',{method:'POST',body:'{'})).status,400);
 assert.equal((await fetch(base+'/api/requests/MR-001',{method:'PATCH',body:JSON.stringify({qty:80})})).status,200);
});
