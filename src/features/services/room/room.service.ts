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
    console.log("Creating room with data:", data);
    let imageUrls: string[] = [];
    if (data.images) {
      const files = Array.isArray(data.images) ? data.images : [data.images];
      // Filter out empty objects or invalid files
      const validFiles = files.filter(f => f && (f instanceof File || f.size > 0));
      console.log(`Found ${validFiles.length} valid files to upload`);
      imageUrls = await UploadService.uploadMultiple(validFiles);
    }

    console.log("Generated image URLs:", imageUrls);

    const { images, ...rest } = data; // Remove original images from spread
    return RoomRepository.create({
      ...rest,
      capacity: Number(data.capacity),
      isActive: data.isActive === 'true' || data.isActive === true,
      images: imageUrls,
    });
  };

  export const updateRoom = async (id: string, data: any) => {
    console.log(`Updating room ${id} with data:`, data);
    let imageUrls: string[] | undefined = undefined;
    if (data.images) {
      const files = Array.isArray(data.images) ? data.images : [data.images];
      const validFiles = files.filter(f => f && (f instanceof File || f.size > 0));
      console.log(`Found ${validFiles.length} valid files to upload for update`);
      imageUrls = await UploadService.uploadMultiple(validFiles);
    }

    console.log("Generated image URLs for update:", imageUrls);

    const { images, ...rest } = data; // Remove original images from spread
    return RoomRepository.update(id, {
      ...rest,
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
