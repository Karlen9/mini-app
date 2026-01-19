import {
  mockTrainer,
  mockSessionTypes,
  mockWorkingHours,
  mockBookings,
} from "./mock-data";
import { Trainer, SessionType, Booking, TimeSlot, WorkingHours } from "./types";

// Simulated delay for realistic feel
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let bookings = [...mockBookings];

export const api = {
  async getTrainer(): Promise<Trainer> {
    await delay(100);
    return mockTrainer;
  },

  async getSessionTypes(): Promise<SessionType[]> {
    await delay(100);
    return mockSessionTypes;
  },

  async getWorkingHours(): Promise<WorkingHours[]> {
    await delay(100);
    return mockWorkingHours;
  },

  async getAvailableSlots(date: string, sessionTypeId: string): Promise<TimeSlot[]> {
    await delay(200);

    const selectedDate = new Date(date);
    const dayOfWeek = selectedDate.getDay();
    const sessionType = mockSessionTypes.find((st) => st.id === sessionTypeId);
    const workingHour = mockWorkingHours.find((wh) => wh.dayOfWeek === dayOfWeek);

    if (!workingHour || !sessionType) {
      return [];
    }

    const slots: TimeSlot[] = [];
    const [startHour, startMin] = workingHour.startTime.split(":").map(Number);
    const [endHour, endMin] = workingHour.endTime.split(":").map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    for (let minutes = startMinutes; minutes + sessionType.durationMinutes <= endMinutes; minutes += 30) {
      const hour = Math.floor(minutes / 60);
      const min = minutes % 60;
      const time = `${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`;

      // Check if slot conflicts with existing bookings
      const slotStart = new Date(date);
      slotStart.setHours(hour, min, 0, 0);
      const slotEnd = new Date(slotStart.getTime() + sessionType.durationMinutes * 60 * 1000);

      const hasConflict = bookings.some((booking) => {
        if (booking.status === "cancelled") return false;
        const bookingStart = new Date(booking.startsAt);
        const bookingEnd = new Date(booking.endsAt);
        return slotStart < bookingEnd && slotEnd > bookingStart;
      });

      slots.push({ time, available: !hasConflict });
    }

    return slots;
  },

  async getBookings(): Promise<Booking[]> {
    await delay(100);
    return bookings.filter((b) => b.status === "confirmed");
  },

  async createBooking(sessionTypeId: string, date: string, time: string): Promise<Booking> {
    await delay(300);

    const sessionType = mockSessionTypes.find((st) => st.id === sessionTypeId)!;
    const [hour, min] = time.split(":").map(Number);
    const startsAt = new Date(date);
    startsAt.setHours(hour, min, 0, 0);
    const endsAt = new Date(startsAt.getTime() + sessionType.durationMinutes * 60 * 1000);

    const newBooking: Booking = {
      id: `b-${Date.now()}`,
      sessionType,
      startsAt: startsAt.toISOString(),
      endsAt: endsAt.toISOString(),
      status: "confirmed",
    };

    bookings.push(newBooking);
    return newBooking;
  },

  async cancelBooking(bookingId: string, reason: string): Promise<Booking> {
    await delay(200);

    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) throw new Error("Booking not found");

    booking.status = "cancelled";
    booking.cancelReason = reason;
    booking.cancelledBy = "client";

    return booking;
  },

  async rescheduleBooking(bookingId: string, date: string, time: string, reason: string): Promise<Booking> {
    await delay(300);

    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) throw new Error("Booking not found");

    const [hour, min] = time.split(":").map(Number);
    const startsAt = new Date(date);
    startsAt.setHours(hour, min, 0, 0);
    const endsAt = new Date(startsAt.getTime() + booking.sessionType.durationMinutes * 60 * 1000);

    booking.startsAt = startsAt.toISOString();
    booking.endsAt = endsAt.toISOString();

    return booking;
  },
};
