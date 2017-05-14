var mongoose = require('mongoose');
var findOneOrCreate = require('mongoose-find-one-or-create');
var Schema = mongoose.Schema;

var WordSchema = new Schema({
  key: String,
  data: { type: Schema.Types.Mixed, default: {} },
}, { minimize: false });
WordSchema.plugin(findOneOrCreate);

module.exports = mongoose.model('Word', WordSchema);
