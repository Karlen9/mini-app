"use client";

import { TimeSlot } from "@/lib/types";

interface TimeSlotsProps {
  slots: TimeSlot[];
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
  isLoading?: boolean;
}

export function TimeSlots({ slots, selectedTime, onSelectTime, isLoading }: TimeSlotsProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-6 h-6 border-2 border-[var(--tg-theme-button-color)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="text-center py-8 text-[var(--tg-theme-hint-color)]">
        Нет доступного времени
      </div>
    );
  }

  const availableSlots = slots.filter((s) => s.available);

  if (availableSlots.length === 0) {
    return (
      <div className="text-center py-8 text-[var(--tg-theme-hint-color)]">
        Все время занято на этот день
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-2">
      {slots.map((slot) => (
        <button
          key={slot.time}
          onClick={() => slot.available && onSelectTime(slot.time)}
          disabled={!slot.available}
          className={`
            py-3 px-2 rounded-lg text-sm font-medium transition-all
            ${!slot.available ? "opacity-30 line-through cursor-not-allowed" : "active:scale-95"}
            ${selectedTime === slot.time
              ? "bg-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-text-color)]"
              : "bg-[var(--tg-theme-secondary-bg-color)]"
            }
          `}
        >
          {slot.time}
        </button>
      ))}
    </div>
  );
}
