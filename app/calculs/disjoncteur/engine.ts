import {
  calculerChuteTension,
  calculerIntensite,
  choisirDisjoncteurStandard,
} from "./calcul";
import {
  getDisjoncteurMaxRgie,
  getMessagesChuteTension,
  getMessagesRegles,
} from "./rules";
import type { EvaluationInstallation, InstallationInput } from "./types";

export function evaluerInstallation(
  input: InstallationInput,
): EvaluationInstallation {
  const intensiteCalculeeA = calculerIntensite(
    input.puissanceW,
    input.tensionV,
    input.reseau,
  );
  const disjoncteurConseilleA = choisirDisjoncteurStandard(intensiteCalculeeA);
  const disjoncteurMaxRgieA = getDisjoncteurMaxRgie(
    input.sectionMm2,
    input.circuit,
  );
  const { chuteTensionV, chuteTensionPourcent } = calculerChuteTension(
    intensiteCalculeeA,
    input.tensionV,
    input.longueurCableM,
    input.sectionMm2,
    input.reseau,
  );
  const conformeDisjoncteur = disjoncteurConseilleA <= disjoncteurMaxRgieA;
  const conformeChuteTension = chuteTensionPourcent <= 5;
  const conforme = conformeDisjoncteur && conformeChuteTension;

  const messages = getMessagesRegles(input.sectionMm2, input.circuit);
  messages.push(
    ...getMessagesChuteTension(chuteTensionPourcent, input.circuit),
  );

  if (!conformeDisjoncteur) {
    messages.unshift("Disjoncteur trop élevé pour la section");
  }

  if (!conformeChuteTension) {
    messages.unshift("Chute de tension supérieure à 5% : non conforme");
  }

  return {
    intensiteCalculeeA,
    disjoncteurConseilleA,
    disjoncteurMaxRgieA,
    chuteTensionV,
    chuteTensionPourcent,
    conforme,
    messages,
  };
}
