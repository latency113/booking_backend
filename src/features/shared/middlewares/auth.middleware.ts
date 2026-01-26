import { jwt } from "@elysiajs/jwt";
import { Elysia } from "elysia";

export const authMiddleware = new Elysia()
    .use(
        jwt({
            name: 'jwt',
            secret: process.env.JWT_SECRET || 'secret'
        })
    )
    .derive({ as: 'global' }, async ({ jwt, headers: { authorization } }) => {
        if (!authorization) {
            return { user: null };
        }

        const token = authorization.startsWith('Bearer ') 
            ? authorization.slice(7) 
            : authorization;

        const payload = await jwt.verify(token);
        
        if (!payload || typeof payload !== 'object') {
            return { user: null };
        }

        return {
            user: {
                id: (payload.id || payload.sub) as string,
                role: payload.role as string,
                username: payload.username as string
            }
        };
    })
    .macro(({ onBeforeHandle }) => ({
        isAuth() {
            onBeforeHandle(({ user, set }) => {
                if (!user || !user.id) {
                    set.status = 401;
                    return {
                        success: false,
                        message: "Unauthorized: Invalid or missing user session"
                    };
                }
            })
        },
        hasRole(roles: string[]) {
            onBeforeHandle(({ user, set }) => {
                if (!user || !user.id) {
                    set.status = 401;
                    return {
                        success: false,
                        message: "Unauthorized"
                    };
                }
                if (!roles.includes(user.role as string)) {
                    set.status = 403;
                    return {
                        success: false,
                        message: "Forbidden"
                    };
                }
            })
        }
    }));