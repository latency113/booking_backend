import { t } from "elysia";

export const LoginSchema = t.Object({
    username: t.String(),
    password: t.String(),
})

export const AuthResponseSchema = t.Object({
    token: t.String(),
    user: t.Object({
        id: t.String(),
        username: t.String(),
        fullName: t.String(),
        role: t.String(),
        departmentId: t.Optional(t.Nullable(t.String())),
        department: t.Optional(t.Nullable(t.Object({
            name: t.String()
        })))
    })
})

export type Login = typeof LoginSchema.static;
