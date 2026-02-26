import { pgTable, serial, varchar, timestamp, text, pgEnum } from 'drizzle-orm/pg-core';

// Enum for user roles
export const userRoleEnum = pgEnum('role', ['ADMIN', 'EDITOR']);

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }),
  email: varchar('email', { length: 255 }).unique(),
  password: text('password'), // hashed
  role: userRoleEnum('role'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Example posts table update (link to users)
export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }),
  content: text('content'),
  authorId: serial('author_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
