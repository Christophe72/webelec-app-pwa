import React from "react";
import { AppHeader } from "../app-header";

export default function Section() {
  return (
    <div className="relative min-h-screen">
      <AppHeader />

      <div className="flex items-center justify-center min-h-screen">
        <div className="p-8 text-center">
          <h1>Choix disjoncteur</h1>
          <p>This is a disjoncteur page.</p>
        </div>
      </div>
    </div>
  );
}
