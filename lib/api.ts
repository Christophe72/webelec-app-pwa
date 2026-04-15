import { VisiteChantierRequest, VisiteChantierResponse } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function analyserVisite(
  payload: VisiteChantierRequest,
): Promise<VisiteChantierResponse> {
  const response = await fetch(`${API_BASE_URL}/api/visites/analyser`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Erreur lors de l'analyse de la visite chantier");
  }

  return response.json();
}
