var map;
var currentPos={lat: 52.1936, lng: 2.2216};
var markers= [];
var labels = '123456789';
var labelIndex = 0;
var directionsDisplay;
var directionsService;

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
    //navigator.geolocation.getCurrentPosition(updatePosition, failPosition);
    //Center Map
    centerMap();
});

function addCheck(){
    var center = map.getCenter();
    addMarker(center);
}

function addMarker(location){
    var marker = new google.maps.Marker({
        position: location,
        map: map,
        label: labels[labelIndex++ % labels.length],
        draggable: true,
        
    });
    markers.push(marker);

    console.log("add marker");
}

function deleteMarkers(){
    for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
    }
    markers=[];
    labelIndex=0;
}

function centerMap(){
    console.log("center map");
    //instruct location service to get position with appropriate callbacks
    navigator.geolocation.getCurrentPosition(centerPosition, failPosition);
}

function centerPosition(position){
    //Get position
    getPosition(position);
    //Load map
    initMap();
    //Add Start Finish Markers
    startFinishMarkers();
}

//called when the position is successfully determined
function getPosition(position) {
	//lets get some stuff out of the position object
	var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    
    //Update current position
    currentPos.lat= latitude;
    currentPos.lng=longitude;
}

//called if the position is not obtained correctly
function failPosition(error) {
	//change time box to show updated messageuklkh/lkhjlkhjlkh lkhlkhlkhlkhlk
	$('#m1longtext').val("Error getting data: " + error);
	
}

function initMap(){
    detectBrowser();
    directionsDisplay = new google.maps.DirectionsRenderer;
    directionsService = new google.maps.DirectionsService;
     map = new google.maps.Map(document.getElementById('map'), {
        center: currentPos,
        zoom: 15
    });
    directionsDisplay.setMap(map);
    
}

function startFinishMarkers(){
    
    //Start Marker
    var start = new google.maps.Marker({
        position: {lat: currentPos.lat,lng: currentPos.lng-0.003},
        map: map,
        label:{
            text:'START',
            fontWeight: '900'
        },
        animation: google.maps.Animation.DROP,
        draggable: true
    });

    
    //Finish Marker
    var finish = new google.maps.Marker({
        position: {lat: currentPos.lat,lng: currentPos.lng+0.003},
        map: map,
        label:{
            text:'FINISH',
            fontWeight: '900',
        },
        animation: google.maps.Animation.DROP,
        draggable: true
    });
    
    //Add markers
    markers.push(start);
    markers.push(finish);
}

function detectBrowser() {
    var useragent = navigator.userAgent;
    var mapdiv = document.getElementById("map");
    mapdiv.style.width = '100%';
    mapdiv.style.height = '500px';
}

function save(){
;
    var start = markers[0].getPosition();
    var fin = markers[1].getPosition();
    
    $('#slongtext').val(start.lng());
    $('#slattext').val(start.lat());
    $('#flongtext').val(fin.lng());
    $('#flattext').val(fin.lat());
    
    calcRoute(directionsService,directionsDisplay,start,fin);
}

function calcRoute(directionsService, directionsDisplay,s,f) {
        directionsService.route({
          origin: s,  // Haight.
          destination: f,  // Ocean Beach.
          // Note that Javascript allows us to access the constant
          // using square brackets and a string value as its
          // "property."
          travelMode: google.maps.TravelMode['WALKING']
        }, function(response, status) {
          if (status == 'OK') {
            directionsDisplay.setDirections(response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
}