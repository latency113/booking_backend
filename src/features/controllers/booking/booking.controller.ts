import Elysia, { t } from "elysia";
import { authMiddleware } from "../../shared/middlewares/auth.middleware";
import { BookingSchema, CreateBookingSchema, UpdateBookingStatusSchema } from "../../services/booking/booking.schema";
import { BookingService } from "../../services/booking/booking.service";

export const BookingController = new Elysia({ prefix: "/bookings" })
  .use(authMiddleware)
  .get(
    "/",
    async ({ user }) => {
      if (["ADMIN", "HEAD_BUILDING", "HEAD_MEDIA"].includes(user?.role as string)) {
        return await BookingService.getAllBookings();
      }
      return await BookingService.getMyBookings(user?.id as string);
    },
    {
      isAuth: true,
      response: t.Array(BookingSchema),
      summary: "Get all bookings (admin/head) or my bookings (user)",
      tags: ["Bookings"],
    }
  )
  .get(
    "/:id",
    async ({ params: { id }, user, set }) => {
      const booking = await BookingService.getBookingById(id);
      if (!booking) {
        set.status = 404;
        return { message: "Booking not found" };
      }

      // Check if authorized to view
      if (
        booking.userId !== user?.id &&
        !["ADMIN", "HEAD_BUILDING", "HEAD_MEDIA"].includes(user?.role as string)
      ) {
        set.status = 403;
        return { message: "Forbidden" };
      }

      return booking;
    },
    {
      isAuth: true,
      params: t.Object({ id: t.String() }),
      response: {
        200: BookingSchema,
        404: t.Object({ message: t.String() }),
        403: t.Object({ message: t.String() }),
      },
      summary: "Get booking by id",
      tags: ["Bookings"],
    }
  )
  .post(
    "/",
    async ({ body, user, set }) => {
      try {
        set.status = 201;
        return await BookingService.createBooking(user?.id as string, body);
      } catch (error: any) {
        set.status = 400;
        return { message: error.message };
      }
    },
    {
      isAuth: true,
      body: CreateBookingSchema,
      response: {
        201: BookingSchema,
        400: t.Object({ message: t.String() }),
      },
      summary: "Create booking",
      tags: ["Bookings"],
    }
  )
  .put(
    "/:id",
    async ({ params: { id }, body, user, set }) => {
      try {
        return await BookingService.updateBooking(id, user?.id as string, user?.role as string, body);
      } catch (error: any) {
        set.status = 400;
        return { message: error.message };
      }
    },
    {
      isAuth: true,
      params: t.Object({ id: t.String() }),
      body: t.Partial(CreateBookingSchema),
      response: {
        200: BookingSchema,
        400: t.Object({ message: t.String() }),
      },
      summary: "Update booking",
      tags: ["Bookings"],
    }
  )
  .delete(
    "/:id",
    async ({ params: { id }, user, set }) => {
      try {
        await BookingService.deleteBooking(id, user?.id as string, user?.role as string);
        return { message: "Booking deleted successfully" };
      } catch (error: any) {
        set.status = 400;
        return { message: error.message };
      }
    },
    {
      isAuth: true,
      params: t.Object({ id: t.String() }),
      response: {
        200: t.Object({ message: t.String() }),
        400: t.Object({ message: t.String() }),
      },
      summary: "Delete booking",
      tags: ["Bookings"],
    }
  )
  .post(
    "/:id/cancel",
    async ({ params: { id }, user, set }) => {
      try {
        return await BookingService.cancelBooking(id, user?.id as string, user?.role as string);
      } catch (error: any) {
        set.status = 400;
        return { message: error.message };
      }
    },
    {
      isAuth: true,
      params: t.Object({ id: t.String() }),
      response: {
        200: BookingSchema,
        400: t.Object({ message: t.String() }),
      },
      summary: "Cancel booking",
      tags: ["Bookings"],
    }
  )
  .post(
    "/:id/approve",
    async ({ params: { id }, body, user, set }) => {
      try {
        return await BookingService.approveBooking(id, user?.id as string, body.comment);
      } catch (error: any) {
        set.status = 400;
        return { message: error.message };
      }
    },
    {
      isAuth: true,
      hasRole: ["ADMIN", "HEAD_BUILDING"],
      params: t.Object({ id: t.String() }),
      body: t.Object({ comment: t.Optional(t.String()) }),
      response: {
        200: BookingSchema,
        400: t.Object({ message: t.String() }),
      },
      summary: "Approve booking",
      tags: ["Bookings"],
    }
  )
  .post(
    "/:id/reject",
    async ({ params: { id }, body, user, set }) => {
      try {
        return await BookingService.rejectBooking(id, user?.id as string, body.comment);
      } catch (error: any) {
        set.status = 400;
        return { message: error.message };
      }
    },
    {
      isAuth: true,
      hasRole: ["ADMIN", "HEAD_BUILDING"],
      params: t.Object({ id: t.String() }),
      body: t.Object({ comment: t.Optional(t.String()) }),
      response: {
        200: BookingSchema,
        400: t.Object({ message: t.String() }),
      },
      summary: "Reject booking",
      tags: ["Bookings"],
    }
  );;
