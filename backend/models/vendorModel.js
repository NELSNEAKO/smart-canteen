const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    invite_code: {
        code: {
            type: String,
            required: false,
            unique: true
        },
        status: {
            type: String,
            enum: ["unused", "used"],
            default: "unused"
        },
        created_at: {
            type: Date,
            default: Date.now
        }
    }
}, { timestamps: true });

const vendorModel = mongoose.models.Vendor || mongoose.model('Vendor', vendorSchema);

module.exports = vendorModel; 
