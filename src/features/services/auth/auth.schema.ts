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
    })
})

export type Login = typeof LoginSchema.static;
