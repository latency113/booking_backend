import { t } from "elysia";

export const NotificationSchema = t.Object({
    id: t.String(),
    userId: t.String(),
    message: t.String(),
    isRead: t.Boolean(),
    createdAt: t.Date()
})

export type Notification = typeof NotificationSchema.static;
