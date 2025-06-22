import mongoose from "mongoose";
const specificationSchema = new mongoose.Schema({
  make: String,
  model: String,
  year: String,
  trim: String,
  bodyStyle: String,
  transmission: String,
  drivetrain: String,
  engine: String,
  fuelType: String,
  mileage: String,
  exteriorColor: String,
  interiorColor: String,
  vin: String,
  stockNumber: String,
});

const vehicleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  priceNumeric: {
    type: Number,
    required: true,
  },
  mileage: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  postedDate: {
    type: String,
    default: () => new Date().toISOString().split("T")[0],
  },
  images: [String],
  overview: {
    type: String,
    required: true,
  },
  features: [String],
  specifications: specificationSchema,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});
vehicleSchema.pre("save", function (next) {
  if (this.isModified("price")) {
    this.priceNumeric = parseInt(this.price.replace(/[^0-9]/g, ""));
  }
  next();
});
export default mongoose.model("Vehicle", vehicleSchema);
