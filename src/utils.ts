import { MenuItem, DesignTheme } from "./types";

/**
 * Parses indented text structure into a recursive MenuItem list.
 * '-' denotes level 1 menu links.
 * '--' denotes level 2 submenu links.
 */
export function parseMenuStructure(
  rawText: string,
  sectionsMap: Record<string, string[]>
): MenuItem[] {
  const lines = rawText.split("\n");
  const items: MenuItem[] = [];
  let lastL1Item: MenuItem | null = null;

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    // Check level 2 (starts with --)
    if (trimmed.startsWith("--")) {
      const label = trimmed.slice(2).trim();
      const id = slugify(label);
      const subItem: MenuItem = {
        id,
        label,
        level: 2,
        href: `#${id}`,
        subItems: [],
        sections: sectionsMap[id] || ["header", "features", "footer"]
      };

      if (lastL1Item) {
        lastL1Item.subItems.push(subItem);
      } else {
        // Fallback to L1 if no parent exists
        subItem.level = 1;
        items.push(subItem);
        lastL1Item = subItem;
      }
    } else if (trimmed.startsWith("-")) {
      // Level 1
      const label = trimmed.slice(1).trim();
      const id = slugify(label);
      const l1Item: MenuItem = {
        id,
        label,
        level: 1,
        href: `#${id}`,
        subItems: [],
        sections: sectionsMap[id] || ["header", "hero", "cards", "footer"]
      };
      items.push(l1Item);
      lastL1Item = l1Item;
    }
  });

  return items;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

/**
 * Format instructions.md content
 */
export function generateInstructionsMarkdown(
  siteDesc: string,
  structureText: string,
  theme: DesignTheme,
  customCss: string,
  animationChoices: Record<string, string>,
  scriptJsCode: string,
  menuItems: MenuItem[],
  seoMap?: Record<string, { title: string; description: string }>
): string {
  // Build SEO guidelines block
  let seoBlock = "";
  if (seoMap && Object.keys(seoMap).length > 0) {
    seoBlock = `\n## 6. Paramètres SEO & Référencement (Balises Meta)
Pour chaque page, configurez ces balises de référencement sémantiques :
${menuItems.map(item => {
  const meta = seoMap[item.id] || { title: `${item.label} | Mon Site`, description: `Découvrez la page de ${item.label}.` };
  let s = `- **Page : ${item.label}** (\`${item.id}\`)\n  - **Balise \`<title>\` :** "${meta.title}"\n  - **Balise \`<meta name="description">\` :** "${meta.description}"`;
  if (item.subItems.length > 0) {
    s += "\n" + item.subItems.map(sub => {
      const subMeta = seoMap[sub.id] || { title: `${sub.label} | Mon Site`, description: `Découvrez la sous-page de ${sub.label}.` };
      return `  - **Sous-page : ${sub.label}** (\`${sub.id}\`)\n    - **Balise \`<title>\` :** "${subMeta.title}"\n    - **Balise \`<meta name="description">\` :** "${subMeta.description}"`;
    }).join("\n");
  }
  return s;
}).join("\n")}
`;
  }

  let md = `# Cahier des Charges - Instructions de Génération UX & UI

Ce document a été généré via l'application **HelpMeToCode** pour guider le développement de votre site web interactif de façon totalement responsive et optimisée pour Antigravity.

## 1. Idée Générale & Vision
${siteDesc || "Aucune description fournie pour le moment."}

## 2. Structure Arborecente du Site (Menu & Navigation)
Voici la structure du plan de site validée par l'utilisateur :
\`\`\`
${structureText}
\`\`\`

### Liste des Pages & Sections Configurer
${menuItems.map(item => {
  let s = `- **Page/Ancre : Lvl 1 - ${item.label}** (\`${item.href}\`)\n  - Sections prévues : ${item.sections.map(sec => `\`${sec}\``).join(", ")}`;
  if (item.subItems.length > 0) {
    s += "\n" + item.subItems.map(sub => `  - **Sous-menu : Lvl 2 - ${sub.label}** (\`${sub.href}\`)\n    - Sections prévues : ${sub.sections.map(sec => `\`${sec}\``).join(", ")}`).join("\n");
  }
  return s;
}).join("\n")}

## 3. Charte Graphique & Spécifications Design
La charte graphique impose les éléments obligatoires suivants :
- **Thème Visual sélectionné :** ${theme.name}
- **Couleur de Fond Générale (Background) :** \`${theme.bgColor}\`
- **Couleur du Texte Principal (Base Color) :** \`${theme.textColor}\`
- **Couleur d'Accentuation :** \`${theme.accentColor}\`
- **Couleur du Menu Navigation :** \`${theme.navBgColor}\`
- **Couleur du Pied de Page (Footer) :** \`${theme.footerBgColor}\`
- **Famille de Polices :** \`${theme.fontFamily}\`

### Directives d'applications CSS :
Les styles appliqués doivent correspondre scrupuleusement aux balises parentes recommandées :
- Les hyperliens du Menu doivent résider dans la balise HTML \`.nav a\` (ou \`<nav>\`) avec états :hover, :active calqués sur l'accentuation.
- Les blocs promotionnels et textuels principaux se répartiront dans des balises \`.section\` distinctes et sémantiques.
- Le pied de page doit être encapsulé de manière soignée dans une balise \`.footer\` (ou \`<footer>\`).

## 4. Architecture de Base CSS
- **Framework CSS choisi :** ${theme.cssFramework.toUpperCase()}
${theme.cssFramework === "custom_css" ? `- Le fichier de base CSS est généré via un fichier \`style.css\` personnalisé.` : `- Utilisation recommandée via CDN du framework ${theme.cssFramework}.`}

### Code CSS Suggéré (\`style.css\`)
\`\`\`css
${generateStyleCss(theme, customCss)}
\`\`\`

## 5. Interactions & Dynamisme (JavaScript)
Le comportement de script pour les transitions et événements requis:
- **Animations demandées par Page/Section :**
${Object.entries(animationChoices).map(([pageId, anim]) => `  - Page \`${pageId}\` : Animation d'effet \`${anim}\``).join("\n")}

### Code JavaScript Attendu (\`script.js\`)
\`\`\`javascript
${scriptJsCode || generateScriptJs(animationChoices, menuItems)}
\`\`\`
${seoBlock}
---
*Généré avec succès par HelpMeToCode en date du ${new Date().toLocaleDateString("fr-FR")}*
`;
  return md;
}

/**
 * Create custom style.css template
 */
export function generateStyleCss(theme: DesignTheme, customCss: string): string {
  const base = `/*=========================================
  HelpMeToCode - Feuille de Style Standard
  Palette de Thème: ${theme.name}
  =========================================*/

:root {
  --bg-primary: ${theme.bgColor};
  --text-primary: ${theme.textColor};
  --accent-color: ${theme.accentColor};
  --nav-bg: ${theme.navBgColor};
  --footer-bg: ${theme.footerBgColor};
  --font-base: ${theme.fontFamily};
}

/* Base resets & styles globals */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-family: var(--font-base);
  line-height: 1.6;
  overflow-x: hidden;
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* Style de la balise .nav */
.nav, nav {
  background-color: var(--nav-bg);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  padding: 1rem 2rem;
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.nav a {
  color: var(--text-primary);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease, transform 0.1s ease;
  padding: 0.5rem 1rem;
  border-radius: 4px;
}

.nav a:hover {
  color: var(--accent-color);
  background-color: rgba(0,0,0,0.03);
  transform: translateY(-1px);
}

/* Style des .section */
.section, section {
  padding: 5rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.section a {
  color: var(--accent-color);
  text-decoration: underline;
  transition: opacity 0.2s ease;
}

.section a:hover {
  opacity: 0.8;
}

/* Style de la balise .footer */
.footer, footer {
  background-color: var(--footer-bg);
  padding: 3rem 2rem;
  color: ${theme.footerBgColor === "#0f172a" || theme.footerBgColor === "#1e1e24" || theme.footerBgColor === "#030712" ? "#f3f4f6" : "var(--text-primary)"};
  border-top: 1px solid rgba(0,0,0,0.05);
  margin-top: 4rem;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
  text-align: center;
}

.footer a {
  color: var(--accent-color);
  text-decoration: none;
  font-weight: 500;
}

.footer a:hover {
  text-decoration: underline;
}

/* Utilitaires interactifs repérés */
.btn-accent {
  background-color: var(--accent-color);
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: opacity 0.3s;
}

.btn-accent:hover {
  opacity: 0.9;
}

${customCss ? `/* Règles Personnalisées Utilisateur */\n` + customCss : ""}`;

  return base;
}

/**
 * Generate animations javascript code
 */
export function generateScriptJs(
  animationChoices: Record<string, string>,
  menuItems: MenuItem[]
): string {
  const animationsSerialized = JSON.stringify(animationChoices, null, 2);

  return `/*=========================================
  HelpMeToCode - Script d'Interactivité & Animations
  Intégré et configuré dynamiquement
  =========================================*/

document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 Script d'interaction HelpMeToCode chargé.");

  // Configuration des animations par page
  const pageAnimations = ${animationsSerialized};

  // 1. Initialiser les ancres fluides pour la balise .nav
  const navLinks = document.querySelectorAll(".nav a, nav a");
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth" });
          
          // Déclencher l'animation spécifique de cette section
          const animationType = pageAnimations[targetId];
          if (animationType) {
            triggerAnimation(targetElement, animationType);
          }
        }
      }
    });
  });

  // 2. Détection d'apparition au scroll (Scroll Reveal)
  const observerOptions = {
    root: null,
    threshold: 0.15,
    rootMargin: "0px"
  };

  const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const targetId = entry.target.id;
        const animationType = pageAnimations[targetId] || "fade-in";
        triggerAnimation(entry.target, animationType);
        observer.unobserve(entry.target); // s'anime une seule fois
      }
    });
  }, observerOptions);

  const sections = document.querySelectorAll(".section, section");
  sections.forEach(sec => {
    // Ajouter une classe de départ opaque
    sec.style.opacity = "0";
    sec.style.transition = "all 0.8s cubic-bezier(0.25, 1, 0.5, 1)";
    sectionObserver.observe(sec);
  });

  // 3. Fonction d'animation
  function triggerAnimation(element, type) {
    element.style.opacity = "1";
    
    switch (type) {
      case "fade-in":
        element.style.transform = "translateY(0)";
        break;
      case "slide-up":
        element.style.transform = "translateY(0)";
        break;
      case "pop-in":
        element.style.transform = "scale(1)";
        break;
      case "slide-left":
        element.style.transform = "translateX(0)";
        break;
      case "slide-right":
        element.style.transform = "translateX(0)";
        break;
      default:
        element.style.transform = "none";
    }
    
    // Ajoute une classe d'état pour le style additionnel
    element.classList.add("animated-trigger-" + type);
    console.log(\`Animation déclenchée: \${type} sur le bloc #\${element.id}\`);
  }

  // 4. Animation des cartes au survol (micro-interactions)
  const cards = document.querySelectorAll(".cards-grid .card, .pricing-card");
  cards.forEach(card => {
    card.addEventListener("mouseenter", () => {
      card.style.transform = "scale(1.03) translateY(-5px)";
      card.style.boxShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)";
      card.style.transition = "transform 0.3s ease, box-shadow 0.3s ease";
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "scale(1) translateY(0)";
      card.style.boxShadow = "none";
    });
  });

  // 5. Gestionnaire de Dropdown (Sous-menus de la .nav)
  const dropParents = document.querySelectorAll(".nav-item-has-submenu");
  dropParents.forEach(parent => {
    parent.addEventListener("mouseenter", () => {
      const dropdown = parent.querySelector(".nav-dropdown");
      if (dropdown) dropdown.style.display = "block";
    });
    parent.addEventListener("mouseleave", () => {
      const dropdown = parent.querySelector(".nav-dropdown");
      if (dropdown) dropdown.style.display = "none";
    });
  });
});
`;
}

/**
 * Core Ultimate Developer Prompt Creator
 */
export function generateUltimatePrompt(
  siteDesc: string,
  structureText: string,
  theme: DesignTheme,
  customCss: string,
  animationChoices: Record<string, string>,
  scriptJsCode: string,
  menuItems: MenuItem[],
  useCustomCss: boolean,
  seoMap?: Record<string, { title: string; description: string }>
): string {
  const stylingApproach = theme.cssFramework === "custom_css" || useCustomCss
    ? "un fichier `style.css` haut de gamme sur-mesure"
    : `le framework CSS ${theme.cssFramework.toUpperCase()}`;

  let seoPromptSection = "";
  if (seoMap && Object.keys(seoMap).length > 0) {
    seoPromptSection = `\n7. CONSIGNES SEO (OPTIMISATION SÉMANTIQUE & BALISES) :
Pour chaque page créée, vous devez impérativement injecter ces balises d'identification de l'onglet et de référencement dans sa balise <head> respective :
${menuItems.map(item => {
  const meta = seoMap[item.id] || { title: `${item.label} | Mon Site`, description: `Découvrez la page de ${item.label}.` };
  let s = `- Page : ${item.label} (ID ID HTML: #${item.id})\n  * <title>${meta.title}</title>\n  * <meta name="description" content="${meta.description}">`;
  if (item.subItems.length > 0) {
    s += "\n" + item.subItems.map(sub => {
      const subMeta = seoMap[sub.id] || { title: `${sub.label} | Mon Site`, description: `Découvrez la sous-page de ${sub.label}.` };
      return `  - Sous-page : ${sub.label} (ID HTML: #${sub.id})\n    * <title>${subMeta.title}</title>\n    * <meta name="description" content="${subMeta.description}">`;
    }).join("\n");
  }
  return s;
}).join("\n")}
`;
  }

  const prompt = `Tu es un developpeur full-stack avec 20 ans d'expérience, développe pour moi ce site avec les instructions développées avec cette application :

=========================================
FICHE TECHNIQUE & CAHIER DES CHARGES DU SITE RESPONSIVE
=========================================

1. VISION & DESCRIPTION DE L'IDÉE GÉNÉRALE :
"${siteDesc || "Générer un site web moderne et intuitif pour servir au mieux les besoins de l'utilisateur."}"

2. STRUCTURE ARBORESCENTE DES PAGES (PLAN) :
${structureText}

3. SÉLECTIONS DE L'INTERFACE UTILISATEUR & CONTRASTES (IMPORTANT) :
- Thème d'ambiance visuelle : ${theme.name}
- Palette de Couleurs :
  * Couleur de Fond Principale : ${theme.bgColor}
  * Couleur de Texte Principal : ${theme.textColor}
  * Couleur d'Accentuation Dynamique (cta, boutons, hover) : ${theme.accentColor}
  * Couleur de fond du Menu principal : ${theme.navBgColor}
  * Couleur de fond du Pied de page : ${theme.footerBgColor}
- Police de caractères à charger : ${theme.fontFamily}

IMPORTANT POUR LA CONCORDANCE DE STYLE :
- Tous les liens hypertexte du menu de navigation doivent être imbriqués impérativement dans un parent de classe \`.nav\` ou une balise \`<nav>\`.
- Tous les liens du bas de page se placent dans la balise \`.footer\` ou \`<footer>\`.
- Chaque bloc principal de contenu s'organise et se distribue à l'intérieur de balises de classe \`.section\` ou balises \`<section>\`.
- Les liens hypertexte se colorent sur le hover avec la couleur d'accentuation d'éclat : ${theme.accentColor} !

4. CHOIX ET FRAMEWORK STYLE CSS :
- Approche : Utiliser ${stylingApproach}.
- Code source de style suggéré ou enrichi :
\`\`\`css
${generateStyleCss(theme, customCss)}
\`\`\`

5. LOGIQUE DES ANIMATIONS ET INTERACTIVITÉ :
- Code d'interactivité et animations JavaScript intégrées par page (à placer dans /script.js pour dynamiser les transitions) :
\`\`\`javascript
${scriptJsCode || generateScriptJs(animationChoices, menuItems)}
\`\`\`

6. DIRECTIVES PAR PAGE ET SECTIONS SPÉCIFIQUES :
${menuItems.map(item => {
  let details = `- PAGE [${item.label}] :
  * Sections configurées à intégrer impérativement dans l'ordre vertical : ${item.sections.map(s => s.toUpperCase()).join(" -> ")}`;
  if (item.subItems.length > 0) {
    details += "\n" + item.subItems.map(sub => `  * SOUS-PAGE [${sub.label}] : Sections prévues : ${sub.sections.map(s => s.toUpperCase()).join(" -> ")}`).join("\n");
  }
  return details;
}).join("\n")}
${seoPromptSection}
CONSIGNES DE PRODUCTION FINALE :
- Le site internet doit être extrêmement élégant, moderne, et 100% responsive sur mobile, tablette et desktop (utilisation de Flexbox et Grid CSS).
- Aucun framework lourd de base de données ne doit être utilisé; conservez un squelette performant, fluide et entièrement client-side, prêt pour un déploiement direct et hautement optimisé d'interface statique pour l'assistant Antigravity.
- Produisez un code unique, propre, entièrement implémenté de A à Z sans placeholders ni commentaires de troncature, prêt à copier direct dans index.html (comprenant les balises CSS, structures de grille, et scripts reliés).`;

  return prompt;
}
