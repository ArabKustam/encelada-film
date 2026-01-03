const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    telegramId: { type: Number, unique: true, sparse: true },
    tgUsername: { type: String },
    avatar: { type: String },
    settings: {
        include_adult: { type: Boolean, default: false },
        card_size: { type: String, default: 'medium' },
        card_hover_disabled: { type: Boolean, default: false },
        background_type: { type: String, default: 'default' }
    },
    library: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
        default: {}
    },
    history: [{
        id: String,
        type: { type: String },
        title: String,
        poster: String,
        rating: Number,
        timestamp: { type: Number, default: Date.now }
    }],
    progress: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
        default: {}
    },
    ratings: {
        type: Map,
        of: Number,
        default: {}
    }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
