import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Helper function to get safe filepath in workspace
function getSafePath(filename: string): string {
  const allowedFiles = ["instructions.md", "style.css", "script.js", "README.md"];
  if (!allowedFiles.includes(filename)) {
    throw new Error("Nom de fichier non autorisé.");
  }
  return path.join(process.cwd(), filename);
}

// Endpoint to save a file (instructions.md, style.css, script.js)
app.post("/api/save-file", (req, res) => {
  try {
    const { filename, content } = req.body;
    if (!filename || content === undefined) {
      return res.status(400).json({ error: "Paramètres filename et content requis." });
    }

    const filepath = getSafePath(filename);
    
    // Write file content
    fs.writeFileSync(filepath, content, "utf8");

    // Try to set CHMOD to 644 (readable by all, writable by owner)
    // and handle potential OS restrictions gracefully.
    let chmodSuccess = false;
    let currentMode = "Inconnu";
    try {
      fs.chmodSync(filepath, 0o644);
      const stat = fs.statSync(filepath);
      currentMode = "0" + (stat.mode & 0o777).toString(8);
      chmodSuccess = true;
    } catch (chmodErr: any) {
      console.warn("Erreur chmodSync:", chmodErr.message);
    }

    res.json({
      success: true,
      filename,
      filepath,
      chmodSuccess,
      mode: currentMode,
      message: `Fichier '${filename}' enregistré avec succès.`
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Erreur lors de l'écriture du fichier." });
  }
});

// Endpoint to check status and read files
app.get("/api/file-status", (req, res) => {
  try {
    const files = ["instructions.md", "style.css", "script.js", "README.md"];
    const statusResult = files.map((file) => {
      const filepath = path.join(process.cwd(), file);
      const exists = fs.existsSync(filepath);
      let mode = "Non existant";
      let isReadable = false;
      let isWritable = false;
      let content = "";

      if (exists) {
        try {
          const stat = fs.statSync(filepath);
          mode = "0" + (stat.mode & 0o777).toString(8);
          // Simple read check
          fs.accessSync(filepath, fs.constants.R_OK);
          isReadable = true;
          fs.accessSync(filepath, fs.constants.W_OK);
          isWritable = true;
          content = fs.readFileSync(filepath, "utf8");
        } catch (e) {
          // accessSync throws on fail
        }
      }

      return {
        filename: file,
        exists,
        mode,
        isReadable,
        isWritable,
        content: exists ? content : ""
      };
    });

    res.json({ success: true, files: statusResult });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Erreur de lecture du statut." });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    console.log("Démarrage en mode développement avec middleware Vite...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Démarrage en mode production...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
