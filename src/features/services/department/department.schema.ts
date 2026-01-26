import { t } from "elysia";

export const DepartmentSchema = t.Object({
    id: t.String(),
    name: t.String(),
    createdAt: t.Date(),
    _count: t.Optional(t.Object({
        users: t.Number()
    }))
})

export const CreateDepartmentSchema = t.Object({
    name: t.String()
})

export const UpdateDepartmentSchema = t.Partial(CreateDepartmentSchema);

export type Department = typeof DepartmentSchema.static;
export type CreateDepartment = typeof CreateDepartmentSchema.static;
export type UpdateDepartment = typeof UpdateDepartmentSchema.static;
