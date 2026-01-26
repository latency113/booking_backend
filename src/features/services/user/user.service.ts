import { UserRepository } from "../../repositories/user/user.repository";
import { CreateUser, UpdateUser, UserSchema } from "./user.schema";

export namespace UserService {
  export const getAllUsers = async () => {
    return UserRepository.findUsers();
  };

  export const getUserById = async (id: string) => {
    return UserRepository.findUserById(id);
  };

  export const createUser = async (user: CreateUser) => {
    try {
      const { email, username, password, fullName } = user;
      const hashedPassword = await Bun.password.hash(password, {
        algorithm: "argon2id",
      });
      return await UserRepository.createUser(email, username, hashedPassword, fullName);
    } catch (error: any) {
      if (error.code === "P2002") {
        const target = error.meta?.target || [];
        if (target.includes("username")) {
          throw new Error("Username already exists");
        }
        if (target.includes("email")) {
          throw new Error("Email already exists");
        }
      }
      throw error;
    }
  };

  export const updateUserById = async (id: string, data: UpdateUser) => {
    try {
      const { email, username, password, fullName, role } = data;
      let hashedPassword = password;
      if (password) {
        hashedPassword = await Bun.password.hash(password, {
          algorithm: "argon2id",
        });
      }
      return await UserRepository.updateUserById(
        id,
        email,
        username,
        hashedPassword,
        fullName,
        role,
      );
    } catch (error: any) {
      if (error.code === "P2002") {
        const target = error.meta?.target || [];
        if (target.includes("username")) {
          throw new Error("Username already exists");
        }
        if (target.includes("email")) {
          throw new Error("Email already exists");
        }
      }
      throw error;
    }
  }

  export const deleteUserById = async (id: string) => {
    return UserRepository.deleteUserById(id);
  };
}
