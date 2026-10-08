import pg from 'pg'; import {env} from './env.js';
const localDatabase=/localhost|127\.0\.0\.1|\[::1\]/i.test(env.DATABASE_URL);
export const pool=new pg.Pool({connectionString:env.DATABASE_URL,ssl:localDatabase?false:{rejectUnauthorized:env.DB_SSL_REJECT_UNAUTHORIZED==='true'},max:10,idleTimeoutMillis:30000,connectionTimeoutMillis:5000});
pool.on('error',e=>console.error('Unexpected PostgreSQL pool error',e.message));
