import Elysia from "elysia";
import { UserController } from "./user/user.controller";
import { AuthController } from "./auth/auth.controller";
import { RoomController } from "./room/room.controller";
import { EquipmentController } from "./equipment/equipment.controller";
import { BookingController } from "./booking/booking.controller";
import { ApprovalController } from "./approval/approval.controller";
import { NotificationController } from "./notification/notification.controller";
import { SystemConfigController } from "./systemconfig/systemconfig.controller";
import { DepartmentController } from "./department/department.controller";
import { loggerMiddleware } from "../shared/middlewares/logger.middleware";

export const controllers = new Elysia({ prefix: "/api/v1" })
    .use(loggerMiddleware)
    .use(AuthController)
    .use(UserController)
    .use(DepartmentController)
    .use(RoomController)
    .use(EquipmentController)
    .use(BookingController)
    .use(ApprovalController)
    .use(NotificationController)
    .use(SystemConfigController)
