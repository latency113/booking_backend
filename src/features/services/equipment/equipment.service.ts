import { EquipmentRepository } from "../../repositories/equipment/equipment.repository";
import { CreateEquipment, UpdateEquipment } from "./equipment.schema";

export namespace EquipmentService {
  export const getAllEquipment = async () => {
    return EquipmentRepository.findMany();
  };

  export const getEquipmentById = async (id: string) => {
    return EquipmentRepository.findById(id);
  };

  export const createEquipment = async (data: CreateEquipment) => {
    return EquipmentRepository.create(data);
  };

  export const updateEquipment = async (id: string, data: UpdateEquipment) => {
    return EquipmentRepository.update(id, data);
  };

  export const deleteEquipment = async (id: string) => {
    return EquipmentRepository.deleteById(id);
  };
}
