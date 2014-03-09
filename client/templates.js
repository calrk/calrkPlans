var mapTemplate = "\
<div id=\"{{_id}}\" class='subMenuItem'>\
	<div class='mapListItem'> \
		<span onclick=\"openMap(\'{{_id}}\')\">{{title}}</span>\
		<img class='mapListImage' src='img/share.png' onclick=\"toggleMenu(\'shareMap\', \'{{_id}}\');\"/>\
	</div>\
</div>\
";
		// <img class='mapListImage' src='img/edit.png' onclick=\"editMap(\'{{_id}}\');\"/>\

var markerTemplate = "\
<div id=\"{{_id}}\" class='subMenuItem'>\
	<div class='mapListItem'> \
		<span onclick=\"clickMarker(\'{{_id}}\')\">{{title}}</span>\
		<img class='mapListImage' src='img/prims.png' onclick=\"doPrims(\'{{_id}}\');\"/>\
		<div class='mapListImage {{#link}}linked{{/link}}' onclick=\"linkMarker(\'{{_id}}\', this);\"></div>\
		<img class='mapListImage' src='img/delete.png' onclick=\"deleteMarker(\'{{_id}}\');\"/>\
	</div>\
</div>\
";
		// <img class='mapListImage {{^link}}linked{{/link}}' src='img/brokenLink.png' onclick=\"linkMarker(\'{{_id}}\', this);\"/>\

var markerListTemplate = '\
<div class="title menuItem" onclick="">Markers</div>\
<div class="subMenuItem">\
	<input class="subMenuItem" style="padding-left:0px;" type="button" value="Create Marker" onclick="toggleMenu(\'newMarker\');"/>\
</div>\
';


