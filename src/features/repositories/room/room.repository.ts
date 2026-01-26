import prisma from "../../../providers/database/database.provider";

export namespace RoomRepository {
  export const findMany = async () => {
    return prisma.room.findMany({
      include: {
        images: true
      }
    });
  };

  export const findById = async (id: string) => {
    return prisma.room.findUnique({
      where: { id },
      include: {
        images: true
      }
    });
  };

  export const create = async (data: {
    name: string;
    capacity: number;
    description?: string;
    isActive?: boolean;
    images?: string[];
  }) => {
    const { images, ...roomData } = data;
    return prisma.room.create({
      data: {
        ...roomData,
        images: images ? {
          create: images.map(url => ({ url }))
        } : undefined
      },
      include: {
        images: true
      }
    });
  };

  export const update = async (
    id: string,
    data: {
      name?: string;
      capacity?: number;
      description?: string;
      isActive?: boolean;
      images?: string[];
    },
  ) => {
    const { images, ...roomData } = data;
    return prisma.room.update({
      where: { id },
      data: {
        ...roomData,
        images: images ? {
          deleteMany: {},
          create: images.map(url => ({ url }))
        } : undefined
      },
      include: {
        images: true
      }
    });
  };

  export const deleteById = async (id: string) => {
    // 1. Get all bookings for this room to clean up their sub-relations
    const bookings = await prisma.booking.findMany({
      where: { roomId: id },
      select: { id: true }
    });
    const bookingIds = bookings.map(b => b.id);

    return prisma.$transaction([
      // Clean up relations for all bookings in this room
      prisma.bookingEquipment.deleteMany({ where: { bookingId: { in: bookingIds } } }),
      prisma.approval.deleteMany({ where: { bookingId: { in: bookingIds } } }),
      prisma.emailNotification.deleteMany({ where: { bookingId: { in: bookingIds } } }),
      prisma.booking.deleteMany({ where: { roomId: id } }),
      
      // Clean up room-specific relations
      prisma.roomEquipment.deleteMany({ where: { roomId: id } }),
      prisma.roomImage.deleteMany({ where: { roomId: id } }),
      
      // Finally delete the room
      prisma.room.delete({
        where: { id },
      }),
    ]);
  };

  export const assignEquipment = async (roomId: string, equipmentId: string) => {
    return prisma.roomEquipment.create({
      data: {
        roomId,
        equipmentId,
      },
    });
  };

  export const unassignEquipment = async (roomId: string, equipmentId: string) => {
    return prisma.roomEquipment.delete({
      where: {
        roomId_equipmentId: {
          roomId,
          equipmentId,
        },
      },
    });
  };

  export const getRoomWithEquipment = async (id: string) => {
    return prisma.room.findUnique({
      where: { id },
      include: {
        equipments: {
          include: {
            equipment: true,
          },
        },
      },
    });
  };
}
