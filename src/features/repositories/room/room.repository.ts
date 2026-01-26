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
    return prisma.room.delete({
      where: { id },
    });
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
