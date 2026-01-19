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

  const availableSlots = slots.filter((s) => s.available);

  if (slots.length === 0 || availableSlots.length === 0) {
    return (
      <div className="text-center py-8 text-[var(--tg-theme-hint-color)]">
        Нет доступного времени
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="font-semibold text-lg">Выберите время</span>
        <span className="text-sm text-[var(--tg-theme-hint-color)]">
          {availableSlots.length} слотов
        </span>
      </div>

      {/* Time grid - 3 columns */}
      <div className="grid grid-cols-3 gap-3">
        {availableSlots.map((slot) => (
          <button
            key={slot.time}
            onClick={() => onSelectTime(slot.time)}
            className={`
              py-3 px-4 rounded-full text-sm font-medium transition-all active:scale-95
              ${selectedTime === slot.time
                ? "bg-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-text-color)]"
                : "bg-[var(--tg-theme-secondary-bg-color)] border border-transparent hover:border-[var(--tg-theme-button-color)]"
              }
            `}
          >
            {slot.time}
          </button>
        ))}
      </div>
    </div>
  );
}
