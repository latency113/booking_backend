import Elysia, { t } from "elysia";
import { authMiddleware } from "../../shared/middlewares/auth.middleware";
import { CreateEquipmentSchema, EquipmentSchema, UpdateEquipmentSchema } from "../../services/equipment/equipment.schema";
import { EquipmentService } from "../../services/equipment/equipment.service";

export const EquipmentController = new Elysia({ prefix: "/equipments" })
  .use(authMiddleware)
  .get(
    "/",
    async () => {
      return await EquipmentService.getAllEquipment();
    },
    {
      isAuth: true,
      response: t.Array(EquipmentSchema),
      summary: "Get all equipment",
      tags: ["Equipment"],
    }
  )
  .get(
    "/:id",
    async ({ params: { id }, set }) => {
      const equipment = await EquipmentService.getEquipmentById(id);
      if (!equipment) {
        set.status = 404;
        return { message: "Equipment not found" };
      }
      return equipment;
    },
    {
      isAuth: true,
      params: t.Object({ id: t.String() }),
      response: {
        200: EquipmentSchema,
        404: t.Object({ message: t.String() }),
      },
      summary: "Get equipment by id",
      tags: ["Equipment"],
    }
  )
  .post(
    "/",
    async ({ body, set }) => {
      try {
        set.status = 201;
        return await EquipmentService.createEquipment(body);
      } catch (error: any) {
        set.status = 400;
        return { message: error.message };
      }
    },
    {
      isAuth: true,
      hasRole: ["ADMIN", "HEAD_MEDIA"],
      body: CreateEquipmentSchema,
      response: {
        201: EquipmentSchema,
        400: t.Object({ message: t.String() }),
      },
      summary: "Create equipment",
      tags: ["Equipment"],
    }
  )
  .put(
    "/:id",
    async ({ params: { id }, body, set }) => {
      try {
        return await EquipmentService.updateEquipment(id, body);
      } catch (error: any) {
        set.status = 400;
        return { message: error.message };
      }
    },
    {
      isAuth: true,
      hasRole: ["ADMIN", "HEAD_MEDIA"],
      params: t.Object({ id: t.String() }),
      body: UpdateEquipmentSchema,
      response: {
        200: EquipmentSchema,
        400: t.Object({ message: t.String() }),
      },
      summary: "Update equipment",
      tags: ["Equipment"],
    }
  )
  .delete(
    "/:id",
    async ({ params: { id } }) => {
      await EquipmentService.deleteEquipment(id);
      return { message: "Equipment deleted" };
    },
    {
      isAuth: true,
      hasRole: ["ADMIN", "HEAD_MEDIA"],
      params: t.Object({ id: t.String() }),
      response: t.Object({ message: t.String() }),
      summary: "Delete equipment",
      tags: ["Equipment"],
    }
  );
