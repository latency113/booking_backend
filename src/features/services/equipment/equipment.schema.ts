import { t } from "elysia";

export const EquipmentSchema = t.Object({
    id: t.String(),
    name: t.String(),
    detail: t.Optional(t.Nullable(t.String())),
})

export const CreateEquipmentSchema = t.Omit(EquipmentSchema, ["id"]);

export const UpdateEquipmentSchema = t.Partial(CreateEquipmentSchema);

export type Equipment = typeof EquipmentSchema.static;
export type CreateEquipment = typeof CreateEquipmentSchema.static;
export type UpdateEquipment = typeof UpdateEquipmentSchema.static;
