import Elysia, { t } from "elysia";
import { authMiddleware } from "../../shared/middlewares/auth.middleware";
import { CreateRoomSchema, RoomSchema, UpdateRoomSchema } from "../../services/room/room.schema";
import { RoomService } from "../../services/room/room.service";

export const RoomController = new Elysia({ prefix: "/rooms" })
  .use(authMiddleware)
  .get(
    "/",
    async () => {
      return await RoomService.getAllRooms();
    },
    {
      isAuth: true,
      response: t.Array(RoomSchema),
      summary: "Get all rooms",
      tags: ["Rooms"],
    }
  )
  .get(
    "/:id",
    async ({ params: { id }, set }) => {
      const room = await RoomService.getRoomById(id);
      if (!room) {
        set.status = 404;
        return { message: "Room not found" };
      }
      return room;
    },
    {
      isAuth: true,
      params: t.Object({ id: t.String() }),
      response: {
        200: RoomSchema,
        404: t.Object({ message: t.String() }),
      },
      summary: "Get room by id",
      tags: ["Rooms"],
    }
  )
  .post(
    "/",
    async ({ body, set }) => {
      try {
        set.status = 201;
        return await RoomService.createRoom(body);
      } catch (error: any) {
        set.status = 400;
        return { message: error.message };
      }
    },
    {
      isAuth: true,
      hasRole: ["ADMIN", "HEAD_BUILDING"],
      body: CreateRoomSchema,
      response: {
        201: RoomSchema,
        400: t.Object({ message: t.String() }),
      },
      summary: "Create room",
      tags: ["Rooms"],
    }
  )
  .put(
    "/:id",
    async ({ params: { id }, body, set }) => {
      try {
        return await RoomService.updateRoom(id, body);
      } catch (error: any) {
        set.status = 400;
        return { message: error.message };
      }
    },
    {
      isAuth: true,
      hasRole: ["ADMIN", "HEAD_BUILDING"],
      params: t.Object({ id: t.String() }),
      body: UpdateRoomSchema,
      response: {
        200: RoomSchema,
        400: t.Object({ message: t.String() }),
      },
      summary: "Update room",
      tags: ["Rooms"],
    }
  )
  .delete(
    "/:id",
    async ({ params: { id } }) => {
      await RoomService.deleteRoom(id);
      return { message: "Room deleted" };
    },
    {
      isAuth: true,
      hasRole: ["ADMIN", "HEAD_BUILDING"],
      params: t.Object({ id: t.String() }),
      response: t.Object({ message: t.String() }),
      summary: "Delete room",
      tags: ["Rooms"],
    }
  )
  .post(
    "/:id/equipments",
    async ({ params: { id }, body: { equipmentId } }) => {
      return await RoomService.assignEquipment(id, equipmentId);
    },
    {
      isAuth: true,
      hasRole: ["ADMIN", "HEAD_BUILDING"],
      params: t.Object({ id: t.String() }),
      body: t.Object({ equipmentId: t.String() }),
      summary: "Assign equipment to room",
      tags: ["Rooms"],
    }
  )
  .delete(
    "/:id/equipments/:equipmentId",
    async ({ params: { id, equipmentId } }) => {
      await RoomService.unassignEquipment(id, equipmentId);
      return { message: "Equipment unassigned from room" };
    },
    {
      isAuth: true,
      hasRole: ["ADMIN", "HEAD_BUILDING"],
      params: t.Object({ id: t.String(), equipmentId: t.String() }),
      summary: "Unassign equipment from room",
      tags: ["Rooms"],
    }
  );
