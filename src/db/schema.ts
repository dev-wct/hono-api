import { relations } from 'drizzle-orm';
import { integer, numeric, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

// ==========================================
// 1. Tabla de Clientes (CRM Core)
// ==========================================
export const customers = pgTable('customers', {
  id: uuid('id').defaultRandom().primaryKey(),
  cedula: varchar('cedula', { length: 20 }).notNull().unique(), // Identificación única del cliente
  name: varchar('name', { length: 150 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  phone: varchar('phone', { length: 30 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ==========================================
// 2. Tabla de Productos (Catálogo e Inventario)
// ==========================================
export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  sku: varchar('sku', { length: 50 }).notNull().unique(), // Ej: "TSHIRT-BLUE-L"
  name: varchar('name', { length: 150 }).notNull(),
  marca: varchar('marca', { length: 100 }),
  modelo: varchar('modelo', { length: 100 }),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(), // Dinero exacto
  stock: integer('stock').notNull().default(0), // Cantidad física real disponible
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ==========================================
// 3. Tabla de Órdenes (Ventas Cabecera)
// ==========================================
export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  customerId: uuid('customer_id')
    .notNull()
    .references(() => customers.id),
  status: varchar('status', { length: 20 }).notNull().default('pending'), // 'pending' | 'completed' | 'cancelled'
  totalAmount: numeric('total_amount', { precision: 12, scale: 2 }).notNull().default('0.00'), // Suma de todos los detalles
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ==========================================
// 4. Detalles de la Orden (Ventas Líneas - 3NF Relacional)
// ==========================================
export const orderItems = pgTable('order_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id')
    .notNull()
    .references(() => orders.id, { onDelete: 'cascade' }), // Si borramos la orden, borramos sus items
  productId: uuid('product_id')
    .notNull()
    .references(() => products.id),
  quantity: integer('quantity').notNull(),
  unitPrice: numeric('unit_price', { precision: 10, scale: 2 }).notNull(), // Snapshot histórico del precio
});

// ==========================================
// 🔀 DEFINICIÓN DE RELACIONES (Drizzle Relations API)
// Esto nos permitirá hacer consultas relacionales limpias sin joins complejos manuales.
// ==========================================
export const customersRelations = relations(customers, ({ many }) => ({
  orders: many(orders),
}));

export const productsRelations = relations(products, ({ many }) => ({
  orderItems: many(orderItems),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  customer: one(customers, {
    fields: [orders.customerId],
    references: [customers.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));
