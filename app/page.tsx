import Image from "next/image";
import { ThemeToggle } from "./theme-toggle";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Bienvenue sur WebElec</h1>
      <p className="text-lg text-gray-600 mb-8"> Assistant électrique RGIE</p>
      <Image
        src="/icon-512x512.png"
        alt="WebElec Logo"
        width={128}
        height={128}
        className="mb-8"
      />
    </div>
  );
}
