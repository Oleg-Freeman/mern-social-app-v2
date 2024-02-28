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
        customSiteTitle: 'User Management API',
        customfavIcon:
            'https://avatars.githubusercontent.com/u/6936373?s=200&v=4',
        customJs: [
            'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
        ],
        customCssUrl: [
            'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.css',
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
    getSwaggerJSDocConfig,
    getSwaggerUIConfig,
};
