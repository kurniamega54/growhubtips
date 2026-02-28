import 'dotenv/config';
import { db } from '../lib/db';

(async () => {
  console.log('running check script, DATABASE_URL=', process.env.DATABASE_URL?.slice(0,50) + '...');
  try {
    const res = await db.execute(
      `select table_name from information_schema.tables where table_schema='public' and table_name='office_hours'`
    );
    console.log('raw result', res);
    console.log('exists rows', (res as any).rows);
  } catch (e) {
    console.error('error during query', e);
  }
})();
