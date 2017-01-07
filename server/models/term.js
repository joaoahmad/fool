var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TermSchema = new Schema({
    key: { type: String, required: true },
    data: Schema.Types.Mixed
});

module.exports = mongoose.model('Term', TermSchema);
