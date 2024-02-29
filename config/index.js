require('dotenv').config();

const env = process.env;

function getValue(key, throwOnMissing = true) {
    const value = env[key];

    if (!value && throwOnMissing) {
        throw new Error(`Config error - missing env.${key}`);
    }

    return value;
}

function getPort() {
    return getValue('PORT', false) || 8080;
}

function getMongoUri() {
    return getValue('MONGO_URI');
}

function getJwtSecret() {
    return getValue('JWT_SECRET');
}

function getDefaultUserAvatar() {
    return getValue('DEFAULT_USER_AVATAR');
}

function getCloudinaryConfig() {
    return {
        cloudName: getValue('CLOUDINARY_CLOUD_NAME'),
        apiKey: getValue('CLOUDINARY_API_KEY'),
        apiSecret: getValue('CLOUDINARY_API_SECRET'),
    };
}

function getMailJetConfig() {
    return {
        userName: getValue('MAILJET_API_KEY'),
        password: getValue('MAILJET_API_SECRET'),
        from: getValue('MAILJET_FROM_EMAIL'),
        apiURL: 'https://api.mailjet.com/v3',
    };
}

function getSwaggerUIConfig() {
    return {
        customSiteTitle: 'User Management API',
        customCssUrl: [
            'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.3.0/swagger-ui.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.3.0/swagger-ui.css',
        ],
        customJs: [
            'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.3.0/swagger-ui-bundle.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.3.0/swagger-ui-standalone-preset.min.js',
        ],
    };
}

module.exports = {
    getPort,
    getMongoUri,
    getJwtSecret,
    getDefaultUserAvatar,
    getCloudinaryConfig,
    getMailJetConfig,
    getSwaggerUIConfig,
};
