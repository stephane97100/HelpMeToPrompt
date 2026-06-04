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
