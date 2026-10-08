import {z} from 'zod';
const resultSchema=z.object({field_name:z.string().max(256),category:z.enum(['identity','contact','financial','health','children','location','credentials','other']),sensitivity:z.enum(['low','medium','high','critical']),label:z.string().max(120),confidence:z.number().min(0).max(1),reasoning:z.string().max(500)});
export function validateAiJson(text){return z.array(resultSchema).parse(JSON.parse(text))}
export async function retryOnce(operation){let last;for(let attempt=0;attempt<2;attempt++){try{return await operation()}catch(e){last=e}}throw last}
