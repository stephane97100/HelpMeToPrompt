import { useState } from "react";
import { Paintbrush, Check, Eye, ChevronRight } from "lucide-react";
import { DesignTheme, PRESET_THEMES } from "../types";

interface ThemeSelectorProps {
  selectedThemeId: string;
  onSelectTheme: (theme: DesignTheme) => void;
  bgColor: string;
  onChangeBgColor: (color: string) => void;
  textColor: string;
  onChangeTextColor: (color: string) => void;
  accentColor: string;
  onChangeAccentColor: (color: string) => void;
  navBgColor: string;
  onChangeNavBgColor: (color: string) => void;
  footerBgColor: string;
  onChangeFooterBgColor: (color: string) => void;
}

const POPULAR_COLORS = [
  { name: "Blanc Pur", value: "#ffffff" },
  { name: "Gris Doux", value: "#f3f4f6" },
  { name: "Crème Chaleureux", value: "#fffaf0" },
  { name: "Sable Fin", value: "#fafaf9" },
  { name: "Charbon Profond", value: "#111827" },
  { name: "Ardoise Sombre", value: "#0f172a" },
  { name: "Espoir Indigo", value: "#4f46e5" },
  { name: "Bleu Océan", value: "#0284c7" },
  { name: "Vert Vérité", value: "#10b981" },
  { name: "Orange Corail", value: "#f97316" }
];

export default function ThemeSelector({
  selectedThemeId,
  onSelectTheme,
  bgColor,
  onChangeBgColor,
  textColor,
  onChangeTextColor,
  accentColor,
  onChangeAccentColor,
  navBgColor,
  onChangeNavBgColor,
  footerBgColor,
  onChangeFooterBgColor
}: ThemeSelectorProps) {
  // Theme Preview state (shows look & feel overlay properties)
  const [previewTheme, setPreviewTheme] = useState<DesignTheme | null>(null);

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
        <Paintbrush className="w-5 h-5 text-indigo-600" />
        <h2 className="text-lg font-bold text-gray-900 font-display">Charte Graphique & Thèmes Visuels</h2>
      </div>

      <p className="text-sm text-gray-600 leading-relaxed">
        Sélectionnez un pack de thématique prédéfini ou personnalisez vos couleurs de fond, de texte, d'accentuation et de barres d'outil en détail.
      </p>

      {/* Preset theme list with live interactive eye review */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PRESET_THEMES.map((theme) => {
          const isSelected = selectedThemeId === theme.id;
          return (
            <div
              key={theme.id}
              className={`relative rounded-xl border p-4 transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? "border-indigo-600 bg-indigo-50/20 shadow-md ring-1 ring-indigo-600"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900 text-sm font-display flex items-center gap-1.5">
                    {theme.name}
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </h4>
                  <button
                    onClick={() => setPreviewTheme(theme)}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-0.5 border border-indigo-100 hover:bg-indigo-50 px-2 py-1 rounded-md"
                    title="Aperçu rapide du thème"
                  >
                    <Eye className="w-3 h-3" />
                    Aperçu
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{theme.description}</p>
                
                {/* Visual miniature colors preview */}
                <div className="flex gap-1.5 mt-3">
                  <div
                    className="w-5 h-5 rounded border border-gray-200/60"
                    style={{ backgroundColor: theme.bgColor }}
                    title={`Fond: ${theme.bgColor}`}
                  />
                  <div
                    className="w-5 h-5 rounded border border-gray-200/60"
                    style={{ backgroundColor: theme.textColor }}
                    title={`Texte: ${theme.textColor}`}
                  />
                  <div
                    className="w-5 h-5 rounded border border-gray-200/60"
                    style={{ backgroundColor: theme.accentColor }}
                    title={`Accent: ${theme.accentColor}`}
                  />
                  <div
                    className="w-5 h-5 rounded border border-gray-200/60"
                    style={{ backgroundColor: theme.navBgColor }}
                    title={`Nav: ${theme.navBgColor}`}
                  />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => onSelectTheme(theme)}
                  className={`text-xs px-3 py-1.5 rounded-lg cursor-pointer font-medium transition ${
                    isSelected
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  Appliquer le thème
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Quick Modal/Lightbox for Previewing a Theme */}
      {previewTheme && (
        <div className="p-4 bg-slate-900 text-slate-100 rounded-xl border border-slate-700 space-y-3 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-mono text-indigo-400">Visionneuse d'Aperçu de Palette</span>
            <button
              onClick={() => setPreviewTheme(null)}
              className="text-slate-400 hover:text-white font-bold text-xs"
            >
              Fermer [✕]
            </button>
          </div>
          <h4 className="text-sm font-bold text-white font-display">Aperçu du Thème : {previewTheme.name}</h4>
          
          <div
            className="rounded-lg p-4 border border-dashed border-slate-700 transition"
            style={{ backgroundColor: previewTheme.bgColor, color: previewTheme.textColor }}
          >
            <div
              className="p-2 mb-3 rounded text-xs font-semibold flex items-center justify-between"
              style={{ backgroundColor: previewTheme.navBgColor }}
            >
              <span>Logo</span>
              <div className="space-x-2">
                <span className="underline" style={{ color: previewTheme.accentColor }}>Lien 1</span>
                <span style={{ opacity: 0.8 }}>Lien 2</span>
              </div>
            </div>

            <h5 className="text-base font-bold mb-1">Ceci est un En-tête de section</h5>
            <p className="text-xs mb-3">La lisibilité et l'harmonie des contrastes garantissent un rendu moderne et responsive d'exception.</p>
            
            <button
              className="text-xs px-3 py-1.5 rounded font-bold cursor-pointer"
              style={{ backgroundColor: previewTheme.accentColor, color: "#fff" }}
            >
              Bouton à Forte Valeur Accent
            </button>
          </div>
        </div>
      )}

      {/* Manual Advanced Color Customizers */}
      <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-4">
        <h3 className="text-sm font-bold text-gray-800 font-display">Personnalisation Avancée des Couleurs (Requis)</h3>
        
        {/* Swatches preset selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-500 block">Palette Rapide Universelle :</label>
          <div className="flex flex-wrap gap-2">
            {POPULAR_COLORS.map((col) => (
              <button
                key={col.value}
                onClick={() => {
                  // Prompt options : applies color based on text context
                  if (col.value === "#ffffff" || col.value === "#f3f4f6" || col.value === "#fffaf0" || col.value === "#fafaf9") {
                    onChangeBgColor(col.value);
                  } else {
                    onChangeAccentColor(col.value);
                  }
                }}
                className="group relative flex items-center justify-center p-1 border border-gray-200 bg-white hover:bg-gray-50 rounded-lg cursor-pointer transition text-xs gap-1.5"
              >
                <span className="w-3.5 h-3.5 rounded" style={{ backgroundColor: col.value }} />
                <span className="text-[10px] font-medium text-gray-600">{col.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
          {/* Background input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 block">Fond du corps (body) :</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => onChangeBgColor(e.target.value)}
                className="w-8 h-8 rounded border border-gray-300 cursor-pointer p-0"
              />
              <input
                type="text"
                value={bgColor}
                onChange={(e) => onChangeBgColor(e.target.value)}
                className="w-full text-xs font-mono border border-gray-300 rounded px-2 text-gray-800"
              />
            </div>
          </div>

          {/* Text Color input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 block">Texte Principal :</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={textColor}
                onChange={(e) => onChangeTextColor(e.target.value)}
                className="w-8 h-8 rounded border border-gray-300 cursor-pointer p-0"
              />
              <input
                type="text"
                value={textColor}
                onChange={(e) => onChangeTextColor(e.target.value)}
                className="w-full text-xs font-mono border border-gray-300 rounded px-2 text-gray-800"
              />
            </div>
          </div>

          {/* Accent Color input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 block">Éclat / Accent :</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={accentColor}
                onChange={(e) => onChangeAccentColor(e.target.value)}
                className="w-8 h-8 rounded border border-gray-300 cursor-pointer p-0"
              />
              <input
                type="text"
                value={accentColor}
                onChange={(e) => onChangeAccentColor(e.target.value)}
                className="w-full text-xs font-mono border border-gray-300 rounded px-2 text-gray-800"
              />
            </div>
          </div>

          {/* Nav Background input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 block">Fond de la .nav :</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={navBgColor}
                onChange={(e) => onChangeNavBgColor(e.target.value)}
                className="w-8 h-8 rounded border border-gray-300 cursor-pointer p-0"
              />
              <input
                type="text"
                value={navBgColor}
                onChange={(e) => onChangeNavBgColor(e.target.value)}
                className="w-full text-xs font-mono border border-gray-300 rounded px-2 text-gray-800"
              />
            </div>
          </div>

          {/* Footer Background input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 block">Fond du .footer :</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={footerBgColor}
                onChange={(e) => onChangeFooterBgColor(e.target.value)}
                className="w-8 h-8 rounded border border-gray-300 cursor-pointer p-0"
              />
              <input
                type="text"
                value={footerBgColor}
                onChange={(e) => onChangeFooterBgColor(e.target.value)}
                className="w-full text-xs font-mono border border-gray-300 rounded px-2 text-gray-800"
              />
            </div>
          </div>
        </div>

        <div className="mt-3 p-3 bg-indigo-50 text-indigo-900/80 rounded-lg text-xs leading-normal">
          💡 La structure d'harmonie du thème impacte intelligemment les liens hypertextes du menu dans la balise <code className="font-bold bg-indigo-100 px-1 py-0.5 rounded">.nav</code>, du pied de page <code className="font-bold bg-indigo-100 px-1 py-0.5 rounded">.footer</code>, et tous les titres et encarts des <code className="font-bold bg-indigo-100 px-1 py-0.5 rounded">.section</code>.
        </div>
      </div>
    </div>
  );
}
