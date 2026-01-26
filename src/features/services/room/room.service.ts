import { RoomRepository } from "../../repositories/room/room.repository";
import { CreateRoom, UpdateRoom } from "./room.schema";
import { UploadService } from "../upload/upload.service";

export namespace RoomService {
  export const getAllRooms = async () => {
    return RoomRepository.findMany();
  };

  export const getRoomById = async (id: string) => {
    return RoomRepository.findById(id);
  };

  export const createRoom = async (data: any) => {
    let imageUrls: string[] = [];
    if (data.images) {
      const files = Array.isArray(data.images) ? data.images : [data.images];
      imageUrls = await UploadService.uploadMultiple(files);
    }

    return RoomRepository.create({
      ...data,
      capacity: Number(data.capacity), // Ensure number if from multipart
      isActive: data.isActive === 'true' || data.isActive === true,
      images: imageUrls,
    });
  };

  export const updateRoom = async (id: string, data: any) => {
    let imageUrls: string[] | undefined = undefined;
    if (data.images) {
      const files = Array.isArray(data.images) ? data.images : [data.images];
      imageUrls = await UploadService.uploadMultiple(files);
    }

    return RoomRepository.update(id, {
      ...data,
      capacity: data.capacity ? Number(data.capacity) : undefined,
      isActive: data.isActive !== undefined ? (data.isActive === 'true' || data.isActive === true) : undefined,
      images: imageUrls,
    });
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
