import cors from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { controllers } from "./features/controllers";

const port = Number(process.env.PORT || 3000);
const app = new Elysia()
.use(cors())
.use(swagger({
  path: "/docs",
}))
.use(controllers)
.listen(port);



console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}/docs`
);
