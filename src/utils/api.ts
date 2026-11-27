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
    if (parsed && typeof parsed.error === 'string' && parsed.error.trim()) {
      throw new Error(parsed.error);
    }
    if (response.status === 504) {
      throw new Error(
        'El servidor tardó demasiado en responder (tiempo de espera agotado). Intenta nuevamente.'
      );
    }
    if (rawText.includes('FUNCTION_INVOCATION_FAILED')) {
      throw new Error(
        'Error interno en la función del servidor (Vercel). Verifica GEMINI_API_KEY y los logs de despliegue en Vercel.'
      );
    }
    throw new Error(`${fallbackError} (HTTP ${response.status})`);
  }

  if (!parsed) {
    throw new Error('El servidor devolvió una respuesta no válida. Verifica la configuración de /api.');
  }

  return parsed as T;
}
