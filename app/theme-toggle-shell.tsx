"use client";

import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";

export function ThemeToggleShell() {
  const pathname = usePathname();

  if (pathname === "/" || pathname.startsWith("/diagnostic")) {
    return null;
  }

  return <ThemeToggle />;
}
