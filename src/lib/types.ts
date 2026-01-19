export interface Trainer {
  id: string;
  name: string;
  timezone: string;
  cancelCutoffHours: number;
}

export interface SessionType {
  id: string;
  name: string;
  durationMinutes: number;
  price: number;
  currency: string;
}

export interface WorkingHours {
  dayOfWeek: number; // 0 = Sunday, 6 = Saturday
  startTime: string; // "09:00"
  endTime: string;   // "18:00"
}

export interface Booking {
  id: string;
  sessionType: SessionType;
  startsAt: string; // ISO datetime
  endsAt: string;
  status: "confirmed" | "cancelled" | "completed";
  cancelReason?: string;
  cancelledBy?: "client" | "trainer";
}

export interface TimeSlot {
  time: string; // "09:00"
  available: boolean;
}
