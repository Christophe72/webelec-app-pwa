import { ImageMenu } from "../components/image-menu";
import { MAIN_MENU_ITEMS } from "../components/main-menu-items";

export default function Section() {
  return (
    <div className="relative min-h-screen">
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-8 text-center w-full max-w-3xl">
          <h1>Choix disjoncteur</h1>
          <p>This is a disjoncteur page.</p>
          <div className="mt-6">
            <ImageMenu
              items={MAIN_MENU_ITEMS}
              delayStartMs={120}
              delayStepMs={80}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
