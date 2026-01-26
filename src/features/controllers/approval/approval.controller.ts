import Elysia, { t } from "elysia";
import { authMiddleware } from "../../shared/middlewares/auth.middleware";
import { ApprovalSchema } from "../../services/approval/approval.schema";
import { ApprovalService } from "../../services/approval/approval.service";

export const ApprovalController = new Elysia({ prefix: "/approvals" })
  .use(authMiddleware)
  .get(
    "/booking/:bookingId",
    async ({ params: { bookingId } }) => {
      return await ApprovalService.getApprovalHistory(bookingId);
    },
    {
      isAuth: true,
      params: t.Object({ bookingId: t.String() }),
      response: t.Array(ApprovalSchema),
      summary: "Get approval history for a booking",
      tags: ["Approvals"],
    }
  );
