import { t } from "elysia";
import { UserSchema } from "../user/user.schema";
import { RoomSchema } from "../room/room.schema";
import { EquipmentSchema } from "../equipment/equipment.schema";

export const BookingStatusEnum = t.UnionEnum(["PENDING", "APPROVED", "REJECTED", "CANCELLED"]);

export const BookingEquipmentSchema = t.Object({
    bookingId: t.String(),
    equipmentId: t.String(),
    quantity: t.Number(),
    equipment: t.Optional(EquipmentSchema)
})

export const BookingSchema = t.Object({
    id: t.String(),
    userId: t.String(),
    roomId: t.String(),
    startTime: t.Date(),
    endTime: t.Date(),
    purpose: t.String(),
    roomSetup: t.String(),
    status: BookingStatusEnum,
    createdAt: t.Date(),
    approvedAt: t.Optional(t.Nullable(t.Date())),
    user: t.Optional(UserSchema),
    room: t.Optional(RoomSchema),
    equipments: t.Optional(t.Array(BookingEquipmentSchema))
})

export const CreateBookingEquipmentSchema = t.Object({
    equipmentId: t.String(),
    quantity: t.Number({ minimum: 1 })
})

export const CreateBookingSchema = t.Object({
    roomId: t.String(),
    startTime: t.String(), // input as string then convert to Date
    endTime: t.String(),
    purpose: t.String(),
    roomSetup: t.String(),
    equipments: t.Optional(t.Array(CreateBookingEquipmentSchema))
})

export const UpdateBookingStatusSchema = t.Object({
    status: BookingStatusEnum,
    comment: t.Optional(t.String())
})

export const UpdateBookingSchema = t.Partial(CreateBookingSchema);

export type Booking = typeof BookingSchema.static;
export type CreateBooking = typeof CreateBookingSchema.static;
export type UpdateBooking = typeof UpdateBookingSchema.static;
export type UpdateBookingStatus = typeof UpdateBookingStatusSchema.static;
