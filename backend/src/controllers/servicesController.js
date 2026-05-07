const Service = require('../models/Service');
const { uploadAndProcessImage } = require('../utils/cloudinary');
const asyncHandler = require('../utils/asyncHandler');
const { serviceCreateSchema } = require('../validators/serviceValidator');

// List services
exports.list = asyncHandler(async (req, res) => {
  const services = await Service.find().sort({ createdAt: -1 });
  res.json({ services });
});

// Create service
exports.create = asyncHandler(async (req, res) => {
  // 1. Validation
  const parseResult = serviceCreateSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ message: 'Validation failed', errors: parseResult.error.format() });
  }

  const { category, title, description, features } = parseResult.data;
  let imageUrl = req.body.image || null;

  // 2. Handle Image Upload
  if (req.file) {
    const result = await uploadAndProcessImage(req.file.buffer, { folder: 'abk/services' });
    imageUrl = result.secure_url;
  }

  // 3. Create
  const service = await Service.create({ category, title, description, image: imageUrl, features });
  res.status(201).json({ service });
});

// Update service
exports.update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { category, title, description, features, image: existingImage } = req.body;
  let imageUrl = existingImage;

  if (req.file) {
    const result = await uploadAndProcessImage(req.file.buffer, { folder: 'abk/services' });
    imageUrl = result.secure_url;
  }

  const updated = await Service.findByIdAndUpdate(
    id, 
    { category, title, description, image: imageUrl, features }, 
    { new: true, runValidators: true }
  );
  
  if (!updated) return res.status(404).json({ message: 'Service not found' });
  res.json({ service: updated });
});

// Delete service
exports.delete = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deleted = await Service.findByIdAndDelete(id);
  if (!deleted) return res.status(404).json({ message: 'Service not found' });
  res.json({ success: true, message: 'Service deleted' });
});

