import { Elysia } from "elysia";

export const loggerMiddleware = new Elysia()
    .onRequest(({ request }) => {
        console.log(`[${new Date().toISOString()}] ${request.method} ${request.url}`);
    })
    .onAfterHandle(({ request, set }) => {
        // Optional: log status code or duration
    })
    .onError(({ code, error, set }) => {
        console.error(`[ERROR] ${code}: ${error.message}`);
        return {
            status: set.status,
            code,
            message: error.message
        };
    });
