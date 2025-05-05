import express from "express";
import Court from "../models/Court.js";

const router = express.Router();

// GET /api/courts
router.get("/", async (req, res) => {
  console.log("Received request for /api/courts");
  try {
    const courts = await Court.find();
    res.json(courts);
  } catch (err) {
    console.error("Error fetching courts:", err);
    res.status(500).json({ error: "Failed to fetch courts" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    // Only update the BookingLink if it's being passed in the body
    const updated = await Court.findByIdAndUpdate(
      req.params.id,
      { $set: { "Booking Link": req.body["Booking Link"] } },
      { new: true }
    );
    
    if (!updated) {
      return res.status(404).json({ error: "Court not found" });
    }
    
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update court data" });
  }
});


export default router;