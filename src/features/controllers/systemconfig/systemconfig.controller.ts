import Elysia, { t } from "elysia";
import { authMiddleware } from "../../shared/middlewares/auth.middleware";
import { SystemConfigSchema, UpdateSystemConfigSchema } from "../../services/systemconfig/systemconfig.schema";
import { SystemConfigService } from "../../services/systemconfig/systemconfig.service";

export const SystemConfigController = new Elysia({ prefix: "/system-config" })
  .use(authMiddleware)
  .get(
    "/",
    async () => {
      return await SystemConfigService.getConfig();
    },
    {
      isAuth: true,
      hasRole: ["ADMIN"],
      response: SystemConfigSchema,
      summary: "Get system configuration",
      tags: ["System Config"],
    }
  )
  .put(
    "/",
    async ({ body }) => {
      return await SystemConfigService.updateConfig(body);
    },
    {
      isAuth: true,
      hasRole: ["ADMIN"],
      body: UpdateSystemConfigSchema,
      response: SystemConfigSchema,
      summary: "Update system configuration",
      tags: ["System Config"],
    }
  );
