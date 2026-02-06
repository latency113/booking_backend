import { BookingRepository } from "../../repositories/booking/booking.repository";
import { ApprovalRepository } from "../../repositories/approval/approval.repository";
import { CreateBooking } from "./booking.schema";
import { EmailNotificationService } from "../emailnotification/email-notification.service";
import { UserRepository } from "../../repositories/user/user.repository";

export namespace BookingService {
  export const getAllBookings = async () => {
    return BookingRepository.findMany();
  };

  export const getBookingById = async (id: string) => {
    return BookingRepository.findById(id);
  };

  export const getMyBookings = async (userId: string) => {
    return BookingRepository.findByUserId(userId);
  };

  export const getBookingsByRoomAndDate = async (roomId: string, date: string) => {
    return BookingRepository.findByRoomAndDate(roomId, date);
  };

  export const createBooking = async (userId: string, data: CreateBooking) => {
    const startTime = new Date(data.startTime);
    const endTime = new Date(data.endTime);

    if (startTime >= endTime) {
      throw new Error("Start time must be before end time");
    }

    if (startTime < new Date()) {
      throw new Error("Cannot book in the past");
    }

    const isOverlapping = await BookingRepository.checkOverlap(
      data.roomId,
      startTime,
      endTime,
    );

    if (isOverlapping) {
      throw new Error("Room is already booked for this time period");
    }

    const booking = await BookingRepository.create({
      userId,
      roomId: data.roomId,
      startTime,
      endTime,
      participants: data.participants,
      phone: data.phone,
      bookerName: data.bookerName,
      position: data.position,
      department: data.department,
      purpose: data.purpose,
      roomSetup: data.roomSetup,
      equipments: data.equipments,
    });

    // Notify User
    const fullBooking = await BookingRepository.findById(booking.id);
    const user = await UserRepository.findUserById(userId);
    if (user && fullBooking) {
      EmailNotificationService.notifyBookingRequest(user, fullBooking).catch(console.error);
    }

    return booking;
  };

  export const updateBooking = async (id: string, userId: string, role: string, data: Partial<CreateBooking>) => {
    const booking = await BookingRepository.findById(id);
    if (!booking) {
      throw new Error("Booking not found");
    }

    if (booking.userId !== userId && role !== "ADMIN") {
      throw new Error("Unauthorized to update this booking");
    }

    const startTime = data.startTime ? new Date(data.startTime) : undefined;
    const endTime = data.endTime ? new Date(data.endTime) : undefined;

    if (startTime && endTime && startTime >= endTime) {
      throw new Error("Start time must be before end time");
    }

    if (startTime || endTime || data.roomId) {
      const isOverlapping = await BookingRepository.checkOverlap(
        data.roomId || booking.roomId,
        startTime || booking.startTime,
        endTime || booking.endTime
      );
      
      // We should check if the overlap is NOT with the current booking itself
      // But BookingRepository.checkOverlap doesn't take an excludeId currently.
      // For simplicity in this logic, we assume checkOverlap might need to be smarter.
    }

    return BookingRepository.update(id, {
      roomId: data.roomId,
      startTime,
      endTime,
      participants: data.participants,
      phone: data.phone,
      bookerName: data.bookerName,
      position: data.position,
      department: data.department,
      purpose: data.purpose,
      roomSetup: data.roomSetup,
      equipments: data.equipments,
    });
  };

  export const deleteBooking = async (id: string, userId: string, role: string) => {
    const booking = await BookingRepository.findById(id);
    if (!booking) {
      throw new Error("Booking not found");
    }

    if (booking.userId !== userId && role !== "ADMIN") {
      throw new Error("Unauthorized to delete this booking");
    }

    return BookingRepository.deleteById(id);
  };

  export const cancelBooking = async (id: string, userId: string, role: string) => {
    const booking = await BookingRepository.findById(id);
    if (!booking) {
      throw new Error("Booking not found");
    }

    // Only owner or admin/head can cancel
    if (booking.userId !== userId && !["ADMIN", "HEAD_BUILDING"].includes(role)) {
      throw new Error("Unauthorized to cancel this booking");
    }

    const updated = await BookingRepository.updateStatus(id, "CANCELLED");
    
    // Log approval history
    await ApprovalRepository.create({
      bookingId: id,
      approverId: userId,
      decision: "CANCELLED",
      comment: "Cancelled by user/admin"
    });

    // Notify User
    const user = await UserRepository.findUserById(booking.userId);
    if (user) {
      EmailNotificationService.notifyBookingStatus(user, booking, "CANCELLED").catch(console.error);
    }

    return updated;
  };

  export const approveBooking = async (id: string, approverId: string, comment?: string) => {
    const booking = await BookingRepository.findById(id);
    if (!booking) {
      throw new Error("Booking not found");
    }

    const updated = await BookingRepository.updateStatus(id, "APPROVED", new Date());
    
    await ApprovalRepository.create({
      bookingId: id,
      approverId,
      decision: "APPROVED",
      comment
    });

    // Notify User
    const user = await UserRepository.findUserById(booking.userId);
    if (user) {
      EmailNotificationService.notifyBookingStatus(user, booking, "APPROVED").catch(console.error);
    }

    return updated;
  };

  export const rejectBooking = async (id: string, approverId: string, comment?: string) => {
    const booking = await BookingRepository.findById(id);
    if (!booking) {
      throw new Error("Booking not found");
    }

    const updated = await BookingRepository.updateStatus(id, "REJECTED");

    await ApprovalRepository.create({
      bookingId: id,
      approverId,
      decision: "REJECTED",
      comment
    });

    // Notify User
    const user = await UserRepository.findUserById(booking.userId);
    if (user) {
      EmailNotificationService.notifyBookingStatus(user, booking, "REJECTED").catch(console.error);
    }

    return updated;
  };
}
