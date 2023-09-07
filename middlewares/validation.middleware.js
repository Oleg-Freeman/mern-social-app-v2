// noinspection ExceptionCaughtLocallyJS

const { CustomError } = require('../utils');

module.exports = (schema, target) => (req, res, next) => {
    try {
        let errors = [];

        switch (target) {
            case 'body': {
                const { error } = schema.validate(req.body);

                if (error) {
                    errors = errors.concat(error.details);
                }

                break;
            }

            case 'path': {
                Object.values(req.params).forEach((value) => {
                    const { error } = schema.validate(value);

                    if (error) {
                        errors = errors.concat(error.details);
                    }
                });

                break;
            }

            default:
                throw new CustomError(500, 'Unknown target');
        }

        if (errors.length) {
            const message = errors.map(({ message }) => message).join(',\n');

            throw new CustomError(400, message);
        }

        next();
    } catch (err) {
        next(err);
    }
};
