export const categories = ['fasteners','filters','electrical','consumables'];
export function fail(status, message) { throw Object.assign(new Error(message),{status}); }
export function validate(input) {
 if (!input || typeof input !== 'object' || Array.isArray(input)) fail(400,'INVALID_BODY');
 if (!categories.includes(input.category)) fail(400,'INVALID_CATEGORY');
 if (!Number.isSafeInteger(input.qty) || input.qty <= 0) fail(400,'INVALID_QTY');
 for (const key of ['part_number','owner']) if(typeof input[key] !== 'string' || !input[key].trim() || input[key].length>120) fail(400,'INVALID_'+key.toUpperCase());
 if(!['submitted','approved','rejected'].includes(input.status)) fail(400,'INVALID_STATUS');
 const date=input.request_date;
 if(typeof date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(Date.parse(date))||new Date(date).toISOString().slice(0,10)!==date)fail(400,'INVALID_DATE');
 if(typeof input.note!=='string'||input.note.length>1000)fail(400,'INVALID_NOTE');
 return Object.fromEntries(['part_number','category','qty','owner','status','request_date','note'].map(k=>[k,input[k]]));
}
export function filterRequests(rows, query={}) {
 const search=(query.search||'').toLowerCase();
 return rows.filter(r=>(!query.owner||r.owner===query.owner)&&(r.part_number+' '+r.note).toLowerCase().includes(search));
}
export function csvCell(value) {
 let text=String(value);
 if(/^[\s\u0000-\u001f]*[=+@-]/.test(text)||/^[\t\r\n]/.test(text))text="'"+text;
 return '"'+text.replaceAll('"','""')+'"';
}
export function toCsv(rows) {
 const keys=['id','request_date','part_number','category','qty','owner','status','note'];
 return [keys.join(','),...rows.map(r=>keys.map(k=>csvCell(r[k])).join(','))].join('\r\n');
}
