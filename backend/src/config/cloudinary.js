const cloudinary = require('cloudinary').v2;

// Configure Cloudinary from either CLOUDINARY_URL or explicit vars
if (process.env.CLOUDINARY_URL) {
	cloudinary.config({ url: process.env.CLOUDINARY_URL });
} else if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
	cloudinary.config({
		cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
		api_key: process.env.CLOUDINARY_API_KEY,
		api_secret: process.env.CLOUDINARY_API_SECRET,
	});
} else {
	// Not fatal at require-time; route handlers will return a clear error if used.
	console.warn('Cloudinary not configured. Set CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME/CLOUDINARY_API_KEY/CLOUDINARY_API_SECRET in your .env');
}

module.exports = cloudinary;
