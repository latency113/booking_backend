import prisma from "../../../providers/database/database.provider";

export namespace EquipmentRepository {
  export const findMany = async () => {
    return prisma.equipment.findMany();
  };

  export const findById = async (id: string) => {
    return prisma.equipment.findUnique({
      where: { id },
    });
  };

  export const create = async (data: {
    name: string;
    detail?: string;
  }) => {
    return prisma.equipment.create({
      data,
    });
  };

  export const update = async (
    id: string,
    data: {
      name?: string;
      detail?: string;
    },
  ) => {
    return prisma.equipment.update({
      where: { id },
      data,
    });
  };

  export const deleteById = async (id: string) => {
    return prisma.equipment.delete({
      where: { id },
    });
  };
}
