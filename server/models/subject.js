var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SubjectSchema = new Schema({
    key: { type: String, required: true },
    context: String,
    importance: Number
});

module.exports = mongoose.model('Subject', SubjectSchema);
