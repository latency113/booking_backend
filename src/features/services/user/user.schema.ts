import { t } from "elysia";

export const DepartmentSchema = t.Object({
    id: t.String(),
    name: t.String(),
    createdAt: t.Date(),
})

export const UserSchema = t.Object({
    id: t.String(),
    email: t.Optional(t.Nullable(t.String())),
    username: t.String(),
    password: t.String(),
    fullName: t.String(),
    role: t.UnionEnum(["USER", "ADMIN","HEAD_BUILDING","HEAD_MEDIA"]),
    departmentId: t.Optional(t.Nullable(t.String())),
    createdAt: t.Date(),
    department: t.Optional(t.Nullable(DepartmentSchema))
})

export const CreateUserSchema = t.Object({
    email: t.Optional(t.Nullable(t.String())),
    username: t.String(),
    password: t.String(),
    fullName: t.String(),
    role: t.UnionEnum(["USER", "ADMIN","HEAD_BUILDING","HEAD_MEDIA"]),
    departmentId: t.Optional(t.Nullable(t.String())),
})

export const UpdateUserBodySchema = t.Partial(t.Omit(UserSchema, ["id", "createdAt", "department"]));

export type User = typeof UserSchema.static;
export type CreateUser = typeof CreateUserSchema.static;
export type UpdateUser = typeof UpdateUserBodySchema.static;