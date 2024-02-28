const axios = require('axios');
const { CustomError } = require('./custom-error');
const removeHtmlTags = require('./remove-html-tags');
const config = require('../config').getMailJetConfig();

const sendEmail = async ({ to, subject, html, userName }) => {
    try {
        const response = await axios.post(
            `${config.apiURL}/send`,
            {
                FromEmail: config.from,
                FromName: 'Social App Team',
                Sender: true,
                Recipients: [
                    {
                        Email: to,
                        Name: userName,
                    },
                ],
                Subject: subject,
                'Text-part': removeHtmlTags(html),
                'Html-part': html,
            },
            {
                auth: {
                    username: config.userName,
                    password: config.password,
                },
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        return response.data;
    } catch (error) {
        console.log(error);

        throw new CustomError(
            500,
            error.message || error || 'Send email error'
        );
    }
};

module.exports = {
    sendEmail,
};
