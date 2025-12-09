require('dotenv').config();

console.log('DEBUG ENV - MONGO_URI:', process.env.MONGO_URI);

module.exports = {
    port: process.env.PORT || 3000,
    mongoUri: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    pepper: process.env.PEPPER_SECRET,
    publicKey: process.env.PUBLIC_KEY,
    privateKey: process.env.PRIVATE_KEY
};