import prisma from "../../../providers/database/database.provider";

export namespace BookingRepository {
  export const findMany = async () => {
    return prisma.booking.findMany({
      include: {
        user: true,
        room: true,
        equipments: {
          include: {
            equipment: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  };

  export const findById = async (id: string) => {
    return prisma.booking.findUnique({
      where: { id },
      include: {
        user: true,
        room: true,
        equipments: {
          include: {
            equipment: true,
          },
        },
        approvals: {
          include: {
            approver: true,
          },
        },
      },
    });
  };

  export const findByUserId = async (userId: string) => {
    return prisma.booking.findMany({
      where: { userId },
      include: {
        room: true,
        equipments: {
          include: {
            equipment: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  };

  export const create = async (data: {
    userId: string;
    roomId: string;
    startTime: Date;
    endTime: Date;
    purpose: string;
    roomSetup: string;
    equipments?: { equipmentId: string; quantity: number }[];
  }) => {
    const { equipments, ...bookingData } = data;

    return prisma.booking.create({
      data: {
        ...bookingData,
        equipments: equipments
          ? {
              create: equipments.map((eq) => ({
                equipmentId: eq.equipmentId,
                quantity: eq.quantity,
              })),
            }
          : undefined,
      },
      include: {
        equipments: true,
      },
    });
  };

  export const updateStatus = async (
    id: string,
    status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED",
    approvedAt?: Date,
  ) => {
    return prisma.booking.update({
      where: { id },
      data: {
        status,
        approvedAt,
      },
    });
  };

  export const update = async (
    id: string,
    data: {
      roomId?: string;
      startTime?: Date;
      endTime?: Date;
      purpose?: string;
      roomSetup?: string;
      equipments?: { equipmentId: string; quantity: number }[];
    }
  ) => {
    const { equipments, ...bookingData } = data;

    return prisma.booking.update({
      where: { id },
      data: {
        ...bookingData,
        equipments: equipments
          ? {
              deleteMany: {},
              create: equipments.map((eq) => ({
                equipmentId: eq.equipmentId,
                quantity: eq.quantity,
              })),
            }
          : undefined,
      },
      include: {
        equipments: true,
      },
    });
  };

  export const deleteById = async (id: string) => {
    return prisma.$transaction([
      prisma.bookingEquipment.deleteMany({ where: { bookingId: id } }),
      prisma.approval.deleteMany({ where: { bookingId: id } }),
      prisma.emailNotification.deleteMany({ where: { bookingId: id } }),
      prisma.booking.delete({ where: { id } }),
    ]);
  };

  export const checkOverlap = async (
    roomId: string,
    startTime: Date,
    endTime: Date,
  ) => {
    const overlaps = await prisma.booking.findMany({
      where: {
        roomId,
        status: {
          in: ["PENDING", "APPROVED"],
        },
        OR: [
          {
            AND: [
              { startTime: { lte: startTime } },
              { endTime: { gt: startTime } },
            ],
          },
          {
            AND: [
              { startTime: { lt: endTime } },
              { endTime: { gte: endTime } },
            ],
          },
          {
            AND: [
              { startTime: { gte: startTime } },
              { endTime: { lte: endTime } },
            ],
          },
        ],
      },
    });

    return overlaps.length > 0;
  };
}
