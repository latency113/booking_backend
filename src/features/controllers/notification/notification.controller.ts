import Elysia, { t } from "elysia";
import { authMiddleware } from "../../shared/middlewares/auth.middleware";
import { NotificationSchema } from "../../services/notification/notification.schema";
import { NotificationService } from "../../services/notification/notification.service";

export const NotificationController = new Elysia({ prefix: "/notifications" })
  .use(authMiddleware)
  .get(
    "/",
    async ({ user }) => {
      return await NotificationService.getMyNotifications(user?.id as string);
    },
    {
      isAuth: true,
      response: t.Array(NotificationSchema),
      summary: "Get my notifications",
      tags: ["Notifications"],
    }
  )
  .post(
    "/:id/read",
    async ({ params: { id } }) => {
      return await NotificationService.markAsRead(id);
    },
    {
      isAuth: true,
      params: t.Object({ id: t.String() }),
      response: NotificationSchema,
      summary: "Mark notification as read",
      tags: ["Notifications"],
    }
  );
