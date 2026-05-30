import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle', // Carpeta donde se guardarán las migraciones SQL
  schema: './src/db/schema.ts', // Ruta a tu esquema de tablas
  dialect: 'postgresql', // Dialecto de base de datos
  dbCredentials: {
    url: process.env.DATABASE_URL!, // URL de conexión
  },
});
