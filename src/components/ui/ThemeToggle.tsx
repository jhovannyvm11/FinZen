"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@heroui/react";
import { useTranslation } from "@/contexts/LanguageContext";

// SVG Icons
const SunIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 3V5M12 19V21M5.64 5.64L7.05 7.05M16.95 16.95L18.36 18.36M3 12H5M19 12H21M5.64 18.36L7.05 16.95M16.95 7.05L18.36 5.64"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="12"
      cy="12"
      r="4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MoonIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    // Check if there's a saved theme preference
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    const shouldBeDark = savedTheme === "dark" || (!savedTheme && prefersDark);
    setIsDark(shouldBeDark);
    updateTheme(shouldBeDark);
  }, []);

  const updateTheme = (dark: boolean) => {
    const html = document.documentElement;
    const body = document.body;

    if (dark) {
      html.classList.add("dark");
      body.className = "financy-dark text-foreground bg-background";
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      body.className = "financy-theme text-foreground bg-background";
      localStorage.setItem("theme", "light");
    }
  };

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    updateTheme(newIsDark);
  };

  return (
    <Button
      isIconOnly
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="text-foreground hover:bg-default-100"
      aria-label={t("theme.toggle")}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </Button>
  );
};

export default ThemeToggle;
