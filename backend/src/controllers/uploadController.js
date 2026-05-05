const cloudinary = require('../config/cloudinary');

// Upload image from multer memory buffer using upload_stream
exports.uploadImage = (req, res) => {
  try {
    // Validate Cloudinary config presence
    const cloudConfigured = process.env.CLOUDINARY_URL || (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
    if (!cloudConfigured) return res.status(500).json({ message: 'Cloudinary not configured. Set CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME/CLOUDINARY_API_KEY/CLOUDINARY_API_SECRET' });

    if (!req.file) return res.status(400).json({ message: 'No file provided' });

    const streamifier = require('streamifier');

    const upload_stream = cloudinary.uploader.upload_stream(
      { folder: 'abk/services', resource_type: 'image', transformation: [{ quality: 'auto' }, { fetch_format: 'auto' }] },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error', error);
          const msg = (error && error.message) ? error.message : 'Upload failed';
          return res.status(500).json({ message: `Cloudinary upload error: ${msg}` });
        }
        res.json({ url: result.secure_url, public_id: result.public_id });
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(upload_stream);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

// Upload raw BMC PDF for innovators
exports.uploadBmc = (req, res) => {
  try {
    const cloudConfigured = process.env.CLOUDINARY_URL || (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
    if (!cloudConfigured) return res.status(500).json({ message: 'Cloudinary not configured' });

    if (!req.file) return res.status(400).json({ message: 'No file provided' });

    const streamifier = require('streamifier');

    const upload_stream = cloudinary.uploader.upload_stream(
      { folder: 'abk/bmc', resource_type: 'raw' },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error', error);
          const msg = (error && error.message) ? error.message : 'Upload failed';
          return res.status(500).json({ message: `Cloudinary upload error: ${msg}` });
        }
        res.json({ url: result.secure_url, public_id: result.public_id });
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(upload_stream);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

// Upload pitch deck PDF and attach to application
exports.uploadPitch = async (req, res) => {
  try {
    const cloudConfigured = process.env.CLOUDINARY_URL || (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
    if (!cloudConfigured) return res.status(500).json({ message: 'Cloudinary not configured' });

    if (!req.file) return res.status(400).json({ message: 'No file provided' });

    const streamifier = require('streamifier');

    const upload_stream = cloudinary.uploader.upload_stream(
      { folder: 'abk/pitch', resource_type: 'raw' },
      async (error, result) => {
        if (error) {
          console.error('Cloudinary upload error', error);
          const msg = (error && error.message) ? error.message : 'Upload failed';
          return res.status(500).json({ message: `Cloudinary upload error: ${msg}` });
        }

        try {
          const Startup = require('../models/Startup')
          const { id } = req.params
          const startup = await Startup.findById(id)
          if (!startup) return res.status(404).json({ message: 'Application not found' })

          // Only founder can attach pitch
          if (startup.founder_id.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' })

          startup.pitch_url = result.secure_url
          startup.pitch_public_id = result.public_id
          await startup.save()

          res.json({ url: result.secure_url, public_id: result.public_id })
        } catch (err) {
          console.error(err)
          res.status(500).json({ message: 'Server error' })
        }
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(upload_stream);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};
