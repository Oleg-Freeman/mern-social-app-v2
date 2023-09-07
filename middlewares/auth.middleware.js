// noinspection ExceptionCaughtLocallyJS

const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { CustomError } = require('../utils');
module.exports = async (req, res, next) => {
    try {
        const { authorization = '' } = req.headers;
        // console.log(authorization);
        const [bearer, token] = authorization.split(' ');
        // console.log(token);

        if (bearer !== 'Bearer') {
            throw new CustomError(401, 'Unauthorized');
        }

        const { id } = jwt.verify(token, process.env.JWT_SECRET);
        console.log(id);
        const user = await User.findById(id);

        if (!user || !user.token || token !== user.token) {
            throw new CustomError(401, 'Unauthorized');
        }

        req.user = user;

        next();
    } catch (error) {
        const authError = new CustomError(
            error.status || 401,
            error.message || 'Unauthorized'
        );
        next(authError);
    }
};
