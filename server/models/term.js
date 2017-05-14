var mongoose = require('mongoose');
var findOneOrCreate = require('mongoose-find-one-or-create');
var Schema = mongoose.Schema;

var TermSchema = new Schema({
    key: { type: String, required: true },
    data: Schema.Types.Mixed
});
TermSchema.plugin(findOneOrCreate);

module.exports = mongoose.model('Term', TermSchema);
