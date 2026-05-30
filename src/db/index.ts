import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

// Creamos un Pool de conexiones
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Instanciamos Drizzle inyectando el pool y los esquemas
export const db = drizzle(pool, { schema });
