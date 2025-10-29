
import { pgTable, serial, text,varchar } from "drizzle-orm/pg-core";  

export const MockInterviews =  pgTable("mockInterview", {
    id: serial("id").primaryKey(),
    jsonMockResp:text("jsonMockResp").notNull(),
    jobPosition:varchar("jobPosition",{ length: 255 }).notNull(),
    jobDescription:varchar("jobDescription").notNull(),
    jobExperience:varchar("jobExperience").notNull(),
    createdBy:varchar("createdBy",{ length: 255 }).notNull(),
    createdAt:varchar("createdAt",{ length: 255 }),
    mockId:varchar("mockId",{ length: 255 }).notNull()

});
