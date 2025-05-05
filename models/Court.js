import mongoose from 'mongoose';

const courtSchema = new mongoose.Schema({
  SN: {type: Number, required: true, unique: true},
  Name: String,
  Location: String,
  Latitude: Number,
  Longitude: Number,
  Access: String,
  Lighting: String,
  "Court Type": String,
  "Court Purpose": String,
  "Booking Link": String,
}, { collection: "Details", versionKey: false });

courtSchema.index({ SN: 1 }, { unique: true });

const Court = mongoose.model("Court", courtSchema);

export default Court;