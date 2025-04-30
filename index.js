import mongoose from "mongoose";
import fs from "fs";
import dotenv from "dotenv";
import pLimit from "p-limit";
import Court from "./models/Court.js";

dotenv.config();

const courts = JSON.parse(fs.readFileSync("courts.json", "utf-8"));
const limit = pLimit(5); // limit concurrency

const enrichCourt = async (court, index) => {
  try {
    await Court.findOneAndUpdate(
      { SN: court.SN },
      court,
      { upsert: true, new: true }
    );

    if (index % 100 === 0) {
      console.log(`Progress: ${index}/${courts.length}`);
    }
  } catch (error) {
    console.warn(`❌ Error processing court: ${court.Name} - ${error.message}`);
  }
};

async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const tasks = courts
      .sort((a, b) => a.SN - b.SN) // Optional: sort before storing
      .map((court, i) => limit(() => enrichCourt(court, i)));

    await Promise.all(tasks);

    console.log("🎉 All courts processed and saved to DB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  } finally {
    await mongoose.disconnect();
  }
}

start();
