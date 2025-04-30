import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import courtRoutes from "./routes/courts.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
  origin: '*', // Allow all origins for testing purposes
  methods: ['GET', 'POST', 'PATCH', 'PUT'],
}));
app.use(express.json());

app.use("/api/courts", courtRoutes); // Route prefix

app.use((req, res, next) => {
  console.log("Incoming:", req.method, req.url);
  next();
});

// Handle undefined routes (404)
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handling middleware (optional)
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => console.error("❌ MongoDB error:", err));
