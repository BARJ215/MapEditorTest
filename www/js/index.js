//var map;
var currentCenter={lat: -34.397, lng: 150.644};

//when the jQuery Mobile page is initialised
$(document).on('pageinit', function() {
	
	//set up listener for button click
	//$(document).on('click', getPosition);
    centerMap();
	
	//change time box to show message
	$('#time').val("Press the button to get location data");
    
    var locationOptions = {
        //maximumAge: 10000,
        //timeout: 6000,
        //enableHighAccuracy: true
    };

    navigator.geolocation.watchPosition(updateTable,failPosition,locationOptions);
	
});


//Call this function when you want to get the current position
function getPosition() {
	
	//change time box to show updated message
	$('#m1longtext').val("Getting data...");
	
	//instruct location service to get position with appropriate callbacks
	navigator.geolocation.getCurrentPosition(updateTable, failPosition);
}

function centerMap(){
    //instruct location service to get position with appropriate callbacks
	navigator.geolocation.getCurrentPosition(updateCenter, failPosition);
}


//called when the position is successfully determined
function updateTable(position) {
	
	//You can find out more details about what the position obejct contains here:
	// http://www.w3schools.com/html/html5_geolocation.asp
	

	//lets get some stuff out of the position object
	var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    
	//OK. Now we want to update the display with the correct values
	$('#lattext').val(latitude);
    $('#longtext').val(longitude);
}

function updateCenter(position){
    //Update Current Center
	currentCenter.lat=position.coords.latitude;
    currentCenter.lng=position.coords.longitude;
    initMap();
}

//called if the position is not obtained correctly
function failPosition(error) {
	//change time box to show updated message
	$('#m1longtext').val("Error getting data: " + error);
	
}

function initMap(){
    detectBrowser();
     map = new google.maps.Map(document.getElementById('map'), {
        center: currentCenter,
        zoom: 8
    });
    var drawingManager = new google.maps.drawing.DrawingManager({
          drawingMode: google.maps.drawing.OverlayType.MARKER,
          drawingControl: true,
          drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: ['marker', 'circle', 'polygon', 'polyline', 'rectangle']
          },
          markerOptions: {icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'},
          circleOptions: {
            fillColor: '#ffff00',
            fillOpacity: 1,
            strokeWeight: 5,
            clickable: false,
            editable: true,
            zIndex: 1
          }
        });
        drawingManager.setMap(map);
}

function detectBrowser() {
    var useragent = navigator.userAgent;
    var mapdiv = document.getElementById("map");
    mapdiv.style.width = '600px';
    mapdiv.style.height = '800px';
}