import { Menu, Info, Layers } from "lucide-react";
import { MenuItem } from "../types";

interface MenuEditorProps {
  structureText: string;
  onStructureChange: (text: string) => void;
  parsedMenu: MenuItem[];
}

export default function MenuEditor({
  structureText,
  onStructureChange,
  parsedMenu
}: MenuEditorProps) {
  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
        <Menu className="w-5 h-5 text-indigo-600" />
        <h2 className="text-lg font-bold text-gray-900 font-display">Structure du Menu & Plan de Site</h2>
      </div>

      <p className="text-sm text-gray-600 leading-relaxed">
        Définissez l'arborescence des liens de votre futur site web. Saisissez chaque lien sur une nouvelle ligne en respectant scrupuleusement la syntaxe suivante :
      </p>

      {/* Syntax explanation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900 text-slate-100 p-4 rounded-xl border border-slate-800">
        <div className="space-y-2 text-xs">
          <p className="font-semibold text-indigo-300 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" /> Syntaxe Indentée Recommandée :
          </p>
          <ul className="space-y-1 font-mono text-slate-300">
            <li><span className="text-emerald-400 font-bold">-</span> Accueil (Lien Principal)</li>
            <li><span className="text-emerald-400 font-bold">-</span> Prestations (Lien Principal)</li>
            <li><span className="text-indigo-400 font-bold">--</span> Design d'Art (Sous-menu)</li>
            <li><span className="text-indigo-400 font-bold">--</span> Développement (Sous-menu)</li>
            <li><span className="text-emerald-400 font-bold">-</span> Contact (Lien Principal)</li>
          </ul>
        </div>
        
        <div className="flex flex-col justify-between text-xs text-slate-400 leading-relaxed">
          <p>
            Cette application analysera en continu vos traits pour concevoir automatiquement des barres de navigation et des structures de drop-down responsives d'une grande fluidité.
          </p>
          <div className="flex items-center gap-1 text-[11px] text-indigo-300 bg-slate-950 p-1.5 rounded border border-slate-800">
            <Info className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Un tiret (<code className="font-bold">-</code>) = menu, deux tirets (<code className="font-bold">--</code>) = sous-menu</span>
          </div>
        </div>
      </div>

      {/* Inputs vs Live Tree render split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left column: input text area */}
        <div className="lg:col-span-7 space-y-1.5">
          <label className="text-xs font-bold text-gray-700 block">Détails de l'arborescence (Saisir ci-dessous) :</label>
          <textarea
            value={structureText}
            onChange={(e) => onStructureChange(e.target.value)}
            rows={8}
            className="w-full text-sm font-mono border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl p-4 text-gray-800 bg-white"
            placeholder="- Accueil&#10;- Présentation&#10;- Services&#10;-- Conception UX&#10;-- Développement Web&#10;- Mon Portfolio&#10;- Nous Recruter"
          />
        </div>

        {/* Right column: live generated visual tree */}
        <div className="lg:col-span-5 bg-gray-50 border border-gray-150 rounded-xl p-4 flex flex-col">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 font-display">Aperçu Arborescent en Temps Réel :</span>
          
          {parsedMenu.length === 0 ? (
            <div className="text-xs text-gray-400 italic my-auto text-center py-8">
              Aucun lien encore défini. Saisissez du texte avec la syntaxe de tirets à gauche pour afficher le diagramme.
            </div>
          ) : (
            <div className="my-auto space-y-2 border-l-2 border-indigo-100 pl-3 py-1">
              {parsedMenu.map((item) => (
                <div key={item.id} className="text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-gray-800">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    <span>{item.label}</span>
                    <span className="text-[10px] font-mono text-gray-400 bg-gray-200/50 px-1.5 py-0.2 rounded">
                      {item.href}
                    </span>
                  </div>
                  
                  {item.subItems.length > 0 && (
                    <div className="pl-4 space-y-1 border-l border-gray-200 ml-1">
                      {item.subItems.map((sub) => (
                        <div key={sub.id} className="flex items-center gap-1.5 text-gray-600 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                          <span>{sub.label}</span>
                          <span className="text-[9px] font-mono text-gray-400">
                            {sub.href}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
