import { Sparkles, Code, Globe, HelpCircle } from "lucide-react";
import { MenuItem } from "../types";

interface AnimationPlannerProps {
  cssFramework: "tailwind" | "bootstrap" | "advantix" | "custom_css";
  onFrameworkChange: (fw: "tailwind" | "bootstrap" | "advantix" | "custom_css") => void;
  customCss: string;
  onCustomCssChange: (css: string) => void;
  menuItems: MenuItem[];
  animationChoices: Record<string, string>;
  onAnimationChange: (pageId: string, effect: string) => void;
}

const ANIMATION_EFFECTS = [
  { id: "fade-in", name: "Fade-In (Fondu classique)", desc: "L'élément apparaît en douceur lors du chargement ou du survol." },
  { id: "slide-up", name: "Slide-Up (Apparition montante)", desc: "Glissement vertical élégant de bas en haut." },
  { id: "pop-in", name: "Pop-In (Élargissement)", desc: "Effet d'échelle dynamique partant de 0.95 vers 1." },
  { id: "slide-left", name: "Slide-Left (Balayage gauche)", desc: "Glissement de droite à gauche." },
  { id: "none", name: "Statique", desc: "Pas de transition ou d'interactivité dynamique liée au scroll." }
];

export default function AnimationPlanner({
  cssFramework,
  onFrameworkChange,
  customCss,
  onCustomCssChange,
  menuItems,
  animationChoices,
  onAnimationChange
}: AnimationPlannerProps) {

  // Flattened pages list
  const allPages: { id: string; label: string }[] = [];
  menuItems.forEach(item => {
    allPages.push({ id: item.id, label: item.label });
    item.subItems.forEach(sub => {
      allPages.push({ id: sub.id, label: `${item.label} ➜ ${sub.label}` });
    });
  });

  return (
    <div className="space-y-6 font-sans">
      {/* SECTION 4 - Style & Bases CSS */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
          <Globe className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-bold text-gray-900 font-display">Bases CSS & Intégration de style.css</h2>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed">
          Choisissez la base technologique et stylistique de votre maquette. Vous pouvez lier des utilitaires de frameworks de pointe ou générer directement un fichier <code className="font-mono bg-gray-100 px-1 py-0.5 rounded text-indigo-600">style.css</code> pur.
        </p>

        {/* Framework Selector Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(["tailwind", "bootstrap", "advantix", "custom_css"] as const).map((fw) => {
            const isActive = cssFramework === fw;
            let title = "";
            let badge = "";
            switch (fw) {
              case "tailwind":
                title = "Tailwind CSS";
                badge = "V4 Utility";
                break;
              case "bootstrap":
                title = "Bootstrap 5";
                badge = "Grilles Flex";
                break;
              case "advantix":
                title = "Advantix CSS";
                badge = "Fluid Design";
                break;
              case "custom_css":
                title = "Custom Pure CSS";
                badge = "style.css";
                break;
            }

            return (
              <button
                key={fw}
                onClick={() => onFrameworkChange(fw)}
                className={`p-3 rounded-xl border text-center transition flex flex-col justify-between items-center cursor-pointer ${
                  isActive
                    ? "border-indigo-600 bg-indigo-50/20 shadow-sm"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <div className="text-xs font-bold text-gray-900 font-display">{title}</div>
                <div className="text-[10px] text-indigo-600 font-semibold uppercase mt-1 bg-indigo-50 px-1.5 py-0.5 rounded-full">
                  {badge}
                </div>
              </button>
            );
          })}
        </div>

        {/* Custom CSS overrides */}
        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-gray-700">Règles CSS Personnalisées (Injectées dans style.css) :</label>
            <span className="text-[10px] text-gray-400 font-mono">Modulables à la volée</span>
          </div>
          <textarea
            value={customCss}
            onChange={(e) => onCustomCssChange(e.target.value)}
            rows={4}
            className="w-full text-xs font-mono border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl p-3 bg-white text-gray-800"
            placeholder="/* Entrez vos styles personnalisés ici */&#10;.hero-banner {&#10;  border-radius: 20px;&#10;  border: 2px solid var(--accent-color);&#10;}"
          />
        </div>
      </div>

      {/* SECTION 5 - Animations & script.js */}
      <div className="space-y-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-bold text-gray-900 font-display">Interactivité, Animations & script.js</h2>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed">
          Associez à chaque page un comportement dynamique lors de sa visibilité ou de son ouverture. Ces événements seront compilés pour concevoir l'architecture de votre fichier d'interaction <code className="font-mono bg-gray-100 px-1 py-0.5 rounded text-indigo-600">script.js</code>.
        </p>

        {allPages.length === 0 ? (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-center text-amber-800 text-xs">
            Saisissez des liens de page à l'étape 2 afin de pouvoir affiner l'interactivité de la maquette.
          </div>
        ) : (
          <div className="space-y-3.5">
            {allPages.map((page) => {
              const currentEffect = animationChoices[page.id] || "fade-in";
              return (
                <div
                  key={page.id}
                  className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm"
                >
                  <div>
                    <span className="text-xs font-bold text-gray-800 font-display flex items-center gap-1.5">
                      <Code className="w-3.5 h-3.5 text-slate-500" />
                      Page : {page.label}
                    </span>
                    <p className="text-[10px] text-gray-400 mt-0.5 leading-normal">
                      Déclenché au scroll ou clic nav-item
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {ANIMATION_EFFECTS.map((eff) => {
                      const isSelected = currentEffect === eff.id;
                      return (
                        <button
                          key={eff.id}
                          onClick={() => onAnimationChange(page.id, eff.id)}
                          className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium cursor-pointer transition ${
                            isSelected
                              ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                              : "bg-gray-100 border-gray-200 hover:border-gray-300 text-gray-700"
                          }`}
                          title={eff.desc}
                        >
                          {eff.name}
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
    </div>
  );
}
