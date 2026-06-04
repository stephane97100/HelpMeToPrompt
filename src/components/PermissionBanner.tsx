import { useEffect, useState } from "react";
import { Shield, CheckCircle, AlertTriangle, RefreshCw } from "lucide-react";
import { FileStatus } from "../types";

interface PermissionBannerProps {
  filesStatus: FileStatus[];
  onRefresh: () => void;
  isLoading: boolean;
}

export default function PermissionBanner({
  filesStatus,
  onRefresh,
  isLoading
}: PermissionBannerProps) {
  const [showGuide, setShowGuide] = useState(false);

  const instructionsFile = filesStatus.find(f => f.filename === "instructions.md");
  const hasError = filesStatus.some(f => f.exists && (!f.isReadable || !f.isWritable));

  return (
    <div className="bg-slate-900 border border-slate-700/60 rounded-xl p-5 mb-6 text-slate-100 shadow-xl overflow-hidden relative font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-white font-display flex items-center gap-2">
              Statut des Fichiers & Permissions CHMOD
              {hasError ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-400/10 text-red-400 border border-red-400/20">
                  <AlertTriangle className="w-3 h-3 mr-1" /> Requis
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
                  <CheckCircle className="w-3 h-3 mr-1" /> Actif
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Les fichiers generés sont sauvegardés directement dans votre espace de travail.
            </p>
          </div>
        </div>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          Vérifier les droits
        </button>
      </div>

      {/* List files right in the project root */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
        {filesStatus.map((file) => (
          <div
            key={file.filename}
            className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 flex items-center justify-between"
          >
            <div>
              <div className="text-xs font-mono font-bold text-slate-200 flex items-center gap-1.5">
                {file.filename}
                {file.exists ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ) : (
                  <span className="text-[10px] text-slate-500 font-normal underline decoration-dotted">Nouveau</span>
                )}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Droits : {file.exists ? <span className="font-mono text-indigo-400">{file.mode}</span> : "N/A"}
              </div>
            </div>
            
            <div className="flex gap-1.5">
              {file.exists ? (
                <>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium ${
                      file.isReadable
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-red-500/10 text-red-500 border border-red-500/20"
                    }`}
                  >
                    R
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium ${
                      file.isWritable
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-red-500/10 text-red-500 border border-red-500/20"
                    }`}
                  >
                    W
                  </span>
                </>
              ) : (
                <span className="text-[10px] text-slate-500 font-semibold italic">En attente</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 flex justify-between items-center text-xs">
        <span className="text-slate-400">
          Problème d'écriture dans l'applet Antigravity ?
        </span>
        <button
          onClick={() => setShowGuide(!showGuide)}
          className="text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer underline"
        >
          {showGuide ? "Masquer les explications CHMOD ⛛" : "Voir comment faire CHMOD ⛚"}
        </button>
      </div>

      {showGuide && (
        <div className="mt-3 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-xs text-yellow-100/90 leading-relaxed font-mono">
          <p className="font-bold mb-2 text-yellow-400">⚠️ ACTIVER LE CHMOD SUR MAC OU LINUX :</p>
          <p className="mb-2">
            Afin que le serveur de l'application puisse écrire et modifier les fichiers dans le conteneur sandboxed, assurez-vous que les permissions d'écriture locales soient convenablement accordées.
          </p>
          <p className="bg-slate-950 p-2 rounded text-indigo-300 border border-slate-800 mb-2 font-mono">
            chmod 644 instructions.md style.css script.js
          </p>
          <p className="text-slate-300 mb-1">
            Si vous souhaitez accorder des droits d'écriture complets à tous les membres du conteneur en mode local express / workspace :
          </p>
          <p className="bg-slate-950 p-2 rounded text-indigo-300 border border-slate-800 font-mono">
            chmod 777 instructions.md style.css script.js
          </p>
          <p className="text-slate-400 mt-2 text-[11px] italic leading-normal">
            Note: L'application HelpMeToCode applique d'office un chmod 644 de façon automatisée en arrière-plan à chaque requête d'enregistrement réussie.
          </p>
        </div>
      )}
    </div>
  );
}
