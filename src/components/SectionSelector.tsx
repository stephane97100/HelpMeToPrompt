import React, { useState, useRef } from "react";
import { Layers, Layout, Edit3, Check, HelpCircle, Image, Trash2, ArrowRight, LayoutTemplate, Sparkles, CheckCircle2 } from "lucide-react";
import { MenuItem, SectionContent, PRESET_LAYOUTS } from "../types";

interface SectionSelectorProps {
  menuItems: MenuItem[];
  onToggleSection: (pageId: string, sectionName: string) => void;
  selectedLayoutId: "one_column" | "two_column" | "magazine";
  onSelectLayout: (id: "one_column" | "two_column" | "magazine") => void;
  sectionContent: SectionContent;
  onUpdateContent: (updated: Partial<SectionContent>) => void;
}

const AVAILABLE_SECTIONS = [
  { id: "header", name: "En-tête (Header Nav)", desc: "Logo de marque, barre de navigation et sous-menus." },
  { id: "hero", name: "Bannière Hero d'Impact", desc: "Titre principal accrocheur, sous-titres et bouton d'action principal CTA." },
  { id: "carousel", name: "Carrousel de Messages", desc: "Glissière animée avec messages promotionnels et images d'arrière-plan." },
  { id: "cards", name: "Grille de Cartes (Bento/Cards)", desc: "Affichage de services, de bénéfices ou d'éléments de portfolio." },
  { id: "contact", name: "Formulaire de Contact", desc: "Zone de saisie sécurisée pour recueillir les demandes de devis ou messages." },
  { id: "footer", name: "Raccord de Pied de page (Footer)", desc: "Notes de copyright, liens hypertextes de conformité et raccord de bas." }
];

export default function SectionSelector({
  menuItems,
  onToggleSection,
  selectedLayoutId,
  onSelectLayout,
  sectionContent,
  onUpdateContent
}: SectionSelectorProps) {
  const [activeSubTab, setActiveSubTab] = useState<"layout" | "sections" | "content">("layout");
  
  // Drag-and-drop upload state references
  const [dragOverKey, setDragOverKey] = useState<string | null>(null);

  // General file handler using FileReader base64
  const handleFileChange = (key: string, file: File, secondaryIdx?: number) => {
    if (!file.type.startsWith("image/")) {
      alert("Veuillez sélectionner un fichier image valide (png, jpeg, webp, svg).");
      return;
    }
    
    // Check file size limit (keep it under 4.5MB to save storage safely client side)
    if (file.size > 4.5 * 1024 * 1024) {
      alert("Fichier trop volumineux. Veuillez importer une image de moins de 4 Mo.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = e.target?.result as string;
      if (secondaryIdx !== undefined) {
        if (key === "carousel") {
          const slides = [...(sectionContent.carouselSlides || [])];
          if (slides[secondaryIdx]) {
            slides[secondaryIdx].imageFile = base64String;
            onUpdateContent({ carouselSlides: slides });
          }
        } else if (key === "cards") {
          const items = [...(sectionContent.cardsItems || [])];
          if (items[secondaryIdx]) {
            items[secondaryIdx].imageFile = base64String;
            onUpdateContent({ cardsItems: items });
          }
        }
      } else {
        onUpdateContent({ [key]: base64String });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent, elementKey: string) => {
    e.preventDefault();
    setDragOverKey(elementKey);
  };

  const handleDragLeave = () => {
    setDragOverKey(null);
  };

  const handleDrop = (e: React.DragEvent, elementKey: string, secondaryIdx?: number) => {
    e.preventDefault();
    setDragOverKey(null);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileChange(elementKey, files[0], secondaryIdx);
    }
  };

  // Flattened pages list
  const allPages: { id: string; label: string; isSubpage: boolean }[] = [];
  menuItems.forEach((item) => {
    allPages.push({ id: item.id, label: item.label, isSubpage: false });
    item.subItems.forEach((sub) => {
      allPages.push({ id: sub.id, label: `${item.label} ➜ ${sub.label}`, isSubpage: true });
    });
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Tab Switch bar */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveSubTab("layout")}
          className={`flex-1 pb-3 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === "layout"
              ? "border-b-2 border-indigo-600 text-indigo-600"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <Layout className="w-4 h-4" />
          <span>1. Mise en Page</span>
        </button>
        <button
          onClick={() => setActiveSubTab("sections")}
          className={`flex-1 pb-3 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === "sections"
              ? "border-b-2 border-indigo-600 text-indigo-600"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>2. Sections actives ({allPages.length} Pages)</span>
        </button>
        <button
          onClick={() => setActiveSubTab("content")}
          className={`flex-1 pb-3 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === "content"
              ? "border-b-2 border-indigo-600 text-indigo-600"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>3. Saisie Textes & Médias</span>
        </button>
      </div>

      {/* SUB-VIEW 1: LAYOUT SELECTION */}
      {activeSubTab === "layout" && (
        <div className="space-y-5 animate-fadeIn">
          <div className="flex items-center gap-2 border-b border-gray-150 pb-2.5">
            <LayoutTemplate className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-tight">Configuration de la Grille de Mise en Page</h3>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            Choisissez l'agencement structurel de votre site responsive. Ce choix configure la manière dont les sections de page s'organisent et intègrent le contenu interactif.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PRESET_LAYOUTS.map((lay) => {
              const isSelected = selectedLayoutId === lay.id;
              return (
                <button
                  key={lay.id}
                  onClick={() => onSelectLayout(lay.id)}
                  className={`text-left border rounded-xl p-4.5 transition duration-300 relative select-none cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "border-indigo-600 bg-indigo-50/10 ring-1 ring-indigo-500 shadow-md"
                      : "border-gray-200 hover:border-gray-300 hover:bg-slate-50/50 hover:shadow"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className={`text-[10px] uppercase font-mono tracking-wider font-extrabold px-2 py-0.5 rounded ${
                        isSelected ? "bg-indigo-600 text-white" : "bg-slate-150 text-slate-700"
                      }`}>
                        {lay.id}
                      </span>
                      {isSelected && (
                        <div className="h-5 w-5 bg-indigo-600 text-white rounded-full flex items-center justify-center">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                    
                    <h4 className="text-xs font-bold text-gray-900">{lay.name}</h4>
                    <p className="text-[11px] text-gray-500 leading-normal">{lay.description}</p>
                    
                    <div className="pt-2 border-t border-slate-100">
                      <p className="text-[10px] text-indigo-900 font-bold mb-0.5">Structure sémantique :</p>
                      <p className="text-[10px] font-mono bg-black/5 p-1.5 rounded text-gray-700 leading-relaxed select-all">
                        {lay.structure}
                      </p>
                    </div>

                    <div className="pt-2">
                      <p className="text-[10px] text-emerald-800 font-semibold mb-0.5">Avantages majeurs :</p>
                      <p className="text-[10.5px] text-slate-600 leading-normal font-normal">
                        ★ {lay.advantages}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100/50 flex items-center justify-end">
                    <span className="text-[10px] text-indigo-600 font-extrabold flex items-center gap-1">
                      {isSelected ? "LAYOUT ACTIF" : "CHOISIR"}
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: SECTIONS SELECTION */}
      {activeSubTab === "sections" && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center gap-2 border-b border-gray-150 pb-2.5">
            <Layers className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-tight">Organisation d'Agencement des Pages</h3>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            Pour chaque page de la structure du menu, cochez les sections d'affichage web correspondantes. Le prompt final de 20 ans d'expérience s'adaptera sélectivement pour guider le dôme de code d'Antigravity !
          </p>

          {allPages.length === 0 ? (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-center">
              <p className="text-xs text-amber-800 font-semibold">
                ⚠️ Aucune page ou structure de menu détectée à l'étape 2.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {allPages.map((page) => {
                let activeSections: string[] = [];
                const l1 = menuItems.find((item) => item.id === page.id);
                if (l1) {
                  activeSections = l1.sections;
                } else {
                  for (const item of menuItems) {
                    const l2 = item.subItems.find((sub) => sub.id === page.id);
                    if (l2) {
                      activeSections = l2.sections;
                      break;
                    }
                  }
                }

                return (
                  <div key={page.id} className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
                    <div className="bg-slate-50 px-4 py-2.5 border-b border-gray-150 flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-800 font-display flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                        {page.label}
                      </span>
                      <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full font-bold">
                        {activeSections.length} active(s)
                      </span>
                    </div>

                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3.5 bg-white">
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
                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/30"
                            }`}
                          >
                            <div
                              className={`w-4 h-4 rounded mt-0.5 flex-shrink-0 flex items-center justify-center border transition ${
                                isChecked
                                  ? "bg-indigo-600 border-indigo-600 text-white"
                                  : "border-gray-300 group-hover:border-gray-400"
                              }`}
                            >
                              {isChecked && <Check className="w-3.5 h-3.5" />}
                            </div>
                            <div>
                              <p className={`text-xs font-bold ${isChecked ? "text-indigo-950" : "text-gray-800"}`}>
                                {sec.name}
                              </p>
                              <p className="text-[10.5px] text-gray-500 mt-0.5 leading-normal font-normal">
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
      )}

      {/* SUB-VIEW 3: TEXT & MEDIA CONTENT FORM */}
      {activeSubTab === "content" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center gap-2 border-b border-gray-150 pb-2.5">
            <Edit3 className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-tight">Vrai Raccord de Textes & Médias</h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed leading-normal">
            Remplacez entièrement les paragraphes de démonstration. En téléversant vos fichiers (logos, bannières), ils seront convertis en base64 client-side et restitués dans la fenêtre responsive en temps réel et intégrés dans les fichiers `instructions.md`.
          </p>

          <div className="space-y-6 bg-slate-50/40 p-5 rounded-2xl border border-slate-100">
            
            {/* 1. EN-TÊTE CONFIG */}
            <div className="bg-white border border-gray-150 rounded-xl p-4.5 space-y-4 shadow-sm">
              <h4 className="text-xs font-bold text-gray-900 border-b border-slate-100 pb-2 flex items-center gap-1.5 uppercase tracking-wider">
                <span className="w-5 h-5 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] font-mono font-bold">H</span>
                En-tête de page (Header)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-700">Texte d'appoint du Logo :</label>
                  <input
                    type="text"
                    value={sectionContent.headerLogoText}
                    onChange={(e) => onUpdateContent({ headerLogoText: e.target.value })}
                    className="w-full text-xs border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg p-2 bg-white"
                    placeholder="ex: DesignAgency"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-700">Logo Graphique (Image) :</label>
                  <div
                    onDragOver={(e) => handleDragOver(e, "headerLogoFile")}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, "headerLogoFile")}
                    className={`border border-dashed rounded-lg p-3 text-center transition ${
                      dragOverKey === "headerLogoFile" ? "border-indigo-500 bg-indigo-50/10" : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {sectionContent.headerLogoFile ? (
                      <div className="flex items-center justify-between gap-1">
                        <img src={sectionContent.headerLogoFile} alt="Logo thumbnail" className="h-6 w-auto object-contain rounded" />
                        <button
                          onClick={() => onUpdateContent({ headerLogoFile: "" })}
                          className="p-1 rounded bg-red-50 text-red-650 hover:bg-red-100 text-slate-500 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-500" />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-1 cursor-pointer relative">
                        <input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleFileChange("headerLogoFile", e.target.files[0]);
                            }
                          }}
                        />
                        <Image className="w-4 h-4 text-slate-400 mx-auto" />
                        <p className="text-[9.5px] text-slate-500 font-semibold">Déposer logo ou Cliquez pour parcourir</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. HERO CONFIG */}
            <div className="bg-white border border-gray-150 rounded-xl p-4.5 space-y-4 shadow-sm">
              <h4 className="text-xs font-bold text-gray-900 border-b border-slate-100 pb-2 flex items-center gap-1.5 uppercase tracking-wider">
                <span className="w-5 h-5 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] font-mono font-bold">B</span>
                Bannière Principale Hero (Présentation)
              </h4>
              <div className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-700">Titre d'impact accrocheur :</label>
                  <input
                    type="text"
                    value={sectionContent.heroTitle}
                    onChange={(e) => onUpdateContent({ heroTitle: e.target.value })}
                    className="w-full text-xs border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg p-2 bg-white"
                    placeholder="Saisissez un titre majeur..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-700">Message / Phrasé de soutien (Subtitle) :</label>
                  <textarea
                    rows={2.5}
                    value={sectionContent.heroSubtitle}
                    onChange={(e) => onUpdateContent({ heroSubtitle: e.target.value })}
                    className="w-full text-xs border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg p-2 bg-white"
                    placeholder="Une belle description sémantique..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1 col-span-1">
                    <label className="text-[11px] font-bold text-gray-700">Intitulé du bouton d'action principal :</label>
                    <input
                      type="text"
                      value={sectionContent.heroCtaText}
                      onChange={(e) => onUpdateContent({ heroCtaText: e.target.value })}
                      className="w-full text-xs border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg p-2 bg-white"
                      placeholder="Prendre Contact"
                    />
                  </div>

                  <div className="space-y-1 col-span-1">
                    <label className="text-[11px] font-bold text-gray-700">Illustration d'impact Hero (Arrière-plan) :</label>
                    <div
                      onDragOver={(e) => handleDragOver(e, "heroImageFile")}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, "heroImageFile")}
                      className={`border border-dashed rounded-lg p-3 text-center transition ${
                        dragOverKey === "heroImageFile" ? "border-indigo-500 bg-indigo-50/10" : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {sectionContent.heroImageFile ? (
                        <div className="flex items-center justify-between gap-1">
                          <img src={sectionContent.heroImageFile} alt="hero thumbnail" className="h-8 max-w-[120px] object-cover rounded" />
                          <button
                            onClick={() => onUpdateContent({ heroImageFile: "" })}
                            className="p-1 rounded bg-red-50 text-red-650 hover:bg-red-100 text-slate-550 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-500" />
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-1 cursor-pointer relative">
                          <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleFileChange("heroImageFile", e.target.files[0]);
                              }
                            }}
                          />
                          <Image className="w-4 h-4 text-slate-400 mx-auto" />
                          <p className="text-[9px] text-slate-500 font-semibold">Téléverser Illustration de fond</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. CAROUSEL CONFIG */}
            <div className="bg-white border border-gray-150 rounded-xl p-4.5 space-y-4 shadow-sm">
              <h4 className="text-xs font-bold text-gray-900 border-b border-slate-100 pb-2 flex items-center gap-1.5 uppercase tracking-wider">
                <span className="w-5 h-5 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] font-mono font-bold">C</span>
                Carrousel d'Images (3 Messages défilants)
              </h4>
              
              <div className="space-y-4">
                {[0, 1, 2].map((idx) => {
                  const slideObj = sectionContent.carouselSlides[idx] || { title: "", text: "", imageFile: "" };
                  return (
                    <div key={idx} className="p-3 bg-slate-50 rounded-lg space-y-3 border border-slate-100">
                      <p className="text-[10px] font-bold text-indigo-700">Slide de message #0{idx + 1}</p>
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                        <div className="md:col-span-4 space-y-1">
                          <label className="text-[9.5px] font-semibold text-slate-600">Titre :</label>
                          <input
                            type="text"
                            value={slideObj.title}
                            onChange={(e) => {
                              const list = [...sectionContent.carouselSlides];
                              list[idx] = { ...slideObj, title: e.target.value };
                              onUpdateContent({ carouselSlides: list });
                            }}
                            className="w-full text-xs border border-gray-300 rounded p-1.5 bg-white font-medium"
                          />
                        </div>
                        <div className="md:col-span-5 space-y-1">
                          <label className="text-[9.5px] font-semibold text-slate-600">Texte d'accroche :</label>
                          <input
                            type="text"
                            value={slideObj.text}
                            onChange={(e) => {
                              const list = [...sectionContent.carouselSlides];
                              list[idx] = { ...slideObj, text: e.target.value };
                              onUpdateContent({ carouselSlides: list });
                            }}
                            className="w-full text-xs border border-gray-300 rounded p-1.5 bg-white font-medium"
                          />
                        </div>
                        <div className="md:col-span-3 space-y-1">
                          <label className="text-[9 text-slate-650 font-semibold block">Image :</label>
                          <div
                            onDragOver={(e) => handleDragOver(e, "carousel_slide_" + idx)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, "carousel", idx)}
                            className={`border border-dashed rounded p-1 text-center cursor-pointer relative bg-white ${
                              dragOverKey === "carousel_slide_" + idx ? "border-indigo-500" : "border-slate-200"
                            }`}
                          >
                            {slideObj.imageFile ? (
                              <div className="flex items-center justify-between">
                                <img src={slideObj.imageFile} alt="" className="h-6 w-8 object-cover rounded" />
                                <button
                                  onClick={() => {
                                    const list = [...sectionContent.carouselSlides];
                                    list[idx] = { ...slideObj, imageFile: "" };
                                    onUpdateContent({ carouselSlides: list });
                                  }}
                                  className="text-[9px] font-bold text-red-500 hover:opacity-80 px-1"
                                >
                                  ✕
                                </button>
                              </div>
                            ) : (
                              <div className="py-1">
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                      handleFileChange("carousel", e.target.files[0], idx);
                                    }
                                  }}
                                />
                                <span className="text-[9px] text-gray-400">Importer</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4. CARDS GRID CONFIG */}
            <div className="bg-white border border-gray-150 rounded-xl p-4.5 space-y-4 shadow-sm">
              <h4 className="text-xs font-bold text-gray-900 border-b border-slate-100 pb-2 flex items-center gap-1.5 uppercase tracking-wider">
                <span className="w-5 h-5 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] font-mono font-bold">G</span>
                Grille de Cartes / Colonnes (Cards & Bento Grid)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-700">Sur-titre de la section :</label>
                  <input
                    type="text"
                    value={sectionContent.cardsSubtitle}
                    onChange={(e) => onUpdateContent({ cardsSubtitle: e.target.value })}
                    className="w-full text-xs border border-gray-300 rounded p-2 bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-700">Titre principal de section :</label>
                  <input
                    type="text"
                    value={sectionContent.cardsTitle}
                    onChange={(e) => onUpdateContent({ cardsTitle: e.target.value })}
                    className="w-full text-xs border border-gray-300 rounded p-2 bg-white"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-2">
                {[0, 1, 2].map((idx) => {
                  const cardObj = sectionContent.cardsItems[idx] || { title: "", desc: "", imageFile: "" };
                  return (
                    <div key={idx} className="p-3 bg-slate-50 rounded-lg space-y-3 border border-slate-100">
                      <p className="text-[10px] font-bold text-emerald-700">Colonne d'élément #0{idx + 1}</p>
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                        <div className="md:col-span-4 space-y-1">
                          <label className="text-[9.5px] font-semibold text-slate-600">Titre :</label>
                          <input
                            type="text"
                            value={cardObj.title}
                            onChange={(e) => {
                              const list = [...sectionContent.cardsItems];
                              list[idx] = { ...cardObj, title: e.target.value };
                              onUpdateContent({ cardsItems: list });
                            }}
                            className="w-full text-xs border border-gray-300 rounded p-1.5 bg-white font-medium"
                          />
                        </div>
                        <div className="md:col-span-5 space-y-1">
                          <label className="text-[9.5px] font-semibold text-slate-600">Texte court descriptif :</label>
                          <input
                            type="text"
                            value={cardObj.desc}
                            onChange={(e) => {
                              const list = [...sectionContent.cardsItems];
                              list[idx] = { ...cardObj, desc: e.target.value };
                              onUpdateContent({ cardsItems: list });
                            }}
                            className="w-full text-xs border border-gray-300 rounded p-1.5 bg-white font-medium"
                          />
                        </div>
                        <div className="md:col-span-3 space-y-1">
                          <label className="text-[9.5px] font-semibold block text-slate-650">Pictogramme :</label>
                          <div
                            onDragOver={(e) => handleDragOver(e, "cards_item_" + idx)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, "cards", idx)}
                            className={`border border-dashed rounded p-1 text-center cursor-pointer relative bg-white ${
                              dragOverKey === "cards_item_" + idx ? "border-indigo-500" : "border-slate-200"
                            }`}
                          >
                            {cardObj.imageFile ? (
                              <div className="flex items-center justify-between">
                                <img src={cardObj.imageFile} alt="" className="h-6 w-8 object-cover rounded" />
                                <button
                                  onClick={() => {
                                    const list = [...sectionContent.cardsItems];
                                    list[idx] = { ...cardObj, imageFile: "" };
                                    onUpdateContent({ cardsItems: list });
                                  }}
                                  className="text-[9px] font-bold text-red-500 hover:opacity-80 px-1"
                                >
                                  ✕
                                </button>
                              </div>
                            ) : (
                              <div className="py-1">
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                      handleFileChange("cards", e.target.files[0], idx);
                                    }
                                  }}
                                />
                                <span className="text-[9px] text-gray-400">Parcourir</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 5. CONTACT FORM CONFIG */}
            <div className="bg-white border border-gray-150 rounded-xl p-4.5 space-y-4 shadow-sm">
              <h4 className="text-xs font-bold text-gray-900 border-b border-slate-100 pb-2 flex items-center gap-1.5 uppercase tracking-wider">
                <span className="w-5 h-5 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] font-mono font-bold">F</span>
                Formulaire de Prise de Contact
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-700">Titre d'appel du formulaire :</label>
                  <input
                    type="text"
                    value={sectionContent.contactTitle}
                    onChange={(e) => onUpdateContent({ contactTitle: e.target.value })}
                    className="w-full text-xs border border-gray-300 rounded p-2 bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-700">Intitulé du bouton d'envoi :</label>
                  <input
                    type="text"
                    value={sectionContent.contactBtnText}
                    onChange={(e) => onUpdateContent({ contactBtnText: e.target.value })}
                    className="w-full text-xs border border-gray-300 rounded p-2 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* 6. FOOTER CONFIG */}
            <div className="bg-white border border-gray-150 rounded-xl p-4.5 space-y-4 shadow-sm">
              <h4 className="text-xs font-bold text-gray-900 border-b border-slate-100 pb-2 flex items-center gap-1.5 uppercase tracking-wider">
                <span className="w-5 h-5 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] font-mono font-bold">P</span>
                Pied de page (Footer layout details)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-700">Mention de Copyright :</label>
                  <input
                    type="text"
                    value={sectionContent.footerCopyright}
                    onChange={(e) => onUpdateContent({ footerCopyright: e.target.value })}
                    className="w-full text-xs border border-gray-300 rounded p-2 bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-700">Lien sémantique de conformité #1 :</label>
                  <input
                    type="text"
                    value={sectionContent.footerLink1}
                    onChange={(e) => onUpdateContent({ footerLink1: e.target.value })}
                    className="w-full text-xs border border-gray-300 rounded p-2 bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-700">Lien sémantique de conformité #2 :</label>
                  <input
                    type="text"
                    value={sectionContent.footerLink2}
                    onChange={(e) => onUpdateContent({ footerLink2: e.target.value })}
                    className="w-full text-xs border border-gray-300 rounded p-2 bg-white"
                  />
                </div>
              </div>
            </div>

          </div>
          
          <div className="p-4 bg-emerald-50 border border-emerald-250/50 rounded-xl flex items-center gap-2 text-xs text-emerald-800 leading-normal font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 animate-pulse" />
            <span>Tous les textes configurés ci-dessus s'injectent en temps réel et s'inséreront fidèlement dans les instructions et prompts générés.</span>
          </div>
        </div>
      )}
    </div>
  );
}
