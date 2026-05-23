import { app } from "./app.js";
import connectDB from "./db/index.js";
import { logMailStartupStatus } from "./config/mail.js";
import fileRoutes from "./routes/file.routes.js";
import userRoutes from "./routes/user.routes.js";
import path from "path";
import express from "express";

const __dirname = path.resolve();
const PORT = process.env.PORT || 5600;
const frontendUrl =
  process.env.FRONTEND_URL ||
  process.env.CLIENT_URL ||
  process.env.BASE_URL;

const redirectToFrontend = (res, route) => {
  if (!frontendUrl) {
    return res.status(500).json({
      error: "Frontend URL is not configured. Set FRONTEND_URL or BASE_URL in server/.env.",
    });
  }

  return res.redirect(302, `${frontendUrl.replace(/\/$/, "")}${route}`);
};

const startServer = async () => {
  try {
    await connectDB();

    app.use("/api/files", fileRoutes);
    app.use("/api/users", userRoutes);
    app.use(express.static(path.join(__dirname, "/client")));

    app.get("/f/:shortCode", (req, res) => {
      redirectToFrontend(res, `/f/${req.params.shortCode}`);
    });

    app.get("/g/:shortCode", (req, res) => {
      redirectToFrontend(res, `/g/${req.params.shortCode}`);
    });

    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
      logMailStartupStatus();
    });
  } catch (error) {
    console.error("❌ Error starting server:", error);
  }
};

startServer();