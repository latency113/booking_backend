import prisma from "../../../providers/database/database.provider";

export namespace UserRepository {
  export const findUsers = async () => {
    return prisma.user.findMany();
  };
  export const findUserById = async (id: string) => {
    return prisma.user.findUnique({
      where: { id },
    });
  };

  export const createUser = async (
    email: string | null | undefined,
    username: string,
    password: string,
    fullName: string,
  ) => {
    return prisma.user.create({
      data: {
        email,
        username,
        password,
        fullName,
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
  ) => {
    return prisma.user.update({
      where: { id },
      data: {
        email,
        username,
        password,
        fullName,
        role,
      },
    });
  }

  export const findUserByUsername = async (username: string) => {
    return prisma.user.findUnique({
      where: { username },
    });
  };

  export const deleteUserById = async (id: string) => {
    return prisma.user.delete({
      where: { id },
    });
  };
}
