var map;
var currentPos={lat: 52.1936, lng: 2.2216};
var markers= [];
var labels = '123456789';
var labelIndex = 0;
var directionsDisplay;
var directionsService;
var points=[];

//when the jQuery Mobile page is initialised
$(document).on('pageinit', function() {
    
	//set up listener for button click
	
    
	//change time box to show message
	$('#time').val("Press the button to get location data");
    
    /*
    var locationOptions = {
        maximumAge: 10000,
        timeout: 6000,
        enableHighAccuracy: true
    };

    //navigator.geolocation.watchPosition(updatePosition,failPosition,locationOptions);
    //navigator.geolocation.getCurrentPosition(updatePosition, failPosition);
    */
    //Center Map
    centerMap();
});

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
    //startFinishMarkers();
    route ={
          origin: {lat: currentPos.lat,lng: currentPos.lng-0.003},  // Haight.
          destination: {lat: currentPos.lat,lng: currentPos.lng+0.003},  // Ocean Beach.
          // Note that Javascript allows us to access the constant
          // using square brackets and a string value as its
          // "property."
          waypoints: markers,
          travelMode: google.maps.TravelMode['WALKING']
    };
    calcRoute(directionsService, directionsDisplay, route);
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

     map = new google.maps.Map(document.getElementById('map'), {
        center: currentPos,
        zoom: 15
    });
    
    directionsDisplay = new google.maps.DirectionsRenderer({
        draggable:true,
        map: map
    });
    
    directionsService = new google.maps.DirectionsService;

}


function detectBrowser() {
    var useragent = navigator.userAgent;
    var mapdiv = document.getElementById("map");
    mapdiv.style.width = '100%';
    mapdiv.style.height = '500px';
}

function calcRoute(directionsService, directionsDisplay, route) {
        directionsService.route(route, function(response, status) {
          if (status == 'OK') {
            directionsDisplay.setDirections(response);
            save();
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });     
}

function save(){
    //waypoints = (directionsDisplay.directions.geocoded_waypoints);
    var geo = directionsDisplay.directions.geocoded_waypoints;
    for(i=0; i<geo.length;i++){
        points[i]={placeId: geo[i].place_id};
        if(0<i&&i<geo.length-1){
           points[i]={location: {placeId: geo[i].place_id},stopover:false}; 
        }
    }
    console.log(points);
    //$('#slongtext').val(start.lng());
    //$('#slattext').val(start.lat());
    //$('#flongtext').val(fin.lng());
    //$('#flattext').val(fin.lat());
    
}

function load(){
    //initMap();
    //route.origin=waypoints[0].place_id;
    route.origin=points[0];
    route.destination=points[points.length-1];
    if(points.length>2){
        if(points.length==3){
          route.waypoints=[points[1]];  
        }else{
          route.waypoints=points.slice(1,points.length-1);
        }
    }
    
    calcRoute(directionsService, directionsDisplay, route);
}

