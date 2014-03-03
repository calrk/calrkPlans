var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;

var User = new Schema({
	email: String,
	password: String,

	maps: Array,
});

User.methods = {
	toJSON: function () {
        var entry = this.toObject();
        entry.password = "";

        return entry;
	},
}

module.exports = Mongoose.model('User', User);