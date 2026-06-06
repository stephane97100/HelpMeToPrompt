import React, { useState, useEffect } from "react";
import { Cloud, Save, Trash2, FolderOpen, AlertTriangle, ShieldCheck, RefreshCw, Key, ChevronRight, Clock, Box } from "lucide-react";
import { SectionContent } from "../types";

interface SavedPromptsManagerProps {
  user: { email: string; name: string; avatarUrl?: string } | null;
  onShowConnexion: () => void;
  // All state payload to save
  activeState: {
    siteDesc: string;
    structureText: string;
    selectedThemeId: string;
    cssFramework: "tailwind" | "bootstrap" | "advantix" | "custom_css";
    customCss: string;
    animationChoices: Record<string, string>;
    sectionsMap: Record<string, string[]>;
    seoMap: Record<string, any>;
    activeLayoutPresetId: "one_column" | "two_column" | "magazine";
    sectionContent: SectionContent;
  };
  onLoadPrompt: (promptData: any) => void;
}

interface SavedPromptItem {
  id: string;
  email: string;
  promptName: string;
  createdAt: string;
  updatedAt?: string;
  data: any;
}

export default function SavedPromptsManager({
  user,
  onShowConnexion,
  activeState,
  onLoadPrompt
}: SavedPromptsManagerProps) {
  const [promptsList, setPromptsList] = useState<SavedPromptItem[]>([]);
  const [newName, setNewName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<{ text: string; error: boolean } | null>(null);

  // Fetch from Node backend
  const fetchPrompts = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const response = await fetch("/api/prompts");
      const data = await response.json();
      if (data.success && data.prompts) {
        // Filter by current connected user's email
        const usersPrompts = data.prompts.filter((p: SavedPromptItem) => p.email === user.email);
        setPromptsList(usersPrompts);
      }
    } catch (err) {
      console.error("Erreur lors de la récupération des prompts:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrompts();
  }, [user]);

  // Save prompt action
  const handleSavePrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!newName.trim()) {
      setActionFeedback({ text: "Saisissez un nom descriptif pour votre prompt.", error: true });
      return;
    }

    setIsLoading(true);
    setActionFeedback(null);

    const newPromptPayload = {
      id: "prompt_" + Date.now(),
      email: user.email,
      promptName: newName.trim(),
      data: activeState
    };

    try {
      const response = await fetch("/api/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: newPromptPayload })
      });
      const resData = await response.json();

      if (resData.success) {
        setActionFeedback({ text: `Le prompt "${newName}" a été correctement enregistré sur le serveur !`, error: false });
        setNewName("");
        fetchPrompts();
        // Clear success message after 4s
        setTimeout(() => setActionFeedback(null), 4000);
      } else {
        setActionFeedback({ text: "Erreur serveur de sauvegarde.", error: true });
      }
    } catch (err: any) {
      setActionFeedback({ text: "Impossible de joindre le serveur de sauvegarde.", error: true });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete action
  const handleDeletePrompt = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer définitivement cette version de prompt ?")) {
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`/api/prompts/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (data.success) {
        setActionFeedback({ text: "Prompt retiré de l'espace cloud avec succès.", error: false });
        fetchPrompts();
        setTimeout(() => setActionFeedback(null), 3000);
      }
    } catch (err) {
      setActionFeedback({ text: "Erreur lors de la suppression.", error: true });
    } finally {
      setIsLoading(false);
    }
  };

  // Help load function
  const triggerLoad = (item: SavedPromptItem) => {
    try {
      onLoadPrompt(item.data);
      setActionFeedback({ text: `✓ Configuration "${item.promptName}" chargée avec succès !`, error: false });
      setTimeout(() => setActionFeedback(null), 3500);
    } catch (e) {
      setActionFeedback({ text: "Impossible de charger cette configuration.", error: true });
    }
  };

  // DISCONNECTED GUEST CARD
  if (!user) {
    return (
      <div className="bg-[#1e293b]/5 backdrop-blur-sm border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex items-start gap-3.5">
          <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center flex-shrink-0 border border-amber-500/20">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Mode Invité — Sauvegardes Désactivées</h4>
            <p className="text-xs text-gray-500 leading-relaxed font-normal">
              Vos configurations actuelles (menus, Thème CSS et balises de référencement) sont stockées de façon éphémère dans votre navigateur local. Connectez un compte pour activer le gestionnaire cloud sémantique.
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[10.5px] text-indigo-750 font-bold">
            ★ Avantage Premium : Versionnage de prompts illimité sur le serveur.
          </p>
          <button
            onClick={onShowConnexion}
            className="w-full sm:w-auto px-4 py-2 text-xs font-bold bg-[#0f172a] hover:bg-slate-800 text-white rounded-xl transition shadow flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Key className="w-3.5 h-3.5" />
            <span>Créer ou connecter mon compte</span>
          </button>
        </div>
      </div>
    );
  }

  // CONNECTED CLOUD MANAGER
  return (
    <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden font-sans">
      <div className="bg-[#0f172a] text-white px-4.5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cloud className="w-4 h-4 text-indigo-450 animate-pulse" />
          <span className="text-xs font-extrabold uppercase tracking-wider font-display">
            Espace Cloud de {user.name}
          </span>
        </div>
        <span className="text-[10px] bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-mono">
          {user.email}
        </span>
      </div>

      <div className="p-5 space-y-6">
        
        {/* Save Current Prompt Form */}
        <form onSubmit={handleSavePrompt} className="space-y-3">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-700">Sauvegarder l'état actuel de conception :</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ex : V1.2 - Design Agence Sémantique..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                disabled={isLoading}
                className="flex-1 text-xs border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg p-2.5 bg-white font-medium"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-extrabold rounded-lg flex items-center gap-1.5 transition shadow-sm cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Enregistrer</span>
              </button>
            </div>
          </div>
        </form>

        {/* Info or Feedback alert */}
        {actionFeedback && (
          <div className={`p-3 rounded-lg text-[11px] font-bold flex justify-between items-center ${
            actionFeedback.error ? "bg-red-50 text-red-800 border border-red-200" : "bg-emerald-50 text-emerald-800 border border-emerald-150"
          }`}>
            <span>{actionFeedback.text}</span>
            <button type="button" onClick={() => setActionFeedback(null)}>✕</button>
          </div>
        )}

        {/* History Grid */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between border-b border-gray-150 pb-2">
            <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1.5 uppercase tracking-wider">
              <FolderOpen className="w-3.5 h-3.5 text-indigo-600" />
              Vos versions ({promptsList.length})
            </h4>
            <button
              onClick={fetchPrompts}
              disabled={isLoading}
              title="Rafraîchir"
              className="p-1 rounded text-slate-500 hover:bg-slate-200"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            </button>
          </div>

          {promptsList.length === 0 ? (
            <div className="text-center py-7 bg-white rounded-xl border border-dashed border-slate-200 space-y-1.5">
              <Box className="w-6 h-6 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500 font-medium">Vous n'avez pas encore enregistré de prompt.</p>
              <p className="text-[10px] text-slate-400">Nommez votre configuration ci-dessus et cliquez sur Enregistrer.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {promptsList.map((item) => {
                const countPages = item.data?.structureText
                  ? item.data.structureText.split("\n").filter((l: string) => l.trim().startsWith("-")).length
                  : 0;

                const dateStr = new Date(item.createdAt).toLocaleString("fr-FR", {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit"
                });

                return (
                  <div
                    key={item.id}
                    className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-3.5 flex flex-col justify-between hover:shadow-sm transition"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-xs font-extrabold text-slate-900 line-clamp-1">
                          {item.promptName}
                        </span>
                        <span className="text-[9px] font-mono text-indigo-500 font-extrabold uppercase shrink-0 bg-indigo-50 px-1.5 py-0.5 rounded">
                          {item.data?.cssFramework || "Tailwind"}
                        </span>
                      </div>

                      <p className="text-[10.5px] text-slate-500 line-clamp-2 italic font-normal">
                        "{item.data?.siteDesc || "Aucune description..."}"
                      </p>

                      <div className="flex items-center gap-3 pt-1 text-[10px] text-slate-400 font-mono">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {dateStr}
                        </span>
                        <span className="flex items-center gap-1 font-bold">
                          ● {countPages} page(s)
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => handleDeletePrompt(item.id)}
                        className="p-1 text-slate-450 hover:text-red-650 hover:bg-slate-50 rounded cursor-pointer transition text-xs font-bold text-red-500 flex items-center gap-1"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Supprimer</span>
                      </button>

                      <button
                        onClick={() => triggerLoad(item)}
                        className="px-3 py-1.5 text-[10.5px] font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Charger</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="pt-2 flex items-center gap-1.5 justify-center text-[10.5.5px] text-slate-500 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-550" />
          <span>Vos prompts sont sauvegardés en toute sécurité dans l'espace sandbox d'Antigravity.</span>
        </div>
      </div>
    </div>
  );
}
