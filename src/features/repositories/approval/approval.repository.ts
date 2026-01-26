import prisma from "../../../providers/database/database.provider";

export namespace ApprovalRepository {
  export const findByBookingId = async (bookingId: string) => {
    return prisma.approval.findMany({
      where: { bookingId },
      include: {
        approver: true,
      },
      orderBy: {
        decidedAt: "desc",
      },
    });
  };

  export const create = async (data: {
    bookingId: string;
    approverId: string;
    decision: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
    comment?: string;
  }) => {
    return prisma.approval.create({
      data,
    });
  };
}
