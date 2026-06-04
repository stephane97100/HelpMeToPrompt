import { Layers, Puzzle, Check } from "lucide-react";
import { MenuItem } from "../types";

interface SectionSelectorProps {
  menuItems: MenuItem[];
  onToggleSection: (pageId: string, sectionName: string) => void;
}

const AVAILABLE_SECTIONS = [
  { id: "header", name: "En-tête de page (Header)", desc: "Logo, menu de navigation responsive et raccord de couleur." },
  { id: "hero", name: "Bannière Hero", desc: "Titre principal d'impact, phrase d'accroche et bouton d'action CTA." },
  { id: "carousel", name: "Carrousel d'images", desc: "Glissière d'images et de messages promotionnels défilants." },
  { id: "cards", name: "Grille de Cartes (Cards Grid)", desc: "Affichage de services, prestations ou articles structurés." },
  { id: "contact", name: "Formulaire de Contact", desc: "Champs de saisie, email, message et validation client." },
  { id: "footer", name: "Pied de page (Footer)", desc: "Liens, copyright, mentions légales et boutons sociaux." }
];

export default function SectionSelector({
  menuItems,
  onToggleSection
}: SectionSelectorProps) {

  // Flattened list of pages (all pages and subpages to configure sections)
  const allPages: { id: string; label: string; isSubpage: boolean }[] = [];
  menuItems.forEach(item => {
    allPages.push({ id: item.id, label: item.label, isSubpage: false });
    item.subItems.forEach(sub => {
      allPages.push({ id: sub.id, label: `${item.label} ➜ ${sub.label}`, isSubpage: true });
    });
  });

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
        <Layers className="w-5 h-5 text-indigo-600" />
        <h2 className="text-lg font-bold text-gray-900 font-display">Agencement des Sections par Page</h2>
      </div>

      <p className="text-sm text-gray-600 leading-relaxed">
        Pour chaque page ou sous-page de la structure définie à l'étape précédente, cochez les sections de contenu requises. Le prompt et le mockup de prévisualisation s'ajusteront de manière dynamique dans l'ordre de votre choix !
      </p>

      {allPages.length === 0 ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-center">
          <p className="text-sm text-amber-800">
            ⚠️ <strong>Aucun lien de menu n'a encore été détecté.</strong>
          </p>
          <p className="text-xs text-amber-700/80 mt-1">
            Veuillez d'abord saisir la structure de votre site à l'étape d'avant pour configurer les blocs et sections de vos pages.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {allPages.map((page) => {
            // Find current saved sections associated with this page
            // We search through top menu or sub-menus to fetch current active sections
            let activeSections: string[] = [];
            const l1 = menuItems.find(item => item.id === page.id);
            if (l1) {
              activeSections = l1.sections;
            } else {
              // look inside subItems
              for (const item of menuItems) {
                const l2 = item.subItems.find(sub => sub.id === page.id);
                if (l2) {
                  activeSections = l2.sections;
                  break;
                }
              }
            }

            return (
              <div
                key={page.id}
                className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden transition-all duration-200"
              >
                {/* Header of Page section block */}
                <div className="bg-gray-50/80 px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Puzzle className={`w-4 h-4 ${page.isSubpage ? "text-indigo-400" : "text-indigo-600"}`} />
                    <span className="text-sm font-bold text-gray-800 font-display">
                      {page.label}
                    </span>
                    {page.isSubpage && (
                      <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
                        Sous-page
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-400 font-mono">
                    {activeSections.length} section(s) active(s)
                  </span>
                </div>

                {/* Subsections choices container */}
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {AVAILABLE_SECTIONS.map((sec) => {
                    const isChecked = activeSections.includes(sec.id);
                    return (
                      <button
                        key={sec.id}
                        type="button"
                        onClick={() => onToggleSection(page.id, sec.id)}
                        className={`text-left rounded-xl border p-3 flex gap-3 transition cursor-pointer select-none group ${
                          isChecked
                            ? "border-indigo-600 bg-indigo-50/10"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/50"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded mt-0.5 flex-shrink-0 flex items-center justify-center border transition ${
                            isChecked
                              ? "bg-indigo-600 border-indigo-600 text-white"
                              : "border-gray-300 group-hover:border-gray-400"
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                        
                        <div>
                          <p className={`text-xs font-semibold ${isChecked ? "text-indigo-900" : "text-gray-800"}`}>
                            {sec.name}
                          </p>
                          <p className="text-[11px] text-gray-500 mt-0.5 leading-normal">
                            {sec.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
