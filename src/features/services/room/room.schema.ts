import { t } from "elysia";

export const RoomImageSchema = t.Object({
    id: t.String(),
    url: t.String()
})

export const RoomSchema = t.Object({
    id: t.String(),
    name: t.String(),
    capacity: t.Number(),
    description: t.Optional(t.Nullable(t.String())),
    isActive: t.Boolean(),
    images: t.Optional(t.Array(RoomImageSchema))
})

export const CreateRoomSchema = t.Object({
    name: t.String(),
    capacity: t.Numeric(), // Handles "1" -> 1
    description: t.Optional(t.Nullable(t.String())),
    isActive: t.Optional(t.Any()), // Handles "true" -> true (will be converted in service)
    images: t.Optional(t.Files())
})

export const UpdateRoomSchema = t.Partial(t.Object({
    name: t.String(),
    capacity: t.Numeric(),
    description: t.Nullable(t.String()),
    isActive: t.Any(),
    images: t.Files()
}));

export type Room = typeof RoomSchema.static;
export type CreateRoom = typeof CreateRoomSchema.static;
export type UpdateRoom = typeof UpdateRoomSchema.static;
