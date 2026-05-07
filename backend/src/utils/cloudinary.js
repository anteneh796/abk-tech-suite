const cloudinary = require('../config/cloudinary');
const sharp = require('sharp');
const streamifier = require('streamifier');

/**
 * Process and upload an image to Cloudinary
 * @param {Buffer} buffer - Multer file buffer
 * @param {Object} options - Cloudinary upload options (folder, etc.)
 * @returns {Promise<Object>} - Cloudinary upload result
 */
const uploadAndProcessImage = async (buffer, options = {}) => {
  // 1. Process image with Sharp
  const processedBuffer = await sharp(buffer)
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();

  // 2. Upload to Cloudinary using a Promise wrapper for the stream
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || 'abk/general',
        resource_type: 'image',
        transformation: [{ quality: 'auto' }, { fetch_format: 'auto' }],
        ...options
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(processedBuffer).pipe(uploadStream);
  });
};

module.exports = {
  uploadAndProcessImage
};
