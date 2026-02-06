import prisma from "../../../providers/database/database.provider";

export namespace RoomLayoutRepository {
  export const findMany = async () => {
    return prisma.roomLayout.findMany({
      include: {
        _count: {
          select: { bookings: true }
        }
      }
    });
  };

  export const findById = async (id: string) => {
    return prisma.roomLayout.findUnique({
      where: { id },
      include: {
        bookings: true
      }
    });
  };

  export const create = async (name: string) => {
    return prisma.roomLayout.create({
      data: { name }
    });
  };

  export const update = async (id: string, name: string) => {
    return prisma.roomLayout.update({
      where: { id },
      data: { name }
    });
  };

  export const deleteById = async (id: string) => {
    return prisma.roomLayout.delete({
      where: { id }
    });
  };
}
