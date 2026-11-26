import assert from 'node:assert/strict';
import { createApp } from '../src/app.js';
import { httpServer } from '../../material-request/src/http.js';
const server=httpServer(createApp());
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const base='http://127.0.0.1:'+server.address().port;
async function post(path,body,expected){const r=await fetch(base+path,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});const data=await r.json();assert.equal(r.status,expected);console.log('POST',path,r.status,data.status||data.error);return data}
async function stock(expected){const data=await(await fetch(base+'/api/stock')).json();assert.equal(data.warehouse,expected);console.log('warehouse stock:',data.warehouse)}
try{
 await post('/api/transfers',{id:'T1',part:'FLT-01',qty:5},201);await stock(100);
 await post('/api/transfers/T1/pending',{actor:'Rina',reason:'Scanner timeout'},200);await stock(100);
 await post('/api/transfers/T1/resolve',{actor:'Dewi',transferRef:'SCAN-001'},200);await stock(95);
 await post('/api/transfers/T1/resolve',{actor:'Dewi',transferRef:'SCAN-001'},200);await stock(95);
 await post('/api/transfers/T1/reverse',{actor:'Dewi',reason:'Wrong line'},200);await stock(100);
 await post('/api/transfers/T1/reverse',{actor:'Dewi',reason:'Retry'},200);await stock(100);
 await post('/api/transfers',{id:'T1',part:'FLT-01',qty:5},409);
 console.log('Demo passed: retries did not double-mutate stock.');
}finally{await new Promise(r=>server.close(r))}
