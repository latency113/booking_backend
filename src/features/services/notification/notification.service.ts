import { NotificationRepository } from "../../repositories/notification/notification.repository";

export namespace NotificationService {
  export const getMyNotifications = async (userId: string) => {
    return NotificationRepository.findByUserId(userId);
  };

  export const createNotification = async (userId: string, message: string) => {
    return NotificationRepository.create({ userId, message });
  };

  export const markAsRead = async (id: string) => {
    return NotificationRepository.markAsRead(id);
  };
}
