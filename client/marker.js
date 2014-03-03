var markerClicked;
var markerClickedElem;
var directionsDisplay = new google.maps.DirectionsRenderer();
var directionsService = new google.maps.DirectionsService();


function createMarker(){
	var marker = {
		position: {
			lat: $("#markerLat")[0].value,
			lng: $("#markerLng")[0].value
		},
		type: $("#iconType")[0].value,
		title: $("#newMarkerName")[0].value,
		mapid: currentMap._id
	};

	socket.emit("createMarker", marker);
	toggleMenu();
}

function markerList(args){
	if(!args.length){
		args = [args];
	}
	args.forEach(function(arg){
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(arg.position.lat, arg.position.lng),
			map: gmap,
			icon: markerTypeIcon(arg.type),
			title: arg.title
		});
	
    	google.maps.event.addListener(marker, 'click', function(){clickMarker(arg)});

    	arg.marker = marker;

		markers.push(arg);
		var render = Mustache.render(markerTemplate, arg);
		$("#markerList").append(render);
	});
}

function markerTypeIcon(type){
	switch(type){
		case "person":
			return 'img/person.png';
		case "car":
			return 'img/car.png';
		case "meet":
			return 'img/meet.png';
		case "office":
			return 'img/office.png';
		case "target":
			return 'img/target.png';
		case "train":
			return 'img/train.png';
		case "bus":
			return 'img/bus.png';
		default:
			return 'img/person.png';
	}
}

function clickMarker(args){
	if(typeof args == "string"){
		for(marker in markers){
			if(markers[marker]._id == args){
				args = markers[marker];
				break;
			}
		}
	}

	if(markerClicked){
		markerClicked.link = args._id;
		var temp = markerClicked.marker;
		markerClicked.marker = undefined;
		socket.emit("updateMarker", markerClicked);
		markerClicked.marker = temp;
		markerClicked = undefined;
		if(markerClickedElem){
			$(markerClickedElem).addClass("linked");
			$(markerClickedElem).removeClass("linking");
			markerClickedElem = undefined;
		}
	}
	else{
		if(args.link){
			var markerLink;
			for(marker in markers){
				if(markers[marker]._id == args.link){
					markerLink = markers[marker];
					break;
				}
			}
			
			directionsService.route({
					origin: args.marker.position,
					destination: markerLink.marker.position,
					travelMode: google.maps.TravelMode.DRIVING
				}, 
				function(result, status) {
				if(status == google.maps.DirectionsStatus.OK){
					directionsDisplay.setDirections(result);
					directionsDisplay.setMap(gmap);
				}
				else{
					alert("Directions Request failed:" +status)
					gmap.setZoom(14);
					gmap.setCenter(args.marker.getPosition());
				};
			});
		}
		else{
			gmap.setZoom(14);
			gmap.setCenter(args.marker.getPosition());
		}
	}
}

function deleteMarker(id){
	var name = "#" + id;
	$(name).remove();

	var marker;
	for(var i = 0; i < markers.length; i++){
		if(markers[i]._id == id){
			marker = markers[i];
			markers[i] = markers[markers.length-1];
			markers.pop();
			break;
		}
	}

	marker.marker.setMap(null);

	socket.emit("deleteMarker", {_id: id});
}

function linkMarker(id, elem){
	var markerClick;
	for(marker in markers){
		if(markers[marker]._id == id){
			markerClick = markers[marker];
			break;
		}
	}

	if(markerClicked){
		var tempId = markerClicked._id;
		markerClicked = undefined;
		if(markerClickedElem){
			$(markerClickedElem).removeClass("linking");
			markerClickedElem = undefined;
		}
		if(tempId == id){
			return;
		}
	}

	if(markerClick.link){
		markerClick.link = null;
		var temp = markerClick.marker;
		markerClick.marker = undefined;
		socket.emit("updateMarker", markerClick);
		markerClick.marker = temp;
		$(elem).removeClass("linked");
	}
	else{
		markerClicked = markerClick;
		markerClickedElem = $(elem);
		$(elem).addClass("linking");
	}
}

function chooseIcon(type){
	$("#iconType")[0].value = type;

	for(var i = 0; i < 6; i++){
		$("#icon" + i).removeClass('iconSelected');
	}

	switch(type){
		case "person":
			$("#icon1").addClass('iconSelected');
			break;
		case "car":
			$("#icon2").addClass('iconSelected');
			break;
		case "meet":
			$("#icon3").addClass('iconSelected');
			break;
		case "office":
			$("#icon4").addClass('iconSelected');
			break;
		case "target":
			$("#icon5").addClass('iconSelected');
			break;
		case "train":
			$("#icon6").addClass('iconSelected');
			break;
		case "bus":
			break;
		default:
			$("#icon1").addClass('iconSelected');
			break;
	}
}
