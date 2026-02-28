import 'dotenv/config';
import { db } from '../lib/db';

(async () => {
  try {
    console.log('creating office_hours table...');
    await db.execute(`
      CREATE TABLE IF NOT EXISTS office_hours (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        day_of_week integer NOT NULL,
        start_time varchar(5) NOT NULL,
        end_time varchar(5) NOT NULL,
        is_open boolean DEFAULT true,
        timezone varchar(50) DEFAULT 'UTC',
        created_at timestamp with time zone DEFAULT now() NOT NULL,
        updated_at timestamp with time zone DEFAULT now() NOT NULL
      );
    `);
    console.log('done');
  } catch (e) {
    console.error('error creating table', e);
  }
})();