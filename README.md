# Scriptura — Estudios Exegéticos (PWA)

Aplicación web progresiva (PWA) para generar y estudiar análisis bíblicos exegéticos y hermenéuticos objetivos basados en el texto original (NA28, BHS, LXX), con auditoría de fidelidad anti-alucinaciones, taller gramatical, capas contextuales, sección de aprendizaje interactivo y múltiples temas visuales.

## Variables de entorno

Configura las siguientes variables en tu archivo `.env` local o en **Settings → Environment Variables** dentro de Vercel:

- `GEMINI_API_KEY` *(obligatoria)*: Clave de API de Google Gemini para ejecutar los endpoints del servidor (`/api/*`).
- `GEMINI_MODEL` *(opcional)*: Modelo a utilizar (por defecto `gemini-4-hydrogen`).

## Desarrollo local

```bash
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.

## Despliegue en Vercel desde GitHub

1. Sube este repositorio completo a GitHub (asegúrate de **no** subir archivos `.env` locales; están excluidos en `.gitignore`).
2. En [Vercel](https://vercel.com), haz clic en **Add New → Project** e importa tu repositorio de GitHub.
3. Vercel detectará automáticamente la configuración de `vercel.json` (Framework: `Vite`, Build Command: `npm run build`, Output Directory: `dist`, y funciones serverless en `/api/index.ts` con `maxDuration: 60`).
4. En **Environment Variables**, añade `GEMINI_API_KEY` con tu clave de Gemini (y opcionalmente `GEMINI_MODEL`).
5. Haz clic en **Deploy**.
