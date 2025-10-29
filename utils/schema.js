
import { pgTable, serial, text,varchar } from "drizzle-orm/pg-core";  

export const MockInterview =  pgTable("mockInterview", {
    id: serial("id").primaryKey(),
    jsonMockResp:text("jsonMockResp").notNull(),
    jobRole:varchar("jobRole",{ length: 255 }).notNull(),
    jobRequirement:varchar("jobRequirement").notNull(),
    experience:varchar("experience").notNull(),
    createdBy:varchar("createdBy",{ length: 255 }).notNull(),
    createdAt:varchar("createdAt",{ length: 255 }),
    mockId:varchar("mockId",{ length: 255 }).notNull(),
    company:varchar("company",{ length: 255 }).notNull()

});
