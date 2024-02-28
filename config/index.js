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

function getSwaggerJSDocConfig() {
    return {
        failOnErrors: true,
        definition: {
            openapi: '3.1.0',
            info: {
                title: 'Social App API',
                version: '2.0.3',
                license: {
                    name: 'MIT',
                    url: 'https://spdx.org/licenses/MIT.html',
                },
                contact: {
                    name: 'Oleg Voitiuk',
                    url: 'https://www.linkedin.com/in/olegv999/',
                },
            },
        },
        apis: ['./docs/*.yaml'],
    };
}

function getSwaggerUIConfig() {
    return {
        explorer: true,
        customCssUrl:
            'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0/swagger-ui.min.css',
    };
}

module.exports = {
    getPort,
    getMongoUri,
    getJwtSecret,
    getDefaultUserAvatar,
    getCloudinaryConfig,
    getMailJetConfig,
    getSwaggerJSDocConfig,
    getSwaggerUIConfig,
};
