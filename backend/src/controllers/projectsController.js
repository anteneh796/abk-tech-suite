const Project = require('../models/Project');
const { uploadAndProcessImage } = require('../utils/cloudinary');
const asyncHandler = require('../utils/asyncHandler');
const { projectCreateSchema } = require('../validators/projectValidator');

// List projects
exports.list = asyncHandler(async (req, res) => {
  const projects = await Project.find().sort({ createdAt: -1 });
  res.json({ projects });
});

// Create project
exports.create = asyncHandler(async (req, res) => {
  // 1. Validation
  const parseResult = projectCreateSchema.safeParse(req.body);
  if (!parseResult.success) {
    console.error('[PROJECT VALIDATION FAILED]:', JSON.stringify(parseResult.error.format(), null, 2));
    return res.status(400).json({ message: 'Validation failed', errors: parseResult.error.format() });
  }

  const { title, category, location, description, challenge, solution, result } = parseResult.data;
  let imageUrl = req.body.image || null;

  // 2. Image Upload
  if (req.file) {
    const result = await uploadAndProcessImage(req.file.buffer, { folder: 'abk/projects' });
    imageUrl = result.secure_url;
  }

  // 3. Create
  const project = await Project.create({ 
    title, category, location, description, challenge, solution, result, 
    image: imageUrl 
  });
  res.status(201).json({ project });
});

// Update project
exports.update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Validation
  const parseResult = projectCreateSchema.safeParse(req.body);
  if (!parseResult.success) {
    console.error('[PROJECT UPDATE VALIDATION FAILED]:', JSON.stringify(parseResult.error.format(), null, 2));
    return res.status(400).json({ message: 'Validation failed', errors: parseResult.error.format() });
  }

  const { title, category, location, description, challenge, solution, result, image: existingImage } = parseResult.data;
  let imageUrl = existingImage;

  if (req.file) {
    const result = await uploadAndProcessImage(req.file.buffer, { folder: 'abk/projects' });
    imageUrl = result.secure_url;
  }

  const updated = await Project.findByIdAndUpdate(
    id, 
    { title, category, location, description, challenge, solution, result, image: imageUrl }, 
    { new: true, runValidators: true }
  );

  if (!updated) return res.status(404).json({ message: 'Project not found' });
  res.json({ project: updated });
});

// Delete project
exports.delete = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deleted = await Project.findByIdAndDelete(id);
  if (!deleted) return res.status(404).json({ message: 'Project not found' });
  res.json({ success: true, message: 'Project deleted' });
});

