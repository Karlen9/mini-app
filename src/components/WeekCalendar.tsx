"use client";

import { useState, useMemo } from "react";

interface WeekCalendarProps {
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  workingDays: number[];
}

const DAYS_SHORT = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
const MONTHS = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
];

export function WeekCalendar({ selectedDate, onSelectDate, workingDays }: WeekCalendarProps) {
  const [weekOffset, setWeekOffset] = useState(0);

  const weekDays = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Start from beginning of current week (Monday)
    const startOfWeek = new Date(today);
    const dayOfWeek = today.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust to start from Monday
    startOfWeek.setDate(today.getDate() + diff + (weekOffset * 7));

    const days: { date: Date; isDisabled: boolean }[] = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);

      const isPast = date < today;
      const isWorkingDay = workingDays.includes(date.getDay());

      days.push({
        date,
        isDisabled: isPast || !isWorkingDay,
      });
    }

    return days;
  }, [weekOffset, workingDays]);

  const currentMonth = useMemo(() => {
    const middleDay = weekDays[3]?.date;
    if (!middleDay) return "";
    return `${MONTHS[middleDay.getMonth()]} ${middleDay.getFullYear()}`;
  }, [weekDays]);

  const formatDateString = (date: Date): string => {
    return date.toISOString().split("T")[0];
  };

  const canGoPrev = weekOffset > 0;

  return (
    <div className="select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="font-semibold text-lg">Выберите дату</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setWeekOffset((w) => w - 1)}
            disabled={!canGoPrev}
            className="p-1 rounded disabled:opacity-30"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <span className="text-sm text-[var(--tg-theme-hint-color)] min-w-[120px] text-center">
            {currentMonth}
          </span>
          <button
            onClick={() => setWeekOffset((w) => w + 1)}
            className="p-1 rounded"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Week days */}
      <div className="flex justify-between gap-1">
        {weekDays.map(({ date, isDisabled }) => {
          const dateString = formatDateString(date);
          const isSelected = selectedDate === dateString;
          const dayName = DAYS_SHORT[date.getDay()];

          return (
            <button
              key={dateString}
              onClick={() => !isDisabled && onSelectDate(dateString)}
              disabled={isDisabled}
              className={`
                flex-1 flex flex-col items-center py-2 rounded-xl transition-all
                ${isDisabled ? "opacity-40" : ""}
                ${!isDisabled && !isSelected ? "active:scale-95" : ""}
              `}
            >
              <span className={`text-xs mb-1 ${isSelected ? "text-[var(--tg-theme-button-color)]" : "text-[var(--tg-theme-hint-color)]"}`}>
                {dayName}
              </span>
              <div
                className={`
                  w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium transition-all
                  ${isSelected
                    ? "bg-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-text-color)]"
                    : ""
                  }
                `}
              >
                {date.getDate()}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
