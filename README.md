# HelpMeToCode (AideMoiÀCoder) 🚀

**HelpMeToCode** est un assistant interactif conçu spécifiquement pour structurer, chartrer et de concevoir des sites web responsives haut de gamme, sans avoir besoin d'une base de données complexe. Il compile l'ensemble de vos choix fonctionnels et visuels pour générer le **prompt et cahier des charges de développement parfait pour l'assistant Antigravity**.

---

## 🎯 Objectif de l'application

HelpMeToCode résout le problème de l'imprécision des prompts de design. Plutôt que de demander à l'IA de générer un site "au hasard", l'application vous accompagne pas à pas pour configurer :
1. **Une vision cible** rédigée de manière humaine.
2. **Une arborescence de menu** imbriquée et structurée en cascade.
3. **Une charte de couleurs** contrastée et équilibrée via des thèmes intégrés.
4. **Des frameworks de style** (Tailwind, Bootstrap, Advantix) ou des feuilles custom (`style.css`).
5. **Des transitions et animations javascript** adaptées par page (compilées dans `script.js`).
6. **L'agencement des éléments sémantiques indispensables** page-par-page (Header, Carrousel, Formulaire, Pied de page).

Après compilation, il crée automatiquement les fichiers requis et prépare le **Prompt Ultime** à copier-coller dans Antigravity.

---

## 🛠️ Guide d'Utilisation Étape par Étape

### Étape 1 : Définir l'Idée Générale (Génération de `instructions.md`)
Saisissez dans l'éditeur de texte la vision globale de votre site (son sujet, sa cible, son ton).
*   En cliquant sur le bouton **"Générer instructions.md"** (ou sur l'appareil à synchronisation complète), l'application écrit et sauvegarde à la racine de votre projet un fichier `instructions.md` contenant l'intégralité du cahier des charges sémantique ainsi mis en forme.

### Étape 2 : Dessiner le Plan du Site & les Liens
Précisez l'arborescence des pages de votre site en utilisant une syntaxe d'indents par tirets ultra-claire :
*   Un tiret simple (`-`) devant un item crée un lien de menu principal (Niveau 1).
*   Deux tirets consécutifs (`--`) devant un item l'imbrique comme sous-menu (Niveau 2) du précédent lien.
*   *Exemple :*
    ```text
    - Accueil
    - Prestations
    -- Conception UX
    -- Intégration Code
    - Contact
    ```

### Étape 3 : Définir les Thématiques & Couleurs Obligatoires
Choisissez parmi des thèmes d'inspiration prédéfinis (**Minimaliste**, **Professionnel Corporate**, **Créatif Vibrator**, ou **Neo Tech Dark Mode**). Vous pouvez aussi affiner manuellement les couleurs clés :
*   Background du corps (`body`).
*   Couleur du texte principal.
*   Couleur d'accentuation (CTA, état de focus).
*   Couleurs d'en-tête (`.nav`) et de bas de page (`.footer`).

### Étape 4 : Choisir la Base CSS & les Animations par Page
*   Précisez le framework visuel souhaité (Tailwind CSS, Bootstrap, Advantix ou style.css personnalisé).
*   Sélectionnez le dynamisme attendu par page (Fade-In, Slide-Up, Pop-In, Slide-Left). L'application assemble ces régles pour configurer son fichier d'interactivité d'animations rattaché `/script.js`.

### Étape 5 : Sélectionner les Sections par Page & Copier le Prompt
Configurez pour chaque page la liste des sections requises (Header, Hero, Carrousel, Cartes de contenu ou Formulaire).
En bas, copiez le **Prompt Ultime** qui débute exactement par la formule :
> *"Tu es un développeur full-stack avec 20 ans d'expérience, développe pour moi ce site avec les instructions développées avec cette application..."*

---

## 🔐 Guide de vérification des Permissions CHMOD

Pour que le serveur d'arrière-plan de l'application puisse créer ou écraser les fichiers `instructions.md`, `style.css` et `script.js` dans le conteneur sandboxed d'Antigravity, les droits de lecture et d'écriture du système doivent être accordés.

### Comment vérifier les droits depuis l'Application ?
L'en-tête de HelpMeToCode intègre un module de diagnostic automatique :
*   🟢 **Badge Vert (Actif / R et W) :** Le fichier existe et est entièrement accessible en lecture et en écriture. Tout fonctionne !
*   🔴 **Badge Rouge (Requis / N/A) :** Le fichier a des restrictions d'autorisation ou n'a pas pu être écrit.

### Résoudre les restrictions en activant le CHMOD :
Si l'application vous indique un échec à l'écriture, ouvrez un terminal de commande lié à l'espace de travail et tapez la commande d'autorisation d'écriture suivante :

```bash
# Accorder des droits d'accès et d'écriture standard
chmod 644 instructions.md style.css script.js
```

Si vous souhaitez temporairement libérer entièrement les permissions pour tous les utilitaires locaux (mode permissif maximal) :

```bash
chmod 777 instructions.md style.css script.js
```

---

## 🖥️ Technologie & Mode Développement

L'application HelpMeToCode est construite en architecture moderne full-stack :
*   **Frontend :** React 19, TypeScript, Tailwind CSS, Lucide-React.
*   **Backend :** Node.js, Express, middleware de service de développement Vite.
*   **Raccords d'écriture :** API REST sécurisée sur `/api/save-file` et `/api/file-status` pour écrire sur le disque du conteneur en direct.
