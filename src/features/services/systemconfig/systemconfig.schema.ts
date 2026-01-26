import { t } from "elysia";

export const SystemConfigSchema = t.Object({
    id: t.String(),
    maxBookingHours: t.Number(),
    advanceBookingDays: t.Number(),
    enableNotification: t.Boolean()
})

export const UpdateSystemConfigSchema = t.Partial(t.Omit(SystemConfigSchema, ["id"]));

export type SystemConfig = typeof SystemConfigSchema.static;
export type UpdateSystemConfig = typeof UpdateSystemConfigSchema.static;
