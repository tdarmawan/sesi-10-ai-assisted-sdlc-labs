export function fail(status,message){throw Object.assign(new Error(message),{status})}
export function text(value,field,max=120){if(typeof value!=='string'||!value.trim()||value.length>max)fail(400,'INVALID_'+field.toUpperCase());return value.trim()}
export function validateCreate(input){
 if(!input||typeof input!=='object'||Array.isArray(input))fail(400,'INVALID_INPUT');
 const id=text(input.id,'id',64);if(!/^[A-Za-z0-9_-]+$/.test(id))fail(400,'INVALID_ID');
 const part=text(input.part,'part');if(!Number.isSafeInteger(input.qty)||input.qty<=0)fail(400,'INVALID_QTY');
 return{id,part,qty:input.qty};
}
