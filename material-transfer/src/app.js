import { createTransferService } from './service.js';
export function createApp({service=createTransferService()}={}) {
 return async({method,url,body})=>{
  try{
   const path=new URL(url,'http://localhost').pathname;
   if(method==='GET'&&path==='/')return{status:200,body:{lab:'Material transfer',routes:['GET /api/stock','GET /api/transfers','POST /api/transfers','POST /api/transfers/:id/confirm']}};
   if(method==='GET'&&path==='/api/stock')return{status:200,body:{warehouse:service.stock()}};
   if(method==='GET'&&path==='/api/transfers')return{status:200,body:service.list()};
   if(method==='POST'&&path==='/api/transfers')return{status:201,body:service.create(body)};
   const m=/^\/api\/transfers\/([^/]+)(?:\/(confirm|pending|resolve|reverse))?$/.exec(path);
   if(m&&method==='GET'&&!m[2])return{status:200,body:service.get(decodeURIComponent(m[1]))};
   if(m&&method==='POST'&&m[2])return{status:200,body:service[m[2]==='pending'?'markPending':m[2]](decodeURIComponent(m[1]),body)};
   return{status:404,body:{error:'NOT_FOUND'}};
  }catch(e){return{status:e.status||400,body:{error:e.message}}}
 };
}
