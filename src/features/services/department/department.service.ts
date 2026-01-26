import { DepartmentRepository } from "../../repositories/department/department.repository";
import { CreateDepartment, UpdateDepartment } from "./department.schema";

export namespace DepartmentService {
  export const getAllDepartments = async () => {
    return DepartmentRepository.findMany();
  };

  export const getDepartmentById = async (id: string) => {
    return DepartmentRepository.findById(id);
  };

  export const createDepartment = async (data: CreateDepartment) => {
    return DepartmentRepository.create(data.name);
  };

  export const updateDepartment = async (id: string, data: UpdateDepartment) => {
    if (!data.name) throw new Error("Name is required");
    return DepartmentRepository.update(id, data.name);
  };

  export const deleteDepartment = async (id: string) => {
    return DepartmentRepository.deleteById(id);
  };
}
