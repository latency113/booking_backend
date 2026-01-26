import prisma from "../../../providers/database/database.provider";

export namespace UserRepository {
  export const findUsers = async () => {
    return prisma.user.findMany({
      include: { department: true }
    });
  };
  export const findUserById = async (id: string) => {
    return prisma.user.findUnique({
      where: { id },
      include: { department: true }
    });
  };

  export const createUser = async (
    email: string | null | undefined,
    username: string,
    password: string,
    fullName: string,
    departmentId?: string | null,
  ) => {
    return prisma.user.create({
      data: {
        email,
        username,
        password,
        fullName,
        departmentId,
        role: "USER",
      },
    });
  };

  export const updateUserById = async (
    id: string,
    email?: string | null,
    username?: string,
    password?: string,
    fullName?: string,
    role?: "USER" | "ADMIN" | "HEAD_BUILDING" | "HEAD_MEDIA",
    departmentId?: string | null,
  ) => {
    return prisma.user.update({
      where: { id },
      data: {
        email,
        username,
        password,
        fullName,
        role,
        departmentId,
      },
    });
  }

  export const findUserByUsername = async (username: string) => {
    return prisma.user.findUnique({
      where: { username },
      include: { department: true }
    });
  };

  export const deleteUserById = async (id: string) => {
    return prisma.user.delete({
      where: { id },
    });
  };
}
