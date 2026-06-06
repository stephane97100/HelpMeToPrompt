import React, { useState } from "react";
import { Sparkles, Layers, Sliders, Play, Code, CheckCircle, Shield, ArrowRight, Github, ExternalLink, Chrome, FileText, Cpu, Check, AlertCircle } from "lucide-react";

interface LandingPageProps {
  onEnterGuest: () => void;
  onLoginSimulate: (provider: string, email: string, name: string) => void;
}

export default function LandingPage({ onEnterGuest, onLoginSimulate }: LandingPageProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeProvider, setActiveProvider] = useState<string | null>(null);
  const [simulatedStep, setSimulatedStep] = useState(0);

  const oauthProviders = [
    {
      id: "google",
      name: "Google",
      color: "bg-white hover:bg-slate-50 text-slate-800 border-slate-200",
      icon: (
        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
          <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.19-5.136 4.19A5.4 5.4 0 0 1 8.5 13.19a5.4 5.4 0 0 1 5.49-5.4c1.478 0 2.82.54 3.858 1.42l3.19-3.19C19.123 3.692 16.513 2.5 13.99 2.5a9.7 9.7 0 0 0-9.74 9.69a9.7 9.7 0 0 0 9.74 9.69c5.23 0 9.54-3.79 9.54-9.69a8.6 8.6 0 0 0-.15-1.9H12.24Z" />
        </svg>
      ),
      guestEmail: "alex.mercer@gmail.com",
      guestName: "Alex Mercer"
    },
    {
      id: "microsoft",
      name: "Microsoft",
      color: "bg-[#2F2F2F] hover:bg-[#1F1F1F] text-white border-transparent",
      icon: (
        <svg className="w-4 h-4 mr-3" viewBox="0 0 23 23">
          <path fill="#f35325" d="M0 0h11v11H0z"/>
          <path fill="#80bb0a" d="M12 0h11v11H12z"/>
          <path fill="#00a1f1" d="M0 12h11v11H0z"/>
          <path fill="#ffb900" d="M12 12h11v11H12z"/>
        </svg>
      ),
      guestEmail: "s.connors@outlook.com",
      guestName: "Sarah Connors"
    },
    {
      id: "apple",
      name: "Apple",
      color: "bg-black hover:bg-neutral-900 text-white border-transparent",
      icon: (
        <svg className="w-4 h-4 mr-3 fill-current text-white" viewBox="0 0 170 170">
          <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.04-1.92-14.12-6.13-3.01-2.51-6.75-7.03-11.22-13.56-4.75-6.84-9.13-16.1-13.15-27.78C8.36 104.28 6.33 90.16 6.33 76c0-13.14 3.11-23.95 9.35-32.4 6.24-8.46 14.12-12.73 23.63-12.82 4.41 0 9.21 1.25 14.41 3.75 5.2 2.5 8.79 3.75 10.77 3.75 1.98 0 5.46-1.21 10.43-3.64 4.97-2.42 9.69-3.61 14.14-3.56 10.11.1 18.2 3.81 24.28 11.13 4.54 5.51 7.6 12.06 9.17 19.64-11.21 5.31-18.06 12.42-20.55 21.32-2.5 8.9-1.54 17.15 2.87 24.77 4.41 7.63 10.51 12.39 18.29 14.28-2.6 7.4-5.92 14.48-9.94 21.28v.13zM119.22 19c0-6.12 2.13-11.79 6.38-17C118.8 3.51 113.34 7.64 109.18 14.4c-4.16 6.76-6.14 13.5-5.93 20.21 6.13.42 11.66-1.63 15.98-6.15 4.31-4.52 6.51-10.42 6.51-17.7a1.2 1.2 0 0 0 .15-.22l-.12-.24z" />
        </svg>
      ),
      guestEmail: "j.dupont@icloud.com",
      guestName: "Jean Dupont"
    },
    {
      id: "facebook",
      name: "Facebook",
      color: "bg-[#1877F2] hover:bg-[#166FE5] text-white border-transparent",
      icon: (
        <svg className="w-5 h-5 mr-3 fill-current text-white" viewBox="0 0 24 24">
          <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
        </svg>
      ),
      guestEmail: "zuck@fb.com",
      guestName: "Marc Zuckerberg"
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      color: "bg-[#0A66C2] hover:bg-[#004182] text-white border-transparent",
      icon: (
        <svg className="w-5 h-5 mr-3 fill-current text-white" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      guestEmail: "elena.rostova@linkedin.com",
      guestName: "Elena Rostova"
    }
  ];

  const handleStartSimulatedAuth = (prov: typeof oauthProviders[0]) => {
    setActiveProvider(prov.name);
    setSimulatedStep(1);
    
    // Simulate connection step intervals
    setTimeout(() => {
      setSimulatedStep(2);
      setTimeout(() => {
        setSimulatedStep(3);
        setTimeout(() => {
          // Trigger successful login override
          onLoginSimulate(prov.id, prov.guestEmail, prov.guestName);
          setShowAuthModal(false);
          setActiveProvider(null);
          setSimulatedStep(0);
        }, 1200);
      }, 1000);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#0b1329] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white font-sans overflow-x-hidden">
      {/* BACKGROUND DECORATIVE ELEMENTS */}
      <div className="absolute top-0 left-1/4 w-[350px] h-[350px] bg-indigo-650/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[200px] h-[200px] bg-blue-600/10 rounded-full blur-[90px] pointer-events-none" />

      {/* HEADER NAVBAR */}
      <header className="border-b border-slate-800/60 sticky top-0 bg-[#0b1329]/80 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-500 text-white flex items-center justify-center font-black text-lg shadow-indigo-500/25 shadow-md">
              H
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-tight text-white font-display flex items-center gap-1.5">
                HelpMeTo Prompt
                <span className="text-[9px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full font-bold">
                  PROMPT ENGINE
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onEnterGuest}
              className="px-3.5 py-1.5 text-xs text-slate-300 hover:text-white font-medium hover:bg-slate-800/40 rounded-lg transition cursor-pointer"
            >
              Mode Invité (Visualiser)
            </button>
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-600/20 hover:scale-[1.02] active:scale-[0.98] transition duration-200 cursor-pointer"
            >
              Se Connecter
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-16 pb-20 max-w-5xl mx-auto text-center space-y-8 z-10">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1 rounded-full text-indigo-400 text-xs font-semibold animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Nouveau : Sauvegarde et versioning Cloud de vos prompts sémantiques</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.15] font-display">
          Concevez des Sites Web Parfaits <br/>
          <span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
            Ajustés au Millimètre pour Antigravity
          </span>
        </h1>

        <p className="text-slate-300 antialiased text-base max-w-2xl mx-auto font-normal leading-relaxed">
          HelpMeTo Prompt vous guide pour assembler visuellement l'identité de marque, la charte graphique, les animations, le plan de site et le référencement SEO afin d'injecter des instructions ultra-structurées dans les fichiers et ainsi piloter l'IA de façon rigoureuse.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => setShowAuthModal(true)}
            className="w-full sm:w-auto px-7 py-3.5 text-sm font-extrabold bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl shadow-xl shadow-indigo-600/20 hover:translate-y-[-1px] transition active:translate-y-0 cursor-pointer flex items-center justify-center gap-2"
          >
            S'inscrire & Sauvegarder vos Prompts
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
          
          <button
            onClick={onEnterGuest}
            className="w-full sm:w-auto px-6 py-3.5 text-sm font-bold bg-slate-800/60 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-2xl transition cursor-pointer flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 text-indigo-400 fill-indigo-400" />
            Lancer le Configurateur (Sans Compte)
          </button>
        </div>

        {/* Feature quick tags */}
        <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto text-xs text-slate-400 font-mono">
          <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/50 flex items-center justify-center gap-2">
            <span className="h-2 w-2 rounded-full bg-indigo-500" />
            <span>Multi-Pages Illimitées</span>
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/50 flex items-center justify-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Raccords CSS Tailwind</span>
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/50 flex items-center justify-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span>Générateur SEO Sémantique</span>
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/50 flex items-center justify-center gap-2">
            <span className="h-2 w-2 rounded-full bg-pink-500" />
            <span>Animations Séquencées</span>
          </div>
        </div>
      </section>

      {/* THREE VALUE PILLARS */}
      <section className="bg-slate-950/50 py-16 border-t border-b border-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-12">
            <span className="text-[10px] font-extrabold uppercase font-mono tracking-widest text-indigo-400">LES AVANTAGES CLÉS</span>
            <h2 className="text-2xl font-extrabold text-white">Pourquoi utiliser HelpMeTo Prompt ?</h2>
            <p className="text-slate-400 text-sm max-w-lg mx-auto">La construction d'un site par prompt souffre généralement du manque d'informations structurées. Voici notre solution :</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/50 space-y-4 hover:border-indigo-500/30 transition duration-300">
              <div className="h-10 w-10 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Organisation Sémantique</h3>
              <p className="text-slate-350 text-xs leading-relaxed">
                Configurez l'arborescence des sous-pages et définissez pour chacune exactement quelles sections doivent figurer (Bannière, Carrousel, Formulaires, Cartes Bento). L'IA n'invente plus : elle applique.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/50 space-y-4 hover:border-emerald-500/30 transition duration-300">
              <div className="h-10 w-10 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Préréglage Visuel complet</h3>
              <p className="text-slate-350 text-xs leading-relaxed">
                Sélectionnez l'un de nos thèmes graphiques élaborés ou personnalisez au pixel près les coloris de fond, de police et d'accentuation, accompagnés de vos snippets CSS personnalisés.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/50 space-y-4 hover:border-indigo-550/30 transition duration-300">
              <div className="h-10 w-10 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center">
                <Code className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Création interactive en arrière-plan</h3>
              <p className="text-slate-350 text-xs leading-relaxed">
                L'application enregistre en temps réel de vrais fichiers (`instructions.md`, `style.css` et `script.js`) sur le workspace d'Antigravity via notre API locale Node.js Express.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS / TIMELINE */}
      <section className="py-16 max-w-5xl mx-auto px-4">
        <div className="text-center space-y-2 mb-12">
          <span className="text-[10px] font-extrabold uppercase font-mono tracking-widest text-emerald-400 font-display">PROCESSUS DE CRÉATION</span>
          <h2 className="text-2xl font-extrabold text-white">Pilotez votre IA en 6 étapes simples</h2>
        </div>

        <div className="relative border-l-2 border-slate-800 ml-4 md:ml-32 space-y-12">
          {/* Step 1 */}
          <div className="relative pl-8">
            <span className="absolute -left-[13px] top-1 h-6 w-6 rounded-full bg-slate-900 border-2 border-indigo-500 text-white flex items-center justify-center text-[10px] font-extrabold">1</span>
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Vision du Projet</h4>
              <p className="text-sm font-semibold text-white">Déclarez brièvement le but du site</p>
              <p className="text-xs text-slate-400">Renseignez un descriptif d'intention générale rédigé par vos soins, comme guide sémantique fondamental.</p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative pl-8">
            <span className="absolute -left-[13px] top-1 h-6 w-6 rounded-full bg-slate-900 border-2 border-indigo-500 text-white flex items-center justify-center text-[10px] font-extrabold">2</span>
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Arborescence & Plan</h4>
              <p className="text-sm font-semibold text-white">Édifiez la structure hiérarchique</p>
              <p className="text-xs text-slate-400">Insérez votre plan de site (menus et sous-menus) : l'application le digérera automatiquement en structure arborescente.</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative pl-8">
            <span className="absolute -left-[13px] top-1 h-6 w-6 rounded-full bg-slate-900 border-2 border-indigo-500 text-white flex items-center justify-center text-[10px] font-extrabold">3</span>
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Charte Graphique sémantique</h4>
              <p className="text-sm font-semibold text-white">Choisissez des contrastes d'excellence</p>
              <p className="text-xs text-slate-400">Définissez des thèmes visuels optimisés (Minimaliste, Cyberpunk, Orange Vitality) intégrant des contrastes parfaitement lisibles.</p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="relative pl-8">
            <span className="absolute -left-[13px] top-1 h-6 w-6 rounded-full bg-slate-900 border-2 border-indigo-500 text-white flex items-center justify-center text-[10px] font-extrabold">4</span>
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Animations, Layouts & SEO</h4>
              <p className="text-sm font-semibold text-white">Séquencez l'interactivité pas-à-pas</p>
              <p className="text-xs text-slate-400">Affectez un motif d'apparition (Fade, Slide, Pop) par page, définissez les métadonnées de référencement SEO et les layouts (Magasine Bento Grid, colonnes).</p>
            </div>
          </div>

          {/* Step 5 */}
          <div className="relative pl-8">
            <span className="absolute -left-[13px] top-1 h-6 w-6 rounded-full bg-slate-900 border-2 border-indigo-500 text-white flex items-center justify-center text-[10px] font-extrabold font-mono">5</span>
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Compte Connecté & Raccordement</h4>
              <p className="text-sm font-semibold text-emerald-300">Enregistrez à tout moment vos créations</p>
              <p className="text-xs text-slate-400">Utilisez notre espace de connexion pour associer vos designs à un espace personnel cloud, permettant la sauvegarde instantanée de vos prompts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-slate-900 bg-[#060b18] py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} HelpMeTo Prompt. Conçu pour le dôme d'assemblage d'Antigravity.</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-350 cursor-pointer">Conditions</span>
            <span className="hover:text-slate-350 cursor-pointer">Mentions</span>
            <span className="hover:text-slate-350 cursor-pointer text-indigo-400 font-bold" onClick={() => setShowAuthModal(true)}>Se Connecter</span>
          </div>
        </div>
      </footer>

      {/* OAUTH AUTHENTICATION COMPACT SUPER POLISHED DIALOG */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-[#141f36] border border-slate-800 rounded-2xl max-w-md w-full p-6 sm:p-8 space-y-6 relative shadow-2xl">
            {/* Close */}
            <button
              onClick={() => { if (!activeProvider) setShowAuthModal(false); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white font-bold cursor-pointer transition text-base disabled:opacity-30"
              disabled={activeProvider !== null}
            >
              ✕
            </button>

            {/* Header */}
            <div className="text-center space-y-2">
              <div className="mx-auto h-12 w-12 bg-gradient-to-tr from-indigo-500 to-emerald-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/10">
                H
              </div>
              <h3 className="text-lg font-black text-white">Espace de Connexion HelpMeTo Prompt</h3>
              <p className="text-xs text-slate-400">
                Connectez-vous via l'un des fournisseurs ci-dessous pour activer la sauvegarde instantanée de vos structures de prompts.
              </p>
            </div>

            {/* Simulated oauth steps */}
            {activeProvider ? (
              <div className="py-8 text-center space-y-4">
                <div className="relative inline-flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                  <div className="absolute text-xs font-extrabold text-indigo-400 animate-pulse font-mono">
                    {simulatedStep * 33}%
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-200">
                    Connexion en cours via <span className="text-indigo-400">{activeProvider}</span>...
                  </p>
                  <p className="text-xs text-slate-500 font-mono">
                    {simulatedStep === 1 && "➜ Requête d'autorisation émise..."}
                    {simulatedStep === 2 && "➜ Synchronisation du profil et token d'accès sémantique..."}
                    {simulatedStep === 3 && "➜ Finalisation et attribution de votre jeton d'espace..."}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {oauthProviders.map((prov) => (
                  <button
                    key={prov.id}
                    onClick={() => handleStartSimulatedAuth(prov)}
                    className={`w-full py-3 px-4 text-xs font-bold rounded-xl border flex items-center justify-center text-center transition-all cursor-pointer shadow-sm active:scale-[0.98] ${prov.color}`}
                  >
                    {prov.icon}
                    <span>Se connecter avec {prov.name}</span>
                  </button>
                ))}

                <button
                  onClick={() => {
                    setShowAuthModal(false);
                    onEnterGuest();
                  }}
                  className="w-full py-3 px-4 text-xs font-bold text-slate-400 hover:text-white bg-slate-800/40 hover:bg-slate-800/80 rounded-xl transition cursor-pointer text-center"
                >
                  Continuer en Mode Invité (Sans connexion)
                </button>
              </div>
            )}

            <div className="flex gap-2 items-center justify-center border-t border-slate-800/80 pt-4.5 text-[10.5px] text-slate-500">
              <Shield className="w-3.5 h-3.5 text-indigo-400/80" />
              <span>Garantie de sécurité sémantique chiffrée SSL client-side</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
