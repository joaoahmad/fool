var mongoose = require('mongoose');
var findOneOrCreate = require('mongoose-find-one-or-create');
var Schema = mongoose.Schema;

var ContextMapSchema = new Schema({
    action: { type: Array, required: true },
    subject: { type: Array, required: true },
    context: String
});
ContextMapSchema.plugin(findOneOrCreate);

module.exports = mongoose.model('ContextMap', ContextMapSchema);
