export async function postApiJson<T>(
  url: string,
  payload: unknown,
  fallbackError: string
): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const rawText = await response.text();
  let parsed: Record<string, unknown> | null = null;
  if (rawText) {
    try {
      parsed = JSON.parse(rawText) as Record<string, unknown>;
    } catch {
      parsed = null;
    }
  }

  if (!response.ok) {
    const serverMessage =
      parsed && typeof parsed.error === 'string' && parsed.error.trim()
        ? parsed.error
        : response.status === 504
          ? 'El servidor tardó demasiado en responder (tiempo de espera agotado). Intenta nuevamente.'
          : `${fallbackError} (HTTP ${response.status})`;
    throw new Error(serverMessage);
  }

  if (!parsed) {
    throw new Error('El servidor devolvió una respuesta no válida. Verifica la configuración de /api.');
  }

  return parsed as T;
}
