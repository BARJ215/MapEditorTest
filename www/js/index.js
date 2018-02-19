var map;
var currentPos={lat: 52.1936, lng: 2.2216};
var markers= [];
//when the jQuery Mobile page is initialised
$(document).on('pageinit', function() {
    
	//set up listener for button click
	
    
	//change time box to show message
	$('#time').val("Press the button to get location data");
    
    var locationOptions = {
        //maximumAge: 10000,
        //timeout: 6000,
        //enableHighAccuracy: true
    };

    //navigator.geolocation.watchPosition(updatePosition,failPosition,locationOptions);
    //getPosition();
    //initMap();
    centerMap();
});

function addCheck(){
    var center = map.getCenter();
    addMarker(center);
}


function addMarker(location){
    var marker = new google.maps.Marker({
        position: location,
        map: map
    });
    markers.push(marker);
    console.log("add marker");
}

function deleteMarkers(){
    for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
    }
    markers=[];
}

//Call this function when you want to get the current position
function getPosition() {
	
	//change time box to show updated message
	$('#m1longtext').val("Getting data...");
	
	//instruct location service to get position with appropriate callbacks
	navigator.geolocation.getCurrentPosition(updatePosition, failPosition);
}


//called when the position is successfully determined
function updatePosition(position) {
	
	//You can find out more details about what the position obejct contains here:
	// http://www.w3schools.com/html/html5_geolocation.asp

	//lets get some stuff out of the position object
	var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    
	//OK. Now we want to update the display with the correct values
	$('#m1lattext').val(latitude);
    $('#m1longtext').val(longitude);
    
    //Update current position
    currentPos.lat= latitude;
    currentPos.lng=longitude;

}

function centerPosition(position){
	//lets get some stuff out of the position object
	var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    
	//OK. Now we want to update the display with the correct values
	$('#m1lattext').val(latitude);
    $('#m1longtext').val(longitude);
    
    //Update current position
    currentPos.lat= latitude;
    currentPos.lng=longitude;
    //Load map
    initMap();
    
}

//called if the position is not obtained correctly
function failPosition(error) {
	//change time box to show updated messageuklkh/lkhjlkhjlkh lkhlkhlkhlkhlk
	$('#m1longtext').val("Error getting data: " + error);
	
}

function initMap(){
    detectBrowser();
     map = new google.maps.Map(document.getElementById('map'), {
        center: currentPos,
        zoom: 8
    });
    
}

function centerMap(){
    console.log("center map");
    //instruct location service to get position with appropriate callbacks
    navigator.geolocation.getCurrentPosition(centerPosition, failPosition);
}


function detectBrowser() {
    var useragent = navigator.userAgent;
    var mapdiv = document.getElementById("map");
    mapdiv.style.width = '100%';
    mapdiv.style.height = '500px';
}