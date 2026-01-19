"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { SessionType, TimeSlot, WorkingHours } from "@/lib/types";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Calendar } from "@/components/Calendar";
import { TimeSlots } from "@/components/TimeSlots";
import { Loading } from "@/components/Loading";
import { getTelegramWebApp } from "@/lib/telegram";

type Step = "service" | "date" | "time" | "confirm";

export default function BookPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("service");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      if (step === "service") {
        router.push("/");
      } else if (step === "date") {
        setStep("service");
      } else if (step === "time") {
        setStep("date");
      } else if (step === "confirm") {
        setStep("time");
      }
    };

    webApp?.BackButton.onClick(handleBack);

    return () => {
      webApp?.BackButton.offClick(handleBack);
      webApp?.BackButton.hide();
    };
  }, [step, router]);

  useEffect(() => {
    Promise.all([api.getSessionTypes(), api.getWorkingHours()]).then(
      ([types, hours]) => {
        setSessionTypes(types);
        setWorkingHours(hours);
        setIsLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    if (selectedDate && selectedService) {
      setSlotsLoading(true);
      api.getAvailableSlots(selectedDate, selectedService.id).then((s) => {
        setSlots(s);
        setSlotsLoading(false);
      });
    }
  }, [selectedDate, selectedService]);

  const handleSelectService = (service: SessionType) => {
    setSelectedService(service);
    setStep("date");
  };

  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setStep("time");
  };

  const handleSelectTime = (time: string) => {
    setSelectedTime(time);
    setStep("confirm");
  };

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

  const formatSelectedDate = (): string => {
    if (!selectedDate) return "";
    const d = new Date(selectedDate);
    const MONTHS = [
      "января", "февраля", "марта", "апреля", "мая", "июня",
      "июля", "августа", "сентября", "октября", "ноября", "декабря"
    ];
    return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
  };

  const workingDays = workingHours.map((wh) => wh.dayOfWeek);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      {/* Step: Select Service */}
      {step === "service" && (
        <>
          <h1 className="text-xl font-bold mb-4">Выберите услугу</h1>
          <div className="flex flex-col gap-3">
            {sessionTypes.map((service) => (
              <Card key={service.id} onClick={() => handleSelectService(service)}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{service.name}</h3>
                    <p className="text-sm text-[var(--tg-theme-hint-color)]">
                      {service.durationMinutes} мин.
                    </p>
                  </div>
                  <span className="font-semibold">
                    {formatPrice(service.price, service.currency)}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Step: Select Date */}
      {step === "date" && (
        <>
          <h1 className="text-xl font-bold mb-1">Выберите дату</h1>
          <p className="text-sm text-[var(--tg-theme-hint-color)] mb-4">
            {selectedService?.name}
          </p>
          <Calendar
            selectedDate={selectedDate}
            onSelectDate={handleSelectDate}
            workingDays={workingDays}
          />
        </>
      )}

      {/* Step: Select Time */}
      {step === "time" && (
        <>
          <h1 className="text-xl font-bold mb-1">Выберите время</h1>
          <p className="text-sm text-[var(--tg-theme-hint-color)] mb-4">
            {selectedService?.name}, {formatSelectedDate()}
          </p>
          <TimeSlots
            slots={slots}
            selectedTime={selectedTime}
            onSelectTime={handleSelectTime}
            isLoading={slotsLoading}
          />
        </>
      )}

      {/* Step: Confirm */}
      {step === "confirm" && selectedService && (
        <>
          <h1 className="text-xl font-bold mb-4">Подтверждение</h1>
          <Card>
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-sm text-[var(--tg-theme-hint-color)]">Услуга</p>
                <p className="font-semibold">{selectedService.name}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--tg-theme-hint-color)]">Дата и время</p>
                <p className="font-semibold">{formatSelectedDate()}, {selectedTime}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--tg-theme-hint-color)]">Длительность</p>
                <p className="font-semibold">{selectedService.durationMinutes} мин.</p>
              </div>
              <div>
                <p className="text-sm text-[var(--tg-theme-hint-color)]">Стоимость</p>
                <p className="font-semibold">{formatPrice(selectedService.price, selectedService.currency)}</p>
              </div>
            </div>
          </Card>

          <div className="mt-6">
            <Button fullWidth onClick={handleConfirm} disabled={isSubmitting}>
              {isSubmitting ? "Записываем..." : "Подтвердить запись"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
