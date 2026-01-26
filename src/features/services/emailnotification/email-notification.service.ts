import nodemailer from "nodemailer";
import { EmailNotificationRepository } from "../../repositories/emailnotification/email-notification.repository";
import { EmailType, EmailStatus } from "../../../providers/database/generated";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export namespace EmailNotificationService {
  export const sendEmail = async (params: {
    userId: string;
    bookingId?: string;
    to: string;
    subject: string;
    message: string;
    type: EmailType;
  }) => {
    // 1. Create record with PENDING status
    const record = await EmailNotificationRepository.create({
      userId: params.userId,
      bookingId: params.bookingId,
      email: params.to,
      subject: params.subject,
      message: params.message,
      type: params.type,
      status: "PENDING",
    });

    try {
      // 2. Send actual email
      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: params.to,
        subject: params.subject,
        html: params.message,
      });

      // 3. Update status to SENT
      await EmailNotificationRepository.updateStatus(record.id, "SENT", undefined, new Date());
    } catch (error: any) {
      console.error("Failed to send email:", error);
      // 4. Update status to FAILED
      await EmailNotificationRepository.updateStatus(record.id, "FAILED", error.message);
    }
  };

  export const notifyBookingRequest = async (user: any, booking: any) => {
    // Notify User
    if (user.email) {
      await sendEmail({
        userId: user.id,
        bookingId: booking.id,
        to: user.email,
        subject: `Booking Request Received: ${booking.purpose}`,
        message: `
          <h1>Booking Request Received</h1>
          <p>Dear ${user.fullName},</p>
          <p>Your booking request for room <b>${booking.room?.name || "N/A"}</b> has been received and is pending approval.</p>
          <p><b>Details:</b></p>
          <ul>
            <li>Purpose: ${booking.purpose}</li>
            <li>Time: ${new Date(booking.startTime).toLocaleString()} - ${new Date(booking.endTime).toLocaleString()}</li>
          </ul>
        `,
        type: "BOOKING_REQUEST",
      });
    }
  };

  export const notifyBookingStatus = async (user: any, booking: any, status: "APPROVED" | "REJECTED" | "CANCELLED") => {
    if (!user.email) return;

    let subject = "";
    let statusText = "";
    let type: EmailType = "BOOKING_APPROVED";

    if (status === "APPROVED") {
      subject = `Booking Approved: ${booking.purpose}`;
      statusText = "has been APPROVED";
      type = "BOOKING_APPROVED";
    } else if (status === "REJECTED") {
      subject = `Booking Rejected: ${booking.purpose}`;
      statusText = "has been REJECTED";
      type = "BOOKING_REJECTED";
    } else if (status === "CANCELLED") {
      subject = `Booking Cancelled: ${booking.purpose}`;
      statusText = "has been CANCELLED";
      type = "BOOKING_CANCELLED";
    }

    await sendEmail({
      userId: user.id,
      bookingId: booking.id,
      to: user.email,
      subject,
      message: `
        <h1>Booking Status Update</h1>
        <p>Dear ${user.fullName},</p>
        <p>Your booking request for room <b>${booking.room?.name || "N/A"}</b> ${statusText}.</p>
        <p><b>Details:</b></p>
        <ul>
          <li>Purpose: ${booking.purpose}</li>
          <li>Time: ${new Date(booking.startTime).toLocaleString()} - ${new Date(booking.endTime).toLocaleString()}</li>
        </ul>
      `,
      type,
    });
  };
}
