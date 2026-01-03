const mongoose = require('mongoose');

const TmdbCacheSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
    timestamp: { type: Number, required: true }
});

module.exports = mongoose.model('TmdbCache', TmdbCacheSchema);
