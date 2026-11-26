import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/app.js';
const row=(x={})=>({part_number:'FLT-01',category:'filters',qty:1,owner:'Rina',status:'submitted',request_date:'2026-11-15',note:'Quota test',...x});
const call=(app,method,url,body)=>app({method,url,body});
test('exact quota accepted for all four categories; next unit rejected atomically',async()=>{
 for(const [category,cap] of Object.entries({fasteners:1500,filters:2000,electrical:3000,consumables:500})){
  const app=createApp({seed:[]});assert.equal((await call(app,'POST','/api/requests',row({category,qty:cap}))).status,201);
  assert.equal((await call(app,'POST','/api/requests',row({category}))).status,422);
  assert.equal((await call(app,'GET','/api/requests')).body.length,1);
 }
});
test('submitted and approved count across owners including Dewi; rejected excluded',async()=>{
 const app=createApp({seed:[]});
 for(const [owner,status,qty] of [['Rina','submitted',1000],['Budi','approved',1000],['Dewi','rejected',9000]])assert.equal((await call(app,'POST','/api/requests',row({owner,status,qty}))).status,201);
 const r=await call(app,'POST','/api/requests',row({owner:'Dewi'}));assert.equal(r.status,422);assert.equal(r.body.error,'QUOTA_EXCEEDED');
});
test('calendar month and category are independent buckets',async()=>{
 const app=createApp({seed:[]});
 for(const input of [row({qty:2000}),row({qty:2000,request_date:'2026-12-01'}),row({qty:1500,category:'fasteners'})])assert.equal((await call(app,'POST','/api/requests',input)).status,201);
});
test('PATCH excludes original row and rejects excess without changing state',async()=>{
 const app=createApp({seed:[]});const a=await call(app,'POST','/api/requests',row({qty:1500}));
 assert.equal((await call(app,'PATCH','/api/requests/'+a.body.id,{qty:2000})).status,200);
 assert.equal((await call(app,'PATCH','/api/requests/'+a.body.id,{qty:2001})).status,422);
 assert.equal((await call(app,'GET','/api/requests')).body[0].qty,2000);
});
test('PATCH category/month change checks destination; rejection leaves old record',async()=>{
 const app=createApp({seed:[]});await call(app,'POST','/api/requests',row({qty:2000}));
 const b=await call(app,'POST','/api/requests',row({qty:10,request_date:'2026-12-01'}));
 assert.equal((await call(app,'PATCH','/api/requests/'+b.body.id,{request_date:'2026-11-30'})).status,422);
 assert.equal((await call(app,'PATCH','/api/requests/'+b.body.id,{category:'consumables',qty:501})).status,422);
 assert.equal((await call(app,'PATCH','/api/requests/'+b.body.id,{category:'consumables',qty:500})).status,200);
});
test('rejected to submitted revalidates quota; approved to rejected releases it',async()=>{
 const app=createApp({seed:[]});const a=await call(app,'POST','/api/requests',row({qty:2000,status:'approved'}));
 const b=await call(app,'POST','/api/requests',row({qty:2000,status:'rejected'}));
 assert.equal((await call(app,'PATCH','/api/requests/'+b.body.id,{status:'submitted'})).status,422);
 await call(app,'PATCH','/api/requests/'+a.body.id,{status:'rejected'});
 assert.equal((await call(app,'PATCH','/api/requests/'+b.body.id,{status:'submitted'})).status,200);
});
