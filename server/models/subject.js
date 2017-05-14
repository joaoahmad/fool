var mongoose = require('mongoose');
var findOneOrCreate = require('mongoose-find-one-or-create');
var Schema = mongoose.Schema;

var SubjectSchema = new Schema({
    key: { type: String, required: true },
    context: String,
    importance: Number
});
SubjectSchema.plugin(findOneOrCreate);

module.exports = mongoose.model('Subject', SubjectSchema);
