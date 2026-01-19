"use client";

import { useState, useEffect } from "react";

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        themeParams: {
          bg_color?: string;
          text_color?: string;
          button_color?: string;
          button_text_color?: string;
        };
      };
    };
  }
}

export default function Home() {
  const [currentTime, setCurrentTime] = useState<string | null>(null);

  useEffect(() => {
    // Initialize Telegram Mini App
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();

      // Apply Telegram theme colors
      const themeParams = window.Telegram.WebApp.themeParams;
      if (themeParams.bg_color) {
        document.documentElement.style.setProperty(
          "--tg-theme-bg-color",
          themeParams.bg_color
        );
      }
      if (themeParams.text_color) {
        document.documentElement.style.setProperty(
          "--tg-theme-text-color",
          themeParams.text_color
        );
      }
      if (themeParams.button_color) {
        document.documentElement.style.setProperty(
          "--tg-theme-button-color",
          themeParams.button_color
        );
      }
      if (themeParams.button_text_color) {
        document.documentElement.style.setProperty(
          "--tg-theme-button-text-color",
          themeParams.button_text_color
        );
      }
    }
  }, []);

  const handleShowTime = () => {
    const now = new Date();
    const formatted = now.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    setCurrentTime(formatted);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-8">Scheduler</h1>

      <button
        onClick={handleShowTime}
        className="px-6 py-3 rounded-lg text-lg font-medium transition-all hover:opacity-90 active:scale-95"
        style={{
          backgroundColor: "var(--tg-theme-button-color)",
          color: "var(--tg-theme-button-text-color)",
        }}
      >
        Current Time
      </button>

      {currentTime && (
        <div className="mt-8 p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
          <p className="text-xl text-center">{currentTime}</p>
        </div>
      )}
    </div>
  );
}
