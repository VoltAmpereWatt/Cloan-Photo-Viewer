const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const ImagesSchema = new Schema({
  url: { type: String, required: true },
  uploader: { type: String, ref: 'Users', required: true }
}, {
  timestamps: true,
});

const Images = mongoose.model('Images', ImagesSchema);

module.exports = Images;