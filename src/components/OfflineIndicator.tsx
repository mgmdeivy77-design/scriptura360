import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-20 md:bottom-5 left-4 z-40 flex items-center gap-2 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-950 shadow-sm no-print"
    >
      <WifiOff className="w-3.5 h-3.5 text-amber-800 shrink-0" aria-hidden="true" />
      <span>Modo sin conexión — Consultando estudios guardados localmente</span>
    </div>
  );
};
