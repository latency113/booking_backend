import prisma from "../../../providers/database/database.provider";

export namespace DepartmentRepository {
  export const findMany = async () => {
    return prisma.department.findMany({
      include: {
        _count: {
          select: { users: true }
        }
      }
    });
  };

  export const findById = async (id: string) => {
    return prisma.department.findUnique({
      where: { id },
      include: {
        users: true
      }
    });
  };

  export const create = async (name: string) => {
    return prisma.department.create({
      data: { name }
    });
  };

  export const update = async (id: string, name: string) => {
    return prisma.department.update({
      where: { id },
      data: { name }
    });
  };

  export const deleteById = async (id: string) => {
    return prisma.department.delete({
      where: { id }
    });
  };
}
