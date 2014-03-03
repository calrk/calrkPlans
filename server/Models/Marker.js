var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;

var Marker = new Schema({
	mapid: String,

	position: {
		lat: Number,
		lng: Number
	},
	
	title: String,
	link: String,
	type: String
});

Marker.methods = {
	toJSON: function () {
        var entry = this.toObject();

        return entry;
	},
}

module.exports = Mongoose.model('Marker', Marker);