import { jwt } from "@elysiajs/jwt";
import Elysia, { t } from "elysia";
import { AuthService } from "../../services/auth/auth.service";
import { AuthResponseSchema, LoginSchema } from "../../services/auth/auth.schema";

export const AuthController = new Elysia({ prefix: "/auth" })
    .use(
        jwt({
            name: 'jwt',
            secret: process.env.JWT_SECRET || 'secret'
        })
    )
    .post("/login", async ({ body, jwt, set }) => {
        try {
            const user = await AuthService.login(body);
            
            const token = await jwt.sign({
                id: user.id,
                role: user.role
            });

            return {
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    fullName: user.fullName,
                    role: user.role
                }
            };
        } catch (error: any) {
            set.status = 401;
            return { message: error.message };
        }
    }, {
        body: LoginSchema,
        response: {
            200: AuthResponseSchema,
            401: t.Object({ message: t.String() })
        },
        summary: "Login",
        tags: ["Auth"]
    });
