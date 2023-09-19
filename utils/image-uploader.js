const { v2: cloudinary } = require('cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
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
