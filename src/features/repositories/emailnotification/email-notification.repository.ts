import prisma from "../../../providers/database/database.provider";
import { EmailType, EmailStatus } from "../../../providers/database/generated";

export namespace EmailNotificationRepository {
  export const create = async (data: {
    userId: string;
    bookingId?: string;
    email: string;
    subject: string;
    message: string;
    type: EmailType;
    status?: EmailStatus;
    errorMsg?: string;
  }) => {
    return prisma.emailNotification.create({
      data,
    });
  };

  export const updateStatus = async (
    id: string,
    status: EmailStatus,
    errorMsg?: string,
    sentAt?: Date
  ) => {
    return prisma.emailNotification.update({
      where: { id },
      data: {
        status,
        errorMsg,
        sentAt,
      },
    });
  };

  export const findByBookingId = async (bookingId: string) => {
    return prisma.emailNotification.findMany({
      where: { bookingId },
      orderBy: { createdAt: "desc" },
    });
  };
}
