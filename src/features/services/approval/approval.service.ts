import { ApprovalRepository } from "../../repositories/approval/approval.repository";

export namespace ApprovalService {
  export const getApprovalHistory = async (bookingId: string) => {
    return ApprovalRepository.findByBookingId(bookingId);
  };
}
