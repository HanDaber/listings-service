var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var result_properties = {
	'title' : { type: String },
	'url' : { type: String },
	'date' : { type: Date }
}

var resultSchema = new Schema( result_properties );

// resultSchema.methods = result_methods;

var resultModel = mongoose.model( 'Result', resultSchema );

exports.model = resultModel;
exports.schema = resultSchema;