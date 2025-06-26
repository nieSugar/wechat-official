import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const messageLogs = pgTable("message_logs", {
    id: serial("id").primaryKey(),
    toUserName: text("ToUserName"),
    fromUserName: text("FromUserName"),
    msgType: text("MsgType"),
    content: text("Content"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});