var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var WordSchema = new Schema({
    key: String,
    data: Array,
});

module.exports = mongoose.model('Word', WordSchema);
