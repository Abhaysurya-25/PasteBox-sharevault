import { app } from "./app.js";
import connectDB from "./db/index.js";
import { logMailStartupStatus } from "./config/mail.js";
import fileRoutes from "./routes/file.routes.js"
import userRoutes from "./routes/user.routes.js"
import path from 'path';
const __dirname = path.resolve();

import express from "express"
import cors from "cors"
const PORT=process.env.PORT || 5600;

      
const startServer = async () => {
     try {
    await connectDB();

    // Register routes
    app.use("/api/files", fileRoutes);
    app.use("/api/users", userRoutes); // 👈 Now you can use /api/users endpoints

    app.use(express.static(path.join(__dirname, '/client')));

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

    app.get("/f/:shortCode", (req, res) => {
      res.redirect(302, `${frontendUrl}/f/${req.params.shortCode}`);
    });

    app.get("/g/:shortCode", (req, res) => {
      res.redirect(302, `${frontendUrl}/g/${req.params.shortCode}`);
    });

    app.listen(PORT, () => {
      console.log(`✅ Server is running at http://localhost:${PORT}`);
      logMailStartupStatus();
    });
  } catch (error) {
    console.error("❌ Error starting server:", error);
  }
  };
  
  startServer();