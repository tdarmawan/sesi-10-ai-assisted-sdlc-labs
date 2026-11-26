import { validate, filterRequests, toCsv, fail } from './domain.js';
import { assertWithinQuota } from './quota.js';
export function materialRequestService(repository) {
 return {
  list(query={}){return filterRequests(repository.all(),query)},
  exportCsv(query={}){return toCsv(filterRequests(repository.all(),query))},
  create(input){const record=validate(input);assertWithinQuota(repository.all(),record);return repository.insert(record)},
  update(id,input){
   const old=repository.get(id);if(!old)fail(404,'NOT_FOUND');
   if(!input||typeof input!=='object'||Array.isArray(input))fail(400,'INVALID_BODY');
   const record=validate({...old,...input});assertWithinQuota(repository.all(),record,id);return repository.update(id,record);
  }
 };
}
