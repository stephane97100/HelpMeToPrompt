import { Globe, Search, Info, HelpCircle, CheckCircle, AlertCircle } from "lucide-react";
import { MenuItem } from "../types";

export interface SeoMeta {
  title: string;
  description: string;
}

interface SeoSettingsProps {
  menuItems: MenuItem[];
  seoMap: Record<string, SeoMeta>;
  onSeoChange: (pageId: string, updated: SeoMeta) => void;
}

export default function SeoSettings({
  menuItems,
  seoMap,
  onSeoChange
}: SeoSettingsProps) {
  // Flatten all pages and subpages to get their slugs & labels
  const allPages: { id: string; label: string; isSubpage: boolean }[] = [];
  menuItems.forEach((item) => {
    allPages.push({ id: item.id, label: item.label, isSubpage: false });
    item.subItems.forEach((sub) => {
      allPages.push({ id: sub.id, label: `${item.label} ➜ ${sub.label}`, isSubpage: true });
    });
  });

  const getPageSeo = (pageId: string, defaultLabel: string): SeoMeta => {
    return (
      seoMap[pageId] || {
        title: `${defaultLabel} | Mon Site Web`,
        description: `Bienvenue sur la page de ${defaultLabel}. Retrouvez l'ensemble de nos rubriques, actualités et services en ligne.`
      }
    );
  };

  const handleUpdateTitle = (pageId: string, title: string, currentSeo: SeoMeta) => {
    onSeoChange(pageId, { ...currentSeo, title });
  };

  const handleUpdateDescription = (pageId: string, description: string, currentSeo: SeoMeta) => {
    onSeoChange(pageId, { ...currentSeo, description });
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
        <Globe className="w-5 h-5 text-indigo-600" />
        <h2 className="text-lg font-bold text-gray-900 font-display">6. Paramètres SEO (Référencement Web)</h2>
      </div>

      <p className="text-sm text-gray-650 leading-relaxed">
        Définissez le titre de l'onglet et la description d'accroche pour la recherche de chaque page du site. 
        Ces balises sémantiques <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-indigo-600 text-xs">&lt;title&gt;</code> et <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-indigo-600 text-xs">&lt;meta name="description"&gt;</code> seront injectées directement au format HTML d'Antigravity.
      </p>

      {allPages.length === 0 ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-center">
          <p className="text-sm text-amber-800 font-semibold">
            ⚠️ Aucun lien ou structure de menu détecté.
          </p>
          <p className="text-xs text-amber-600 mt-1">
            Veuillez entrer une arborescence valide sous l'étape 2 (Structure du plan de site) pour configurer le SEO.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {allPages.map((page) => {
            const currentSeo = getPageSeo(page.id, page.label);
            const titleLength = currentSeo.title.length;
            const descLength = currentSeo.description.length;

            const isTitleValid = titleLength >= 10 && titleLength <= 65;
            const isDescValid = descLength >= 50 && descLength <= 160;

            return (
              <div
                key={page.id}
                className="bg-white border border-slate-205 shadow-sm rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0 border-l-4 border-l-indigo-500"
              >
                {/* Inputs Setup Form - Left */}
                <div className="p-5 lg:col-span-7 border-b lg:border-b-0 lg:border-r border-slate-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-700 tracking-wide font-display uppercase">
                      Page : {page.label}
                    </span>
                    {page.isSubpage && (
                      <span className="text-[9px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-full">
                        Sous-page
                      </span>
                    )}
                  </div>

                  {/* Title Field */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <label className="font-bold text-slate-600">Titre de l'onglet (SEO Title)</label>
                      <span
                        className={`font-mono text-[11px] ${
                          isTitleValid ? "text-emerald-600" : "text-amber-500 font-semibold"
                        }`}
                      >
                        {titleLength} / 65 car.
                      </span>
                    </div>
                    <input
                      type="text"
                      className="w-full text-xs border border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-3 py-2 text-slate-800 bg-white"
                      placeholder="Ex: Accueil | Agence Créative Digitale"
                      value={currentSeo.title}
                      onChange={(e) => handleUpdateTitle(page.id, e.target.value, currentSeo)}
                    />
                    <p className="text-[10px] text-slate-400">
                      Recommandé : Entre 10 et 60 caractères pour ne pas être tronqué.
                    </p>
                  </div>

                  {/* Description Field */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <label className="font-bold text-slate-600">Meta Description</label>
                      <span
                        className={`font-mono text-[11px] ${
                          isDescValid ? "text-emerald-600" : "text-amber-500 font-semibold"
                        }`}
                      >
                        {descLength} / 160 car.
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      className="w-full text-xs border border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-3 py-2 text-slate-800 bg-white leading-relaxed"
                      placeholder="Ex: Découvrez notre agence digitale spécialisée dans l'accompagnement UX/UI..."
                      value={currentSeo.description}
                      onChange={(e) => handleUpdateDescription(page.id, e.target.value, currentSeo)}
                    />
                    <p className="text-[10px] text-slate-400">
                      Recommandé : Entre 50 et 160 caractères pour résumer le contenu de la page.
                    </p>
                  </div>
                </div>

                {/* Google Search Preview Simulator - Right */}
                <div className="bg-slate-50/60 p-5 lg:col-span-5 flex flex-col justify-center space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest text-[9px]">
                    <Search className="w-3 h-3" />
                    Aperçu de recherche Google
                  </div>

                  <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm space-y-1 font-sans">
                    {/* URL preview path */}
                    <div className="flex items-center gap-1 text-[11px] text-slate-600 truncate">
                      <span className="font-medium">https://monsiteweb.com</span>
                      <span className="text-slate-400">› {page.id}</span>
                    </div>

                    {/* Meta Title blue clickable link */}
                    <h3 className="text-[14px] text-blue-800 hover:underline font-normal tracking-wide cursor-pointer font-sans leading-tight line-clamp-1">
                      {currentSeo.title || "Titre vide"}
                    </h3>

                    {/* Meta Description snippet */}
                    <p className="text-[12px] text-slate-600 leading-normal line-clamp-2">
                      {currentSeo.description || "Aucune meta description saisie. Saisissez une meta description pour améliorer l'impact de ce résultat."}
                    </p>
                  </div>

                  {/* Rating Badge */}
                  <div className="flex items-center gap-1.5">
                    {isTitleValid && isDescValid ? (
                      <div className="flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        Balises Optimes
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-bold">
                        <AlertCircle className="w-3 h-3 text-amber-500" />
                        Ajustable
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
