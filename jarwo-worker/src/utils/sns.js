const aws = require('aws-sdk');

module.exports = new aws.SNS({
    region: process.env.JARWO_AWS_REGION,
    accessKeyId: process.env.JARWO_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.JARWO_AWS_SECRET_ACCESS_KEY,
});
