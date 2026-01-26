import prisma from "../../../providers/database/database.provider";

export namespace SystemConfigRepository {
  export const getConfig = async () => {
    // There should be only one record
    return prisma.systemConfig.findFirst();
  };

  export const update = async (
    id: string,
    data: {
      maxBookingHours?: number;
      advanceBookingDays?: number;
      enableNotification?: boolean;
    },
  ) => {
    return prisma.systemConfig.update({
      where: { id },
      data,
    });
  };

  export const createInitial = async (data: {
    maxBookingHours: number;
    advanceBookingDays: number;
    enableNotification: boolean;
  }) => {
    return prisma.systemConfig.create({
      data,
    });
  };
}
