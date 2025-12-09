const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
        },

        contentType: {
            type: String,
            required: true,
            enum: ["tecnologia", "saude", "negocios", "natureza", "politica"],
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        createdAt: {
            type: Date,
            default: Date.now
        }
    }
);

module.exports = mongoose.model('News', newsSchema);