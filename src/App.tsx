import { useState, useEffect, useMemo } from "react";
import {
  Terminal,
  Sliders,
  FileCode,
  Layout,
  Eye,
  BookOpen,
  Sparkles,
  Layers,
  Shield,
  Activity,
  CheckCircle,
  AlertTriangle,
  Play
} from "lucide-react";

import { DesignTheme, FileStatus, PRESET_THEMES, SectionContent } from "./types";
import {
  parseMenuStructure,
  generateInstructionsMarkdown,
  generateStyleCss,
  generateScriptJs,
  generateUltimatePrompt
} from "./utils";

import PermissionBanner from "./components/PermissionBanner";
import ThemeSelector from "./components/ThemeSelector";
import MenuEditor from "./components/MenuEditor";
import SectionSelector from "./components/SectionSelector";
import AnimationPlanner from "./components/AnimationPlanner";
import PromptDisplay from "./components/PromptDisplay";
import InteractivePreview from "./components/InteractivePreview";
import SeoSettings, { SeoMeta } from "./components/SeoSettings";
import LandingPage from "./components/LandingPage";
import SavedPromptsManager from "./components/SavedPromptsManager";
import { Cloud, LogOut, LogIn, Key, UserCheck } from "lucide-react";

export default function App() {
  // Authentication states
  const [user, setUser] = useState<{ email: string; name: string; avatarUrl?: string } | null>(() => {
    const cached = localStorage.getItem("helpmetoprompt_user");
    return cached ? JSON.parse(cached) : null;
  });

  const [enableGuestMode, setEnableGuestMode] = useState(() => {
    const cachedUser = localStorage.getItem("helpmetoprompt_user");
    return cachedUser ? true : false;
  });

  const [showEditorAuthScreen, setShowEditorAuthScreen] = useState(false);
  const [activeEditorProvider, setActiveEditorProvider] = useState<string | null>(null);
  const [editorSimulatedStep, setEditorSimulatedStep] = useState(0);

  const handleSimulatedLogin = (provider: string, email: string, name: string) => {
    const newUser = { email, name, avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${name}` };
    localStorage.setItem("helpmetoprompt_user", JSON.stringify(newUser));
    setUser(newUser);
    setEnableGuestMode(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("helpmetoprompt_user");
    setUser(null);
    setEnableGuestMode(false);
  };

  const handleLoadPromptState = (promptData: any) => {
    if (!promptData) return;
    if (promptData.siteDesc !== undefined) setSiteDesc(promptData.siteDesc);
    if (promptData.structureText !== undefined) setStructureText(promptData.structureText);
    if (promptData.selectedThemeId !== undefined) {
      setSelectedThemeId(promptData.selectedThemeId);
      const matching = PRESET_THEMES.find(t => t.id === promptData.selectedThemeId);
      if (matching) {
        setThemeName(matching.name);
        setBgColor(matching.bgColor);
        setTextColor(matching.textColor);
        setAccentColor(matching.accentColor);
        setNavBgColor(matching.navBgColor);
        setFooterBgColor(matching.footerBgColor);
        setFontFamily(matching.fontFamily);
      }
    }
    if (promptData.cssFramework !== undefined) setCssFramework(promptData.cssFramework);
    if (promptData.customCss !== undefined) setCustomCss(promptData.customCss);
    if (promptData.animationChoices !== undefined) setAnimationChoices(promptData.animationChoices);
    if (promptData.sectionsMap !== undefined) setSectionsMap(promptData.sectionsMap);
    if (promptData.seoMap !== undefined) setSeoMap(promptData.seoMap);
    if (promptData.activeLayoutPresetId !== undefined) setActiveLayoutPresetId(promptData.activeLayoutPresetId);
    if (promptData.sectionContent !== undefined) setSectionContent(promptData.sectionContent);
  };

  // Global View Navigation Tabs
  const [activeTab, setActiveTab] = useState<"workspace" | "live_preview" | "user_doc">("workspace");
  const [activeStep, setActiveStep] = useState<number>(1);

  // STEP 1 - Site Vision State
  const [siteDesc, setSiteDesc] = useState<string>(
    "Un site vitrine moderne pour une agence digitale créative, axé sur la fluidité, avec une section pour présenter nos projets de marque et un raccord de prise de contact soigné."
  );

  // STEP 2 - Structure outline
  const [structureText, setStructureText] = useState<string>(
    "- Accueil\n- Prestations\n-- Conception UX\n-- Développement Agile\n- Réalisations\n- Contact"
  );

  // STEP 3 - Theme Visuels & Colors
  const [selectedThemeId, setSelectedThemeId] = useState<string>("minimaliste");
  const [themeName, setThemeName] = useState<string>("Minimaliste Moderne");
  const [bgColor, setBgColor] = useState<string>("#f9fafb");
  const [textColor, setTextColor] = useState<string>("#111827");
  const [accentColor, setAccentColor] = useState<string>("#4f46e5");
  const [navBgColor, setNavBgColor] = useState<string>("#ffffff");
  const [footerBgColor, setFooterBgColor] = useState<string>("#f3f4f6");
  const [fontFamily, setFontFamily] = useState<string>("Inter, sans-serif");

  // STEP 4 - Style & Framework
  const [cssFramework, setCssFramework] = useState<"tailwind" | "bootstrap" | "advantix" | "custom_css">("tailwind");
  const [customCss, setCustomCss] = useState<string>(
    "/* Custom style code overrides */\n.hero-banner {\n  border-radius: 12px;\n  box-shadow: 0 4px 20px rgba(0,0,0,0.03);\n}"
  );

  // STEP 5 - Animations
  const [animationChoices, setAnimationChoices] = useState<Record<string, string>>({
    "accueil": "fade-in",
    "prestations": "slide-up",
    "conception-ux": "pop-in",
    "developpement-agile": "slide-left",
    "realisations": "fade-in",
    "contact": "pop-in"
  });

  // STEP 6 - Section toggles per page template slug
  const [sectionsMap, setSectionsMap] = useState<Record<string, string[]>>({
    "accueil": ["header", "hero", "carousel", "footer"],
    "prestations": ["header", "cards", "footer"],
    "conception-ux": ["header", "hero", "footer"],
    "developpement-agile": ["header", "cards", "footer"],
    "realisations": ["header", "carousel", "cards", "footer"],
    "contact": ["header", "contact", "footer"]
  });

  // STEP 6 - SEO metadata per page slug
  const [seoMap, setSeoMap] = useState<Record<string, SeoMeta>>({
    "accueil": { title: "Accueil | Agence Digitale Créative", description: "Découvrez nos créations et services digitaux de marque avec expertise UX/UI de pointe." },
    "prestations": { title: "Nos Prestations | Services de Conception UX & Développement", description: "Découvrez notre gamme complète de prestations allant de la conception UX/UI au développement de logiciels agiles." },
    "conception-ux": { title: "Conception UX/UI de Pointe | Nos Prestations", description: "Recherche utilisateurs, wireframes interactifs et design d'expérience sur-mesure pour vos produits web et mobile." },
    "developpement-agile": { title: "Développement Agile Performant | Nos Prestations", description: "Méthodologies agiles pour un développement logiciel robuste, évolutif et centré sur la valeur métier." },
    "realisations": { title: "Nos Réalisations & Projets Digitaux", description: "Explorez notre portfolio de créations digitales et de projets de marque accomplis pour nos clients." },
    "contact": { title: "Contactez-Nous | Discutons de votre Projet", description: "Prêt à propulser votre expérience de marque ? Envoyez-nous un message pour lancer votre projet digital." }
  });

  const handleSeoChange = (pageId: string, updated: SeoMeta) => {
    setSeoMap((prev) => ({
      ...prev,
      [pageId]: updated
    }));
  };

  // STEP 7 - Layout and Content overrides
  const [activeLayoutPresetId, setActiveLayoutPresetId] = useState<"one_column" | "two_column" | "magazine">("one_column");

  const [sectionContent, setSectionContent] = useState<SectionContent>({
    headerLogoText: "SiteUX",
    headerLogoFile: "",
    heroTitle: "Concevoir le Web de demain.",
    heroSubtitle: "Un rendu harmonieux de contrastes, d'espacements stables, de hauteurs de lignes et d'ergonomie client-side fluide.",
    heroCtaText: "Démarrer maintenant",
    heroImageFile: "",
    carouselSlides: [
      { title: "Innover et Concevoir", text: "Nous façonnons des expériences utilisateur mémorables et ultra fluides.", imageFile: "" },
      { title: "Rapidité sans faille", text: "Chaque milli-seconde est optimisée client-side grâce au responsive Antigravity.", imageFile: "" },
      { title: "Vision Responsive", text: "S'adapte dynamiquement de l'iPhone Mini jusqu'aux Écrans 4K.", imageFile: "" }
    ],
    cardsTitle: "Nos points forts d'excellence",
    cardsSubtitle: "Des prestations calibrées pour la performance",
    cardsItems: [
      { title: "Module innovant 01", desc: "Des layouts légers et responsives construits pour un rendu de performance maximal.", imageFile: "" },
      { title: "Grille sémantique 02", desc: "Structure du dôme sémantique totalement optimisée et codée sans détour.", imageFile: "" },
      { title: "Design d'Impact 03", desc: "Contrôle millimétré des hauteurs, marges intérieures, typographies et contrastes parfaits.", imageFile: "" }
    ],
    contactTitle: "Transmettre une demande de projet",
    contactBtnText: "Soumettre ma demande",
    footerCopyright: "© 2026 SiteUX Corporation. Tous droits réservés.",
    footerLink1: "Mentions Légales",
    footerLink2: "Politique de Confidentialité"
  });

  // BACKEND - Files state
  const [filesStatus, setFilesStatus] = useState<FileStatus[]>([]);
  const [isServerLoading, setIsServerLoading] = useState<boolean>(false);
  const [serverMessage, setServerMessage] = useState<{ text: string; error: boolean } | null>(null);

  // Fetch status of files under project root from server
  const fetchFilesStatus = async () => {
    setIsServerLoading(true);
    try {
      const response = await fetch("/api/file-status");
      const data = await response.json();
      if (data.success && data.files) {
        setFilesStatus(data.files);
      }
    } catch (err) {
      console.error("Impossible d'obtenir le statut des fichiers :", err);
    } finally {
      setIsServerLoading(false);
    }
  };

  useEffect(() => {
    fetchFilesStatus();
  }, []);

  // Save specific file contents into the workspace root
  const handleSaveFileOnServer = async (filename: string, content: string): Promise<boolean> => {
    setIsServerLoading(true);
    setServerMessage(null);
    try {
      const response = await fetch("/api/save-file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename, content })
      });
      const data = await response.json();
      if (data.success) {
        setServerMessage({
          text: `Fichier "${filename}" enregistré avec succès ! Permissions CHMOD appliquées (${data.mode}).`,
          error: false
        });
        fetchFilesStatus();
        return true;
      } else {
        setServerMessage({ text: data.error || "Erreur de sauvegarde", error: true });
        return false;
      }
    } catch (err: any) {
      setServerMessage({ text: "Impossible de joindre le serveur de fichiers.", error: true });
      return false;
    } finally {
      setIsServerLoading(false);
    }
  };

  // Generate compiled outputs
  const parsedMenu = useMemo(() => {
    return parseMenuStructure(structureText, sectionsMap);
  }, [structureText, sectionsMap]);

  // Handle section checkbox toggle for pages
  const handleToggleSection = (pageId: string, sectionName: string) => {
    setSectionsMap((prev) => {
      const existing = prev[pageId] || ["header", "footer"];
      const updated = existing.includes(sectionName)
        ? existing.filter((s) => s !== sectionName)
        : [...existing, sectionName];
      return { ...prev, [pageId]: updated };
    });
  };

  // Sync state when Preset Theme card is selected
  const handleSelectTheme = (theme: DesignTheme) => {
    setSelectedThemeId(theme.id);
    setThemeName(theme.name);
    setBgColor(theme.bgColor);
    setTextColor(theme.textColor);
    setAccentColor(theme.accentColor);
    setNavBgColor(theme.navBgColor);
    setFooterBgColor(theme.footerBgColor);
    setFontFamily(theme.fontFamily);
    setCssFramework(theme.cssFramework);
  };

  // Compile active structures
  const activeThemeObject: DesignTheme = useMemo(() => {
    return {
      id: selectedThemeId,
      name: themeName,
      description: "Thème actif personnalisé",
      bgColor,
      textColor,
      accentColor,
      navBgColor,
      footerBgColor,
      fontFamily,
      cssFramework
    };
  }, [selectedThemeId, themeName, bgColor, textColor, accentColor, navBgColor, footerBgColor, fontFamily, cssFramework]);

  const styleCssContent = useMemo(() => {
    return generateStyleCss(activeThemeObject, customCss);
  }, [activeThemeObject, customCss]);

  const scriptJsContent = useMemo(() => {
    return generateScriptJs(animationChoices, parsedMenu);
  }, [animationChoices, parsedMenu]);

  const instructionsMdContent = useMemo(() => {
    return generateInstructionsMarkdown(
      siteDesc,
      structureText,
      activeThemeObject,
      customCss,
      animationChoices,
      scriptJsContent,
      parsedMenu,
      seoMap,
      activeLayoutPresetId,
      sectionContent
    );
  }, [siteDesc, structureText, activeThemeObject, customCss, animationChoices, scriptJsContent, parsedMenu, seoMap, activeLayoutPresetId, sectionContent]);

  const finalPromptContent = useMemo(() => {
    return generateUltimatePrompt(
      siteDesc,
      structureText,
      activeThemeObject,
      customCss,
      animationChoices,
      scriptJsContent,
      parsedMenu,
      cssFramework === "custom_css",
      seoMap,
      activeLayoutPresetId,
      sectionContent
    );
  }, [siteDesc, structureText, activeThemeObject, customCss, animationChoices, scriptJsContent, parsedMenu, cssFramework, seoMap, activeLayoutPresetId, sectionContent]);

  // Auto trigger file generation in background when prompt is loaded or explicitly clicked
  const handleGenerateAllProjectFiles = async () => {
    setServerMessage(null);
    let allOk = true;
    allOk = await handleSaveFileOnServer("instructions.md", instructionsMdContent) && allOk;
    allOk = await handleSaveFileOnServer("style.css", styleCssContent) && allOk;
    allOk = await handleSaveFileOnServer("script.js", scriptJsContent) && allOk;
    
    if (allOk) {
      setServerMessage({
        text: "Succès ! Les fichiers instructions.md, style.css et script.js ont tous été générés simultanément.",
        error: false
      });
    }
  };

  if (!user && !enableGuestMode) {
    return (
      <LandingPage
        onEnterGuest={() => setEnableGuestMode(true)}
        onLoginSimulate={handleSimulatedLogin}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-800 font-sans flex flex-col antialiased">
      {/* APP HEADER */}
      <header className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center font-bold text-xl font-display shadow-indigo-200 shadow-md">
              H
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-tight text-slate-900 font-display flex items-center gap-1.5">
                HelpMeTo Prompt
                <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  v2.0
                </span>
              </h1>
              <p className="text-[11px] text-slate-400 font-medium">Créateur de Prompt Responsive pour Antigravity</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Nav Tab Controls */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setActiveTab("workspace")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                  activeTab === "workspace" ? "bg-white text-indigo-700 shadow" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                Saisie & Plan de Site
              </button>
              <button
                onClick={() => setActiveTab("live_preview")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                  activeTab === "live_preview" ? "bg-white text-indigo-700 shadow" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                Prévisualisation Interactive
              </button>
              <button
                onClick={() => setActiveTab("user_doc")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                  activeTab === "user_doc" ? "bg-white text-indigo-700 shadow" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                README & Aide CHMOD
              </button>
            </div>

            {/* USER PROFILE STATUS OR GUEST BLOCK */}
            <div className="flex items-center gap-3 border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-4">
              {user ? (
                <div className="flex items-center gap-2.5">
                  <img
                    src={user.avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.name}`}
                    alt={user.name}
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-200"
                  />
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-800 line-clamp-1 max-w-[110px]">{user.name}</div>
                    <div className="text-[9px] text-emerald-600 font-bold flex items-center gap-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                      Espace Cloud
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    title="Se Déconnecter"
                    className="p-1 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-650 cursor-pointer transition"
                  >
                    <LogOut className="w-3.5 h-3.5 text-red-500" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-[9.5px] bg-amber-50 text-amber-700 border border-amber-250 px-2 py-1 rounded-lg font-bold">
                    Mode Invité
                  </span>
                  <button
                    onClick={() => setShowEditorAuthScreen(true)}
                    className="px-3 py-1.5 bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-extrabold rounded-lg hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer flex items-center gap-1.5 shadow"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Connexion</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* CORE WORKSPACE container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 gap-6">
        {/* Permission / Status Panel on top */}
        <PermissionBanner
          filesStatus={filesStatus}
          onRefresh={fetchFilesStatus}
          isLoading={isServerLoading}
        />

        {/* Global Action / Saving Feedback alerts */}
        {serverMessage && (
          <div
            className={`p-4 rounded-xl text-xs font-medium flex items-center justify-between ${
              serverMessage.error
                ? "bg-red-50 text-red-800 border border-red-200"
                : "bg-emerald-50 text-emerald-800 border border-emerald-200"
            }`}
          >
            <div className="flex items-center gap-2">
              {serverMessage.error ? <AlertTriangle className="w-4 h-4 text-red-600" /> : <CheckCircle className="w-4 h-4 text-emerald-600" />}
              <span>{serverMessage.text}</span>
            </div>
            <button onClick={() => setServerMessage(null)} className="font-bold hover:opacity-80">✕</button>
          </div>
        )}

        {/* VIEW 1: CREATION WORKSPACE WIZARD */}
        {activeTab === "workspace" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Nav menu indicator */}
            <div className="lg:col-span-3 bg-white border border-slate-100 rounded-2xl p-4.5 shadow-sm space-y-1.5">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block mb-2 px-1">Étapes de configuration</span>
              
              {[
                { step: 1, label: "1. Idée générale & Vision", color: "indigo" },
                { step: 2, label: "2. Structure du plan de site", color: "indigo" },
                { step: 3, label: "3. Charte des couleurs", color: "indigo" },
                { step: 4, label: "4. CSS & Animations", color: "indigo" },
                { step: 5, label: "5. Sections de page", color: "indigo" },
                { step: 6, label: "6. Paramètres SEO & Prompt", color: "indigo" },
                { step: 7, label: "7. Sauvegarde (Espace Cloud)", color: "indigo" }
              ].map((s) => (
                <button
                  key={s.step}
                  onClick={() => setActiveStep(s.step)}
                  className={`w-full text-left text-xs px-3.5 py-2.5 rounded-xl font-semibold transition cursor-pointer flex items-center justify-between ${
                    activeStep === s.step
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                  }`}
                >
                  <span>{s.label}</span>
                  {activeStep > s.step && (
                    <span className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-[9px] font-bold">✓</span>
                  )}
                </button>
              ))}

              <div className="pt-4 mt-3 border-t border-slate-100">
                <button
                  onClick={handleGenerateAllProjectFiles}
                  disabled={isServerLoading}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 cursor-pointer disabled:opacity-50 transition shadow-sm"
                >
                  <Activity className="w-3.5 h-3.5" />
                  Générer Tout ({parsedMenu.length} pages)
                </button>
              </div>
            </div>

            {/* Right Form Editor Panel */}
            <div className="lg:col-span-9 bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 shadow-sm">
              {/* STEP 1: GENERAL IDEA */}
              {activeStep === 1 && (
                <div className="space-y-5">
                  <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                    <h2 className="text-lg font-bold text-gray-900 font-display">1. Idée Générale & Vision</h2>
                  </div>
                  
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Définissez la thématique générale du site à générer pour Antigravity. Racontez brièvement ce que propose votre marque ou organisme, quelle est sa cible et son esthétique.
                  </p>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <label className="font-bold text-gray-700">Description textuelle de votre vision :</label>
                      <span className="text-gray-400 font-mono">{siteDesc.length} caractères</span>
                    </div>

                    <textarea
                      value={siteDesc}
                      onChange={(e) => setSiteDesc(e.target.value)}
                      rows={6}
                      className="w-full text-sm border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl p-4 text-gray-800 bg-white leading-relaxed"
                      placeholder="Décrivez votre site internet ici..."
                    />
                  </div>

                  <div className="pt-3 flex justify-between items-center">
                    <span className="text-[11px] text-gray-400 italic">Astuce : Soyez précis pour obtenir un prompt de structure optimal !</span>
                    <button
                      onClick={() => setActiveStep(2)}
                      className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition cursor-pointer"
                    >
                      Étape suivante : Structure
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: STRUCTURE */}
              {activeStep === 2 && (
                <div className="space-y-5">
                  <MenuEditor
                    structureText={structureText}
                    onStructureChange={setStructureText}
                    parsedMenu={parsedMenu}
                  />

                  <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                    <button
                      onClick={() => setActiveStep(1)}
                      className="text-xs font-semibold text-gray-500 hover:text-gray-700 underline"
                    >
                      Retour
                    </button>
                    
                    <button
                      onClick={() => setActiveStep(3)}
                      className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition cursor-pointer"
                    >
                      Étape suivante : Palette
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: COLOR PALETTE */}
              {activeStep === 3 && (
                <div className="space-y-5">
                  <ThemeSelector
                    selectedThemeId={selectedThemeId}
                    onSelectTheme={handleSelectTheme}
                    bgColor={bgColor}
                    onChangeBgColor={setBgColor}
                    textColor={textColor}
                    onChangeTextColor={setTextColor}
                    accentColor={accentColor}
                    onChangeAccentColor={setAccentColor}
                    navBgColor={navBgColor}
                    onChangeNavBgColor={setNavBgColor}
                    footerBgColor={footerBgColor}
                    onChangeFooterBgColor={setFooterBgColor}
                  />

                  <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                    <button
                      onClick={() => setActiveStep(2)}
                      className="text-xs font-semibold text-gray-500 hover:text-gray-700 underline"
                    >
                      Retour
                    </button>
                    
                    <button
                      onClick={() => setActiveStep(4)}
                      className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition cursor-pointer"
                    >
                      Étape suivante : CSS & Animations
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: CSS FRAMEWORKS & ANIMATIONS */}
              {activeStep === 4 && (
                <div className="space-y-5">
                  <AnimationPlanner
                    cssFramework={cssFramework}
                    onFrameworkChange={setCssFramework}
                    customCss={customCss}
                    onCustomCssChange={setCustomCss}
                    menuItems={parsedMenu}
                    animationChoices={animationChoices}
                    onAnimationChange={(pageId, effect) => {
                      setAnimationChoices((p) => ({ ...p, [pageId]: effect }));
                    }}
                  />

                  <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                    <button
                      onClick={() => setActiveStep(3)}
                      className="text-xs font-semibold text-gray-500 hover:text-gray-700 underline"
                    >
                      Retour
                    </button>
                    
                    <button
                      onClick={() => setActiveStep(5)}
                      className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition cursor-pointer"
                    >
                      Étape suivante : Sections de page
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 5: SECTIONS SELECTOR */}
              {activeStep === 5 && (
                <div className="space-y-6">
                  <SectionSelector
                    menuItems={parsedMenu}
                    onToggleSection={handleToggleSection}
                    selectedLayoutId={activeLayoutPresetId}
                    onSelectLayout={setActiveLayoutPresetId}
                    sectionContent={sectionContent}
                    onUpdateContent={(updated) => setSectionContent((prev) => ({ ...prev, ...updated }))}
                  />

                  <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
                    <button
                      onClick={() => setActiveStep(4)}
                      className="text-xs font-semibold text-gray-500 hover:text-gray-700 underline"
                    >
                      Retour
                    </button>
                    
                    <button
                      onClick={() => setActiveStep(6)}
                      className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition cursor-pointer"
                    >
                      Étape suivante : SEO & Prompt final
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 6: SEO SETTINGS & PROMPT GENERATION */}
              {activeStep === 6 && (
                <div className="space-y-6">
                  <SeoSettings
                    menuItems={parsedMenu}
                    seoMap={seoMap}
                    onSeoChange={handleSeoChange}
                  />

                  <div className="pt-6 border-t border-gray-100">
                    <PromptDisplay
                      finalPrompt={finalPromptContent}
                      instructionsMd={instructionsMdContent}
                      styleCss={styleCssContent}
                      scriptJs={scriptJsContent}
                      onSaveFileOnServer={handleSaveFileOnServer}
                      isSaving={isServerLoading}
                    />
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex justify-between">
                    <button
                      onClick={() => setActiveStep(5)}
                      className="text-xs font-semibold text-gray-500 hover:text-gray-700 underline"
                    >
                      Retour
                    </button>
                    
                    <button
                      onClick={() => {
                        setActiveStep(7);
                      }}
                      className="inline-flex items-center gap-1 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow transition cursor-pointer"
                    >
                      Étape suivante : Sauvegarde Cloud
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 7: CLOUD STORAGE */}
              {activeStep === 7 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                    <Cloud className="w-5 h-5 text-indigo-650 animate-pulse" />
                    <h2 className="text-lg font-bold text-gray-900 font-display">7. Sauvegarde & Historique Cloud</h2>
                  </div>
                  
                  <p className="text-sm text-gray-650 leading-relaxed font-sans">
                    Sauvegardez l'ensemble de votre configuration actuelle (Vision, Menu sémantique, Palette, Custom CSS, Animations, Sections de page et SEO) pour pouvoir la restaurer plus tard d'un simple clic.
                  </p>

                  <SavedPromptsManager
                    user={user}
                    onShowConnexion={() => {
                      setShowEditorAuthScreen(true);
                    }}
                    activeState={{
                      siteDesc,
                      structureText,
                      selectedThemeId,
                      cssFramework,
                      customCss,
                      animationChoices,
                      sectionsMap,
                      seoMap,
                      activeLayoutPresetId,
                      sectionContent
                    }}
                    onLoadPrompt={handleLoadPromptState}
                  />

                  <div className="pt-6 border-t border-gray-100 flex justify-between">
                    <button
                      onClick={() => setActiveStep(6)}
                      className="text-xs font-semibold text-gray-500 hover:text-gray-700 underline"
                    >
                      Retour
                    </button>
                    
                    <button
                      onClick={() => {
                        setActiveTab("live_preview");
                      }}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-905 hover:bg-slate-805 text-white font-bold text-xs shadow-md transition cursor-pointer"
                    >
                      <Play className="w-4 h-4 text-emerald-450 fill-emerald-405 mr-1" />
                      Visionner le Rendu Interactif
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 2: LIVE SIMULATOR PREVIEW */}
        {activeTab === "live_preview" && (
          <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
            <InteractivePreview
              menuItems={parsedMenu}
              theme={activeThemeObject}
              bgColor={bgColor}
              textColor={textColor}
              accentColor={accentColor}
              navBgColor={navBgColor}
              footerBgColor={footerBgColor}
              cssFramework={cssFramework}
              animationChoices={animationChoices}
              seoMap={seoMap}
              finalPrompt={finalPromptContent}
              layoutPresetId={activeLayoutPresetId}
              sectionContent={sectionContent}
            />
          </div>
        )}

        {/* VIEW 3: README & HELP CHMOD DOCUMENTATION */}
        {activeTab === "user_doc" && (
          <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-gray-900 font-display">Aide d'utilisation & Directives CHMOD</h2>
            </div>

            <div className="prose prose-slate max-w-none text-sm text-gray-600 leading-relaxed font-sans space-y-4">
              <h3 className="text-base font-bold text-slate-900 font-display">Objectif de l'application HelpMeTo Prompt</h3>
              <p>
                L'application **HelpMeTo Prompt** permet de structurer au millimètre près l'architecture sémantique et la charte graphique de n'importe quel site internet responsive de manière visuelle et interactive, avant d'en assembler le prompt universel parfait.
              </p>

              <h3 className="text-base font-bold text-slate-900 font-display">Étapes d'utilisation pas à pas</h3>
              <ol className="list-decimal pl-5 space-y-2.5">
                <li>
                  <strong>Visionner votre Idée :</strong> Renseignez dans le textarea l'objectif du site, les fonctionnalités requises et les messages d'impact. C'est ce texte qui servira à initialiser le fichier centralisé <code className="bg-gray-100 font-mono px-1 py-0.5 rounded font-semibold text-indigo-600">instructions.md</code>.
                </li>
                <li>
                  <strong>Structurer le Menu :</strong> Utilisez des tirets unifiés d'indentation (<code className="bg-gray-100 font-mono px-1 py-0.5 rounded font-bold">-</code> pour un lien de premier niveau et <code className="bg-gray-100 font-mono px-1 py-0.5 rounded font-bold">--</code> pour un sous-menu imbriqué) pour dessiner l'arborescence des onglets de votre barre d'outils responsive.
                </li>
                <li>
                  <strong>Choisir un Thème Inspirant :</strong> Optez pour des presets harmonieux (Minimaliste, Professionnel, Créatif) ou éditez manuellement les couleurs de fond et de texte pour un design unique.
                </li>
                <li>
                  <strong>Animer les rubriques :</strong> Assignez des effets de translation ou de fondu (Fade-In, Slide-Up, Pop-In, Slide-Left) pour chaque page détectée. Ceci assemblera en direct le code de votre futur fichier <code className="bg-gray-100 font-mono px-1 py-0.5 rounded font-semibold text-indigo-600">script.js</code>.
                </li>
                <li>
                  <strong>Agencer les composants & Générer le Prompt :</strong> Précisez les blocs indispensables (Header, Carrousel, Formulaire, Pied de page) pour chaque page et récupérez d'un simple clic le prompt à copier-coller dans votre IA générative préférée !
                </li>
              </ol>

              <div className="bg-yellow-50 border border-yellow-250 p-4 rounded-xl space-y-2 mt-4">
                <h4 className="text-sm font-bold text-yellow-800 flex items-center gap-1">
                  <Shield className="w-4 h-4 text-yellow-700" />
                  Guide Technique de configuration des permissions CHMOD
                </h4>
                <p className="text-xs text-yellow-905 leading-relaxed">
                  Lorsque l'application s'exécute dans un conteneur d'évaluation ou en mode sandbox, le serveur d'arrière-plan tente de modifier directement les fichiers de votre espace de travail. Si les permissions d'administration d'écriture locales manquent, les fichiers ne pourront s'implanter.
                </p>
                <p className="text-xs text-yellow-905">
                  <strong>Pour corriger cela de façon permanente :</strong> Ouvrez le terminal système rattaché à l'éditeur et passez la commande de droit ci-dessous :
                </p>
                <pre className="bg-slate-900 border border-slate-950 text-indigo-300 font-mono p-2.5 rounded text-xs select-all">
                  chmod 644 instructions.md style.css script.js
                </pre>
                <p className="text-xs text-slate-500 italic mt-1 font-sans">
                  En environnement standard, un CHMOD de 644 (ou 777) accorde les privilèges suffisants d'écriture et d'analyse.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-100 py-6 mt-12 text-center text-xs text-slate-400 select-none">
        <div className="max-w-7xl mx-auto px-4">
          <p>© {new Date().getFullYear()} HelpMeTo Prompt — Conçu pour l'assemblage UX d'Antigravity.</p>
        </div>
      </footer>

      {/* LOCAL LOGIN MODAL FROM EDITOR WORKSPACE */}
      {showEditorAuthScreen && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-[#141f36] border border-slate-800 rounded-3xl max-w-sm w-full p-6 sm:p-7 space-y-5 relative shadow-2xl">
            <button
              onClick={() => { if (!activeEditorProvider) setShowEditorAuthScreen(false); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white font-bold cursor-pointer transition text-base disabled:opacity-30"
              disabled={activeEditorProvider !== null}
            >
              ✕
            </button>

            <div className="text-center space-y-2">
              <div className="mx-auto h-11 w-11 bg-gradient-to-tr from-indigo-500 to-emerald-500 text-white rounded-xl flex items-center justify-center font-black text-lg shadow-md">
                H
              </div>
              <h3 className="text-base font-black text-white">Espace de Connexion</h3>
              <p className="text-xs text-slate-400">
                Associez vos configurations de prompts à votre propre profil cloud sécurisé pour sauvegarder et échanger vos modèles.
              </p>
            </div>

            {activeEditorProvider ? (
              <div className="py-6 text-center space-y-4">
                <div className="relative inline-flex items-center justify-center">
                  <div className="w-10 h-10 border-3 border-indigo-505 border-t-indigo-500 rounded-full animate-spin" />
                  <div className="absolute text-[10px] font-extrabold text-indigo-400 animate-pulse font-mono">
                    {editorSimulatedStep * 33}%
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-200">
                    Négociation avec <span className="text-indigo-400">{activeEditorProvider}</span>...
                  </p>
                  <p className="text-[9.5px] text-slate-400 font-mono">
                    {editorSimulatedStep === 1 && "➜ Initialisation de la session de confiance..."}
                    {editorSimulatedStep === 2 && "➜ Synchronisation du profil et clés d'écriture..."}
                    {editorSimulatedStep === 3 && "➜ Session sémantique cloud active !"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5">
                {[
                  { id: "google", name: "Google", email: "alex.mercer@gmail.com", user: "Alex Mercer" },
                  { id: "microsoft", name: "Microsoft", email: "s.connors@outlook.com", user: "Sarah Connors" },
                  { id: "apple", name: "Apple", email: "j.dupont@icloud.com", user: "Jean Dupont" },
                  { id: "facebook", name: "Facebook", email: "zuck@fb.com", user: "Marc Zuckerberg" },
                  { id: "linkedin", name: "LinkedIn", email: "elena.rostova@linkedin.com", user: "Elena Rostova" }
                ].map((prov) => (
                  <button
                    key={prov.id}
                    onClick={() => {
                      setActiveEditorProvider(prov.name);
                      setEditorSimulatedStep(1);
                      setTimeout(() => {
                        setEditorSimulatedStep(2);
                        setTimeout(() => {
                          setEditorSimulatedStep(3);
                          setTimeout(() => {
                            handleSimulatedLogin(prov.id, prov.email, prov.user);
                            setShowEditorAuthScreen(false);
                            setActiveEditorProvider(null);
                            setEditorSimulatedStep(0);
                          }, 1100);
                        }, 900);
                      }, 750);
                    }}
                    className="w-full py-2.5 px-3 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-bold text-slate-100 rounded-xl transition cursor-pointer text-center"
                  >
                    Se connecter avec {prov.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
