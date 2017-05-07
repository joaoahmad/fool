var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var WordSchema = new Schema({
    key: String,
    data: Schema.Types.Mixed,
});

module.exports = mongoose.model('Word', WordSchema);
