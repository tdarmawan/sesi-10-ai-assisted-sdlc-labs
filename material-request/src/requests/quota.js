import { fail } from './domain.js';
export const monthlyQuota={fasteners:1500,filters:2000,electrical:3000,consumables:500};
export function assertWithinQuota(rows,candidate,excludeId) {
 if(candidate.status==='rejected')return;
 const month=candidate.request_date.slice(0,7);
 const total=rows.filter(r=>r.id!==excludeId&&r.category===candidate.category&&r.request_date.slice(0,7)===month&&['submitted','approved'].includes(r.status)).reduce((sum,r)=>sum+r.qty,0);
 if(total+candidate.qty>monthlyQuota[candidate.category])fail(422,'QUOTA_EXCEEDED');
}
