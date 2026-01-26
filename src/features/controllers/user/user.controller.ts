import Elysia, { t } from "elysia";
import { CreateUserSchema, UpdateUserBodySchema, UserSchema } from "../../services/user/user.schema";
import { UserService } from "../../services/user/user.service";
import { authMiddleware } from "../../shared/middlewares/auth.middleware";

export const UserController = new Elysia()
  .use(authMiddleware)
  .get(
    "/users",
    async () => {
      try {
        return await UserService.getAllUsers();
      } catch (error) {
        throw error;
      }
    },
    {
      isAuth: true,
      hasRole: ["ADMIN"],
      response: { 200: t.Array(UserSchema) },
      summary: "get all users",
      tags: ["Users"],
    }
  )
  .post(
    "/users",
    async ({ body, set }) => {
      try {
        return await UserService.createUser(body);
      } catch (error: any) {
        set.status = 400;
        return {
          message: error.message,
        };
      }
    },
    {
      body: CreateUserSchema,
      response: { 
        201: UserSchema,
        400: t.Object({ message: t.String() })
      },
      summary: "create user",
      tags: ["Users"],
    }
  )
  .get(
    "/users/:id",
    async ({ params: { id } }) => {
      try {
        return await UserService.getUserById(id);
      } catch (error) {
        throw error;
      }
    },
    {
      isAuth: true,
      params: t.Object({ id: t.String() }),
      response: { 200: UserSchema },
      summary: "get user by id",
      tags: ["Users"],
    }
  )
  .put(
    "/users/:id",
    async ({ params: { id }, body, set }) => {
      try {
        return await UserService.updateUserById(id, body);
      } catch (error: any) {
        set.status = 400;
        return {
          message: error.message,
        };
      }
    },
    {
      isAuth: true,
      params: t.Object({ id: t.String() }),
      body: UpdateUserBodySchema,
      response: { 
        200: UserSchema,
        400: t.Object({ message: t.String() })
      },
      summary: "update user by id",
      tags: ["Users"],
    }
  )
  .delete(
    "/users/:id",
    async ({ params: { id } }) => {
      try {
        return await UserService.deleteUserById(id);
      } catch (error) {
        throw error;
      }
    },
    {
      isAuth: true,
      hasRole: ["ADMIN"],
      params: t.Object({ id: t.String() }),
      response: { 200: UserSchema },
      summary: "delete user by id",
      tags: ["Users"],
    }
  );