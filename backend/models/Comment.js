const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true },
    userRating: { type: Number },
    mediaId: { type: String, required: true },
    mediaType: { type: String, required: true },
    text: { type: String, required: true, maxlength: 1500 },
    isSpoiler: { type: Boolean, default: false },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    timestamp: { type: Number, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Comment', CommentSchema);
