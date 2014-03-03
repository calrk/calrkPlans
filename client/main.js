var socket;
var currentMap;
var maps = [];
var markers = [];
var gmap;
// var parser = new DOMParser();
var geocoder = new google.maps.Geocoder();

var mapToEdit;
var mapToShare;

function initialiseSocket(){
	socket = io.connect('http://localhost');

	socket.on('connected', function(){

	});

	socket.on('login', loginEnd);
	socket.on('account', accountEnd);

	socket.on('openMap', openMap);
	// socket.on('mapEnd', mapEnd);
	socket.on('mapList', mapList);

	socket.on('markerList', markerList);
}

function initialiseMaps(){
	socket.emit("getMapList", {user:user});
}

function editMap(id){
	var map;
	for(i in maps){
		if(maps[i]._id == id){
			map = maps[i];
			break;
		}
	}
	openMenu('newMap');
	mapToEdit = map;

	$("#newMapName")[0].value = map.title;
	$("#mapLat")[0].value = map.center.lat;
	$("#mapLng")[0].value = map.center.lng;
}

function openMap(args){
	if(typeof args == "string"){
		for(map in maps){
			if(maps[map]._id == args){
				args = maps[map];
				break;
			}
		}
	}
	var mapOptions = {
		center: new google.maps.LatLng(args.center.lat, args.center.lng),
		zoom: args.zoom,
	};
	gmap = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
	
	currentMap = args;

	socket.emit("getMarkerList", {map: args._id});
	
	$("#markerList").empty();
	var render = Mustache.render(markerListTemplate);
	$("#markerList").append(render);

	google.maps.event.addListener(gmap, 'click', function(event) {
		updateLatLng(event.latLng.lat(), event.latLng.lng());
	});
}

function createMap(){
	var zoom = 11;
	var center = {
		lat: $("#mapLat")[0].value,
		lng: $("#mapLng")[0].value
	}
	var title = $("#newMapName")[0].value;

	if(!user){
		console.log("Not logged in.");
	}
	/*else if(mapToEdit){
		socket.emit("updateMap", {id:mapToEdit._id, zoom:zoom, center:center, title:title});
	}*/
	else{
		socket.emit("createMap", {zoom:zoom, center:center, user:user, title:title});
	}
	toggleMenu();
}

function toggleMenu(type){
	$("#newMapDiv").addClass("closed");
	$("#newMarkerDiv").addClass("closed");
	$("#shareMapDiv").addClass("closed");
	switch(type){
		case "newMap":
			$("#newMapDiv").removeClass("closed");
			break;
		case "newMarker":
			$("#newMarkerDiv").removeClass("closed");
			break;
		case "shareMap":
			$("#shareMapDiv").removeClass("closed");
			break;
	}
}

function shareMap(){
	var email = $("#shareEmail")[0].value;
	if(email.match(/[-0-9a-zA-Z.+_]+@[-0-9a-zA-Z.+_]+\.[a-zA-Z]{2,4}/) == null){
		return;
	}
	if(!currentMap){
		return;
	}
	args = {
		email: email,
		map: currentMap
	};

	toggleMenu();

	socket.emit("shareMap", args);
}

function mapList(args){
	if(!currentMap){
		openMap(args);
	}
	maps.push(args);

	var render = Mustache.render(mapTemplate, args);
	$("#mapList").append(render);
}

function updateLatLng(lat, lng){
	$("#mapLat")[0].value = lat;
	$("#mapLng")[0].value = lng;

	$("#markerLat")[0].value = lat;
	$("#markerLng")[0].value = lng;
}

function geocode(element){
	var address = element.value;


	geocoder.geocode({'address': address}, function(results, status){
		if(status == google.maps.GeocoderStatus.OK) {
			updateLatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng());
		}
		else{
			alert("Geocode was not successful for the following reason: " + status);
		}
	});
}

window.onload = initialiseSocket;
// google.maps.event.addDomListener(window, 'load', initialiseMap);
