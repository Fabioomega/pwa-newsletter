const mongoose = require('mongoose');
const { mongoUri } = require('./env');

async function connectMongoDB() {
    try {
        console.log('Tentando conectar no Mongo em:', mongoUri);
        await mongoose.connect(mongoUri);
        console.log('MongoDB conectado!');
    } catch (err) {
        console.error('Erro ao conectar o MongoDB:', err.message);
        process.exit(1);
    }
}

module.exports = connectMongoDB;