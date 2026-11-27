import React, { useState } from 'react';
import { Download, Share, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'subtle' | 'primary';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'subtle' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className={
          variant === 'primary'
            ? 'inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2 text-xs font-medium text-white bg-[#1E3A8A] rounded-md hover:bg-[#172D6E] transition-colors whitespace-nowrap shrink-0 cursor-pointer'
            : 'inline-flex items-center justify-center gap-2 min-h-[40px] px-3 py-1.5 text-xs font-medium text-[#1E3A8A] border border-[#D4D0C7] bg-white rounded-md hover:bg-[#F3F1EC] transition-colors whitespace-nowrap shrink-0 cursor-pointer'
        }
      >
        <Download className="w-3.5 h-3.5" aria-hidden="true" />
        <span>Instalar aplicación</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center justify-center gap-2 min-h-[40px] px-3 py-1.5 text-xs font-medium text-[#1E3A8A] border border-[#D4D0C7] bg-white rounded-md hover:bg-[#F3F1EC] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Share className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Instalar en iOS</span>
        </button>

        {showIOSGuide && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ios-install-title"
          >
            <div className="w-full max-w-sm rounded-lg bg-[#FAF9F6] border border-[#E4E1DA] p-6 shadow-xl">
              <div className="flex items-start justify-between gap-4">
                <h3 id="ios-install-title" className="font-display text-2xl font-semibold text-zinc-900">
                  Instalar Scriptura en iOS
                </h3>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  aria-label="Cerrar guía de instalación"
                  className="min-h-[44px] min-w-[44px] -mt-2 -mr-2 flex items-center justify-center text-zinc-500 hover:text-zinc-900 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <ol className="mt-4 space-y-3 text-sm text-zinc-700 leading-relaxed list-decimal list-inside">
                <li>
                  Pulsa el botón <strong>Compartir</strong> en la barra inferior de Safari.
                </li>
                <li>
                  Desplázate hacia abajo y selecciona <strong>Añadir a pantalla de inicio</strong>.
                </li>
                <li>
                  Confirma pulsando <strong>Añadir</strong> para usar tus estudios exegéticos sin conexión.
                </li>
              </ol>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-6 w-full min-h-[44px] rounded-md bg-[#1E3A8A] py-2.5 text-sm font-medium text-white hover:bg-[#172D6E] transition-colors cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
