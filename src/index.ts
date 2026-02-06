import cors from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";
import { staticPlugin } from "@elysiajs/static";
import { Elysia } from "elysia";
import { controllers } from "./features/controllers";
import { join } from "path";

process.env.TZ = "Asia/Bangkok";

const port = Number(process.env.PORT || 3000);
const app = new Elysia()
.use(cors())
.get("/public/*", ({ params }) => {
    const path = join(process.cwd(), "public", params["*"]);
    return Bun.file(path);
})
.use(swagger({
  path: "/docs",
}))
.use(controllers)
.listen(port);



console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}/docs`
)
