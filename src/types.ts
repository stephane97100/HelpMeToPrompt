export interface MenuItem {
  id: string;
  label: string;
  level: 1 | 2;
  href: string;
  subItems: MenuItem[];
  sections: string[]; // custom sections like header, carousel, contact, cards
}

export interface DesignTheme {
  id: string;
  name: string;
  description: string;
  bgColor: string;
  textColor: string;
  accentColor: string;
  navBgColor: string;
  footerBgColor: string;
  fontFamily: string;
  cssFramework: "tailwind" | "bootstrap" | "advantix" | "custom_css";
}

export interface LayoutPreset {
  id: "one_column" | "two_column" | "magazine";
  name: string;
  description: string;
  structure: string;
  advantages: string;
}

export const PRESET_LAYOUTS: LayoutPreset[] = [
  {
    id: "one_column",
    name: "Une Colonne (Épuré & Linéaire)",
    description: "Un flux vertical harmonieux centré, parfait pour lire de haut en bas sans distraction visuelle.",
    structure: "En-tête -> sections empilées de largeur maximale contrôlée (Centered Stack) -> Pied de page.",
    advantages: "Excellente clarté, simplicité absolue sur mobile, temps de chargement ultra-rapide et impact fort sur le message."
  },
  {
    id: "two_column",
    name: "Deux Colonnes (Modulaire & Sidebar)",
    description: "Une colonne latérale fixe ou flottante (Sidebar) pour la navigation ou les rappels, à côté du contenu principal.",
    structure: "En-tête -> (Menu de navigation latérale / Widget SEO + Flux de contenu adjacent) -> Pied de page.",
    advantages: "Navigation ultra-rapide, idéal pour documentations techniques, blogs d'information, espaces d'administration ou wikis."
  },
  {
    id: "magazine",
    name: "Magazine Bento Grid (Visuel & Créatif)",
    description: "Une grille asymétrique ordonnée intégrant des cartes de dimensions variables pour un rendu riche et rythmé.",
    structure: "En-tête -> Grille interactive Bento asymétrique (Cards s'étalant sur 2 ou 3 colonnes) -> Pied de page.",
    advantages: "Excellente mise en avant médiatique (portfolio, e-commerce), esthétique moderne mémorable et distribution de contenus denses."
  }
];

export interface SectionContent {
  headerLogoText: string;
  headerLogoFile: string; // Base64 or object URL
  heroTitle: string;
  heroSubtitle: string;
  heroCtaText: string;
  heroImageFile: string; // Base64 or object URL
  carouselSlides: Array<{
    title: string;
    text: string;
    imageFile: string;
  }>;
  cardsTitle: string;
  cardsSubtitle: string;
  cardsItems: Array<{
    title: string;
    desc: string;
    imageFile: string;
  }>;
  contactTitle: string;
  contactBtnText: string;
  footerCopyright: string;
  footerLink1: string;
  footerLink2: string;
}

export const PRESET_THEMES: DesignTheme[] = [
  {
    id: "minimaliste",
    name: "Minimaliste Moderne",
    description: "Un rendu épuré, axé sur la clarté et le vide spatial typographique. Idéal pour portfolios ou produits design.",
    bgColor: "#f9fafb", // Off-white
    textColor: "#111827", // Dark gray
    accentColor: "#4f46e5", // Indigo
    navBgColor: "#ffffff",
    footerBgColor: "#f3f4f6",
    fontFamily: "Inter, sans-serif",
    cssFramework: "tailwind"
  },
  {
    id: "professionnel",
    name: "Professionnel Corporate",
    description: "Un look de confiance et d'autorité avec des bleus profonds et une structure de grille stable et soignée.",
    bgColor: "#f0f4f8",
    textColor: "#0f172a",
    accentColor: "#0284c7", // Ocean blue
    navBgColor: "#0f172a", // Dark nav
    footerBgColor: "#0f172a",
    fontFamily: "Inter, sans-serif",
    cssFramework: "bootstrap"
  },
  {
    id: "creatif",
    name: "Créatif Vibrator",
    description: "Une palette chaleureuse et créative avec un orange corail audacieux, des contrastes dynamiques et de la vitalité.",
    bgColor: "#fffaf0", // Warm apricot/sand tint
    textColor: "#1e1e24",
    accentColor: "#f97316", // Coral Orange
    navBgColor: "#fffbeb",
    footerBgColor: "#1e1e24",
    fontFamily: "Space Grotesk, sans-serif",
    cssFramework: "advantix"
  },
  {
    id: "cyberpunk",
    name: "Neo Tech (Dark Mode)",
    description: "Un environnement immersif néon de style cyberpunk. Idéal pour projets techniques ou crypto.",
    bgColor: "#090d16",
    textColor: "#e2e8f0",
    accentColor: "#10b981", // Emerald green neon
    navBgColor: "#030712",
    footerBgColor: "#030712",
    fontFamily: "JetBrains Mono, monospace",
    cssFramework: "tailwind"
  }
];

export interface FileStatus {
  filename: string;
  exists: boolean;
  mode: string;
  isReadable: boolean;
  isWritable: boolean;
  content: string;
}
