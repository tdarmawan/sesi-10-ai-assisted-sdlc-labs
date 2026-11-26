export const defaultSeed = [
 {id:'MR-001',part_number:'FLT-01',category:'filters',qty:100,owner:'Rina',status:'submitted',request_date:'2026-11-01',note:'Filter awal'},
 {id:'MR-002',part_number:'BLT-01',category:'fasteners',qty:50,owner:'Budi',status:'approved',request_date:'2026-11-02',note:'Baut lini A'}
];
export function memoryRepository(seed=defaultSeed) {
 const rows=structuredClone(seed); let sequence=1;
 return {
  all:()=>structuredClone(rows),
  get:id=>structuredClone(rows.find(r=>r.id===id)),
  insert(record){while(rows.some(r=>r.id==='MR-'+String(sequence).padStart(3,'0')))sequence++;const row={...record,id:'MR-'+String(sequence++).padStart(3,'0')};rows.push(row);return structuredClone(row)},
  update(id,record){const row=rows.find(r=>r.id===id);if(!row)throw new Error('Repository row missing');Object.assign(row,record,{id});return structuredClone(row)}
 };
}
