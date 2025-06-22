import Vehicle from "../models/Vehicle.js";

const getVehicles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filters = {};
    if (req.query.search) {
      filters.$or = [
        { "specifications.make": { $regex: req.query.search, $options: "i" } },
        { "specifications.model": { $regex: req.query.search, $options: "i" } },
        { title: { $regex: req.query.search, $options: "i" } },
      ];
    }
    if (req.query.category) {
      filters["specifications.bodyStyle"] = {
        $in: req.query.category.split(","),
      };
    }
    if (req.query.brand) {
      filters["specifications.make"] = { $in: req.query.brand.split(",") };
    }
    if (req.query.minPrice || req.query.maxPrice) {
      filters.priceNumeric = {};
      if (req.query.minPrice)
        filters.priceNumeric.$gte = parseInt(req.query.minPrice);
      if (req.query.maxPrice)
        filters.priceNumeric.$lte = parseInt(req.query.maxPrice);
    }
    if (req.query.fuelType) {
      filters["specifications.fuelType"] = {
        $in: req.query.fuelType.split(","),
      };
    }
    if (req.query.transmission) {
      filters['specifications.transmission'] = { $in: req.query.transmission.split(',') };
    }
    let sort = {};
    switch (req.query.sort) {
      case 'price-asc':
        sort = { priceNumeric: 1 };
        break;
      case 'price-desc':
        sort = { priceNumeric: -1 };
        break;
      case 'mileage-asc':
        sort = { 'specifications.mileage': 1 };
        break;
      case 'year-desc':
        sort = { 'specifications.year': -1 };
        break;
      default:
        sort = { createdAt: -1 };
    }
    const total = await Vehicle.countDocuments(filters);

    const vehicles = await Vehicle.find(filters)
      .skip(skip)
      .limit(limit)
      .sort(sort);

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: vehicles,
      pagination: {
        currentPage: page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
const getVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const createVehicle = async (req, res) => {
  const vehicle = new Vehicle(req.body);
  try {
    const newVehicle = await vehicle.save();
    res.status(201).json(newVehicle);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    res.json(vehicle);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    res.json({ message: "Vehicle deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export { getVehicles, getVehicle, createVehicle, updateVehicle, deleteVehicle };
