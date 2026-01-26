import prisma from "../../../providers/database/database.provider";

export namespace NotificationRepository {
  export const findByUserId = async (userId: string) => {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: {
        createdAt: "desc",
      },
    });
  };

  export const create = async (data: { userId: string; message: string }) => {
    return prisma.notification.create({
      data,
    });
  };

  export const markAsRead = async (id: string) => {
    return prisma.notification.update({
      where: { id },
      data: {
        isRead: true,
      },
    });
  };

  export const deleteById = async (id: string) => {
    return prisma.notification.delete({
      where: { id },
    });
  };
}
