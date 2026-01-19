"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { initTelegramApp, getUserName, getThemeParams } from "@/lib/telegram";
import { api } from "@/lib/api";
import { Trainer } from "@/lib/types";
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <Loading />
      </div>
    );
  }

  const userName = getUserName();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      {/* Trainer Header */}
      <div className="relative px-4 pt-8 pb-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-gray-500 text-sm mb-1">Добро пожаловать, {userName}</p>
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
      <div className="flex-1 bg-white rounded-t-3xl px-4 pt-6 pb-8">
        {/* Quick Actions */}
        <div className="flex flex-col gap-4">
          <button
            onClick={() => router.push("/book")}
            className="w-full py-4 rounded-2xl bg-[var(--tg-theme-button-color)] text-white font-semibold text-base active:scale-[0.98] transition-all"
          >
            Записаться на тренировку
          </button>

          <button
            onClick={() => router.push("/bookings")}
            className="w-full py-4 rounded-2xl bg-gray-100 text-gray-700 font-semibold text-base active:scale-[0.98] transition-all"
          >
            Мои записи
          </button>
        </div>

        {/* Info */}
        <div className="mt-8 p-4 rounded-2xl bg-blue-50">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900">Правила отмены</p>
              <p className="text-sm text-gray-500 mt-1">
                Отмена и перенос записи возможны не позднее чем за {trainer?.cancelCutoffHours} часов до начала тренировки
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
