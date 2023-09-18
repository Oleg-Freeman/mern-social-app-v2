const multer = require('multer');

const imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

const storage = multer.diskStorage({
    filename: function (req, file, callback) {
        callback(null, Date.now() + '_image');
    },
});

const imageUpload = multer({ storage, fileFilter: imageFilter });

module.exports = imageUpload;
