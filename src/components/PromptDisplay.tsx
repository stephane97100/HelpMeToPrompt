import { useState } from "react";
import { Terminal, Copy, Check, Save, Download, FileText, AlertCircle } from "lucide-react";
import { DesignTheme, MenuItem } from "../types";

interface PromptDisplayProps {
  finalPrompt: string;
  instructionsMd: string;
  styleCss: string;
  scriptJs: string;
  onSaveFileOnServer: (filename: string, content: string) => Promise<boolean>;
  isSaving: boolean;
}

export default function PromptDisplay({
  finalPrompt,
  instructionsMd,
  styleCss,
  scriptJs,
  onSaveFileOnServer,
  isSaving
}: PromptDisplayProps) {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [saveStatus, setSaveStatus] = useState<Record<string, { success?: boolean; error?: string }>>({});

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(finalPrompt);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2500);
    } catch (err) {
      console.error("Échec copie :", err);
    }
  };

  const handleSaveFile = async (filename: string, content: string) => {
    setSaveStatus(prev => ({ ...prev, [filename]: {} }));
    const ok = await onSaveFileOnServer(filename, content);
    if (ok) {
      setSaveStatus(prev => ({ ...prev, [filename]: { success: true } }));
      setTimeout(() => {
        setSaveStatus(prev => {
          const u = { ...prev };
          delete u[filename];
          return u;
        });
      }, 4000);
    } else {
      setSaveStatus(prev => ({ ...prev, [filename]: { success: false, error: "Droit d'accès restreint." } }));
    }
  };

  // Helper to trigger direct local download for offline use
  const handleDownloadFileLocal = (filename: string, content: string) => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
        <Terminal className="w-5 h-5 text-indigo-600" />
        <h2 className="text-lg font-bold text-gray-900 font-display">Génération du Prompt Ultime & Sauvegarde</h2>
      </div>

      <p className="text-sm text-gray-600 leading-relaxed">
        Félicitations ! Votre structure, vos thèmes de couleurs, vos CSS, vos animations et vos sections par page de site sont désormais pleinement compilés.
      </p>

      {/* Writing buttons right into the workspace */}
      <div className="bg-indigo-50 border border-indigo-100/80 p-5 rounded-2xl space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-700" />
          <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wider font-display">
            Génération Rapide des fichiers Workspace :
          </h3>
        </div>

        <p className="text-xs text-indigo-950/80 leading-normal">
          Cliquez sur les boutons ci-dessous pour créer ou écraser directement les fichiers <code className="font-bold">instructions.md</code>, <code className="font-bold">style.css</code> et <code className="font-bold">script.js</code> dans la racine de votre application dans l'iFrame ou l'espace de travail.
        </p>

        <div className="flex flex-wrap gap-3">
          {/* Write instructions.md */}
          <div className="relative">
            <button
              onClick={() => handleSaveFile("instructions.md", instructionsMd)}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm cursor-pointer disabled:opacity-50 transition"
            >
              <Save className="w-3.5 h-3.5" />
              Générer instructions.md
            </button>
            {saveStatus["instructions.md"]?.success && (
              <span className="absolute -top-2 -right-1 text-[10px] bg-emerald-500 text-white px-1.5 py-0.2 rounded-full shadow border border-white font-semibold">
                Créé!
              </span>
            )}
          </div>

          {/* Write style.css */}
          <div className="relative">
            <button
              onClick={() => handleSaveFile("style.css", styleCss)}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm cursor-pointer disabled:opacity-50 transition"
            >
              <Save className="w-3.5 h-3.5" />
              Générer style.css
            </button>
            {saveStatus["style.css"]?.success && (
              <span className="absolute -top-2 -right-1 text-[10px] bg-emerald-500 text-white px-1.5 py-0.2 rounded-full shadow border border-white font-semibold">
                Créé!
              </span>
            )}
          </div>

          {/* Write script.js */}
          <div className="relative">
            <button
              onClick={() => handleSaveFile("script.js", scriptJs)}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm cursor-pointer disabled:opacity-50 transition"
            >
              <Save className="w-3.5 h-3.5" />
              Générer script.js
            </button>
            {saveStatus["script.js"]?.success && (
              <span className="absolute -top-2 -right-1 text-[10px] bg-emerald-500 text-white px-1.5 py-0.2 rounded-full shadow border border-white font-semibold">
                Créé!
              </span>
            )}
          </div>
        </div>

        {/* Local Offline Downloads */}
        <div className="pt-2 border-t border-indigo-100 flex items-center justify-between text-xs text-indigo-900/60">
          <span>Vous souhaitez télécharger les fichiers sur votre ordinateur ?</span>
          <div className="flex gap-2.5">
            <button
              onClick={() => handleDownloadFileLocal("instructions.md", instructionsMd)}
              className="hover:text-indigo-800 font-bold underline cursor-pointer"
            >
              Doc MD
            </button>
            <button
              onClick={() => handleDownloadFileLocal("style.css", styleCss)}
              className="hover:text-indigo-800 font-bold underline cursor-pointer"
            >
              Styles CSS
            </button>
            <button
              onClick={() => handleDownloadFileLocal("script.js", scriptJs)}
              className="hover:text-indigo-800 font-bold underline cursor-pointer"
            >
              Script JS
            </button>
          </div>
        </div>
      </div>

      {/* Ultimate prompt compiled codeblock terminal with 1-click copy */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-gray-700">Prompt Ultime pour le Développeur Antigravity :</label>
          <button
            onClick={handleCopyPrompt}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition cursor-pointer select-none"
          >
            {copiedPrompt ? (
              <>
                <Check className="w-3.5 h-3.5 animate-bounce text-emerald-600" />
                <span className="text-emerald-700">Prompt Copié !</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copier le Prompt</span>
              </>
            )}
          </button>
        </div>

        <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl font-mono text-[11px] leading-relaxed relative group">
          {/* Header of terminal */}
          <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center gap-2 text-slate-400 select-none">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <span className="ml-2 text-[10px] uppercase font-bold tracking-wider text-slate-300">Prompt Ultime Compilé - 100% Client-side ready</span>
          </div>

          <pre className="p-4 overflow-x-auto text-slate-100 whitespace-pre-wrap max-h-[460px]">
            {finalPrompt}
          </pre>
        </div>
      </div>

      <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex gap-3 text-xs leading-normal text-amber-900">
        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-700" />
        <p>
          <strong>Comment exploiter le prompt ?</strong> Copiez le prompt compilé ci-dessus, puis déposez-le directement dans votre assistant conversationnel ou votre outil d'IA de génération de code (comme l'agent Antigravity). Il créera d'un seul trait toute la structure attendue en y incorporant scrupuleusement chacune de vos exigences !
        </p>
      </div>
    </div>
  );
}
