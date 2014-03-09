var Mongoose = require('mongoose');
var _ = require('underscore');
var connect = require('connect');
var app;

var User = require('./Models/User.js');
var Map = require('./Models/Map.js');
var Marker = require('./Models/Marker.js');
var nodemailer = require('nodemailer');
/*var transport = nodemailer.createTransport("SMTP",{
	service: "Gmail",
	auth: {
		user: "calrk1@gmail.com",
	}
}); */

var Application = {
	initialise: function() {
		this.mongoose = Mongoose.connect('mongodb://localhost/calrkPlans');
		var db = this.mongoose.connection;
		db.on('error', console.error.bind(console, 'connection error:'));
		db.once('open', _.bind(function() {
			console.log("Database connected.");
			this.startServer();
		}, this));

		app = connect.createServer(
			connect.static("./client")
		).listen(80);
	},
	
	startServer: function() {
		this.io = require('socket.io').listen(app);
		this.io.configure(_.bind(function(){
			this.io.set('log level', 1);
		}, this));

		this.io.sockets.on('connection', function(socket){
			socket.emit('connected');

			//account functions
			socket.on('login', login);
			socket.on('createAccount', createAccount);

			//map functions
			socket.on('createMap', createMap);
			socket.on('getMapList', getMapList);
			socket.on('shareMap', shareMap);
			socket.on('updateMap', updateMap);
			socket.on('deleteMap', deleteMap);
			
			//marker functions
			socket.on('createMarker', createMarker);
			socket.on('getMarkerList', getMarkerList);
			socket.on('updateMarker', updateMarker);
			socket.on('deleteMarker', deleteMarker);

			function login(args){
				if(args.password == ""){
					socket.emit("login", {success:false, reason:"No password."});
					return;
				}
				User.findOne({email:args.email}, function(err, res){
					if(res){
						if(res.password == args.password){
							console.log("Logging in user.");
							socket.emit("login", {success:true, id:res.id});
						}
						else{
							console.log("Failed to log in user.");
							socket.emit("login", {success:false, reason:"Incorrect password."});
						}
					}
					else{
						console.log("Failed to log in user.");
						socket.emit("login", {success:false, reason:"Email does not exist in system."});
					}
				});
			}

			function createAccount(args){
				User.findOne({email:args.email}, function(err, res){
					if(!res){
						var user = new User(args);
						user.save();
						console.log("Creating user.");
						socket.emit("account", {success:true});
					}
					else{
						if(!res.password){
							res.password = args.password;
							res.save();
							socket.emit("account", {success:true});
						}
						else{
							console.log("Failed to create user.");
							socket.emit("account", {success:false, reason:"Email already exists in system."});
						}
					}
				});
			}

			function createMap(args){
				User.findById(args.user, function(err, res){
					if(!res){
						console.log("User not found.");
						return;
					}
					var map = new Map();
					map.title = args.title;
					map.center = args.center;
					map.zoom = args.zoom;
					map.save(function(err, map){
						socket.emit("mapList", map);
						if(err){
							console.log("Error creating map.");
							socket.emit("mapEnd", {success:false, reason:"Could not save map."});
						}
						else{
							res.maps.push(map.id);
							res.save(function(err, res){
								socket.emit("mapEnd", {success:true});
							});
						}
					});
				});
			}

			function getMapList(args){
				User.findById(args.user, function(err, res){
					if(!res){
						console.log("User not in system to get maps.");
						return;
					}
					res.maps.forEach(function(map){
						Map.findById(map, function(err, res){
							if(!map.deleted){
								socket.emit("mapList", res);
							}
						});
					});
				});
			}

			function shareMap(args){
				User.findOne({email: args.email}, function(err, res){
					if(!res){
						var user = new User({email: args.email, maps:[args.map._id]});
						user.save();
						var mail = {
							from: "mpatton86@live.com",
							to: args.email,
							subject: "A map has been shared with you!",
							text: "Some totally cool dude has shared a map with you. Go to http://14.201.77.58 and register an account in order to see and edit it."
						}
						/*transport.sendMail(mail, function(error){
							if(error){
								console.log('Email could not be sent');
								return;
							}
						});*/
					}
					else{
						var exists = false;
						res.maps.forEach(function(map){
							if(map == args.map._id){
								exists = true;
							}
						});
						if(!exists){
							res.maps.push(args.map._id);
							res.save();
						}
					}
				});
			}

			function updateMap(args){
				Map.findByIdAndUpdate(args._id, args);
			}

			function deleteMap(args){
				args.deleted = true;
				Map.findByIdAndUpdate(args._id, args);
			}

			function createMarker(args){
				var marker = new Marker(args);
				marker.save(function(err, res){
					if(err){
						console.log(err);
					}
					socket.emit("markerList", res);
				});
			}

			function getMarkerList(args){
				Marker.find({mapid: args.map}, function(err, res){
					if(res.length > 0){
						socket.emit("markerList", res);
					}
				});
			}

			function updateMarker(args){
				Marker.findByIdAndUpdate(args._id, {link:args.link}, function(err){
					if(err)
						console.log(err);
				});
			}

			function deleteMarker(args){
				Marker.findByIdAndRemove(args._id, function(err){
					if(err)
						console.log(err);
				});
			}
		});
	}
};

module.exports = Application;
