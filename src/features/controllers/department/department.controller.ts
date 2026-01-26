import Elysia, { t } from "elysia";
import { authMiddleware } from "../../shared/middlewares/auth.middleware";
import { CreateDepartmentSchema, DepartmentSchema, UpdateDepartmentSchema } from "../../services/department/department.schema";
import { DepartmentService } from "../../services/department/department.service";

export const DepartmentController = new Elysia({ prefix: "/departments" })
  .use(authMiddleware)
  .get(
    "/",
    async () => {
      return await DepartmentService.getAllDepartments();
    },
    {
      isAuth: true,
      response: t.Array(DepartmentSchema),
      summary: "Get all departments",
      tags: ["Departments"],
    }
  )
  .get(
    "/:id",
    async ({ params: { id }, set }) => {
      const dept = await DepartmentService.getDepartmentById(id);
      if (!dept) {
        set.status = 404;
        return { message: "Department not found" };
      }
      return dept;
    },
    {
      isAuth: true,
      params: t.Object({ id: t.String() }),
      response: {
        200: DepartmentSchema,
        404: t.Object({ message: t.String() }),
      },
      summary: "Get department by id",
      tags: ["Departments"],
    }
  )
  .post(
    "/",
    async ({ body, set }) => {
      try {
        set.status = 201;
        return await DepartmentService.createDepartment(body);
      } catch (error: any) {
        set.status = 400;
        return { message: error.message };
      }
    },
    {
      isAuth: true,
      hasRole: ["ADMIN"],
      body: CreateDepartmentSchema,
      response: {
        201: DepartmentSchema,
        400: t.Object({ message: t.String() }),
      },
      summary: "Create department",
      tags: ["Departments"],
    }
  )
  .put(
    "/:id",
    async ({ params: { id }, body, set }) => {
      try {
        return await DepartmentService.updateDepartment(id, body);
      } catch (error: any) {
        set.status = 400;
        return { message: error.message };
      }
    },
    {
      isAuth: true,
      hasRole: ["ADMIN"],
      params: t.Object({ id: t.String() }),
      body: UpdateDepartmentSchema,
      response: {
        200: DepartmentSchema,
        400: t.Object({ message: t.String() }),
      },
      summary: "Update department",
      tags: ["Departments"],
    }
  )
  .delete(
    "/:id",
    async ({ params: { id } }) => {
      await DepartmentService.deleteDepartment(id);
      return { message: "Department deleted" };
    },
    {
      isAuth: true,
      hasRole: ["ADMIN"],
      params: t.Object({ id: t.String() }),
      response: t.Object({ message: t.String() }),
      summary: "Delete department",
      tags: ["Departments"],
    }
  );
