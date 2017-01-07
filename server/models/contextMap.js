var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ContextMapSchema = new Schema({
    action: { type: Array, required: true },
    subject: { type: Array, required: true },
    context: String
});

module.exports = mongoose.model('ContextMap', ContextMapSchema);
