"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { initTelegramApp, getUserName, getThemeParams } from "@/lib/telegram";
import { api } from "@/lib/api";
import { Trainer } from "@/lib/types";
import { Button } from "@/components/Button";
import { Loading } from "@/components/Loading";

export default function Home() {
  const router = useRouter();
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initTelegramApp();

    // Apply Telegram theme
    const params = getThemeParams();
    const root = document.documentElement;
    if (params.bg_color) root.style.setProperty("--tg-theme-bg-color", params.bg_color);
    if (params.text_color) root.style.setProperty("--tg-theme-text-color", params.text_color);
    if (params.hint_color) root.style.setProperty("--tg-theme-hint-color", params.hint_color);
    if (params.link_color) root.style.setProperty("--tg-theme-link-color", params.link_color);
    if (params.button_color) root.style.setProperty("--tg-theme-button-color", params.button_color);
    if (params.button_text_color) root.style.setProperty("--tg-theme-button-text-color", params.button_text_color);
    if (params.secondary_bg_color) root.style.setProperty("--tg-theme-secondary-bg-color", params.secondary_bg_color);

    // Load trainer info
    api.getTrainer().then((t) => {
      setTrainer(t);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  const userName = getUserName();

  return (
    <div className="min-h-screen p-4 flex flex-col">
      {/* Header */}
      <div className="mb-8">
        <p className="text-[var(--tg-theme-hint-color)] text-sm">Добро пожаловать, {userName}</p>
        <h1 className="text-2xl font-bold mt-1">Тренер {trainer?.name}</h1>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-4 flex-1">
        <Button fullWidth onClick={() => router.push("/book")}>
          Записаться на тренировку
        </Button>

        <Button fullWidth variant="secondary" onClick={() => router.push("/bookings")}>
          Мои записи
        </Button>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-8 text-center text-[var(--tg-theme-hint-color)] text-sm">
        Отмена и перенос возможны за {trainer?.cancelCutoffHours}ч до начала
      </div>
    </div>
  );
}
