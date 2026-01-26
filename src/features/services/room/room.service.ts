import { RoomRepository } from "../../repositories/room/room.repository";
import { CreateRoom, UpdateRoom } from "./room.schema";

export namespace RoomService {
  export const getAllRooms = async () => {
    return RoomRepository.findMany();
  };

  export const getRoomById = async (id: string) => {
    return RoomRepository.findById(id);
  };

  export const createRoom = async (data: CreateRoom) => {
    return RoomRepository.create(data);
  };

  export const updateRoom = async (id: string, data: UpdateRoom) => {
    return RoomRepository.update(id, data);
  };

  export const deleteRoom = async (id: string) => {
    return RoomRepository.deleteById(id);
  };

  export const assignEquipment = async (roomId: string, equipmentId: string) => {
    return RoomRepository.assignEquipment(roomId, equipmentId);
  };

  export const unassignEquipment = async (roomId: string, equipmentId: string) => {
    return RoomRepository.unassignEquipment(roomId, equipmentId);
  };

  export const getRoomWithEquipment = async (id: string) => {
    return RoomRepository.getRoomWithEquipment(id);
  };
}
