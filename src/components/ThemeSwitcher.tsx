import React, { useEffect, useRef, useState } from 'react';
import { Check, Palette } from 'lucide-react';
import { APP_THEMES } from '../hooks/useTheme';
import type { ThemeId } from '../types/exegesis';

interface ThemeSwitcherProps {
  theme: ThemeId;
  onSelectTheme: (theme: ThemeId) => void;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ theme, onSelectTheme }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const active = APP_THEMES.find((t) => t.id === theme) ?? APP_THEMES[0];

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Cambiar tema visual"
        title={`Tema actual: ${active.name}`}
        className="inline-flex items-center gap-1.5 min-h-[38px] px-2.5 sm:px-3 py-1.5 text-xs font-medium bg-white border border-[#D4D0C7] text-zinc-800 rounded-md hover:border-[#1E3A8A] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
      >
        <Palette className="w-3.5 h-3.5 text-[#1E3A8A] shrink-0" aria-hidden="true" />
        <span aria-hidden="true">{active.emoji}</span>
        <span className="hidden sm:inline">Tema</span>
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Selector de temas"
          className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-[#E4E1DA] rounded-md shadow-xl p-2 z-50 space-y-1"
        >
          <div className="px-2.5 py-1.5 border-b border-[#E4E1DA] flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-widest font-semibold text-zinc-500">
              🎨 Temas de lectura
            </span>
            <span className="text-[11px] text-zinc-400">{APP_THEMES.length} estilos</span>
          </div>

          {APP_THEMES.map((item) => {
            const selected = item.id === theme;
            return (
              <button
                key={item.id}
                type="button"
                role="menuitemradio"
                aria-checked={selected}
                onClick={() => {
                  onSelectTheme(item.id);
                  setOpen(false);
                }}
                className={`w-full text-left px-2.5 py-2.5 rounded-md flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                  selected ? 'bg-[#F3F1EC] text-[#1E3A8A]' : 'hover:bg-[#FAF9F6] text-zinc-800'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Mini Color Swatch Trio */}
                  <div
                    className="flex items-center rounded border border-[#D4D0C7] overflow-hidden shrink-0"
                    aria-hidden="true"
                  >
                    <span className="w-3 h-6" style={{ backgroundColor: item.canvasSwatch }} />
                    <span className="w-3 h-6" style={{ backgroundColor: item.surfaceSwatch }} />
                    <span className="w-2.5 h-6" style={{ backgroundColor: item.accentSwatch }} />
                  </div>

                  <div className="min-w-0">
                    <div className="text-xs font-semibold flex items-center gap-1.5 truncate">
                      <span aria-hidden="true">{item.emoji}</span>
                      <span>{item.name}</span>
                    </div>
                    <div className="text-[11px] text-zinc-500 truncate">{item.subtitle}</div>
                  </div>
                </div>

                {selected && <Check className="w-4 h-4 text-[#1E3A8A] shrink-0" aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
