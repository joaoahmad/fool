var mongoose = require('mongoose');
var findOneOrCreate = require('mongoose-find-one-or-create');
var Schema = mongoose.Schema;

var ActionSchema = new Schema({
    key: { type: String, required: true },
    context: String,
    importance: Number
});
ActionSchema.plugin(findOneOrCreate);

module.exports = mongoose.model('Action', ActionSchema);
