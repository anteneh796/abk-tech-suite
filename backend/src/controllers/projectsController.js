const Project = require('../models/Project');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

exports.list = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json({ projects });
  } catch (err) {
    console.warn('DB error, returning mock projects', err.message);
    res.json({ projects: [
      { _id: '1', title: 'Solar Gondar', category: 'Solar', location: 'Gondar', description: 'Sample project' },
      { _id: '2', title: 'Hydro Maintenance', category: 'Industrial', location: 'Oromia', description: 'Sample project' }
    ]});
  }
};

exports.create = async (req, res) => {
  try {
    const { title, category, location, description, challenge, solution, result } = req.body;
    let imageUrl = null;

    if (req.file) {
      const sharp = require('sharp');
      const processed = await sharp(req.file.buffer).resize({ width: 1600 }).webp().toBuffer();
      const upload_stream = cloudinary.uploader.upload_stream({ folder: 'abk/projects' }, async (err, reslt) => {
        if (err) return res.status(500).json({ message: 'Upload failed' });
        const prj = await Project.create({ title, category, location, description, challenge, solution, result, image: reslt.secure_url });
        res.status(201).json({ project: prj });
      });
      streamifier.createReadStream(processed).pipe(upload_stream);
      return;
    }

    const prj = await Project.create({ title, category, location, description, challenge, solution, result });
    res.status(201).json({ project: prj });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, location, description, challenge, solution, result, image } = req.body;
    let imageUrl = image;

    if (req.file) {
      const sharp = require('sharp');
      const processed = await sharp(req.file.buffer).resize({ width: 1600 }).webp().toBuffer();
      const upload_stream = cloudinary.uploader.upload_stream({ folder: 'abk/projects' }, async (err, reslt) => {
        if (err) return res.status(500).json({ message: 'Upload failed' });
        const updated = await Project.findByIdAndUpdate(id, { title, category, location, description, challenge, solution, result, image: reslt.secure_url }, { new: true });
        res.json({ project: updated });
      });
      streamifier.createReadStream(processed).pipe(upload_stream);
      return;
    }

    const updated = await Project.findByIdAndUpdate(id, { title, category, location, description, challenge, solution, result, image: imageUrl }, { new: true });
    res.json({ project: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    await Project.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
