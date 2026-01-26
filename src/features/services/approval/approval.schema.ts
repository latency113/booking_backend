import { t } from "elysia";
import { UserSchema } from "../user/user.schema";

export const ApprovalSchema = t.Object({
    id: t.String(),
    bookingId: t.String(),
    approverId: t.String(),
    decision: t.UnionEnum(["PENDING", "APPROVED", "REJECTED", "CANCELLED"]),
    comment: t.Optional(t.Nullable(t.String())),
    decidedAt: t.Date(),
    approver: t.Optional(UserSchema)
})

export const CreateApprovalSchema = t.Omit(ApprovalSchema, ["id", "decidedAt", "approver"]);

export type Approval = typeof ApprovalSchema.static;
export type CreateApproval = typeof CreateApprovalSchema.static;
