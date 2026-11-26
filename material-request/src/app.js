import { html } from './ui.js';
import { memoryRepository } from './requests/repository.js';
import { materialRequestService } from './requests/service.js';
export function createApp({ seed, service=materialRequestService(memoryRepository(seed)) }={}) {
 return async({method,url,body})=>{
  try{
   const parsed=new URL(url,'http://localhost');const path=parsed.pathname;const query=Object.fromEntries(parsed.searchParams);
   if(method==='GET'&&path==='/')return{status:200,body:html,headers:{'content-type':'text/html; charset=utf-8'}};
   if(method==='GET'&&path==='/api/requests')return{status:200,body:service.list(query)};
   if(method==='GET'&&path==='/api/requests.csv')return{status:200,body:service.exportCsv(query),headers:{'content-type':'text/csv; charset=utf-8','content-disposition':'attachment; filename="requests.csv"'}};
   if(method==='POST'&&path==='/api/requests')return{status:201,body:service.create(body)};
   const match=/^\/api\/requests\/([^/]+)$/.exec(path);
   if(method==='PATCH'&&match)return{status:200,body:service.update(decodeURIComponent(match[1]),body)};
   return{status:404,body:{error:'NOT_FOUND'}};
  }catch(e){return{status:e.status||400,body:{error:e.message}}}
 };
}
