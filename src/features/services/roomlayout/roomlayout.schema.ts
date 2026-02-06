import { t } from "elysia";

export const RoomLayoutSchema = t.Object({
    id: t.String(),
    name: t.String(),
    _count: t.Optional(t.Object({
        bookings: t.Number()
    }))
})

export const CreateRoomLayoutSchema = t.Object({
    name: t.String()
})

export const UpdateRoomLayoutSchema = t.Partial(CreateRoomLayoutSchema);

export type RoomLayout = typeof RoomLayoutSchema.static;
export type CreateRoomLayout = typeof CreateRoomLayoutSchema.static;
export type UpdateRoomLayout = typeof UpdateRoomLayoutSchema.static;
