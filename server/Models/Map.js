var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;

var Map = new Schema({
	mapid: String,
	center: {
		lat: Number,
		lng: Number
	},
	zoom: Number,
	title: String,
	deleted: Boolean,
	isPublic: Boolean
});

Map.methods = {
	toJSON: function () {
        var entry = this.toObject();

        return entry;
	},
}

module.exports = Mongoose.model('Map', Map);