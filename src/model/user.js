const mongoose = require("mongoose");
const argon2 = require("argon2");
const { pepper } = require('../config/env');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        passwordHash: {
            type: String,
            required: true
        },

        isAdmin: {
            type: Boolean,
            enum: [true, false],
            default: false
        }
    }
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('passwordHash')) return next();

    const senhaComPepper = this.passwordHash + pepper;

    this.passwordHash = await argon2.hash(senhaComPepper, {
        type: argon2.argon2id,
        memoryCost: 2 ** 16,
        timeCost: 3,
        parallelism: 1,
    });

    next();
});

userSchema.methods.validarSenha = async function (senhaDigitada) {
    const senhaComPepper = senhaDigitada + pepper;
    return argon2.verify(this.passwordHash, senhaComPepper);
};

module.exports = mongoose.model('User', userSchema);