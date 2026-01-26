import { UserRepository } from "../../repositories/user/user.repository";
import { Login } from "./auth.schema";

export namespace AuthService {
    export const login = async (data: Login) => {
        const user = await UserRepository.findUserByUsername(data.username);
        if (!user) {
            throw new Error("Invalid username or password");
        }

        const isPasswordValid = await Bun.password.verify(data.password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid username or password");
        }

        return user;
    }
}
