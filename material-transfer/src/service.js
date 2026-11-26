import { fail, text, validateCreate } from './domain.js';
export function createTransferService({stock=100}={}) {
 if(!Number.isSafeInteger(stock)||stock<0)fail(400,'INVALID_STOCK');
 const transfers=new Map();
 const get=id=>{if(!transfers.has(id))fail(404,'NOT_FOUND');return transfers.get(id)};
 const copy=row=>structuredClone(row);
 function event(row,action,actor,to,extra={}){const from=row.status;row.status=to;row.audit.push({action,actor,from,to,at:new Date().toISOString(),...extra});return copy(row)}
 function moveOut(row){if(stock<row.qty)fail(409,'INSUFFICIENT_STOCK');stock-=row.qty}
 return {
  create(input){const value=validateCreate(input);if(transfers.has(value.id))fail(409,'DUPLICATE_ID');if(value.part!=='FLT-01')fail(400,'INVALID_PART');const row={...value,status:null,audit:[]};transfers.set(row.id,row);return event(row,'create','system','NEW')},
  get(id){return copy(get(id))}, list(){return copy([...transfers.values()])},stock(){return stock},
  confirm(id,input={}){const row=get(id);const actor=text(input?.actor,'actor');if(row.status==='CONFIRMED')return copy(row);if(row.status!=='NEW')fail(409,'INVALID_TRANSITION');moveOut(row);return event(row,'confirm',actor,'CONFIRMED')},
  markPending(id,input={}){const row=get(id);const actor=text(input?.actor,'actor');const reason=text(input?.reason,'reason');if(row.status==='PENDING')return copy(row);if(row.status!=='NEW')fail(409,'INVALID_TRANSITION');return event(row,'pending',actor,'PENDING',{reason})},
  resolve(id,input={}){const row=get(id);const actor=text(input?.actor,'actor');const transferRef=text(input?.transferRef,'transfer_ref');if(row.status==='CONFIRMED'&&row.transferRef===transferRef)return copy(row);if(row.status!=='PENDING')fail(409,'INVALID_TRANSITION');moveOut(row);row.transferRef=transferRef;return event(row,'resolve',actor,'CONFIRMED',{transferRef})},
  reverse(id,input={}){const row=get(id);const actor=text(input?.actor,'actor');const reason=text(input?.reason,'reason');if(row.status==='REVERSED')return copy(row);if(row.status!=='CONFIRMED')fail(409,'INVALID_TRANSITION');stock+=row.qty;return event(row,'reverse',actor,'REVERSED',{reason})}
 };
}
