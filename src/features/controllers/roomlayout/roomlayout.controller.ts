import Elysia, { t } from "elysia";
import { authMiddleware } from "../../shared/middlewares/auth.middleware";
import { CreateRoomLayoutSchema, RoomLayoutSchema, UpdateRoomLayoutSchema } from "../../services/roomlayout/roomlayout.schema";
import { RoomLayoutService } from "../../services/roomlayout/roomlayout.service";

export const RoomLayoutController = new Elysia({ prefix: "/RoomLayouts" })
  .use(authMiddleware)
  .get(
    "/",
    async () => {
      return await RoomLayoutService.getAllRoomLayouts();
    },
    {
      isAuth: true,
      response: t.Array(RoomLayoutSchema),
      summary: "Get all RoomLayouts",
      tags: ["RoomLayouts"],
    }
  )
  .get(
    "/:id",
    async ({ params: { id }, set }) => {
      const dept = await RoomLayoutService.getRoomLayoutById(id);
      if (!dept) {
        set.status = 404;
        return { message: "RoomLayout not found" };
      }
      return dept;
    },
    {
      isAuth: true,
      params: t.Object({ id: t.String() }),
      response: {
        200: RoomLayoutSchema,
        404: t.Object({ message: t.String() }),
      },
      summary: "Get RoomLayout by id",
      tags: ["RoomLayouts"],
    }
  )
  .post(
    "/",
    async ({ body, set }) => {
      try {
        set.status = 201;
        return await RoomLayoutService.createRoomLayout(body);
      } catch (error: any) {
        set.status = 400;
        return { message: error.message };
      }
    },
    {
      isAuth: true,
      hasRole: ["ADMIN"],
      body: CreateRoomLayoutSchema,
      response: {
        201: RoomLayoutSchema,
        400: t.Object({ message: t.String() }),
      },
      summary: "Create RoomLayout",
      tags: ["RoomLayouts"],
    }
  )
  .put(
    "/:id",
    async ({ params: { id }, body, set }) => {
      try {
        return await RoomLayoutService.updateRoomLayout(id, body);
      } catch (error: any) {
        set.status = 400;
        return { message: error.message };
      }
    },
    {
      isAuth: true,
      hasRole: ["ADMIN"],
      params: t.Object({ id: t.String() }),
      body: UpdateRoomLayoutSchema,
      response: {
        200: RoomLayoutSchema,
        400: t.Object({ message: t.String() }),
      },
      summary: "Update RoomLayout",
      tags: ["RoomLayouts"],
    }
  )
  .delete(
    "/:id",
    async ({ params: { id } }) => {
      await RoomLayoutService.deleteRoomLayout(id);
      return { message: "RoomLayout deleted" };
    },
    {
      isAuth: true,
      hasRole: ["ADMIN"],
      params: t.Object({ id: t.String() }),
      response: t.Object({ message: t.String() }),
      summary: "Delete RoomLayout",
      tags: ["RoomLayouts"],
    }
  );
