import { Trainer, SessionType, WorkingHours, Booking } from "./types";

export const mockTrainer: Trainer = {
  id: "trainer-1",
  name: "Алексей Петров",
  timezone: "Europe/Moscow",
  cancelCutoffHours: 24,
};

export const mockSessionTypes: SessionType[] = [
  {
    id: "st-1",
    name: "Персональная тренировка",
    durationMinutes: 60,
    price: 3000,
    currency: "RUB",
  },
  {
    id: "st-2",
    name: "Групповое занятие",
    durationMinutes: 90,
    price: 1500,
    currency: "RUB",
  },
  {
    id: "st-3",
    name: "Консультация",
    durationMinutes: 30,
    price: 1000,
    currency: "RUB",
  },
];

export const mockWorkingHours: WorkingHours[] = [
  { dayOfWeek: 1, startTime: "09:00", endTime: "18:00" },
  { dayOfWeek: 2, startTime: "09:00", endTime: "18:00" },
  { dayOfWeek: 3, startTime: "09:00", endTime: "18:00" },
  { dayOfWeek: 4, startTime: "09:00", endTime: "18:00" },
  { dayOfWeek: 5, startTime: "09:00", endTime: "18:00" },
  { dayOfWeek: 6, startTime: "10:00", endTime: "15:00" },
];

export const mockBookings: Booking[] = [
  {
    id: "b-1",
    sessionType: mockSessionTypes[0],
    startsAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    endsAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
    status: "confirmed",
  },
  {
    id: "b-2",
    sessionType: mockSessionTypes[1],
    startsAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    endsAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000).toISOString(),
    status: "confirmed",
  },
];
