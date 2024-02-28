const { v2: cloudinary } = require('cloudinary');
const config = require('../config').getCloudinaryConfig();

cloudinary.config({
    cloud_name: config.cloudName,
    api_key: config.apiKey,
    api_secret: config.apiSecret,
});

const upload = async (path) => {
    const { secure_url: imageURL } = await cloudinary.uploader.upload(path);

    return imageURL;
};

const deleteImage = async (imageURL) => {
    const publicId = imageURL.split('/').pop().split('.')[0];

    await cloudinary.uploader.destroy(publicId);
};

module.exports = { upload, deleteImage };
