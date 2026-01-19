"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { SessionType, TimeSlot, WorkingHours, Trainer } from "@/lib/types";
import { Card } from "@/components/Card";
import { WeekCalendar } from "@/components/WeekCalendar";
import { TimeSlots } from "@/components/TimeSlots";
import { Loading } from "@/components/Loading";
import { getTelegramWebApp } from "@/lib/telegram";

export default function BookPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [sessionTypes, setSessionTypes] = useState<SessionType[]>([]);
  const [workingHours, setWorkingHours] = useState<WorkingHours[]>([]);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const [selectedService, setSelectedService] = useState<SessionType | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  useEffect(() => {
    const webApp = getTelegramWebApp();
    webApp?.BackButton.show();

    const handleBack = () => {
      router.push("/");
    };

    webApp?.BackButton.onClick(handleBack);

    return () => {
      webApp?.BackButton.offClick(handleBack);
      webApp?.BackButton.hide();
    };
  }, [router]);

  useEffect(() => {
    Promise.all([
      api.getTrainer(),
      api.getSessionTypes(),
      api.getWorkingHours()
    ]).then(([t, types, hours]) => {
      setTrainer(t);
      setSessionTypes(types);
      setWorkingHours(hours);
      // Auto-select first service
      if (types.length > 0) {
        setSelectedService(types[0]);
      }
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (selectedDate && selectedService) {
      setSlotsLoading(true);
      setSelectedTime(null);
      api.getAvailableSlots(selectedDate, selectedService.id).then((s) => {
        setSlots(s);
        setSlotsLoading(false);
      });
    }
  }, [selectedDate, selectedService]);

  const handleConfirm = async () => {
    if (!selectedService || !selectedDate || !selectedTime) return;

    setIsSubmitting(true);
    try {
      await api.createBooking(selectedService.id, selectedDate, selectedTime);
      router.push("/bookings?success=1");
    } catch (error) {
      console.error("Booking failed:", error);
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price: number, currency: string): string => {
    if (currency === "RUB") {
      return `${price.toLocaleString("ru-RU")} руб.`;
    }
    return `${price} ${currency}`;
  };

  const workingDays = workingHours.map((wh) => wh.dayOfWeek);
  const canBook = selectedService && selectedDate && selectedTime;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      {/* Trainer Header */}
      <div className="relative px-4 pt-4 pb-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-1 mb-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#FFD700">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="text-sm font-medium">4.9</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{trainer?.name}</h1>
            <p className="text-gray-500">Фитнес тренер</p>
          </div>
          {/* Trainer avatar placeholder */}
          <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center overflow-hidden">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white rounded-t-3xl px-4 pt-6 pb-24">
        {/* Service Selection */}
        <div className="mb-6">
          <span className="font-semibold text-lg block mb-3">Услуга</span>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
            {sessionTypes.map((service) => (
              <button
                key={service.id}
                onClick={() => setSelectedService(service)}
                className={`
                  flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all
                  ${selectedService?.id === service.id
                    ? "bg-[var(--tg-theme-button-color)] text-white"
                    : "bg-gray-100 text-gray-700"
                  }
                `}
              >
                {service.name} - {formatPrice(service.price, service.currency)}
              </button>
            ))}
          </div>
        </div>

        {/* Week Calendar */}
        <div className="mb-6">
          <WeekCalendar
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            workingDays={workingDays}
          />
        </div>

        {/* Time Slots */}
        {selectedDate && (
          <TimeSlots
            slots={slots}
            selectedTime={selectedTime}
            onSelectTime={setSelectedTime}
            isLoading={slotsLoading}
          />
        )}

        {!selectedDate && (
          <div className="text-center py-8 text-[var(--tg-theme-hint-color)]">
            Выберите дату для просмотра доступного времени
          </div>
        )}
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
        <button
          onClick={handleConfirm}
          disabled={!canBook || isSubmitting}
          className={`
            w-full py-4 rounded-full text-base font-semibold transition-all
            ${canBook && !isSubmitting
              ? "bg-[var(--tg-theme-button-color)] text-white active:scale-[0.98]"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }
          `}
        >
          {isSubmitting ? "Записываем..." : "Записаться"}
        </button>
      </div>
    </div>
  );
}
