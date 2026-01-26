import { t } from "elysia";

export const UserSchema = t.Object({
    id: t.String(),
    email: t.Optional(t.Nullable(t.String())),
    username: t.String(),
    password: t.String(),
    fullName: t.String(),
    role: t.UnionEnum(["USER", "ADMIN","HEAD_BUILDING","HEAD_MEDIA"]),
    createdAt: t.Date(),
})

export const CreateUserSchema = t.Object({
    email: t.Optional(t.Nullable(t.String())),
    username: t.String(),
    password: t.String(),
    fullName: t.String(),
    role: t.UnionEnum(["USER", "ADMIN","HEAD_BUILDING","HEAD_MEDIA"]),
})

export const UpdateUserBodySchema = t.Partial(t.Omit(UserSchema, ["id", "createdAt"]));

export type User = typeof UserSchema.static;
export type CreateUser = typeof CreateUserSchema.static;
export type UpdateUser = typeof UpdateUserBodySchema.static;