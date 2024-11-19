
import { boolean, pgTable, serial, varchar } from "drizzle-orm/pg-core"; 


export const Task = pgTable ("task",{
    id: serial("id").primaryKey(),
    title: varchar("title").notNull(),
    createdBy: varchar('createdBy').notNull(),
    checked:boolean('checked').notNull(),
} )
