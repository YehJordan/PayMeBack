import "dotenv/config";
import express from "express";
import cors from "cors";
import { verifySupabaseToken } from "./middleware/auth.js";
import groupsRouter from "./routes/groups.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Public Test route
app.get("/", (req, res) => {
  res.send("API is running");
});

// Protected Test route
app.get("/protected", verifySupabaseToken, (req, res) => {
  res.json({
    message: "You have accessed a protected route!",
    user: req.user // Decoded JWT data from Supabase
  });
});

// API Routes
app.use("/api/groups", groupsRouter);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});