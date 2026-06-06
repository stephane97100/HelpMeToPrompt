import { useState, useEffect } from "react";
import { Monitor, Tablet, Smartphone, Sparkles, Send, ChevronLeft, ChevronRight, Menu, HelpCircle, Flame, FileText, CheckCircle2, Info, LayoutTemplate } from "lucide-react";
import { MenuItem, DesignTheme, SectionContent } from "../types";

interface InteractivePreviewProps {
  menuItems: MenuItem[];
  theme: DesignTheme;
  bgColor: string;
  textColor: string;
  accentColor: string;
  navBgColor: string;
  footerBgColor: string;
  cssFramework: string;
  animationChoices: Record<string, string>;
  seoMap?: Record<string, { title: string; description: string }>;
  finalPrompt?: string;
  layoutPresetId?: "one_column" | "two_column" | "magazine";
  sectionContent?: SectionContent;
}

export default function InteractivePreview({
  menuItems,
  theme,
  bgColor,
  textColor,
  accentColor,
  navBgColor,
  footerBgColor,
  cssFramework,
  animationChoices,
  seoMap = {},
  finalPrompt = "",
  layoutPresetId = "one_column",
  sectionContent
}: InteractivePreviewProps) {
  // Available screen sizes / breakpoints
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [activePageId, setActivePageId] = useState<string>("");
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [triggerAnimMessage, setTriggerAnimMessage] = useState<string>("");
  const [showMobileNav, setShowMobileNav] = useState(false);

  // Synchronize state: fall back to the first available parsed page if current active doesn't exist
  useEffect(() => {
    if (menuItems.length > 0) {
      // Find matches
      const exists = menuItems.some(i => i.id === activePageId || i.subItems.some(sub => sub.id === activePageId));
      if (!exists) {
        setActivePageId(menuItems[0].id);
      }
    } else {
      setActivePageId("");
    }
  }, [menuItems, activePageId]);

  // Find active page structural sections
  let activePageLabel = "Accueil";
  let activeSections: string[] = ["header", "hero", "cards", "footer"];

  if (activePageId) {
    const l1 = menuItems.find(item => item.id === activePageId);
    if (l1) {
      activePageLabel = l1.label;
      activeSections = l1.sections;
    } else {
      for (const item of menuItems) {
        const l2 = item.subItems.find(sub => sub.id === activePageId);
        if (l2) {
          activePageLabel = l2.label;
          activeSections = l2.sections;
          break;
        }
      }
    }
  }

  // Trigger floating logs to preview selected script.js animations behavior!
  useEffect(() => {
    if (activePageId) {
      const activeEffect = animationChoices[activePageId] || "fade-in";
      setTriggerAnimMessage(`[JS.script] Animation "${activeEffect}" déclenchée pour #${activePageId}`);
      const t = setTimeout(() => setTriggerAnimMessage(""), 3500);
      return () => clearTimeout(t);
    }
  }, [activePageId, animationChoices]);

  // Carousel slider data (customized or default fallbacks)
  const carouselSlides = sectionContent?.carouselSlides || [
    { title: "Innover et Concevoir", text: "Nous façonnons des expériences utilisateur mémorables et ultra fluides.", imageFile: "" },
    { title: "Rapidité sans faille", text: "Chaque milli-seconde est optimisée client-side grâce au responsive Antigravity.", imageFile: "" },
    { title: "Vision Responsive", text: "S'adapte dynamiquement de l'iPhone Mini jusqu'aux écrans 4K.", imageFile: "" }
  ];

  // Client-side PDF-friendly summary sheet extraction
  const handleExportPdf = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Le bloqueur de fenêtres contextuelles empêche l'exportation. Veuillez autoriser les popups dans votre navigateur.");
      return;
    }

    // Generate swatches with true colored squares using page settings
    const swatchesHtml = `
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-top: 15px;">
        <div style="border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px; display: flex; align-items: center; gap: 12px; background-color: #fafbfd;">
          <div style="width: 38px; height: 38px; border-radius: 8px; background-color: ${bgColor}; border: 1px solid #cbd5e1; box-shadow: inset 0 2px 4px rgba(0,0,0,0.06);"></div>
          <div>
            <div style="font-size: 10px; color: #64748b; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em;">Fond (Background)</div>
            <div style="font-family: monospace; font-size: 13px; font-weight: bold; color: #1e293b;">${bgColor}</div>
          </div>
        </div>
        <div style="border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px; display: flex; align-items: center; gap: 12px; background-color: #fafbfd;">
          <div style="width: 38px; height: 38px; border-radius: 8px; background-color: ${textColor}; border: 1px solid #cbd5e1; box-shadow: inset 0 2px 4px rgba(0,0,0,0.06);"></div>
          <div>
            <div style="font-size: 10px; color: #64748b; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em;">Texte Principal</div>
            <div style="font-family: monospace; font-size: 13px; font-weight: bold; color: #1e293b;">${textColor}</div>
          </div>
        </div>
        <div style="border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px; display: flex; align-items: center; gap: 12px; background-color: #fafbfd;">
          <div style="width: 38px; height: 38px; border-radius: 8px; background-color: ${accentColor}; border: 1px solid #cbd5e1; box-shadow: inset 0 2px 4px rgba(0,0,0,0.06);"></div>
          <div>
            <div style="font-size: 10px; color: #64748b; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em;">Couleur d'Accent (CTA)</div>
            <div style="font-family: monospace; font-size: 13px; font-weight: bold; color: #1e293b;">${accentColor}</div>
          </div>
        </div>
        <div style="border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px; display: flex; align-items: center; gap: 12px; background-color: #fafbfd;">
          <div style="width: 38px; height: 38px; border-radius: 8px; background-color: ${navBgColor}; border: 1px solid #cbd5e1; box-shadow: inset 0 2px 4px rgba(0,0,0,0.06);"></div>
          <div>
            <div style="font-size: 10px; color: #64748b; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em;">Barre Navigation</div>
            <div style="font-family: monospace; font-size: 13px; font-weight: bold; color: #1e293b;">${navBgColor}</div>
          </div>
        </div>
        <div style="border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px; display: flex; align-items: center; gap: 12px; background-color: #fafbfd;">
          <div style="width: 38px; height: 38px; border-radius: 8px; background-color: ${footerBgColor}; border: 1px solid #cbd5e1; box-shadow: inset 0 2px 4px rgba(0,0,0,0.06);"></div>
          <div>
            <div style="font-size: 10px; color: #64748b; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em;">Pied de page (Footer)</div>
            <div style="font-family: monospace; font-size: 13px; font-weight: bold; color: #1e293b;">${footerBgColor}</div>
          </div>
        </div>
      </div>
    `;

    // Generate menu structure with layout sections and page-specific SEO titles/descriptions
    const menuStructureHtml = menuItems.map(item => {
      const activeSecs = item.sections.map(s => `
        <span style="background-color: #f1f5f9; color: #334155; padding: 3px 8px; border-radius: 6px; font-size: 9.5px; font-family: 'JetBrains Mono', monospace; font-weight: bold; border: 1px solid #e2e8f0; margin-right: 5px; display: inline-block; margin-bottom: 4px;">
          ${s.toUpperCase()}
        </span>
      `).join("");
      
      const subItemsHtml = item.subItems.length > 0 
        ? `<div style="margin-left: 24px; border-left: 2.5px solid #e2e8f0; padding-left: 16px; margin-top: 10px; margin-bottom: 10px;">
            ${item.subItems.map(sub => {
              const subSecs = sub.sections.map(s => `
                <span style="background-color: #f1f5f9; color: #334155; padding: 3px 8px; border-radius: 6px; font-size: 9.5px; font-family: 'JetBrains Mono', monospace; font-weight: bold; border: 1px solid #e2e8f0; margin-right: 5px; display: inline-block; margin-bottom: 4px;">
                  ${s.toUpperCase()}
                </span>
              `).join("");
              const subSeo = seoMap[sub.id] || { title: `${sub.label} | Mon Site`, description: `Découvrez la page de ${sub.label}.` };
              return `
                <div style="margin-bottom: 12px; page-break-inside: avoid;">
                  <strong style="font-size: 12.5px; color: #334155;">↳ Sous-page : ${sub.label}</strong> 
                  <span style="color: #94a3b8; font-size: 11px; font-family: 'JetBrains Mono', monospace;">(#${sub.id})</span>
                  <div style="margin-top: 4px;">${subSecs}</div>
                  <div style="font-size: 11px; color: #475569; margin-top: 6px; background: #fafafc; border: 1px solid #f1f5f9; padding: 8px 12px; border-radius: 8px; line-height: 1.4;">
                    <div style="margin-bottom: 2px;">📄 <strong style="color: #0f172a;">SEO Title:</strong> ${subSeo.title}</div>
                    <div>🔗 <strong style="color: #0f172a;">Meta Description:</strong> ${subSeo.description}</div>
                  </div>
                </div>
              `;
            }).join("")}
           </div>`
        : "";

      const seo = seoMap[item.id] || { title: `${item.label} | Mon Site`, description: `Découvrez la page de ${item.label}.` };

      return `
        <div style="border-bottom: 1px solid #f1f5f9; padding-bottom: 14px; margin-bottom: 14px; page-break-inside: avoid;">
          <div style="font-size: 14px; color: #1e293b; font-weight: bold;">
            Page : ${item.label} <span style="color: #94a3b8; font-family: 'JetBrains Mono', monospace; font-weight: normal; font-size: 11.5px;">(#${item.id})</span>
          </div>
          <div style="margin-top: 6px;">${activeSecs}</div>
          <div style="font-size: 11px; color: #475569; margin-top: 6px; background: #fdfdfe; border: 1px solid #f1f5f9; padding: 10px 12px; border-radius: 8px; line-height: 1.4;">
            <div style="margin-bottom: 3px;">📄 <strong style="color: #0f172a;">SEO Title:</strong> ${seo.title}</div>
            <div>🔗 <strong style="color: #0f172a;">Meta Description:</strong> ${seo.description}</div>
          </div>
          ${subItemsHtml}
        </div>
      `;
    }).join("");

    const escapedPrompt = finalPrompt
      ? finalPrompt
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;")
      : "Le prompt final n'a pas encore été généré. Veuillez d'abord remplir les étapes de l'espace de travail.";

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Recapitulatif Projet - HelpMeTo Prompt</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
            
            body {
              font-family: 'Inter', sans-serif;
              color: #1e293b;
              line-height: 1.5;
              padding: 40px;
              max-width: 850px;
              margin: 0 auto;
              background-color: #ffffff;
            }
            
            h1, h2, h3, h4 {
              font-family: 'Inter', sans-serif;
              color: #0f172a;
              margin-top: 0;
            }
            
            .header-info {
              border-bottom: 3px solid #4f46e5;
              padding-bottom: 20px;
              margin-bottom: 30px;
              display: flex;
              align-items: center;
              justify-content: space-between;
            }
            
            .logo {
              font-weight: 800;
              font-size: 24px;
              color: #4f46e5;
              text-transform: uppercase;
              letter-spacing: -0.04em;
            }
            
            .meta-date {
              text-align: right;
              font-size: 11.5px;
              color: #64748b;
              line-height: 1.4;
            }
            
            .section-card {
              border: 1px solid #e2e8f0;
              border-radius: 12px;
              padding: 22px;
              margin-bottom: 25px;
              page-break-inside: avoid;
              background-color: #ffffff;
            }
            
            .section-title {
              font-weight: 700;
              font-size: 15px;
              border-bottom: 1.5px solid #f1f5f9;
              padding-bottom: 10px;
              margin-bottom: 15px;
              color: #4f46e5;
              display: flex;
              align-items: center;
              gap: 8px;
              text-transform: uppercase;
              letter-spacing: 0.02em;
            }
            
            .prompt-block {
              font-family: 'JetBrains Mono', monospace;
              font-size: 11px;
              background-color: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              padding: 18px;
              white-space: pre-wrap;
              color: #334155;
              word-break: break-all;
              line-height: 1.55;
            }
            
            @media print {
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              body {
                padding: 15px;
              }
              .section-card {
                border: 1px solid #cbd5e1 !important;
              }
            }
          </style>
        </head>
        <body>
          <div class="header-info">
            <div>
              <div class="logo">HelpMeTo Prompt</div>
              <div style="font-size: 12px; color: #64748b; font-weight: 550; margin-top: 3px;">Rapport récapitulatif de conception de site web</div>
            </div>
            <div class="meta-date">
              <div>Exporté le : <strong>${new Date().toLocaleDateString("fr-FR")}</strong></div>
              <div>Outil de rendu : <strong>Antigravity Ready</strong></div>
            </div>
          </div>
          
          <div class="section-card">
            <div class="section-title">🎨 Identité Visuelle &amp; Palette de couleurs</div>
            <p style="font-size: 13px; color: #475569; margin-top: 0; margin-bottom: 12px;">
              Les couleurs configurées ci-dessous ont été validées pour l'agencement du dôme sémantique :
            </p>
            ${swatchesHtml}
          </div>
          
          <div class="section-card">
            <div class="section-title">📐 Structure Arborescente, Sections &amp; Paramètres SEO</div>
            <p style="font-size: 13px; color: #475569; margin-top: 0; margin-bottom: 15px;">
              Organisation hiérarchique des pages et des sous-pages avec leur plan de sections et balises de référencement naturel configurées :
            </p>
            ${menuStructureHtml}
          </div>
          
          <div class="section-card" style="page-break-before: always; page-break-inside: auto;">
            <div class="section-title">📋 Prompt Universel Développeur (AI Ready)</div>
            <p style="font-size: 13px; color: #475569; margin-top: 0; margin-bottom: 15px;">
              Copiez ce prompt technique complet pour concevoir instantanément ce site web autonome dans votre canevas IA :
            </p>
            <div class="prompt-block">${escapedPrompt}</div>
          </div>
          
          <div style="text-align: center; color: #94a3b8; font-size: 11px; margin-top: 40px; border-top: 1px solid #f1f5f9; padding-top: 20px;">
            Fiche éditée avec succès par l'application HelpMeTo Prompt — Tous droits réservés.
          </div>

          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 300);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-3 gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900 font-display flex items-center gap-1.5">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            Prévisualisation Interactive
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">Testez l'adaptabilité, les couleurs et la sémantique de votre futur site.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Export PDF Button */}
          <button
            onClick={handleExportPdf}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs cursor-pointer shadow-sm transition active:scale-95 select-none"
          >
            <FileText className="w-3.5 h-3.5" />
            Exporter en PDF
          </button>

          {/* Responsive Viewport Selectors */}
          <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
            <button
              onClick={() => { setViewport("desktop"); setShowMobileNav(false); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${
                viewport === "desktop" ? "bg-white text-indigo-700 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              Desktop
            </button>
            
            <button
              onClick={() => { setViewport("tablet"); setShowMobileNav(false); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${
                viewport === "tablet" ? "bg-white text-indigo-700 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
              Tablet
            </button>
            
            <button
              onClick={() => { setViewport("mobile"); setShowMobileNav(false); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${
                viewport === "mobile" ? "bg-white text-indigo-700 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              Mobile
            </button>
          </div>
        </div>
      </div>

      {/* Floating simulator details and status badge */}
      <div className="flex justify-between items-center bg-indigo-50 px-4 py-2.5 rounded-xl border border-indigo-100/60 text-xs text-indigo-900/80">
        <div className="flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-orange-500" />
          <span>Fiche : <strong className="font-bold">{activePageLabel}</strong> — Mode d'animation actif : <strong className="font-bold uppercase text-indigo-700">{animationChoices[activePageId] || "fade-in"}</strong></span>
        </div>
        <span className="text-[10px] bg-indigo-600 text-white font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">
          Framework: {cssFramework.toUpperCase()}
        </span>
      </div>

      {/* HTML elements explanation */}
      <div className="text-[10.5px] text-gray-500 bg-gray-50 rounded-lg p-2.5 border border-dashed border-gray-200 leading-normal">
        🔥 <strong>Contrôle de conformité de style :</strong> Les liens hypertextes du menu ci-dessous sont injectés dans la balise <code className="bg-gray-100 font-bold px-1 rounded">.nav</code>. De la même façon, les sections intègrent de la sémantique de classe <code className="bg-gray-100 font-bold px-1 rounded">.section</code> et le footer utilise <code className="bg-gray-100 font-bold px-1 rounded">.footer</code>, répondant exactement aux directives.
      </div>

      {/* Responsive frame simulator */}
      <div className="flex justify-center items-center bg-gray-100/70 p-6 rounded-2xl border border-gray-200 outline-dashed outline-1 outline-gray-200 overflow-hidden relative min-h-[500px]">
        {/* Floating Animation Trigger Banner */}
        {triggerAnimMessage && (
          <div className="absolute top-4 left-4 z-40 bg-slate-900 border border-slate-700 text-emerald-400 text-[10.5px] font-mono px-3 py-1.5 rounded-lg shadow-xl flex items-center gap-1.5 animate-bounce">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {triggerAnimMessage}
          </div>
        )}

        <div
          className={`bg-white shadow-2xl transition-all duration-300 overflow-hidden relative flex flex-col justify-between ${
            viewport === "mobile"
              ? "w-[360px] h-[640px] rounded-[36px] border-[12px] border-slate-900 shadow-2xl"
              : viewport === "tablet"
              ? "w-[720px] min-h-[550px] rounded-2xl border border-gray-300"
              : "w-full max-w-[1020px] min-h-[550px] rounded-xl border border-gray-300"
          }`}
          style={{ backgroundColor: bgColor }}
        >
          {/* If mobile, draw smartphone top ear speaker cutout */}
          {viewport === "mobile" && (
            <div className="absolute top-[2px] left-1/2 -translate-x-1/2 w-32 h-4.5 bg-slate-900 rounded-b-xl z-50 flex items-center justify-center">
              <span className="w-10 h-1 bg-slate-800 rounded-full" />
              <span className="w-2 h-2 bg-slate-800 rounded-full ml-2" />
            </div>
          )}

          {/* SIMULATED WEBSITE BODY */}
          <div className="flex-1 flex flex-col justify-between overflow-y-auto">
            {menuItems.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center" style={{ color: textColor }}>
                <p className="text-sm font-bold font-display">Aucune page à simuler pour l'instant.</p>
                <p className="text-xs opacity-75 mt-1 max-w-sm leading-normal">Configurez votre structure de plan de site à l'étape 2.</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col">
                {/* 1. HEADER & .NAV SECTION */}
                {activeSections.includes("header") && (
                  <header
                    className="sticky top-0 z-40 px-5 py-3.5 flex items-center justify-between border-b border-black/5"
                    style={{ backgroundColor: navBgColor, color: textColor }}
                  >
                    <div className="font-bold font-display text-sm flex items-center gap-2">
                      {sectionContent?.headerLogoFile ? (
                        <img
                          src={sectionContent.headerLogoFile}
                          alt="Logo"
                          className="h-6 w-auto max-w-[100px] object-contain rounded"
                          onError={(e) => { (e.currentTarget as any).style.display = "none"; }}
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span className="h-5 w-5 rounded bg-indigo-600 text-white flex items-center justify-center text-[10px] font-mono leading-none">
                          {sectionContent?.headerLogoText ? sectionContent.headerLogoText.charAt(0) : "S"}
                        </span>
                      )}
                      <span>{sectionContent?.headerLogoText || "SiteUX"}</span>
                    </div>

                    {/* Responsive Nav Links for Desktop/Tablet */}
                    {viewport !== "mobile" ? (
                      <nav className="flex items-center gap-4 text-xs font-semibold">
                        {menuItems.map((item) => {
                          const isActive = activePageId === item.id;
                          const hasSub = item.subItems.length > 0;
                          return (
                            <div key={item.id} className="relative group">
                              <button
                                onClick={() => setActivePageId(item.id)}
                                className="flex items-center gap-0.5 hover:opacity-85 pb-1 relative cursor-pointer"
                              >
                                <span style={{ color: isActive ? accentColor : textColor }}>{item.label}</span>
                                {hasSub && <span className="text-[9px] opacity-70">▾</span>}
                                {isActive && (
                                  <span
                                    className="absolute bottom-0 left-0 right-0 h-0.5"
                                    style={{ backgroundColor: accentColor }}
                                  />
                                )}
                              </button>

                              {/* Hover dropdown list if hasSub */}
                              {hasSub && (
                                <div
                                  className="absolute top-full left-0 mt-1 bg-white border border-gray-150 rounded-lg shadow-lg py-1.5 min-w-[140px] hidden group-hover:block text-left text-[11px] z-50 text-gray-800"
                                >
                                  {item.subItems.map((sub) => (
                                    <button
                                      key={sub.id}
                                      onClick={() => setActivePageId(sub.id)}
                                      className="w-full text-left px-3 py-1.5 hover:bg-gray-100 transition font-medium cursor-pointer"
                                    >
                                      {sub.label}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </nav>
                    ) : (
                      /* Mobile Hamburger mock icon */
                      <button
                        onClick={() => setShowMobileNav(!showMobileNav)}
                        className="p-1 rounded border border-gray-300 hover:bg-gray-50/20 cursor-pointer"
                      >
                        <Menu className="w-4 h-4" />
                      </button>
                    )}
                  </header>
                )}

                {/* Simulated mobile menu Drawer */}
                {showMobileNav && viewport === "mobile" && (
                  <div
                    className="absolute top-12 left-0 right-0 bg-white border-b border-gray-200 p-4 shadow-xl z-50 flex flex-col gap-2.5 text-xs font-semibold"
                    style={{ backgroundColor: navBgColor, color: textColor }}
                  >
                    {menuItems.map((item) => (
                      <div key={item.id} className="space-y-1">
                        <button
                          onClick={() => {
                            setActivePageId(item.id);
                            setShowMobileNav(false);
                          }}
                          className="w-full text-left"
                          style={{ color: activePageId === item.id ? accentColor : textColor }}
                        >
                          {item.label}
                        </button>

                        {item.subItems.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => {
                              setActivePageId(sub.id);
                              setShowMobileNav(false);
                            }}
                            className="w-full text-left pl-3 text-[11px] opacity-80"
                            style={{ color: activePageId === sub.id ? accentColor : textColor }}
                          >
                            ↳ {sub.label}
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                )}

                {/* 2. MAIN WEBSITE BODY (HANDLING TWO_COLUMN GRID STYLE) */}
                <div className={`flex-1 flex flex-col ${viewport !== "mobile" && layoutPresetId === "two_column" ? "md:grid md:grid-cols-12 md:items-stretch" : ""}`}>
                  
                  {/* Two Column Layout Sidebar Widget */}
                  {viewport !== "mobile" && layoutPresetId === "two_column" && (
                    <aside
                      className="md:col-span-3 border-r border-black/5 p-4 space-y-4 text-xs font-semibold select-none flex flex-col justify-between"
                      style={{ backgroundColor: navBgColor, color: textColor }}
                    >
                      <div className="space-y-4">
                        <div>
                          <p className="text-[10px] uppercase font-mono tracking-wider opacity-60 flex items-center gap-1">
                            <LayoutTemplate className="w-3 h-3 text-indigo-500 animate-pulse" />
                            Explorateur
                          </p>
                          <ul className="mt-2 space-y-1.5">
                            {menuItems.map((item) => {
                              const isActive = activePageId === item.id;
                              return (
                                <li key={item.id}>
                                  <button
                                    onClick={() => setActivePageId(item.id)}
                                    className="w-full text-left hover:opacity-80 transition text-[11.5px]"
                                    style={{ color: isActive ? accentColor : textColor }}
                                  >
                                    • {item.label}
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                        <div className="pt-2 border-t border-black/5">
                          <p className="text-[10.5px] font-bold text-indigo-600 tracking-tight flex items-center gap-1 leading-none mb-1">
                            <Info className="w-3.5 h-3.5" />
                            Directives SEO
                          </p>
                          <p className="text-[9.5px] opacity-75 font-normal leading-normal">
                            Plan d'agencement à sidebar optimisé pour l'accessibilité écran.
                          </p>
                        </div>
                      </div>
                      
                      <div className="p-2 bg-black/5 border border-black/5 rounded-lg text-[9px] font-mono opacity-80 leading-snug">
                        SECURE_ANTIGRAVITY_PORTAL
                      </div>
                    </aside>
                  )}

                  {/* Main contents block */}
                  <main className={`flex-1 flex flex-col ${viewport !== "mobile" && layoutPresetId === "two_column" ? "md:col-span-9" : ""}`}>
                    
                    {/* HERO Banner Section */}
                    {activeSections.includes("hero") && (
                      <section
                        className="px-6 py-12 md:py-16 text-center select-none relative overflow-hidden"
                        style={{ color: textColor }}
                      >
                        {sectionContent?.heroImageFile && (
                          <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
                            <img src={sectionContent.heroImageFile} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                        )}
                        <div className="relative z-10">
                          <h1 className="text-xl md:text-3.5xl font-extrabold tracking-tight font-display max-w-lg mx-auto leading-tight">
                            {sectionContent?.heroTitle || "Concevoir le Web de demain."}
                          </h1>
                          <p className="text-xs md:text-sm opacity-80 mt-3 max-w-sm mx-auto leading-relaxed">
                            {sectionContent?.heroSubtitle || "Un rendu harmonieux de contrastes, d'espacements, de hauteurs de lignes, et de grilles ergonomiques."}
                          </p>
                          
                          <div className="mt-6">
                            <button
                              type="button"
                              className="text-xs font-bold px-4 py-2.5 rounded-lg text-white shadow-md active:scale-95 transition cursor-pointer"
                              style={{ backgroundColor: accentColor }}
                            >
                              {sectionContent?.heroCtaText || "Démarrer maintenant"}
                            </button>
                          </div>
                        </div>
                      </section>
                    )}

                    {/* CAROUSEL Slider Section */}
                    {activeSections.includes("carousel") && (
                      <section className="px-6 py-6" style={{ color: textColor }}>
                        <div className="bg-black/5 rounded-xl p-6 relative overflow-hidden transition-all flex flex-col justify-between min-h-[170px]">
                          {carouselSlides[carouselIndex]?.imageFile && (
                            <div className="absolute inset-0 opacity-15 pointer-events-none">
                              <img src={carouselSlides[carouselIndex].imageFile} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                          )}
                          <div className="flex justify-between items-center text-[10px] font-mono opacity-60 z-10">
                            <span>Carrousel de marque</span>
                            <span>{carouselIndex + 1} / {carouselSlides.length}</span>
                          </div>
                          
                          <div className="my-auto py-2.5 text-center z-10">
                            <h4 className="text-sm font-bold font-display">{carouselSlides[carouselIndex]?.title}</h4>
                            <p className="text-[11px] opacity-80 mt-1 max-w-md mx-auto">{carouselSlides[carouselIndex]?.text}</p>
                          </div>

                          {/* Navigation controls for Carousel */}
                          <div className="flex justify-between items-center mt-3 z-10">
                            <button
                              onClick={() => setCarouselIndex(prev => (prev - 1 + carouselSlides.length) % carouselSlides.length)}
                              className="p-1 rounded-full bg-white/20 hover:bg-white/40 transition cursor-pointer"
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                            
                            <div className="flex gap-1">
                              {carouselSlides.map((_, i) => (
                                <span
                                  key={i}
                                  className={`w-1.5 h-1.5 rounded-full transition ${i === carouselIndex ? "opacity-100" : "opacity-30"}`}
                                  style={{ backgroundColor: textColor }}
                                />
                              ))}
                            </div>

                            <button
                              onClick={() => setCarouselIndex(prev => (prev + 1) % carouselSlides.length)}
                              className="p-1 rounded-full bg-white/20 hover:bg-white/40 transition cursor-pointer"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </section>
                    )}

                    {/* CARDS Grid Section (BENTOS OR STANDARD GRIDS) */}
                    {activeSections.includes("cards") && (
                      <section className="px-6 py-8" style={{ color: textColor }}>
                        <div className="text-center mb-6">
                          <span className="text-[10px] uppercase font-mono tracking-widest opacity-60">
                            {sectionContent?.cardsSubtitle || "Nos points forts"}
                          </span>
                          <h3 className="text-sm md:text-base font-bold font-display mt-0.5">
                            {sectionContent?.cardsTitle || "Valeurs d'accompagnement"}
                          </h3>
                        </div>

                        {/* Stagger grid items if layout is MAGAZINE */}
                        <div className={`grid mt-4 gap-4 ${
                          viewport === "mobile"
                            ? "grid-cols-1"
                            : layoutPresetId === "magazine"
                            ? "grid-cols-3"
                            : "grid-cols-3"
                        }`}>
                          {(sectionContent?.cardsItems || [
                            { title: "Module innovant 01", desc: "Des layouts légers et responsives construits pour un rendu de performance maximal.", imageFile: "" },
                            { title: "Grille sémantique 02", desc: "Structure du dôme sémantique totalement optimisée et codée sans détour.", imageFile: "" },
                            { title: "Design d'Impact 03", desc: "Contrôle millimétré des hauteurs, marges intérieures, typographies et contrastes parfaits.", imageFile: "" }
                          ]).map((card, idx) => {
                            // Bento magazine spanning
                            const isMagazineGrid = layoutPresetId === "magazine" && viewport !== "mobile";
                            const gridSpanClass = isMagazineGrid
                              ? idx === 0
                                ? "md:col-span-2 md:row-span-1 border-indigo-200 bg-indigo-50/5"
                                : "md:col-span-1"
                              : "";
                            
                            return (
                              <div
                                key={idx}
                                className={`p-4 rounded-xl border border-black/5 bg-black/5 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 relative overflow-hidden group flex flex-col justify-between min-h-[140px] ${gridSpanClass}`}
                              >
                                {card.imageFile && (
                                  <div className="absolute right-2 bottom-2 w-16 h-16 opacity-10 group-hover:opacity-20 transition-all pointer-events-none">
                                    <img src={card.imageFile} className="w-full h-full object-cover rounded-lg" alt="" referrerPolicy="no-referrer" />
                                  </div>
                                )}
                                <div>
                                  <div
                                    className="w-7 h-7 rounded-lg text-indigo-505 flex items-center justify-center text-xs font-bold mb-3"
                                    style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
                                  >
                                    0{idx + 1}
                                  </div>
                                  <h4 className="text-xs font-bold font-display">{card.title}</h4>
                                  <p className="text-[10px] opacity-80 mt-1 leading-normal max-w-sm">
                                    {card.desc}
                                  </p>
                                </div>
                                <span className="text-[9px] font-mono opacity-40 self-end mt-2">Active</span>
                              </div>
                            );
                          })}
                        </div>
                      </section>
                    )}

                    {/* CONTACT Form Section */}
                    {activeSections.includes("contact") && (
                      <section className="px-6 py-10" style={{ color: textColor }}>
                        <div className="max-w-sm mx-auto bg-black/5 rounded-2xl p-5 border border-black/5">
                          <h3 className="text-xs font-bold uppercase tracking-wider font-display mb-4 text-center">
                            {sectionContent?.contactTitle || "Faire une demande"}
                          </h3>
                          
                          <div className="space-y-3 text-[11px]">
                            <div>
                              <label className="block font-medium opacity-85 mb-1">Votre Nom :</label>
                              <input
                                type="text"
                                disabled
                                placeholder="Jean Dupont"
                                className="w-full bg-white/70 border border-black/10 rounded-lg p-2 focus:ring-1 focus:ring-indigo-500 text-xs"
                              />
                            </div>

                            <div>
                              <label className="block font-medium opacity-85 mb-1">Adresse Email :</label>
                              <input
                                type="email"
                                disabled
                                placeholder="jean@example.com"
                                className="w-full bg-white/70 border border-black/10 rounded-lg p-2 focus:ring-1 focus:ring-indigo-500 text-xs"
                              />
                            </div>

                            <div>
                              <label className="block font-medium opacity-85 mb-1">Message :</label>
                              <textarea
                                rows={2.5}
                                disabled
                                placeholder="Décrivez votre projet..."
                                className="w-full bg-white/70 border border-black/10 rounded-lg p-2 focus:ring-1 focus:ring-indigo-500 text-xs"
                              />
                            </div>

                            <button
                              type="button"
                              className="w-full text-xs font-semibold py-2 rounded-lg text-white font-display flex items-center justify-center gap-1.5 opacity-90 hover:opacity-100 transition cursor-pointer"
                              style={{ backgroundColor: accentColor }}
                            >
                              <Send className="w-3 h-3" />
                              {sectionContent?.contactBtnText || "Transmettre"}
                            </button>
                          </div>
                        </div>
                      </section>
                    )}
                  </main>
                </div>

                {/* 3. FOOTER SECTION */}
                {activeSections.includes("footer") && (
                  <footer
                    className="px-6 py-6 border-t border-black/5 text-center text-[10px] z-10"
                    style={{ backgroundColor: footerBgColor, color: footerBgColor === "#0f172a" || footerBgColor === "#1e1e24" || footerBgColor === "#030712" ? "#f3f4f6" : textColor }}
                  >
                    <div className="max-w-lg mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
                      <span className="opacity-60">
                        {sectionContent?.footerCopyright || `© ${new Date().getFullYear()} SiteUX Corporation. Tous droits réservés.`}
                      </span>
                      <div className="flex gap-3">
                        <span className="font-semibold underline cursor-pointer" style={{ color: accentColor }}>
                          {sectionContent?.footerLink1 || "Confidentialité"}
                        </span>
                        <span className="font-semibold underline cursor-pointer" style={{ color: accentColor }}>
                          {sectionContent?.footerLink2 || "Contact"}
                        </span>
                      </div>
                    </div>
                  </footer>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
