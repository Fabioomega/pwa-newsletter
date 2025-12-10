const webpush = require('web-push');
const { publicKey, privateKey } = require('./env');

webpush.setVapidDetails(
    'mailto:ian@lindo.com',
    publicKey,
    privateKey
);

module.exports = webpush;