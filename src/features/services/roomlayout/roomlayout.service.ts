import { RoomLayoutRepository } from "../../repositories/roomlayout/roomlayout.repository";
import { CreateRoomLayout, UpdateRoomLayout } from "./roomlayout.schema";

export namespace RoomLayoutService {
  export const getAllRoomLayouts = async () => {
    return RoomLayoutRepository.findMany();
  };

  export const getRoomLayoutById = async (id: string) => {
    return RoomLayoutRepository.findById(id);
  };

  export const createRoomLayout = async (data: CreateRoomLayout) => {
    return RoomLayoutRepository.create(data.name);
  };

  export const updateRoomLayout = async (id: string, data: UpdateRoomLayout) => {
    if (!data.name) throw new Error("Name is required");
    return RoomLayoutRepository.update(id, data.name);
  };

  export const deleteRoomLayout = async (id: string) => {
    return RoomLayoutRepository.deleteById(id);
  };
}
