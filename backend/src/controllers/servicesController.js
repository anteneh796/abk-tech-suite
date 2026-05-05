const Service = require('../models/Service');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');
const { serviceCreateSchema } = require('../validators/serviceValidator');

exports.list = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json({ services });
  } catch (err) {
    console.warn('DB error, returning mock services', err.message);
    res.json({ services: [
      { _id: '1', title: 'Industrial Maintenance', category: 'Industrial', description: 'Sample service data', features: [] },
      { _id: '2', title: 'Solar Installation', category: 'Renewable', description: 'Sample service data', features: [] }
    ]});
  }
};

// Create service with optional image upload (multipart/form-data)
exports.create = async (req, res) => {
  try {
    // Validate body fields using Zod (works for multipart where fields are strings)
    const parseResult = serviceCreateSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ message: 'Validation failed', errors: parseResult.error.format() });
    }

    const { category, title, description, features } = parseResult.data;

    let imageUrl = req.body.image || null;

    // If a file was provided, validate + compress then upload to Cloudinary
    if (req.file) {
      const cloudConfigured = process.env.CLOUDINARY_URL || (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
      if (!cloudConfigured) return res.status(500).json({ message: 'Cloudinary not configured' });

      // Server-side image processing with sharp (resize & compress)
      try {
        const sharp = require('sharp')
        const processed = await sharp(req.file.buffer).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 80 }).toBuffer()

        const upload_stream = cloudinary.uploader.upload_stream(
          { folder: 'abk/services', resource_type: 'image', transformation: [{ quality: 'auto' }, { fetch_format: 'auto' }] },
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload error', error);
              return res.status(500).json({ message: 'Image upload failed', detail: error.message || error });
            }

            imageUrl = result.secure_url;
            // create service with image
            Service.create({ category, title, description, image: imageUrl, features })
              .then((svc) => res.status(201).json({ service: svc }))
              .catch((err) => {
                console.error(err);
                res.status(500).json({ message: 'Failed to create service' });
              });
          }
        );

        streamifier.createReadStream(processed).pipe(upload_stream);
        return; // response will be sent in callback
      } catch (err) {
        console.error('Image processing error', err)
        return res.status(400).json({ message: 'Invalid image file' })
      }
    }

// No file: create service directly
    const svc = await Service.create({ category, title, description, image: imageUrl, features });
    res.status(201).json({ service: svc });
  } catch (err) {
    console.error(err);
    if (err.name === 'ValidationError') {
        return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, title, description, features, image: existingImage } = req.body;

    let imageUrl = existingImage;

    if (req.file) {
      const sharp = require('sharp');
      const processed = await sharp(req.file.buffer).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 80 }).toBuffer();

      const upload_stream = cloudinary.uploader.upload_stream(
        { folder: 'abk/services', resource_type: 'image' },
        async (error, result) => {
          if (error) return res.status(500).json({ message: 'Image upload failed' });
          imageUrl = result.secure_url;
          const updated = await Service.findByIdAndUpdate(id, { category, title, description, image: imageUrl, features }, { new: true });
          res.json({ service: updated });
        }
      );
      streamifier.createReadStream(processed).pipe(upload_stream);
      return;
    }

    const updated = await Service.findByIdAndUpdate(id, { category, title, description, image: imageUrl, features }, { new: true });
    res.json({ service: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    await Service.findByIdAndDelete(id);
    res.json({ success: true, message: 'Service deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
